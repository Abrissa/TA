<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasterAcademicYear;
use App\Models\MasterAlumniCohort;
use App\Models\MasterCategory;
use App\Models\MasterPpdbPath;
use App\Models\MasterRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MasterDataController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'academic_years' => MasterAcademicYear::orderBy('code', 'desc')->get(),
                'categories' => MasterCategory::orderBy('order', 'asc')->get(),
                'ppdb_paths' => MasterPpdbPath::orderBy('order', 'asc')->get(),
                'cohorts' => MasterAlumniCohort::orderBy('year', 'desc')->get(),
                'roles' => MasterRole::all(),
            ],
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:article,achievement,announcement',
            'name' => 'required|string|max:100',
            'badge_color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category = MasterCategory::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Master kategori berhasil ditambahkan.',
            'data' => $category,
        ], 201);
    }

    public function updatePpdbPath(Request $request, int $id): JsonResponse
    {
        $path = MasterPpdbPath::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'quota' => 'sometimes|required|integer|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $path->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jalur PPDB berhasil diperbarui.',
            'data' => $path,
        ]);
    }

    public function setActiveAcademicYear(int $id): JsonResponse
    {
        MasterAcademicYear::query()->update(['is_active' => false]);

        $year = MasterAcademicYear::findOrFail($id);
        $year->update(['is_active' => true]);

        return response()->json([
            'success' => true,
            'message' => "Tahun ajaran aktif diubah ke {$year->name}.",
            'data' => $year,
        ]);
    }
}
