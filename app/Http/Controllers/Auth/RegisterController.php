<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FacebookCAPIService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => false,
        ]);

        event(new Registered($user));

        Auth::guard('web')->login($user);

        $fbEventId = null;

        if (config('facebook.pixel_id')) {
            $capiService = app(FacebookCAPIService::class);
            $fbEventId = $capiService->generateEventId();

            $userData = [
                'em' => [FacebookCAPIService::hash($user->email)],
                'fn' => [FacebookCAPIService::hash(explode(' ', $user->name)[0])],
            ];

            $capiService->sendEvent('CompleteRegistration', $request, [
                'status' => true,
                'currency' => 'BDT',
                'value' => 0,
            ], $userData, $fbEventId);
        }

        $fbEvent = $fbEventId ? [
            'type' => 'CompleteRegistration',
            'event_id' => $fbEventId,
            'data' => ['status' => true],
        ] : null;

        return redirect('/dashboard')->with('fb_event', $fbEvent);
    }
}
