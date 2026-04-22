<?php

return [
    // Client ID dari DOKU Dashboard → Integration → API Keys
    'client_id'       => env('DOKU_CLIENT_ID', ''),

    // Secret Key dari DOKU Dashboard → Integration → API Keys
    'secret_key'      => env('DOKU_SECRET_KEY', ''),

    // Base URL (tidak digunakan langsung lagi — SDK yang handle)
    // Tetap disimpan untuk referensi / logging
    'base_url'        => env('DOKU_BASE_URL', 'https://api-sandbox.doku.com'),

    // Path ke file private key RSA (pkcs8.key)
    // Relatif dari root project atau path absolut
    // Contoh: storage/app/doku-private.key
    'private_key_path'=> env('DOKU_PRIVATE_KEY_PATH', 'storage/app/doku-private.key'),

    // true = production, false = sandbox
    'is_production'   => env('DOKU_IS_PRODUCTION', false),

    // URL callback setelah customer bayar (diisi ngrok URL saat development)
    'callback_url'    => env('DOKU_CALLBACK_URL', 'https://liking-subside-spectrum.ngrok-free.dev/doku/callback'),

    // Partner Service ID dari DOKU Dashboard → Settings → Virtual Account SNAP → Configure
    // Ambil nilai kolom "Partner Service ID" (contoh: 19008)
    'partner_service_id' => env('DOKU_PARTNER_SERVICE_ID', '19008'),
];