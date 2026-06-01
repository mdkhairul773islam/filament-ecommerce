<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FacebookCAPIService
{
    private string $pixelId;

    private string $accessToken;

    private ?string $testEventCode;

    private string $apiVersion = 'v19.0';

    public function __construct()
    {
        $this->pixelId = config('facebook.pixel_id', '');
        $this->accessToken = config('facebook.access_token', '');
        $this->testEventCode = config('facebook.test_event_code');
    }

    /**
     * Send an event to Facebook Conversions API.
     *
     * @param  array<string, mixed>  $customData
     * @param  array<string, mixed>  $userData
     */
    public function sendEvent(
        string $eventName,
        Request $request,
        array $customData = [],
        array $userData = [],
        ?string $eventId = null,
        ?string $eventSourceUrl = null
    ): void {
        if (empty($this->pixelId) || empty($this->accessToken)) {
            return;
        }

        $eventId = $eventId ?: (string) Str::uuid();
        $eventSourceUrl = $eventSourceUrl ?: $request->fullUrl();

        $payload = [
            'data' => [
                [
                    'event_name' => $eventName,
                    'event_time' => time(),
                    'event_id' => $eventId,
                    'event_source_url' => $eventSourceUrl,
                    'action_source' => 'website',
                    'user_data' => array_merge(
                        $this->buildUserData($request),
                        $userData
                    ),
                    'custom_data' => $customData,
                ],
            ],
            'access_token' => $this->accessToken,
        ];

        if ($this->testEventCode) {
            $payload['test_event_code'] = $this->testEventCode;
        }

        try {
            Http::post(
                "https://graph.facebook.com/{$this->apiVersion}/{$this->pixelId}/events",
                $payload
            );
        } catch (\Throwable $e) {
            Log::warning('Facebook CAPI error: '.$e->getMessage());
        }
    }

    public function generateEventId(): string
    {
        return (string) Str::uuid();
    }

    public static function hash(string $value): string
    {
        return hash('sha256', strtolower(trim($value)));
    }

    /** @return array<string, mixed> */
    private function buildUserData(Request $request): array
    {
        $userData = [
            'client_ip_address' => $request->ip(),
            'client_user_agent' => $request->userAgent(),
        ];

        if ($request->cookie('_fbc')) {
            $userData['fbc'] = $request->cookie('_fbc');
        }

        if ($request->cookie('_fbp')) {
            $userData['fbp'] = $request->cookie('_fbp');
        }

        return $userData;
    }
}
