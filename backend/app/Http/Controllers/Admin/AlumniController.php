<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use App\Models\AlumniSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlumniController extends Controller
{
    // Submissions from public form
    public function submissions(Request $request): JsonResponse
    {
        $query = AlumniSubmission::with('reviewer');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $submissions = $query->orderBy('id', 'desc')->paginate($request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $submissions->items(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'total' => $submissions->total(),
            ],
        ]);
    }

    public function updateSubmissionStatus(Request $request, int $id): JsonResponse
    {
        $submission = AlumniSubmission::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'notes' => 'nullable|string',
            'publish_to_directory' => 'boolean',
        ]);

        $submission->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $submission->notes,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        // If approved and requested to publish to public directory
        if ($validated['status'] === 'approved' && !empty($validated['publish_to_directory'])) {
            AlumniProfile::updateOrCreate(
                ['submission_id' => $submission->id],
                [
                    'name' => $submission->full_name,
                    'graduation_year' => 'Lulusan ' . $submission->graduation_year,
                    'title' => $submission->job_role,
                    'current_role' => $submission->job_role,
                    'bio' => $submission->message,
                    'image_url' => $submission->photo_url,
                    'social_url' => $submission->social_media,
                    'is_active' => true,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Status formulir alumni berhasil diperbarui.',
            'data' => $submission,
        ]);
    }

    public function destroySubmission(int $id): JsonResponse
    {
        $submission = AlumniSubmission::findOrFail($id);
        AlumniProfile::where('submission_id', $submission->id)->delete();
        $submission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pengajuan alumni berhasil dihapus.',
        ]);
    }

    // Public Directory Profiles
    public function profiles(): JsonResponse
    {
        $profiles = AlumniProfile::orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $profiles,
        ]);
    }

    public function storeProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'graduation_year' => 'required|string|max:50',
            'title' => 'nullable|string|max:150',
            'current_role' => 'required|string|max:150',
            'bio' => 'required|string',
            'quote' => 'nullable|string',
            'image_url' => 'nullable|string',
            'social_url' => 'nullable|string',
            'category_badge' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $profile = AlumniProfile::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil alumni publik berhasil ditambahkan.',
            'data' => $profile,
        ], 201);
    }

    public function updateProfile(Request $request, int $id): JsonResponse
    {
        $profile = AlumniProfile::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'graduation_year' => 'sometimes|required|string|max:50',
            'title' => 'nullable|string|max:150',
            'current_role' => 'sometimes|required|string|max:150',
            'bio' => 'sometimes|required|string',
            'quote' => 'nullable|string',
            'image_url' => 'nullable|string',
            'social_url' => 'nullable|string',
            'category_badge' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $profile->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil alumni publik berhasil diperbarui.',
            'data' => $profile,
        ]);
    }

    public function destroyProfile(int $id): JsonResponse
    {
        $profile = AlumniProfile::findOrFail($id);
        $profile->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profil alumni publik berhasil dihapus.',
        ]);
    }
}
