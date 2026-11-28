# 04 - AUTENTIKASI: SANCTUM, ROLE, TOKEN REVOKE, MIDDLEWARE

## 4.1 Arsitektur Auth

```
┌─────────────┐     POST /api/auth/login      ┌─────────────┐
│  FRONTEND   │ ─────────────────────────────► │  BACKEND    │
│  (React)    │ ◄───────────────────────────── │  (Laravel)  │
└─────────────┘   { token, user, role }       └─────────────┘
       │                                           │
       │ Authorization: Bearer <token>             │
       ▼                                           ▼
┌─────────────┐                         ┌─────────────┐
│  LocalStorage│                         │  Sanctum    │
│  token + user│                         │  Personal   │
└─────────────┘                         │  Access     │
                                        │  Tokens     │
                                        └─────────────┘
```

## 4.2 Endpoint Autentikasi

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login email + password | ❌ Public |
| POST | `/api/auth/logout` | Logout (revoke current token) | ✅ Sanctum |
| GET | `/api/auth/me` | Profil user login | ✅ Sanctum |
| POST | `/api/auth/update-password` | Ganti password/email sendiri | ✅ Sanctum |
| GET | `/api/auth/users` | List semua admin (superadmin) | ✅ Superadmin |
| POST | `/api/auth/users` | Buat admin baru (superadmin) | ✅ Superadmin |
| PUT | `/api/auth/users/{id}` | Update admin lain (superadmin) | ✅ Superadmin |
| DELETE | `/api/auth/users/{id}` | Hapus admin (superadmin) | ✅ Superadmin |
| POST | `/api/auth/users/{id}/reset-password` | Reset password admin lain | ✅ Superadmin |
| POST | `/api/auth/users/{id}/force-logout` | Revoke all tokens admin lain | ✅ Superadmin |

## 4.3 Login Flow

### Request
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mialahmad.sch.id","password":"admin123"}'
```

### Response Sukses (200)
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 1,
      "name": "Administrator Utama",
      "email": "admin@mialahmad.sch.id",
      "role": "superadmin",
      "status": "active",
      "phone": "081234567890",
      "last_login_at": "2026-11-28T07:00:00.000000Z"
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz1234567890..."
  }
}
```

### Response Gagal (422/401)
```json
{
  "success": false,
  "message": "Kredensial tidak valid.",
  "errors": { "email": ["Email tidak terdaftar."] }
}
```

## 4.4 Token Management (Sanctum)

### 4.4.1 Token Dibuat Saat Login
```php
// AuthController::login()
$token = $user->createToken('api-token')->plainTextToken;
```
- Nama token: `'api-token'` (fixed)
- Expiry: default 1 tahun (config `sanctum.expiration`)
- Disimpan di `personal_access_tokens` table

### 4.4.2 Token Dianggap Valid Jika
- Ada di header `Authorization: Bearer <token>`
- Token ada di DB, tidak expired, `tokenable_id` cocok user
- User `status = 'active'`

### 4.4.3 Token Revoke (Logout / Force Logout)
```php
// Logout sendiri
$user->tokens()->where('id', $request->user()->currentAccessToken()->id)->delete();

// Force logout semua session (ganti password, reset, hapus akun)
$user->tokens()->delete();
```
**Efek**: Semua device login user tersebut **langsung logout**.

## 4.5 Role & Permission

### 4.5.1 Role Codes (dari `master_roles`)
| Code | Nama | Level |
|------|------|-------|
| `superadmin` | Super Administrator | Highest |
| `admin_humas` | Admin Humas & Publikasi | Admin |
| `operator_ppdb` | Operator PPDB | Admin |
| `admin_kesiswaan` | Admin Kesiswaan | Admin |

### 4.5.2 Model User Helper
```php
// app/Models/User.php
public function isSuperAdmin(): bool
{
    return $this->role === 'superadmin';
}

public function isAdmin(): bool
{
    return in_array($this->role, ['admin_humas', 'operator_ppdb', 'admin_kesiswaan']);
}

public function hasRole(string $role): bool
{
    return $this->role === $role;
}
```

### 4.5.3 Middleware

| Middleware | File | Cek |
|------------|------|-----|
| `auth:sanctum` | Laravel built-in | Token valid |
| `EnsureAdmin` | `app/Http/Middleware/EnsureAdmin.php` | Role ∈ {superadmin, admin_humas, operator_ppdb, admin_kesiswaan} |
| `EnsureSuperAdmin` | (inline di controller) | `$user->isSuperAdmin()` |

```php
// EnsureAdmin.php
public function handle(Request $request, Closure $next): Response
{
    if (! $request->user() || ! $request->user()->isAdmin()) {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Peran administrator diperlukan.',
        ], 403);
    }
    return $next($request);
}
```

### 4.5.4 Route Protection
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/update-password', [AuthController::class, 'updatePassword']);

    // Superadmin only
    Route::middleware('ensure.superadmin')->group(function () {
        Route::get('/auth/users', [AuthController::class, 'listUsers']);
        Route::post('/auth/users', [AuthController::class, 'storeUser']);
        Route::put('/auth/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/auth/users/{id}', [AuthController::class, 'destroyUser']);
        Route::post('/auth/users/{id}/reset-password', [AuthController::class, 'resetUserPassword']);
        Route::post('/auth/users/{id}/force-logout', [AuthController::class, 'forceLogoutUser']);
    });
});
```

## 4.6 Frontend Auth Integration

### 4.6.1 Login (services/api.ts)
```typescript
async login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await handleResponse(res);
  localStorage.setItem('token', json.data.token);
  localStorage.setItem('user', JSON.stringify(json.data.user));
  return json.data;
}
```

### 4.6.2 Auth Headers
```typescript
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
```

### 4.6.3 Auto Logout on 401
```typescript
// Di handleResponse()
if (res.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

## 4.7 Keamanan Token

| Threat | Mitigasi |
|--------|----------|
| Token bocor di log | `config/logging.php` → `sanitize` sensitive fields |
| Token di URL | Hanya via Header `Authorization` |
| Replay attack | HTTPS wajib production, token expiry 1 tahun |
| XSS ambil token | `HttpOnly` cookie **tidak** dipakai (SPA + Sanctum), simpan di `localStorage` → CSP ketat |
| CSRF | Sanctum SPA mode + CORS origin validation |

## 4.8 Testing Auth

```bash
cd backend
php artisan test --filter=auth
# Atau spesifik
php artisan test --filter=test_user_can_update_email_without_changing_password
php artisan test --filter=test_superadmin_can_update_and_delete_admin_accounts
```

---

> **Next**: [05-MANAJEMEN-AKUN.md](./05-MANAJEMEN-AKUN.md) — CRUD Admin, Ganti Email/Password, Force Logout