<?php

namespace App\Services;

use App\Models\EmailTemplate;
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

        $template = EmailTemplate::getByName('whatsapp_order_digital_product');

        if (! $template) {
            // Fallback to hardcoded message if template not found
            $this->sendFallbackMessage($order, $digitalProducts, $phone);
            return;
        }

        $greeting = $template->greeting ?? 'প্রিয় স্যার/ম্যাডাম';
        
        $orderPrefix = $template->getMeta('order_prefix', 'অর্ডার নম্বর:');
        
        $productBullet = $template->getMeta('product_bullet', '•');
        $productListTitle = $template->getMeta('product_list_title', 'আপনার ক্রয়কৃত পণ্যসমূহ:');
        
        $productList = $digitalProducts->map(function ($item) use ($productBullet) {
            $quantity = $item->quantity > 1 ? " (x{$item->quantity})" : '';
            return "{$productBullet} {$item->product_name}{$quantity}";
        })->implode("\n");

        $totalLabel = $template->getMeta('total_label', 'মোট মূল্য:');
        
        $emailSentLine = $template->getMeta('email_sent_line1', 'আপনার ডিজিটাল ফাইল(গুলো) আপনার ইমেইলে পাঠানো হয়েছে।');
        $emailAddressLabel = $template->getMeta('email_address_label', 'ইমেইল:');
        $checkInbox = $template->getMeta('check_inbox', 'দয়া করে আপনার *Inbox* চেক করুন।');
        $checkSpam = $template->getMeta('check_spam', 'যদি ইমেইল না পান তাহলে *Spam/Junk* ফোল্ডার চেক করুন।');

        $message = "{$greeting},\n\n"
            ."{$orderPrefix} *{$order->order_number}*\n\n"
            ."{$productListTitle}\n{$productList}\n\n"
            ."{$totalLabel} *৳".number_format($order->total, 2)."*\n\n"
            ."─────────────────────\n\n"
            ."{$emailSentLine}\n"
            ."{$emailAddressLabel} {$order->customer_email}\n\n"
            ."{$checkInbox}\n"
            ."{$checkSpam}\n\n"
            ."─────────────────────\n\n"
            .($template->closing ?? 'আমাদের সাথে কেনাকাটা করার জন্য আপনাকে ধন্যবাদ!');

        $this->send($phone, $message);
    }

    private function sendFallbackMessage(Order $order, $digitalProducts, string $phone): void
    {
        $productList = $digitalProducts->map(function ($item) {
            $quantity = $item->quantity > 1 ? " (x{$item->quantity})" : '';
            return "• {$item->product_name}{$quantity}";
        })->implode("\n");

        $message = "প্রিয় স্যার/ম্যাডাম,\n\n"
            ."অর্ডার নম্বর: *{$order->order_number}*\n\n"
            ."আপনার ক্রয়কৃত পণ্যসমূহ:\n{$productList}\n\n"
            ."মোট মূল্য: *৳".number_format($order->total, 2)."*\n\n"
            ."─────────────────────\n\n"
            ."আপনার ডিজিটাল ফাইল(গুলো) আপনার ইমেইলে পাঠানো হয়েছে।\n"
            ."ইমেইল: {$order->customer_email}\n\n"
            ."দয়া করে আপনার *Inbox* চেক করুন।\n"
            ."যদি ইমেইল না পান তাহলে *Spam/Junk* ফোল্ডার চেক করুন।\n\n"
            ."─────────────────────\n\n"
            .'আমাদের সাথে কেনাকাটা করার জন্য আপনাকে ধন্যবাদ!';

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
