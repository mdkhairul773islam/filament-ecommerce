<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Services\FacebookCAPIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = $this->getCart();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $paymentMethods = PaymentMethod::active()->get();

        $fbEventId = null;

        if (config('facebook.pixel_id')) {
            $capiService = app(FacebookCAPIService::class);
            $fbEventId = $capiService->generateEventId();
            $total = $cart->items->sum(fn ($item) => $item->price * $item->quantity);
            $capiService->sendEvent('InitiateCheckout', request(), [
                'value' => (float) $total,
                'currency' => 'BDT',
                'num_items' => $cart->items->sum('quantity'),
                'content_ids' => $cart->items->pluck('product_id')->map(fn ($id) => (string) $id)->values()->toArray(),
                'content_type' => 'product',
            ], [], $fbEventId);
        }

        return Inertia::render('Checkout', [
            'cart' => $cart->load('items.product'),
            'paymentMethods' => $paymentMethods,
            'fbEventId' => $fbEventId,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'nullable|string',
            'payment_method' => 'required|in:bkash,rocket,nagad,cash',
            'notes' => 'nullable|string',
        ]);

        $cart = $this->getCart();

        if (! $cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty');
        }

        // Check stock availability
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return back()->with('error', "Insufficient stock for {$item->product->name}");
            }
        }

        DB::beginTransaction();

        try {
            // Calculate totals
            $subtotal = $cart->items->sum(function ($item) {
                return $item->price * $item->quantity;
            });

            // Create order
            $order = Order::create([
                'user_id' => Auth::guard('web')->id(),
                'order_number' => 'ORD-'.strtoupper(uniqid()),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => 0,
                'discount' => 0,
                'total' => $subtotal,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'customer_address' => $request->customer_address,
                'notes' => $request->notes,
            ]);

            // Create order items
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_type' => $item->product->type,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'total' => $item->price * $item->quantity,
                ]);

                // Update product stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'transaction_id' => 'TXN-'.strtoupper(uniqid()),
                'payment_method' => $request->payment_method,
                'amount' => $subtotal,
                'status' => 'pending',
            ]);

            // Clear cart
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return redirect()->route('payment.show', $order->id)
                ->with('success', 'Order placed successfully. Please complete your payment.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to place order. Please try again.');
        }
    }

    private function getCart()
    {
        if (Auth::guard('web')->check()) {
            return Cart::where('user_id', Auth::guard('web')->id())->first();
        }

        $sessionId = session()->getId();

        return Cart::where('session_id', $sessionId)->first();
    }
}
