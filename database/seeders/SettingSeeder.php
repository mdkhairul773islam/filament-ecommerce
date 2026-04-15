<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'MononKendra', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_name_bangla', 'value' => 'জ্ঞান ও প্রজ্ঞার আলো', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Your Knowledge Hub', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'Best place for books and courses', 'type' => 'textarea', 'group' => 'general'],

            // Appearance
            ['key' => 'site_logo', 'value' => null, 'type' => 'image', 'group' => 'appearance'],
            ['key' => 'site_favicon', 'value' => null, 'type' => 'image', 'group' => 'appearance'],

            // Contact
            ['key' => 'contact_phone', 'value' => '16297', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'hotline', 'value' => '16297', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'hotline_time', 'value' => '9 AM to 8 PM', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_email', 'value' => 'care@mononkendra.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'support_email', 'value' => 'support@mononkendra.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'address', 'value' => '2/1/E, Eden Center, Arambag, Motijheel, Dhaka-1000', 'type' => 'textarea', 'group' => 'contact'],

            // Corporate
            ['key' => 'corporate_phone', 'value' => '01708166238', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'corporate_email', 'value' => 'sales@mononkendra.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'retailer_phone', 'value' => '01708166185', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'wholesale_email', 'value' => 'wholesale@mononkendra.com', 'type' => 'email', 'group' => 'contact'],

            // Social Media
            ['key' => 'facebook_url', 'value' => 'https://facebook.com/mononkendra', 'type' => 'text', 'group' => 'social'],
            ['key' => 'twitter_url', 'value' => 'https://twitter.com/mononkendra', 'type' => 'text', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com/mononkendra', 'type' => 'text', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => 'https://youtube.com/mononkendra', 'type' => 'text', 'group' => 'social'],
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/mononkendra', 'type' => 'text', 'group' => 'social'],
            ['key' => 'telegram_url', 'value' => 'https://t.me/mononkendra', 'type' => 'text', 'group' => 'social'],
            ['key' => 'whatsapp_number', 'value' => '8801708166238', 'type' => 'text', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
