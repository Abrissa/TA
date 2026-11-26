<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CaptchaController extends Controller
{
    public function generate(): JsonResponse
    {
        $key = Str::uuid()->toString();
        $charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        $code = '';
        $maxIndex = strlen($charset) - 1;
        for ($i = 0; $i < 5; $i++) {
            $code .= $charset[random_int(0, $maxIndex)];
        }

        // Cache captcha code for 3 minutes
        Cache::put("captcha:{$key}", $code, now()->addMinutes(3));

        $svg = $this->generateSvg($code);

        return response()->json([
            'key' => $key,
            'svg' => 'data:image/svg+xml;base64,'.base64_encode($svg),
            'expires_in' => 60,
        ]);
    }

    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'captcha' => 'required|string|size:5',
        ]);

        $cached = Cache::pull("captcha:{$validated['key']}");
        $valid = $cached && hash_equals($cached, strtoupper(trim($validated['captcha'])));

        return response()->json([
            'success' => $valid,
            'message' => $valid ? 'Captcha valid' : 'Captcha tidak valid atau telah kadaluarsa',
        ], $valid ? 200 : 422);
    }

    private function generateSvg(string $code): string
    {
        $width = 160;
        $height = 50;
        $fontSize = 26;
        $chars = str_split($code);
        $svg = "<svg xmlns='http://www.w3.org/2000/svg' width='{$width}' height='{$height}' viewBox='0 0 {$width} {$height}'>";
        $svg .= "<rect width='100%' height='100%' fill='#0f172a' rx='8'/>";

        // Subtle background grid
        for ($x = 10; $x < $width; $x += 20) {
            $svg .= "<line x1='{$x}' y1='0' x2='{$x}' y2='{$height}' stroke='#1e293b' stroke-width='1' opacity='0.6'/>";
        }

        // Noise lines
        for ($i = 0; $i < 3; $i++) {
            $x1 = random_int(0, $width);
            $y1 = random_int(5, $height - 5);
            $x2 = random_int(0, $width);
            $y2 = random_int(5, $height - 5);
            $stroke = sprintf('#%06X', random_int(0x334155, 0x475569));
            $svg .= "<line x1='{$x1}' y1='{$y1}' x2='{$x2}' y2='{$y2}' stroke='{$stroke}' stroke-width='1.5' opacity='0.5'/>";
        }

        // Text chars with slight rotation and high contrast
        $x = 20;
        $colors = ['#34d399', '#38bdf8', '#fbbf24', '#a7f3d0', '#f472b6'];
        foreach ($chars as $idx => $ch) {
            $rot = random_int(-6, 6);
            $y = 35;
            $color = $colors[$idx % count($colors)];
            $svg .= "<text x='{$x}' y='{$y}' font-family='Arial, sans-serif' font-size='{$fontSize}' font-weight='900' fill='{$color}' letter-spacing='3' transform='rotate({$rot} {$x} {$y})'>{$ch}</text>";
            $x += 25;
        }

        $svg .= '</svg>';

        return $svg;
    }
}
