<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    public function sendOrderDigitalProducts(Order $order): void
    {
        $phone = $this->normalizePhone($order->customer_phone);

        if (! $phone) {
            return;
        }

        $digitalProducts = $order->items->filter(
            fn ($item) => $item->product && $item->product->digital_file
        );

        if ($digitalProducts->isEmpty()) {
            return;
        }

        $productList = $digitalProducts->map(
            fn ($item) => '• '.$item->product_name
        )->implode("\n");

        $message = "আসসালামু আলাইকুম {$order->customer_name}! 👋\n\n"
            ."আপনার অর্ডার *#{$order->order_number}* সফলভাবে গ্রহণ করা হয়েছে।\n\n"
            ."আপনার ক্রয়কৃত ডিজিটাল পণ্যসমূহ:\n{$productList}\n\n"
            ."📧 আপনার ইমেইলে ({$order->customer_email}) PDF ফাইলগুলো পাঠানো হয়েছে।\n\n"
            .'ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য! 🙏';

        $this->send($phone, $message);
    }

    private function send(string $phone, string $message): void
    {
        $instanceId = config('services.ultramsg.instance_id');
        $token = config('services.ultramsg.token');

        if (! $instanceId || ! $token) {
            Log::warning('WhatsApp credentials not configured. Skipping WhatsApp notification.');

            return;
        }

        try {
            $response = Http::asForm()->post(
                "https://api.ultramsg.com/{$instanceId}/messages/chat",
                [
                    'token' => $token,
                    'to' => $phone,
                    'body' => $message,
                ]
            );

            if (! $response->successful()) {
                Log::error('WhatsApp message failed', [
                    'phone' => $phone,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp service exception: '.$e->getMessage());
        }
    }

    private function normalizePhone(string $phone): ?string
    {
        // Remove all non-digit characters
        $digits = preg_replace('/\D/', '', $phone);

        if (empty($digits)) {
            return null;
        }

        // Bangladesh numbers: convert 01xxxxxxxxx -> 8801xxxxxxxxx
        if (str_starts_with($digits, '0') && strlen($digits) === 11) {
            $digits = '880'.ltrim($digits, '0');
        }

        // Add + prefix
        if (! str_starts_with($digits, '+')) {
            $digits = '+'.$digits;
        }

        return $digits;
    }
}
