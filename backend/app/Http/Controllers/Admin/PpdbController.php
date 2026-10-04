<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PpdbRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PpdbController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PpdbRegistration::with('reviewer');

        if ($request->filled('status')) {
            $status = $request->query('status');
            if ($status === 'menunggu_verifikasi' || $status === 'pending') {
                $query->whereIn('status', ['menunggu_verifikasi', 'pending']);
            } else {
                $query->where('status', $status);
            }
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('registration_number', 'like', "%{$search}%")
                  ->orWhere('child_full_name', 'like', "%{$search}%")
                  ->orWhere('parent_name', 'like', "%{$search}%")
                  ->orWhere('whatsapp', 'like', "%{$search}%");
            });
        }

        $registrations = $query->orderBy('id', 'desc')->paginate($request->query('per_page', 20));

        $statusCounts = [
            'total' => PpdbRegistration::count(),
            'menunggu_verifikasi' => PpdbRegistration::whereIn('status', ['menunggu_verifikasi', 'pending'])->count(),
            'terverifikasi' => PpdbRegistration::where('status', 'terverifikasi')->count(),
            'diterima' => PpdbRegistration::where('status', 'diterima')->count(),
            'ditolak' => PpdbRegistration::where('status', 'ditolak')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $registrations->items(),
            'status_counts' => $statusCounts,
            'meta' => [
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
                'total' => $registrations->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $registration = PpdbRegistration::with('reviewer')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $registration,
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $registration = PpdbRegistration::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:menunggu_verifikasi,terverifikasi,diterima,ditolak,pending',
            'admin_notes' => 'nullable|string',
        ]);

        $registration->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $registration->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status pendaftaran PPDB berhasil diperbarui.',
            'data' => $registration,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $registration = PpdbRegistration::findOrFail($id);
        $registration->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pendaftar PPDB berhasil dihapus.',
        ]);
    }
}
