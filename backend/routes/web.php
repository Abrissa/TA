<?php

use App\Http\Controllers\CaptchaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Captcha routes - for frontend authentication
Route::get('/captcha/generate', [CaptchaController::class, 'generate']);
Route::post('/captcha/verify', [CaptchaController::class, 'verify'])->name('captcha.verify');
