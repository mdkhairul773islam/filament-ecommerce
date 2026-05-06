<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SSLCommerzService
{
    protected string $storeId;

    protected string $storePassword;

    protected bool $isLive;

    protected string $sandboxUrl = 'https://sandbox.sslcommerz.com';

    protected string $liveUrl = 'https://securepay.sslcommerz.com';

    public function __construct()
    {
        $this->storeId = config('services.sslcommerz.store_id');
        $this->storePassword = config('services.sslcommerz.store_password');
        $this->isLive = (bool) config('services.sslcommerz.is_live', false);
    }

    protected function baseUrl(): string
    {
        return $this->isLive ? $this->liveUrl : $this->sandboxUrl;
    }

    /**
     * Initiate a payment session and return the GatewayPageURL to redirect the user.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function initiatePayment(array $params): array
    {
        $payload = array_merge([
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
        ], $params);

        $response = Http::asForm()->post($this->baseUrl().'/gwprocess/v4/api.php', $payload);

        return $response->json() ?? [];
    }

    /**
     * Validate an IPN / success callback by verifying val_id with SSLCommerz.
     *
     * @return array<string, mixed>
     */
    public function validatePayment(string $valId): array
    {
        $response = Http::get($this->baseUrl().'/validator/api/validationserverAPI.php', [
            'val_id' => $valId,
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
            'v' => 1,
            'format' => 'json',
        ]);

        return $response->json() ?? [];
    }
}
