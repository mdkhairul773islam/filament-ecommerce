<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'order_digital_product',
                'subject' => 'আপনার অর্ডার সম্পন্ন হয়েছে - #{order_number}',
                'title' => 'আপনার অর্ডার সম্পন্ন হয়েছে!',
                'greeting' => 'প্রিয়',
                'message' => 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
আপনার ক্রয়কৃত ডিজিটাল ফাইলগুলো এই ইমেইলের সাথে **সংযুক্ত** করা আছে।',
                'closing' => 'ধন্যবাদ,',
                'metadata' => [
                    'order_details_title' => 'অর্ডার বিবরণ',
                    'table_product' => 'পণ্য',
                    'table_quantity' => 'পরিমাণ',
                    'table_price' => 'মূল্য',
                    'total_label' => 'মোট:',
                    'thanks_message' => 'ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য।',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'whatsapp_order_digital_product',
                'subject' => 'WhatsApp Order Notification',
                'title' => '',
                'greeting' => 'প্রিয় স্যার/ম্যাডাম',
                'message' => 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!

আপনার ক্রয়কৃত পণ্যসমূহ:
{product_list}

আপনার ডিজিটাল ফাইল(গুলো) আপনার ইমেইলে পাঠানো হয়েছে।
ইমেইল: {customer_email}

দয়া করে আপনার Inbox চেক করুন।
যদি ইমেইল না পান তাহলে Spam/Junk ফোল্ডার চেক করুন।',
                'closing' => 'আমাদের সাথে কেনাকাটা করার জন্য আপনাকে ধন্যবাদ!',
                'metadata' => [
                    'order_prefix' => 'অর্ডার নম্বর:',
                    'product_list_title' => 'আপনার ক্রয়কৃত পণ্যসমূহ:',
                    'product_bullet' => '•',
                    'email_sent_line1' => 'আপনার ডিজিটাল ফাইল(গুলো) আপনার ইমেইলে পাঠানো হয়েছে।',
                    'email_address_label' => 'ইমেইল:',
                    'check_inbox' => 'দয়া করে আপনার *Inbox* চেক করুন।',
                    'check_spam' => 'যদি ইমেইল না পান তাহলে *Spam/Junk* ফোল্ডার চেক করুন।',
                    'total_label' => 'মোট মূল্য:',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }
    }
}
