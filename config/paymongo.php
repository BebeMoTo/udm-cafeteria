<?php

return [
    'secret_key' => env('PAYMONGO_SECRET_KEY', ''),
    'public_key' => env('PAYMONGO_PUBLIC_KEY', ''),
    'api_url' => env('PAYMONGO_API_URL', 'https://api.paymongo.com/v1/'),
];
