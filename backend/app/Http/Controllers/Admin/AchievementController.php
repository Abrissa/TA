<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Achievement::query();

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('year')) {
            $query->where('year', $request->query('year'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('winner', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%");
            });
        }

        $achievements = $query->orderBy('year', 'desc')->orderBy('id', 'desc')->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $achievements->items(),
            'meta' => [
                'current_page' => $achievements->currentPage(),
                'last_page' => $achievements->lastPage(),
                'total' => $achievements->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'date' => 'nullable|string|max:100',
            'year' => 'nullable|string|max:10',
            'rank' => 'nullable|string|max:255',
            'event' => 'nullable|string|max:255',
            'winner' => 'required|string|max:255',
            'winner_role' => 'nullable|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string',
            'details' => 'nullable|array',
            'medals' => 'nullable|array',
            'highlight' => 'nullable|string|max:255',
            'is_highlighted' => 'boolean',
        ]);

        $achievement = Achievement::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data prestasi berhasil ditambahkan.',
            'data' => $achievement,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $achievement = Achievement::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $achievement,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $achievement = Achievement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'date' => 'nullable|string|max:100',
            'year' => 'nullable|string|max:10',
            'rank' => 'nullable|string|max:255',
            'event' => 'nullable|string|max:255',
            'winner' => 'sometimes|required|string|max:255',
            'winner_role' => 'nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'image_url' => 'nullable|string',
            'details' => 'nullable|array',
            'medals' => 'nullable|array',
            'highlight' => 'nullable|string|max:255',
            'is_highlighted' => 'boolean',
        ]);

        $achievement->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data prestasi berhasil diperbarui.',
            'data' => $achievement,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $achievement = Achievement::findOrFail($id);
        $achievement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data prestasi berhasil dihapus.',
        ]);
    }
}
