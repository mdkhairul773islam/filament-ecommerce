<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BuyNowController extends Controller
{
    public function store(Request $request)
    {
        $validCodes = array_merge(
            PaymentMethod::active()->pluck('code')->toArray(),
            ['sslcommerz']
        );

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'payment_method' => ['required', 'string', 'in:'.implode(',', $validCodes)],
        ]);

        $product = Product::where('id', $request->product_id)
            ->where('is_active', true)
            ->firstOrFail();

        if ($product->stock < 1) {
            return back()->with('error', 'This product is out of stock.');
        }

        $price = $product->discount_price
            ? ($product->discount_type === 'flat'
                ? $product->price - $product->discount_price
                : $product->price * (1 - $product->discount_price / 100))
            : $product->price;

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => Auth::guard('web')->id(),
                'order_number' => 'ORD-'.strtoupper(uniqid()),
                'status' => 'pending',
                'subtotal' => $price,
                'tax' => 0,
                'discount' => 0,
                'total' => $price,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'customer_address' => '',
                'notes' => '',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_type' => $product->type,
                'price' => $price,
                'quantity' => 1,
                'total' => $price,
            ]);

            $product->decrement('stock');

            Payment::create([
                'order_id' => $order->id,
                'transaction_id' => 'TXN-'.strtoupper(uniqid()),
                'payment_method' => $request->payment_method,
                'amount' => $price,
                'status' => 'pending',
            ]);

            DB::commit();

            // SSLCommerz → Inertia::location() forces a full browser redirect
            // (regular redirect() is followed by XHR which is blocked by CORS)
            if ($request->payment_method === 'sslcommerz') {
                return Inertia::location(route('payment.sslcommerz.init', $order->id));
            }

            return redirect()->route('payment.show', $order->id)
                ->with('success', 'অর্ডার সফল হয়েছে! পেমেন্ট সম্পন্ন করুন।');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'অর্ডার দেওয়া সম্ভব হয়নি। আবার চেষ্টা করুন।');
        }
    }
}
