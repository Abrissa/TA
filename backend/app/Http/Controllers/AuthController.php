<?php

namespace App\Http\Controllers;

use App\Models\MasterRole;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'captcha_key' => 'required|string',
            'captcha' => 'required|string|size:5',
        ]);

        // Verify captcha from Cache
        $cached = Cache::get("captcha:{$validated['captcha_key']}");
        if (! $cached) {
            return response()->json([
                'success' => false,
                'message' => 'Kode captcha sudah kadaluarsa atau telah digunakan. Kode baru telah dimuat.',
            ], 422);
        }

        Cache::forget("captcha:{$validated['captcha_key']}");

        if (! hash_equals($cached, strtoupper(trim($validated['captcha'])))) {
            return response()->json([
                'success' => false,
                'message' => 'Kode captcha salah. Silakan masukkan kode baru yang muncul pada gambar.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kombinasi email dan kata sandi tidak cocok.'],
            ]);
        }

        if (! $user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Akun administrator Anda telah dinonaktifkan.',
            ], 403);
        }

        if (! $user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses administrator.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);

        // Revoke previous tokens to enforce single session
        $user->tokens()->delete();
        $token = $user->createToken('admin-token', [$user->role])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Autentikasi berhasil.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'last_login_at' => $user->last_login_at,
                ],
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'last_login_at' => $user->last_login_at,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar (logout).',
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'nullable|string|min:8|confirmed|required_without:new_email',
            'new_email' => 'nullable|email|max:255|unique:users,email,'.$request->user()->id.'|required_without:new_password',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Kata sandi saat ini tidak sesuai.'],
            ]);
        }

        $user->update([
            'email' => $validated['new_email'] ?? $user->email,
            'password' => isset($validated['new_password']) ? Hash::make($validated['new_password']) : $user->password,
        ]);

        // Revoke all tokens so this session and any other sessions are logged out immediately
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil diperbarui. Silakan masuk kembali.',
        ]);
    }

    public function listUsers(Request $request): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Administrator yang dapat melihat daftar pengguna.',
            ], 403);
        }

        $users = User::select(['id', 'name', 'email', 'role', 'status', 'phone', 'last_login_at', 'created_at'])
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Administrator yang dapat menambah akun admin baru.',
            ], 403);
        }

        $allowedRoles = ['admin_humas', 'operator_ppdb', 'admin_kesiswaan'];

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', 'string', Rule::in($allowedRoles)],
            'phone' => 'nullable|string|max:30',
        ]);

        $masterRole = MasterRole::where('code', $validated['role'])->first();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'role_id' => $masterRole?->id,
            'status' => 'active',
            'phone' => $validated['phone'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Akun admin baru untuk {$user->name} berhasil dibuat.",
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],
        ], 201);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Administrator yang dapat mengubah akun admin.',
            ], 403);
        }

        $targetUser = User::find($id);
        if (! $targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        if ($targetUser->id === $request->user()->id || $targetUser->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Gunakan pengaturan akun sendiri untuk mengubah akun Super Administrator.',
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$targetUser->id,
            'role' => ['required', 'string', Rule::in(['admin_humas', 'operator_ppdb', 'admin_kesiswaan'])],
            'phone' => 'nullable|string|max:30',
        ]);
        $masterRole = MasterRole::where('code', $validated['role'])->first();

        $targetUser->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'role_id' => $masterRole?->id,
            'phone' => $validated['phone'] ?? null,
        ]);
        $targetUser->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => "Akun {$targetUser->name} berhasil diperbarui dan sesinya dihentikan.",
        ]);
    }

    public function destroyUser(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Administrator yang dapat menghapus akun admin.',
            ], 403);
        }

        $targetUser = User::find($id);
        if (! $targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        if ($targetUser->id === $request->user()->id || $targetUser->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Super Administrator tidak dapat dihapus.',
            ], 422);
        }

        $targetUser->tokens()->delete();
        $targetUser->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun admin berhasil dihapus.',
        ]);
    }

    public function resetUserPassword(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Administrator yang dapat menyetel ulang kata sandi admin lain.',
            ], 403);
        }

        $targetUser = User::find($id);
        if (! $targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        if ($targetUser->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Gunakan form kata sandi akun sendiri untuk mengubah kata sandi Anda.',
            ], 422);
        }

        if (! $targetUser->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Target bukan akun administrator.',
            ], 422);
        }

        $validated = $request->validate([
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $targetUser->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // Revoke target user's tokens to immediately kick out their session
        $targetUser->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => "Kata sandi untuk pengguna {$targetUser->name} berhasil diperbarui dan semua sesi aktifnya telah dihentikan.",
        ]);
    }

    public function forceLogoutUser(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Super Administrator yang dapat mengeluarkan sesi admin.',
            ], 403);
        }

        $targetUser = User::find($id);
        if (! $targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        if ($targetUser->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Gunakan tombol Keluar untuk mengakhiri sesi Anda sendiri.',
            ], 422);
        }

        if (! $targetUser->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Target bukan akun administrator.',
            ], 422);
        }

        $targetUser->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => "Sesi untuk pengguna {$targetUser->name} berhasil dihentikan (force logout).",
        ]);
    }
}
