<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(): JsonResponse
    {
        $facilities = Facility::orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $facilities,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string',
            'icon_name' => 'nullable|string|max:50',
            'image_url' => 'nullable|string',
            'order' => 'integer',
        ]);

        $facility = Facility::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas berhasil ditambahkan.',
            'data' => $facility,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $facility = Facility::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:150',
            'description' => 'sometimes|required|string',
            'icon_name' => 'nullable|string|max:50',
            'image_url' => 'nullable|string',
            'order' => 'integer',
        ]);

        $facility->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas berhasil diperbarui.',
            'data' => $facility,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $facility = Facility::findOrFail($id);
        $facility->delete();

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas berhasil dihapus.',
        ]);
    }
}
