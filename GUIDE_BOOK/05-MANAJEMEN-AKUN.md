# 05 - MANAJEMEN AKUN ADMIN: CRUD, GANTI EMAIL/PASSWORD, FORCE LOGOUT

## 5.1 Overview

Fitur manajemen akun ada di **Dashboard Admin → Tab "Keamanan & Akun"**.  
Hanya **Superadmin** yang akses penuh. Admin lain hanya bisa ganti kredensial sendiri.

## 5.2 Daftar Pengguna Admin (Superadmin)

### UI: Tabel "Daftar Pengguna Admin"
- Kolom: No, Nama, Email, Peran, Status, Terakhir Login, Dibuat, Aksi
- Peran badge: color-coded (Superadmin=ungu, Humas=biru, PPDB=emerald, Kesiswaan=amber)
- Status badge: Aktif (hijau) / Nonaktif (abu)

### Endpoint
```
GET /api/auth/users
Headers: Authorization: Bearer <superadmin_token>
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrator Utama",
      "email": "admin@mialahmad.sch.id",
      "role": "superadmin",
      "status": "active",
      "phone": "081234567890",
      "last_login_at": "2026-11-28T07:00:00.000000Z",
      "created_at": "2026-10-01T00:00:00.000000Z"
    },
    ...
  ]
}
```

## 5.3 Buat Admin Baru (Superadmin)

### UI: Form "Tambah Admin Baru"
- **Nama** (wajib, max 255)
- **Email** (wajib, unique, format email)
- **Peran** (wajib, dropdown: Admin Humas / Operator PPDB / Admin Kesiswaan) — **tidak bisa buat Superadmin**
- **Telepon** (opsional, max 30)
- **Password** (wajib, min 8 char, konfirmasi)

### Validasi Backend
```php
// AuthController::storeUser()
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|email|max:255|unique:users,email',
    'role' => ['required', 'string', Rule::in(['admin_humas', 'operator_ppdb', 'admin_kesiswaan'])],
    'phone' => 'nullable|string|max:30',
    'password' => 'required|string|min:8|confirmed',
]);
```

### Endpoint
```
POST /api/auth/users
Body: { name, email, role, phone?, password, password_confirmation }
```

### Response Sukses
```json
{
  "success": true,
  "message": "Akun admin berhasil dibuat.",
  "data": { "id": 5, "name": "...", "email": "...", "role": "operator_ppdb" }
}
```

## 5.4 Edit Admin Lain (Superadmin)

### UI: Tombol "Edit" di baris tabel → Panel side/form
- **Nama** (wajib)
- **Email** (wajib, unique kecuali milik sendiri)
- **Peran** (wajib, dropdown 3 role admin)
- **Telepon** (opsional)
- **Tombol "Simpan Perubahan"**

### Backend Logic
```php
// AuthController::updateUser()
$targetUser->update([
    'name' => $validated['name'],
    'email' => $validated['email'],
    'role' => $validated['role'],
    'role_id' => $masterRole?->id,
    'phone' => $validated['phone'] ?? null,
]);
$targetUser->tokens()->delete();  // Force logout
```

### Larangan
- ❌ Tidak bisa edit **diri sendiri** (gunakan form "Akun Saya")
- ❌ Tidak bisa edit **Superadmin lain**
- ✅ Bisa edit role, email, nama, telepon

### Endpoint
```
PUT /api/auth/users/{id}
Body: { name, email, role, phone? }
```

## 5.5 Hapus Admin (Superadmin)

### UI: Tombol "Hapus" → Konfirmasi modal
> "Yakin ingin menghapus akun admin 'Nama'? Tindakan ini tidak dapat dibatalkan."

### Backend Logic
```php
// AuthController::destroyUser()
$targetUser->tokens()->delete();
$targetUser->delete();
```

### Larangan
- ❌ Tidak bisa hapus **diri sendiri**
- ❌ Tidak bisa hapus **Superadmin**
- ✅ Bisa hapus admin_humas, operator_ppdb, admin_kesiswaan

### Endpoint
```
DELETE /api/auth/users/{id}
```

## 5.6 Reset Password Admin Lain (Superadmin)

