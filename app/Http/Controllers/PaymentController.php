<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Services\SSLCommerzService;
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

        $request->validate([
            'transaction_reference' => ['required', 'string', 'max:255'],
        ]);

        DB::beginTransaction();

        try {
            $payment = $order->payment;

            $payment->update([
                'transaction_id' => $request->transaction_reference,
                'status' => 'completed',
                'paid_at' => now(),
                'payment_details' => [
                    'transaction_reference' => $request->transaction_reference,
                    'confirmed_at' => now()->toDateTimeString(),
                ],
            ]);

            $order->update(['status' => 'processing']);

            DB::commit();

            return redirect()->route('orders.show', $order->order_number)
                ->with('success', 'Payment confirmed successfully. Your order is being processed.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to confirm payment. Please try again.');
        }
    }

    // ──────────────────────────────────────────────────────────────
    //  SSLCommerz Integration
    // ──────────────────────────────────────────────────────────────

    public function sslcommerzInit(Order $order, SSLCommerzService $sslCommerz)
    {
        if (auth()->check() && $order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('payment', 'items.product');

        // ── Mock mode: only when credentials are still placeholder ─────
        $storeId = config('services.sslcommerz.store_id');
        if ($storeId === 'your_store_id' || empty($storeId)) {
            return Inertia::render('SSLCommerzMock', [
                'order' => $order,
                'successUrl' => route('payment.sslcommerz.success', $order->id),
                'failUrl' => route('payment.sslcommerz.fail', $order->id),
                'cancelUrl' => route('payment.sslcommerz.cancel', $order->id),
            ]);
        }
        // ──────────────────────────────────────────────────────────────

        $params = [
            'total_amount' => $order->total,
            'currency' => 'BDT',
            'tran_id' => $order->payment->transaction_id,
            'success_url' => route('payment.sslcommerz.success', $order->id),
            'fail_url' => route('payment.sslcommerz.fail', $order->id),
            'cancel_url' => route('payment.sslcommerz.cancel', $order->id),
            'ipn_url' => route('payment.sslcommerz.ipn'),
            'cus_name' => $order->customer_name,
            'cus_email' => $order->customer_email,
            'cus_phone' => $order->customer_phone,
            'cus_add1' => $order->customer_address ?: 'N/A',
            'cus_city' => 'Dhaka',
            'cus_country' => 'Bangladesh',
            'product_name' => $order->items->pluck('product_name')->implode(', '),
            'product_category' => 'Digital Product',
            'product_profile' => 'general',
            'shipping_method' => 'NO',
            'num_of_item' => $order->items->count(),
            'product_amount' => $order->total,
        ];

        $response = $sslCommerz->initiatePayment($params);

        if (isset($response['status']) && $response['status'] === 'SUCCESS' && isset($response['GatewayPageURL'])) {
            return redirect($response['GatewayPageURL']);
        }

        return redirect()->route('payment.show', $order->id)
            ->with('error', 'SSLCommerz payment initiation failed. Please try again.');
    }

    public function sslcommerzSuccess(Request $request, Order $order, SSLCommerzService $sslCommerz)
    {
        $storeId = config('services.sslcommerz.store_id');
        $isMock = $storeId === 'your_store_id' || empty($storeId);

        if (! $isMock) {
            if (! $request->has('val_id')) {
                return redirect()->route('payment.show', $order->id)
                    ->with('error', 'Payment validation failed.');
            }

            $validation = $sslCommerz->validatePayment($request->val_id);

            if (! isset($validation['status']) || $validation['status'] !== 'VALID') {
                return redirect()->route('payment.show', $order->id)
                    ->with('error', 'Payment could not be validated.');
            }
        }

        DB::beginTransaction();
        try {
            $order->payment->update([
                'transaction_id' => $isMock ? 'MOCK-'.strtoupper(uniqid()) : $request->val_id,
                'status' => 'completed',
                'paid_at' => now(),
                'payment_details' => $isMock
                    ? ['mock' => true, 'confirmed_at' => now()->toDateTimeString()]
                    : ($validation ?? []),
            ]);
            $order->update(['status' => 'processing']);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }

        return redirect()->route('orders.show', $order->order_number)
            ->with('success', 'Payment successful! Your order is being processed.');
    }

    public function sslcommerzFail(Order $order)
    {
        return redirect()->route('payment.show', $order->id)
            ->with('error', 'Payment failed. Please try again.');
    }

    public function sslcommerzCancel(Order $order)
    {
        return redirect()->route('payment.show', $order->id)
            ->with('error', 'Payment was cancelled.');
    }

    public function sslcommerzIpn(Request $request, SSLCommerzService $sslCommerz)
    {
        if (! $request->has('val_id') || ! $request->has('tran_id')) {
            return response()->json(['status' => 'failed'], 400);
        }

        $validation = $sslCommerz->validatePayment($request->val_id);

        if (! isset($validation['status']) || $validation['status'] !== 'VALID') {
            return response()->json(['status' => 'invalid'], 400);
        }

        $payment = Payment::where('transaction_id', $request->tran_id)->first();

        if ($payment && $payment->status !== 'completed') {
            DB::transaction(function () use ($payment, $validation, $request) {
                $payment->update([
                    'transaction_id' => $request->val_id,
                    'status' => 'completed',
                    'paid_at' => now(),
                    'payment_details' => $validation,
                ]);
                $payment->order->update(['status' => 'processing']);
            });
        }

        return response()->json(['status' => 'ok']);
    }

    public function callback(Request $request)
    {
        return response()->json(['message' => 'Callback received']);
    }
}
