<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display the specified dynamic page.
     */
    public function show($slug)
    {
        $setting = Setting::where('key', $slug)->first();

        if (! $setting || $setting->group !== 'pages') {
            abort(404);
        }

        // Create a nice readable title from the slug (e.g. "privacy_policy" -> "Privacy Policy")
        $title = ucwords(str_replace('_', ' ', $slug));

        return Inertia::render('Page', [
            'title' => $title,
            'content' => $setting->value,
            'slug' => $slug,
        ]);
    }
}