### UI: Tombol "Reset Sandi" di baris tabel → Modal
- **Password Baru** (min 8 char, konfirmasi)
- **Tombol "Reset Sandi"**

### Backend Logic
```php
// AuthController::resetUserPassword()
$targetUser->update(['password' => Hash::make($validated['new_password'])]);
$targetUser->tokens()->delete();
```

### Endpoint
```
POST /api/auth/users/{id}/reset-password
Body: { new_password, new_password_confirmation }
```

## 5.7 Force Logout Admin Lain (Superadmin)

### UI: Tombol "Keluarkan" (ikon logout) di baris tabel
- Langsung execute, tanpa input password

### Backend Logic
```php
// AuthController::forceLogoutUser()
$targetUser->tokens()->delete();
```

### Endpoint
```
POST /api/auth/users/{id}/force-logout
```

## 5.8 Ganti Email & Password Sendiri (Semua Admin)

### UI: Form "Akun Saya" (selalu terlihat)
- **Email Akun** (editable, validasi unique)
- **Kata Sandi Saat Ini** (wajib)
- **Kata Sandi Baru** (opsional, min 8 char, konfirmasi)
- **Tombol "Simpan Perubahan"**

### Aturan
- Bisa **hanya ganti email** (kosongkan password baru)
- Bisa **hanya ganti password** (kosongkan email baru)
- Bisa **keduanya sekaligus**
- `current_password` **selalu wajib** (bukti identitas)

### Backend Validation
```php
// AuthController::updatePassword()
$validated = $request->validate([
    'current_password' => 'required|string',
    'new_password' => 'nullable|string|min:8|confirmed|required_without:new_email',
    'new_email' => 'nullable|email|max:255|unique:users,email,'.$request->user()->id.'|required_without:new_password',
]);
```

### Logic Update
```php
$user->update([
    'email' => $validated['new_email'] ?? $user->email,
    'password' => isset($validated['new_password']) ? Hash::make($validated['new_password']) : $user->password,
]);
$user->tokens()->delete();  // Revoke all sessions
```

### Endpoint
```
POST /api/auth/update-password
Body: { current_password, new_password?, new_password_confirmation?, new_email? }
```

### Response Sukses
```json
{
  "success": true,
  "message": "Akun berhasil diperbarui. Silakan masuk kembali.",
  "data": { "user": { ...updated user... } }
}
```

> **Frontend**: Setelah sukses, auto `localStorage.clear()` + redirect ke `/login`.

## 5.9 Ringkasan Hak Akses per Fitur

| Fitur | Superadmin | Admin Humas | Operator PPDB | Admin Kesiswaan |
|-------|------------|-------------|---------------|-----------------|
| Lihat daftar admin | ✅ | ❌ | ❌ | ❌ |
| Buat admin baru | ✅ | ❌ | ❌ | ❌ |
| Edit admin lain | ✅ | ❌ | ❌ | ❌ |
| Hapus admin | ✅ | ❌ | ❌ | ❌ |
| Reset password admin lain | ✅ | ❌ | ❌ | ❌ |
| Force logout admin lain | ✅ | ❌ | ❌ | ❌ |
| Ganti email/password sendiri | ✅ | ✅ | ✅ | ✅ |

## 5.10 Testing Manual Checklist

- [ ] Superadmin login → buka tab Keamanan & Akun → lihat tabel user
- [ ] Buat admin baru role `operator_ppdb` → login sebagai user baru → cek akses PPDB
- [ ] Superadmin edit email admin lain → cek unique validation
- [ ] Superadmin hapus admin → cek user hilang dari DB & tabel
- [ ] Superadmin reset password admin lain → login pakai password baru
- [ ] Superadmin force logout admin lain → user tiba-tiba logout di tab lain
- [ ] Admin biasa ganti email sendiri → logout otomatis → login pakai email baru
- [ ] Admin biasa ganti password sendiri → logout otomatis → login pakai password baru
- [ ] Admin biasa ganti email + password sekaligus → logout → login baru

---

> **Next**: [06-PPDB.md](./06-PPDB.md) — Alur PPDB: Daftar, Verifikasi, Status, Cetak