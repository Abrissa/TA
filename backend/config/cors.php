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
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        env('FRONTEND_URL'),
        'https://mialahmadkrian.id',
        'https://www.mialahmadkrian.id',
        'https://mialahmad.sch.id',
        'https://www.mialahmad.sch.id',
        'https://mi-al-ahmad.pages.dev',
    ])),

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.pages\.dev$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-CSRF-Token', 'Authorization'],

    'max_age' => 3600,

    'supports_credentials' => true,

];
