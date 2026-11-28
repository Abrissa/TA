# 03 - DATABASE: MIGRASI, SEEDER, PASSWORD, BACKUP/RESTORE

## 3.1 Skema Tabel Utama (Ringkas)

| Tabel | Deskripsi | Kolom Kunci |
|-------|-----------|-------------|
| `users` | Admin & superadmin | `id, name, email, password, role, role_id, status, phone, last_login_at` |
| `master_roles` | Definisi peran | `id, code, name, description` |
| `master_academic_years` | Tahun ajaran | `id, year, is_active` |
| `master_ppdb_paths` | Jalur PPDB (reguler, afirmasi, dll.) | `id, name, code, is_active, order` |
| `master_alumni_cohorts` | Angkatan alumni | `id, year, name, motto` |
| `ppdb_registrations` | Pendaftar santri baru | `id, registration_number, child_full_name, gender, birth_date, parent_name, whatsapp, address, previous_school, status, academic_year_id, ppdb_path_id, admin_notes, reviewed_at, reviewed_by` |
| `alumni_submissions` | Data alumni | `id, cohort_id, full_name, graduation_year, job_role, photo_url, social_media, phone, email, message, status` |
| `news` | Berita/artikel | `id, title, slug, excerpt, content, featured_image, category_id, status, published_at` |
| `categories` | Kategori berita | `id, name, slug` |
| `galleries` | Galeri foto | `id, title, image_url, category, sort_order` |
| `announcements` | Pengumuman | `id, title, content, priority, status, published_at` |
| `school_profile` | Profil madrasah (single row) | `id, name, npsn, accreditation, tagline, description, address, phone, whatsapp, email, website, principal_name, vision, mission, logo_url, hero_image_url` |
| `personal_access_tokens` | Sanctum tokens | `id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at` |

> Lihat detail lengkap di `backend/database/migrations/*.php`

## 3.2 Menjalankan Migrasi

```bash
cd backend

# Fresh migrate + seed (hapus semua data)
php artisan migrate:fresh --seed

# Hanya migrate (tambah tabel baru)
php artisan migrate

# Rollback 1 step
php artisan migrate:rollback

# Rollback semua
php artisan migrate:reset

# Status migrasi
php artisan migrate:status
```

## 3.3 Seeder & Data Default

### 3.3.1 DatabaseSeeder (Utama)

File: `backend/database/seeders/DatabaseSeeder.php`

Menjalankan urutan:
1. `MasterRoleSeeder` — role `superadmin`, `admin_humas`, `operator_ppdb`, `admin_kesiswaan`
2. `MasterAcademicYearSeeder` — tahun ajaran aktif
3. `MasterPpdbPathSeeder` — jalur PPDB default
4. `MasterAlumniCohortSeeder` — angkatan alumni
5. **Users** — superadmin + admin humas (hardcoded)
6. `SchoolProfileSeeder` — profil madrasah default

### 3.3.2 Kredensial Default (Dari Seeder)

| Role | Email | Password | Catatan |
|------|-------|----------|---------|
| Superadmin | `admin@mialahmad.sch.id` | `admin123` | `updateOrCreate` → password **hanya** saat create |
| Admin Humas | `humas@mialahmad.sch.id` | `humas123` | Sama di atas |

> ⚠️ **Penting**: `User::updateOrCreate(['email' => ...], [...])` **tidak mengupdate password** jika record sudah ada. Jika butuh reset password default, gunakan fitur **Reset Password** di tab *Keamanan & Akun* (superadmin) atau hapus user lalu `php artisan db:seed --class=DatabaseSeeder`.

### 3.3.3 Menjalankan Seeder Tertentu

```bash
# Semua seeder
php artisan db:seed

# Khusus satu seeder
php artisan db:seed --class=DatabaseSeeder
php artisan db:seed --class=MasterRoleSeeder
```

## 3.4 Password & Hashing

| Aspek | Implementasi |
|-------|--------------|
| **Algorithm** | Bcrypt (Laravel default) |
| **Rounds** | 12 (production), 4 (testing via `phpunit.xml`) |
| **Hash Helper** | `Hash::make('plain')`, `Hash::check('plain', $hashed)` |
| **Update Password** | `AuthController::updatePassword()` → `Hash::make($new)` + `tokens()->delete()` |
| **Reset oleh Superadmin** | `AuthController::resetUserPassword()` → generate random 10 char + hash + revoke tokens |

### 3.4.1 Ganti Password Sendiri (User Login)

Endpoint: `POST /api/auth/update-password`

```json
{
  "current_password": "admin123",
  "new_password": "baru123456",
  "new_password_confirmation": "baru123456",
  "new_email": "optional@baru.com"   // optional
}
```

- Validasi: `current_password` wajib cocok
- `new_password` min 8 char + confirmed
- `new_email` unique (kecuali milik sendiri)
- **Semua token user dihapus** → logout otomatis semua device

### 3.4.2 Superadmin Reset Password Admin Lain

Endpoint: `POST /api/auth/users/{id}/reset-password`

```json
{
  "new_password": "baru123456",
  "new_password_confirmation": "baru123456"
}
```

- Hanya superadmin
- Tidak butuh password lama
- Token target dihapus → force logout

## 3.5 Backup & Restore Database

### 3.5.1 SQLite (Development)

```bash
# Backup (copy file)
cp backend/database/database.sqlite backend/database/backup_$(date +%F).sqlite

# Restore
cp backend/database/backup_2026-11-28.sqlite backend/database/database.sqlite
```

### 3.5.2 MySQL/MariaDB (Production)

```bash
# Backup (struktur + data)
mysqldump -u root -p ta_mialahmad > backup_$(date +%F).sql

# Backup hanya data (tanpa create table)
mysqldump -u root -p --no-create-info ta_mialahmad > data_only_$(date +%F).sql

# Restore
mysql -u root -p ta_mialahmad < backup_2026-11-28.sql
```

### 3.5.3 Backup Otomatis (Cron cPanel/VPS)

```bash
# Crontab entry (setiap jam 2 pagi)
0 2 * * * /usr/bin/mysqldump -u USER -p'PASS' DB_NAME | gzip > /home/user/backups/db_$(date +\%F_\%H-\%M).sql.gz

# Hapus backup > 30 hari
0 3 * * * find /home/user/backups -name "db_*.sql.gz" -mtime +30 -delete
```

## 3.6 Migrasi Production (cPanel/VPS)

```bash
# 1. Pastikan .env production sudah benar (DB MySQL, APP_KEY, dll.)
# 2. Jalankan migrasi
php artisan migrate --force

# 3. Jalankan seeder jika fresh install
php artisan db:seed --force

# 4. Clear & cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> **Catatan**: `--force` wajib di production non-interaktif (CI/CD).

## 3.7 Troubleshooting Database

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `SQLSTATE[HY000] [1049] Unknown database` | DB tidak exist | Buat database MySQL / cek `DB_DATABASE` |
| `SQLSTATE[HY000] [2002] Connection refused` | MySQL tidak jalan / host salah | Cek `DB_HOST`, `DB_PORT`, service mysql |
| `Integrity constraint violation: 1062 Duplicate entry` | Unique conflict (email, reg_number) | Cek data existing / hapus duplikat |
| `Foreign key constraint fails` | Hapus record yg direferensi | Hapus child dulu / set `nullOnDelete` |
| `SQLite database is locked` | Proses lain memegang file | Tutup `php artisan serve` / `tinker` lain |

---

> **Next**: [04-AUTENTIKASI.md](./04-AUTENTIKASI.md) — Sanctum, Role, Token Revoke, Middleware