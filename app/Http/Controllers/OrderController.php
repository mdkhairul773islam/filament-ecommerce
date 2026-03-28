<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product', 'payment')
            ->when(Auth::check(), function ($query) {
                $query->where('user_id', Auth::id());
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

        // Allow viewing if user owns the order or if not authenticated (for guest orders)
        if (Auth::check() && $order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
