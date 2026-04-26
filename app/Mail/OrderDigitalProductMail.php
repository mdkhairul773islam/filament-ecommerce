<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class OrderDigitalProductMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Order #'.$this->order->order_number.' — Digital Files',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.order-digital-product',
            with: ['order' => $this->order],
        );
    }

    public function attachments(): array
    {
        $attachments = [];

        foreach ($this->order->items as $item) {
            $product = $item->product;

            if ($product && $product->digital_file && Storage::disk('public')->exists($product->digital_file)) {
                $attachments[] = Attachment::fromStorageDisk('public', $product->digital_file)
                    ->as($product->name.'.pdf')
                    ->withMime('application/pdf');
            }
        }

        return $attachments;
    }
}
