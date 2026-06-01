<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function show(Order $order)
    {
        // Check if user owns this order
        if (auth()->check() && $order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('payment', 'items.product');
        $paymentMethod = PaymentMethod::where('code', $order->payment->payment_method)->first();

        return Inertia::render('Payment', [
            'order' => $order,
            'paymentMethod' => $paymentMethod,
        ]);
    }

    public function confirm(Request $request, Order $order)
    {
        // Check if user owns this order
        if (auth()->check() && $order->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if payment method is cash on delivery
        $isCashOnDelivery = $order->payment->payment_method === 'cash';

        $request->validate([
            'transaction_reference' => [
                $isCashOnDelivery ? 'nullable' : 'required',
                'string',
                'max:255',
            ],
        ]);

        DB::beginTransaction();

        try {
            $payment = $order->payment;

            // Update payment status and transaction ID
            $payment->update([
                'transaction_id' => $request->transaction_reference ?: $payment->transaction_id,
                'status' => 'completed',
                'paid_at' => now(),
                'payment_details' => [
                    'transaction_reference' => $request->transaction_reference,
                    'confirmed_at' => now()->toDateTimeString(),
                ],
            ]);

            // Update order status
            $order->update([
                'status' => 'processing',
            ]);

            DB::commit();

            return redirect()->route('orders.show', $order->order_number)
                ->with('success', 'Payment confirmed successfully. Your order is being processed.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to confirm payment. Please try again.');
        }
    }

    public function callback(Request $request)
    {
        // This is for future payment gateway integration
        // Handle payment gateway callbacks here

        return response()->json(['message' => 'Callback received']);
    }
}
