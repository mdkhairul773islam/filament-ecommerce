<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product', 'payment')
            ->when(Auth::guard('web')->check(), function ($query) {
                $query->where('user_id', Auth::guard('web')->id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show($orderNumber)
    {
        $order = Order::with('items.product', 'payment')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        // If authenticated, only allow viewing own orders
        if (Auth::guard('web')->check() && $order->user_id !== null && $order->user_id !== Auth::guard('web')->id()) {
            abort(403);
        }

        // If order belongs to a user but visitor is not authenticated, deny access
        if (! Auth::guard('web')->check() && $order->user_id !== null) {
            abort(403);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
