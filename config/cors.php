<?php

return [

    /*

    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------

    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute

    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://mozilla.org
    |
    */

    // Mengizinkan CORS hanya pada jalur routes/api.php
    'paths' => ['api/*'],

    // Mengizinkan semua metode HTTP (GET, POST, PUT, DELETE, dll)
    'allowed_methods' => ['*'],

    // Hanya mengizinkan request datang dari frontend Vite/React/Vue Anda
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5175'],

    'allowed_origins_patterns' => [],

    // Mengizinkan semua jenis HTTP Headers dari frontend
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Sesuai request Anda, dimatikan karena tidak memakai cookie auth/sanctum
    'supports_credentials' => false,

];
