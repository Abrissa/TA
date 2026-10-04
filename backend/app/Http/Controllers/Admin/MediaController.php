<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
            'folder' => 'nullable|string|max:50|regex:/^[a-zA-Z0-9_\-]+$/',
        ]);

        $file = $request->file('file');
        $rawFolder = (string) $request->input('folder', 'general');
        $folder = preg_replace('/[^a-zA-Z0-9_\-]/', '', $rawFolder) ?: 'general';
        $filename = date('Ymd_His') . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs("uploads/{$folder}", $filename, 'public');
        $storageUrl = Storage::url($path);
        $fullUrl = url($storageUrl);

        return response()->json([
            'success' => true,
            'message' => 'Berkas gambar berhasil diunggah.',
            'data' => [
                'path' => $path,
                'url' => $fullUrl,
                'relative_url' => $storageUrl,
                'filename' => $filename,
                'size' => $file->getSize(),
            ],
        ], 201);
    }
}
