<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\FacebookCAPIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = $this->getCart();

        return Inertia::render('Cart', [
            'cart' => $cart ? $cart->load('items.product') : null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $quantity = $request->quantity ?? 1;

        if ($product->stock < $quantity) {
            return back()->with('error', '⚠️ Insufficient stock available!');
        }

        $cart = $this->getOrCreateCart();

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();

            return redirect()->route('cart.index')->with('success', '✅ Product quantity updated in cart!');
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->final_price,
            ]);
        }

        $fbEventId = null;

        if (config('facebook.pixel_id')) {
            $capiService = app(FacebookCAPIService::class);
            $fbEventId = $capiService->generateEventId();
            $capiService->sendEvent('AddToCart', $request, [
                'content_ids' => [(string) $product->id],
                'content_name' => $product->name,
                'content_type' => 'product',
                'value' => (float) $product->final_price,
                'currency' => 'BDT',
            ], [], $fbEventId);
        }

        $fbEvent = $fbEventId ? [
            'type' => 'AddToCart',
            'event_id' => $fbEventId,
            'data' => [
                'content_ids' => [(string) $product->id],
                'content_name' => $product->name,
                'content_type' => 'product',
                'value' => (float) $product->final_price,
                'currency' => 'BDT',
            ],
        ] : null;

        return redirect()->route('cart.index')
            ->with('success', '🛒 Product added to cart successfully!')
            ->with('fb_event', $fbEvent);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;

        if ($product->stock < $request->quantity) {
            return back()->with('error', '⚠️ Insufficient stock available!');
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return back()->with('success', '✏️ Cart quantity updated successfully!');
    }

    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();

        return back()->with('success', '🗑️ Item removed from cart!');
    }

    private function getCart()
    {
        if (Auth::guard('web')->check()) {
            return Cart::where('user_id', Auth::guard('web')->id())->first();
        }

        $sessionId = session()->getId();

        return Cart::where('session_id', $sessionId)->first();
    }

    private function getOrCreateCart()
    {
        if (Auth::guard('web')->check()) {
            return Cart::firstOrCreate(['user_id' => Auth::guard('web')->id()]);
        }

        $sessionId = session()->getId();

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }
}
