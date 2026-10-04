<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = SchoolProfile::firstOrCreate(['id' => 1]);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $profile = SchoolProfile::firstOrCreate(['id' => 1]);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'npsn' => 'nullable|string|max:30',
            'accreditation' => 'nullable|string|max:50',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'vision' => 'nullable|string',
            'mission' => 'nullable|array',
            'objectives' => 'nullable|array',
            'principal_name' => 'nullable|string|max:150',
            'principal_greeting' => 'nullable|string',
            'principal_image_url' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'hero_image_url' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'maps_embed_url' => 'nullable|string',
            'social_instagram' => 'nullable|string',
            'social_facebook' => 'nullable|string',
            'social_youtube' => 'nullable|string',
            'social_tiktok' => 'nullable|string',
        ]);

        $profile->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil instansi sekolah berhasil diperbarui.',
            'data' => $profile,
        ]);
    }
}
