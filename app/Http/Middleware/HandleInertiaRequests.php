<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user('web'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'cartItemsCount' => function () use ($request) {
                if ($request->user('web')) {
                    $cart = Cart::where('user_id', $request->user('web')->id)->first();
                } else {
                    $cart = Cart::where('session_id', session()->getId())->first();
                }

                return $cart ? $cart->items()->sum('quantity') : 0;
            },
            'settings' => function () {
                $site_logo = Setting::get('site_logo');
                $site_favicon = Setting::get('site_favicon');

                return [
                    'site_name' => Setting::get('site_name', 'MononKendra'),
                    'site_name_bangla' => Setting::get('site_name_bangla', 'জ্ঞান ও প্রজ্ঞার আলো'),
                    'site_logo' => $site_logo ? asset('storage/' . $site_logo) : null,
                    'site_favicon' => $site_favicon ? asset('storage/' . $site_favicon) : null,
                    'contact_phone' => Setting::get('contact_phone', '16297'),
                    'hotline' => Setting::get('hotline', '16297'),
                    'hotline_time' => Setting::get('hotline_time', '9 AM to 8 PM'),
                    'contact_email' => Setting::get('contact_email', 'care@mononkendra.com'),
                    'address' => Setting::get('address', '2/1/E, Eden Center, Arambag, Motijheel, Dhaka-1000'),
                    'corporate_phone' => Setting::get('corporate_phone', '01708166238'),
                    'corporate_email' => Setting::get('corporate_email', 'sales@mononkendra.com'),
                    'retailer_phone' => Setting::get('retailer_phone', '01708166185'),
                    'wholesale_email' => Setting::get('wholesale_email', 'wholesale@mononkendra.com'),
                    'facebook_url' => Setting::get('facebook_url'),
                    'twitter_url' => Setting::get('twitter_url'),
                    'instagram_url' => Setting::get('instagram_url'),
                    'youtube_url' => Setting::get('youtube_url'),
                    'linkedin_url' => Setting::get('linkedin_url'),
                    'telegram_url' => Setting::get('telegram_url'),
                    'whatsapp_number' => Setting::get('whatsapp_number'),
                    // Pages
                    'about_us' => Setting::get('about_us'),
                    'terms_conditions' => Setting::get('terms_conditions'),
                    'privacy_policy' => Setting::get('privacy_policy'),
                    'refund_policy' => Setting::get('refund_policy'),
                    'shipping_policy' => Setting::get('shipping_policy'),
                    'payment_policy' => Setting::get('payment_policy'),
                    'warranty_policy' => Setting::get('warranty_policy'),
                ];
            },
        ];
    }
}
