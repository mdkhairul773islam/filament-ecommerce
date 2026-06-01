<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Services\FacebookCAPIService;
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

            $fbEventId = null;

            if (config('facebook.pixel_id')) {
                $order->load('items');
                $capiService = app(FacebookCAPIService::class);
                $fbEventId = $capiService->generateEventId();

                $userData = [];
                if ($order->customer_email) {
                    $userData['em'] = [FacebookCAPIService::hash($order->customer_email)];
                }
                if ($order->customer_phone) {
                    $userData['ph'] = [FacebookCAPIService::hash($order->customer_phone)];
                }
                if ($order->customer_name) {
                    $nameParts = explode(' ', $order->customer_name);
                    $userData['fn'] = [FacebookCAPIService::hash($nameParts[0])];
                    if (count($nameParts) > 1) {
                        $userData['ln'] = [FacebookCAPIService::hash(end($nameParts))];
                    }
                }

                $capiService->sendEvent('Purchase', $request, [
                    'content_ids' => $order->items->pluck('product_id')->map(fn ($id) => (string) $id)->values()->toArray(),
                    'content_type' => 'product',
                    'value' => (float) $order->total,
                    'currency' => 'BDT',
                    'order_id' => $order->order_number,
                    'num_items' => $order->items->sum('quantity'),
                ], $userData, $fbEventId);
            }

            $fbEvent = $fbEventId ? [
                'type' => 'Purchase',
                'event_id' => $fbEventId,
                'data' => [
                    'value' => (float) $order->total,
                    'currency' => 'BDT',
                    'order_id' => $order->order_number,
                    'content_ids' => $order->items->pluck('product_id')->map(fn ($id) => (string) $id)->values()->toArray(),
                    'content_type' => 'product',
                    'num_items' => $order->items->sum('quantity'),
                ],
            ] : null;

            return redirect()->route('orders.show', $order->order_number)
                ->with('success', 'Payment confirmed successfully. Your order is being processed.')
                ->with('fb_event', $fbEvent);
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
