@php
    $template = \App\Models\EmailTemplate::getByName('order_digital_product');
@endphp

<x-mail::message>
# {{ $template?->title ?? 'আপনার অর্ডার সম্পন্ন হয়েছে!' }}

{{ $template?->greeting ?? 'প্রিয়' }} **{{ $order->customer_name }}**,

{{ $template?->message ?? 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। আপনার ক্রয়কৃত ডিজিটাল ফাইলগুলো এই ইমেইলের সাথে সংযুক্ত করা আছে।' }}

**অর্ডার নম্বর:** #{{ $order->order_number }}

---

## {{ $template?->getMeta('order_details_title', 'অর্ডার বিবরণ') }}

| {{ $template?->getMeta('table_product', 'পণ্য') }} | {{ $template?->getMeta('table_quantity', 'পরিমাণ') }} | {{ $template?->getMeta('table_price', 'মূল্য') }} |
|:-----|:------:|------:|
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} | ৳{{ number_format($item->total, 2) }} |
@endforeach

**{{ $template?->getMeta('total_label', 'মোট:') }}** ৳{{ number_format($order->total, 2) }}

---

{{ $template?->getMeta('thanks_message', 'ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য।') }}

{{ $template?->closing ?? 'ধন্যবাদ,' }}
{{ config('app.name') }}
</x-mail::message>
