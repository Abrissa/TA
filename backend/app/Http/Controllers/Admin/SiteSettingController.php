<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolProfile;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSetting::all()->groupBy('group');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function batchUpdate(Request $request): JsonResponse
    {
        $rawSettings = $request->input('settings', $request->all());
        if (!is_array($rawSettings)) {
            return response()->json([
                'success' => false,
                'message' => 'Format pengaturan tidak valid.',
            ], 422);
        }

        $settingsMap = [];

        foreach ($rawSettings as $k => $item) {
            if (is_array($item) && isset($item['key'])) {
                $key = (string) $item['key'];
                $rawVal = $item['value'] ?? '';
            } else {
                $key = (string) $k;
                $rawVal = $item;
            }

            if ($key === 'settings' && is_array($rawVal)) {
                foreach ($rawVal as $subK => $subItem) {
                    if (is_array($subItem) && isset($subItem['key'])) {
                        $sKey = (string) $subItem['key'];
                        $sVal = is_bool($subItem['value'] ?? null) ? ($subItem['value'] ? 'true' : 'false') : (string) ($subItem['value'] ?? '');
                    } else {
                        $sKey = (string) $subK;
                        $sVal = is_bool($subItem) ? ($subItem ? 'true' : 'false') : (string) ($subItem ?? '');
                    }
                    $settingsMap[$sKey] = $sVal;
                    SiteSetting::updateOrCreate(['key' => $sKey], ['value' => $sVal]);
                }
                continue;
            }

            $val = is_bool($rawVal) ? ($rawVal ? 'true' : 'false') : (string) ($rawVal ?? '');
            $settingsMap[$key] = $val;
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $val]
            );
        }

        // Sync shared fields with SchoolProfile record
        $profile = SchoolProfile::firstOrCreate(['id' => 1]);
        $profileUpdates = [];
        $keyMap = [
            'school_name' => 'name',
            'school_tagline' => 'tagline',
            'school_accreditation' => 'accreditation',
            'school_npsn' => 'npsn',
            'school_phone' => 'phone',
            'school_whatsapp' => 'whatsapp',
            'school_email' => 'email',
            'school_address' => 'address',
            'maps_embed_url' => 'maps_embed_url',
            'school_logo_url' => 'logo_url',
            'hero_image_url' => 'hero_image_url',
            'principal_name' => 'principal_name',
            'principal_greeting' => 'principal_greeting',
            'principal_image_url' => 'principal_image_url',
            'vision_text' => 'vision',
            'social_instagram' => 'social_instagram',
            'social_facebook' => 'social_facebook',
            'social_youtube' => 'social_youtube',
            'social_tiktok' => 'social_tiktok',
        ];

        foreach ($keyMap as $settingKey => $profileField) {
            if (array_key_exists($settingKey, $settingsMap)) {
                $profileUpdates[$profileField] = $settingsMap[$settingKey];
            }
        }

        if (array_key_exists('mission_text', $settingsMap)) {
            $lines = array_filter(array_map('trim', explode("\n", (string) $settingsMap['mission_text'])));
            $profileUpdates['missions'] = array_values($lines);
        }

        if (!empty($profileUpdates)) {
            $profile->update($profileUpdates);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan website berhasil disimpan.',
            'data' => SiteSetting::all()->pluck('value', 'key'),
        ]);
    }
}
