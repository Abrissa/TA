# 01 - ARSITEKTUR SISTEM & STACK TEKNOLOGI

## 1.1 Overview Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER / BROWSER                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  FRONTEND (React)   │         │  BACKEND (Laravel)  │
│  Cloudflare Workers │◄───────►│  cPanel / VPS       │
│  SPA + SSR Ready    │  REST   │  API + Sanctum      │
└─────────────────────┘   JSON  └─────────────────────┘
           │                               │
           │                               ▼
           │                    ┌─────────────────────┐
           │                    │   DATABASE          │
           │                    │   SQLite (dev)      │
           │                    │   MySQL/MariaDB     │
           │                    │   (production)      │
           │                    └─────────────────────┘
           │                               │
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  ASSET STATIS       │         │  STORAGE            │
│  (logo, gambar)     │         │  /storage/app/public│
│  Cloudflare CDN     │         │  symlink → public   │
└─────────────────────┘         └─────────────────────┘
```

## 1.2 Stack Teknologi

| Layer | Teknologi | Versi | Catatan |
|-------|-----------|-------|---------|
| **Backend Framework** | Laravel | 11.x | PHP 8.3+ |
| **Auth** | Laravel Sanctum | 4.x | SPA token + API token |
| **Database** | SQLite (dev) / MySQL 8+ (prod) | - | Migration + Seeder |
| **Queue** | Database driver | - | `php artisan queue:work` |
| **Scheduler** | Laravel Scheduler | - | Cron `* * * * *` |
| **Frontend Framework** | React | 19.x | Functional + Hooks |
| **Build Tool** | Vite | 6.x | HMR, code-split |
| **Styling** | Tailwind CSS | 4.x | Utility-first |
| **Icons** | Lucide React | 0.546 | Tree-shakable |
| **Animation** | Motion (framer-motion) | 12.x | Layout animation |
| **Hosting FE** | Cloudflare Workers | - | `wrangler deploy` |
| **Hosting BE** | cPanel (shared) / VPS | - | SSH deploy |
| **CI/CD** | GitHub Actions | - | Test → Build → Deploy |

## 1.3 Struktur Direktori Utama

```
TA/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/   # AuthController, PublicApiController, Admin/*
│   │   ├── Models/             # User, PpdbRegistration, AlumniSubmission, dll.
│   │   ├── Middleware/         # EnsureAdmin, EnsureSuperAdmin
│   │   └── Policies/           # (jika dipakai)
│   ├── database/
│   │   ├── migrations/         # Skema tabel
│   │   └── seeders/            # DatabaseSeeder, MasterDataSeeder
│   ├── routes/
│   │   ├── api.php             # Semua route API
│   │   └── web.php             # (minimal, hanya health check)
│   ├── tests/Feature/          # PHPUnit feature tests
│   ├── config/                 # sanctum.php, cors.php, dll.
│   └── storage/                # logs, framework cache, app/public
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── admin/              # Dashboard admin (tab-based)
│   │   │   ├── tabs/           # AdminOverviewTab, AdminPpdbTab, AdminChangePasswordTab, dll.
│   │   │   └── AdminLayout.tsx # Shell + sidebar + topbar
│   │   ├── views/              # Public pages (HomeView, PpdbView, AlumniView, dll.)
│   │   ├── services/api.ts     # Fetch wrapper + BASE_URL
│   │   ├── components/ui/      # Reusable UI (Button, Modal, Table, dll.)
│   │   ├── App.tsx             # Router + providers
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets (favicon, robots.txt)
│   ├── index.html              # HTML template
│   ├── wrangler.toml           # Cloudflare Workers config
│   ├── package.json            # Deps + scripts
│   └── vite.config.ts          # Vite + Tailwind + React config
│
├── GUIDE_BOOK/                 # Dokumentasi ini
└── graphify-out/               # Knowledge graph (dev only, .gitignore)
```

## 1.4 Pola Komunikasi FE ↔ BE

| Aspek | Implementasi |
|-------|--------------|
| **Base URL** | `VITE_API_BASE_URL` (env) → `frontend/src/services/api.ts:BASE_URL` |
| **Auth Header** | `Authorization: Bearer <token>` via `getAuthHeaders()` |
| **Response Format** | `{ success: bool, message?: string, data?: any, errors?: object }` |
| **Error Handling** | `handleResponse()` throw `Error(message)` non-2xx |
| **CSRF** | Tidak dipakai (Sanctum SPA + CORS) |
| **CORS** | `config/cors.php` → allow `mialahmadkrian.id`, `localhost:3000` |

## 1.5 Role & Permission Matrix

| Fitur | Superadmin | Admin Humas | Operator PPDB | Admin Kesiswaan |
|-------|------------|-------------|---------------|-----------------|
| Kelola Admin (CRUD) | ✅ | ❌ | ❌ | ❌ |
| Reset Password Admin Lain | ✅ | ❌ | ❌ | ❌ |
| Force Logout Admin Lain | ✅ | ❌ | ❌ | ❌ |
| Ganti Email/Password Sendiri | ✅ | ✅ | ✅ | ✅ |
| Verifikasi PPDB | ✅ | ❌ | ✅ | ❌ |
| Verifikasi Alumni | ✅ | ✅ | ❌ | ❌ |
| Kelola Berita/Galeri | ✅ | ✅ | ❌ | ❌ |
| Kelola Profil Madrasah | ✅ | ✅ | ❌ | ❌ |
| Lihat Dashboard Ringkasan | ✅ | ✅ | ✅ | ✅ |

> **Catatan**: Role `operator_ppdb` hanya bisa verifikasi PPDB. Role `admin_humas` kelola konten publik. Role `admin_kesiswaan` (belum full implement) untuk data siswa.

## 1.6 Keamanan Default

- **Password**: Bcrypt rounds 12 (default Laravel), 4 di testing
- **Token**: Sanctum personal access token, expiry 1 tahun (default)
- **Token Revoke**: Otomatis saat ganti password / force logout / hapus akun
- **Rate Limit**: `throttle:api` (60 req/menit) di `routes/api.php`
- **CORS**: Hanya domain terdaftar + localhost dev
- **Headers**: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`

---

> **File terkait**: `backend/app/Http/Kernel.php`, `backend/config/sanctum.php`, `backend/config/cors.php`, `frontend/src/services/api.ts`