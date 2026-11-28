# GUIDE_BOOK TEKNIS — MI AL-AHMAD PPDB & Alumni Portal

> Dokumentasi teknis lengkap untuk pengembang, admin, dan DevOps.  
> Versi: **2026-11-28** | Commit: `f204019` (main)

---

## 📂 Struktur Modular

```
GUIDE_BOOK/
├── README.md                    # Index ini
├── 01-ARSITEKTUR.md             # Arsitektur sistem & stack teknologi
├── 02-SETUP-LOKAL.md            # Setup development lokal (Windows/Linux/macOS)
├── 03-DATABASE.md               # Database: migrasi, seeder, password, backup
├── 04-AUTENTIKASI.md            # Auth: Sanctum, role, superadmin, token revoke
├── 05-MANAJEMEN-AKUN.md         # CRUD admin, ganti email/password, force logout
├── 06-PPDB.md                   # Alur PPDB: daftar, verifikasi, status, cetak
├── 07-ALUMNI.md                 # Data alumni: submit, verifikasi, ekspor
├── 08-KONTEN.md                 # Berita, galeri, pengumuman, profil madrasah
├── 09-FRONTEND.md               # React + Vite + Tailwind: struktur, env, build
├── 10-DEPLOY-CICD.md            # GitHub Actions → Cloudflare (FE) + cPanel (BE)
├── 11-DEPLOY-MANUAL.md          # Deploy manual SSH ke cPanel & Cloudflare
├── 12-OPERASIONAL.md            # Log, monitoring, queue, scheduler, cache
├── 13-TROUBLESHOOTING.md        # Error umum & solusi cepat
└── 14-CHECKLIST.md              # Checklist rilis & go-live
```

---

## 🚀 Quick Start (Ringkas)

```bash
# 1. Clone & setup backend
cd backend
cp .env.example .env
# edit .env → DB_SQLITE, APP_KEY, MAIL, dll.
composer install
php artisan migrate --seed
php artisan serve --port=8000

# 2. Setup frontend (terminal baru)
cd frontend
cp .env.example .env
# edit .env → VITE_API_BASE_URL=http://127.0.0.1:8000
npm install
npm run dev -- --port=3000 --host=0.0.0.0

# 3. Akses
# Frontend: http://127.0.0.1:3000
# Backend API: http://127.0.0.1:8000/api
# Login superadmin: admin@mialahmad.sch.id / admin123
```

---

## 🔑 Kredensial Default (Seeder)

| Role | Email | Password |
|------|-------|----------|
| Superadmin | `admin@mialahmad.sch.id` | `admin123` |
| Admin Humas | `humas@mialahmad.sch.id` | `humas123` |
| Operator PPDB | (buat via superadmin) | (set saat create) |
| Admin Kesiswaan | (buat via superadmin) | (set saat create) |

> ⚠️ **Penting**: `updateOrCreate` di seeder **hanya set password saat CREATE**. Jika akun sudah ada, password **tidak** tertimpa. Gunakan fitur *Reset Password* di tab **Keamanan & Akun** untuk set ulang.

---

## 📖 Navigasi Cepat per Peran

| Peran | Baca Prioritas |
|-------|----------------|
| **Developer Baru** | 01 → 02 → 03 → 04 → 09 |
| **Superadmin** | 04 → 05 → 06 → 07 → 08 |
| **Admin Humas / PPDB / Kesiswaan** | 06 → 07 → 08 |
| **DevOps / SysAdmin** | 03 → 10 → 11 → 12 → 13 |

---

## 🔗 Link Penting

- **Repo GitHub**: <https://github.com/mialahmadkrian67-dotcom/TA>
- **Frontend Production**: <https://mialahmadkrian.id> (Cloudflare Pages/Workers)
- **Backend API Production**: <https://api.mialahmadkrian.id> (cPanel)
- **GitHub Actions**: <https://github.com/mialahmadkrian67-dotcom/TA/actions>

---

## 📝 Catatan Versi

| Tanggal | Commit | Perubahan Utama |
|---------|--------|-----------------|
| 2026-11-28 | `f204019` | Fix label status `pending` di PPDB, CI/CD Cloudflare + cPanel |
| 2026-11-28 | `8e4a963` | CRUD admin penuh, ganti email/password sendiri, force logout, test 25/25 |
| 2026-11-27 | `1edf860` | CORS fix, cross-origin resource policy |

---

> **Maintainer**: Tim Teknis MI AL-AHMAD  
> **Update terakhir**: `git log -1 --format="%ci %h %s"`