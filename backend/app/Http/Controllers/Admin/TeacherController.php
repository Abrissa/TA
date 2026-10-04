<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(): JsonResponse
    {
        $teachers = Teacher::orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $teachers,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'degree' => 'nullable|string|max:50',
            'role' => 'required|string|max:150',
            'subjects' => 'nullable|string|max:200',
            'image_url' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $teacher = Teacher::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data dewan guru berhasil ditambahkan.',
            'data' => $teacher,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $teacher = Teacher::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $teacher,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'degree' => 'nullable|string|max:50',
            'role' => 'sometimes|required|string|max:150',
            'subjects' => 'nullable|string|max:200',
            'image_url' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $teacher->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data dewan guru berhasil diperbarui.',
            'data' => $teacher,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data guru berhasil dihapus.',
        ]);
    }
}
