<?php

namespace App;

use Illuminate\Support\Facades\Http;

class PayMongoService
{
    protected $secretKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('paymongo.secret_key');
        $this->baseUrl = config('paymongo.api_url');
    }

    // public function createCheckoutSession(array $data)
    // {
    //     return Http::withBasicAuth($this->secretKey, '')
    //         ->post("{$this->baseUrl}checkout_sessions", $data)
    //         ->json();
    // }
    public function createCheckoutSession(array $data)
    {
        $payload = [
            'data' => [
                'attributes' => [
                    'line_items' => $data['line_items'], // List of items
                    'payment_method_types' => $data['payment_method_types'], // Enabled payment methods
                    'description' => $data['description'], // Description of the payment
                    'redirect' => $data['redirect'], // Redirect URLs
                ],
            ],
        ];
    
        return Http::withBasicAuth($this->secretKey, '')
            ->post("{$this->baseUrl}/checkout_sessions", $payload)
            ->json();
    }

    public function retrieveCheckoutSession($id)
    {
        return Http::withBasicAuth($this->secretKey, '')
            ->get("{$this->baseUrl}checkout_sessions/{$id}")
            ->json();
    }

    // Add more methods for other API endpoints as needed
}
