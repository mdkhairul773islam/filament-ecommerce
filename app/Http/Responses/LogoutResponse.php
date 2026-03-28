<?php

namespace App\Http\Responses;

use Filament\Http\Responses\Auth\Contracts\LogoutResponse as LogoutResponseContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class LogoutResponse implements LogoutResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        // Only logout from admin guard without invalidating the entire session
        Auth::guard('admin')->logout();
        
        // Only regenerate the token, don't invalidate the session
        $request->session()->regenerateToken();

        return redirect()->to('/admin/login');
    }
}
