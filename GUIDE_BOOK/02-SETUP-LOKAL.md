# 02 - SETUP DEVELOPMENT LOKAL

## 2.1 Prasyarat Sistem

| Tools | Versi Minimum | Installasi |
|-------|---------------|------------|
| **PHP** | 8.3 | `php -v` |
| **Composer** | 2.x | `composer -V` |
| **Node.js** | 22.x LTS | `node -v` |
| **npm** | 10.x | `npm -v` |
| **Git** | 2.x | `git --version` |
| **SQLite** | 3.x | `sqlite3 --version` (built-in PHP) |
| **Laragon / XAMPP / Docker** | Optional | Untuk MySQL lokal jika perlu |

> **Windows**: Disarankan **Laragon** (termasuk PHP, Composer, Node, Nginx/Apache, database).  
> **Linux/macOS**: Pakai package manager (`apt`, `brew`, `dnf`).

## 2.2 Clone Repository

```bash
git clone https://github.com/mialahmadkrian67-dotcom/TA.git
cd TA
```

## 2.3 Backend Setup (Laravel)

```bash
cd backend

# 1. Copy env & generate key
cp .env.example .env
php artisan key:generate

# 2. Edit .env (minimal yang wajib)
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite
# APP_URL=http://127.0.0.1:8000
# SANCTUM_STATEFUL_DOMAINS=127.0.0.1:3000,localhost:3000
# SESSION_DOMAIN=127.0.0.1

# 3. Buat file SQLite (Windows PowerShell)
New-Item -ItemType File -Force database/database.sqlite
# Linux/macOS:
touch database/database.sqlite

# 4. Install dependency
composer install

# 5. Migrasi + Seeder
php artisan migrate --seed

# 6. Storage link (untuk upload gambar)
php artisan storage:link

# 7. Jalankan server
php artisan serve --host=0.0.0.0 --port=8000
# → http://127.0.0.1:8000
```

### 2.3.1 Konfigurasi .env Backend Penting

```ini
APP_NAME="MI AL-AHMAD"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

BROADCAST_CONNECTION=log
CACHE_STORE=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=file
SESSION_LIFETIME=120

SANCTUM_STATEFUL_DOMAINS=127.0.0.1:3000,localhost:3000
SESSION_DOMAIN=127.0.0.1

MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@mialahmad.sch.id"
MAIL_FROM_NAME="${APP_NAME}"

# Optional: untuk fitur AI/Gemini
GEMINI_API_KEY=
```

## 2.4 Frontend Setup (React + Vite)

```bash
cd frontend

# 1. Copy env
cp .env.example .env

# 2. Edit .env
# VITE_API_BASE_URL=http://127.0.0.1:8000

# 3. Install dependency
npm install

# 4. Jalankan dev server
npm run dev -- --port=3000 --host=0.0.0.0
# → http://127.0.0.1:3000
```

### 2.4.1 Konfigurasi .env Frontend

```ini
# Base URL backend API (wajib)
VITE_API_BASE_URL=http://127.0.0.1:8000

# Optional: untuk build production
# VITE_API_BASE_URL=https://api.mialahmadkrian.id
```

## 2.5 Verifikasi Instalasi

| Cek | Perintah | Harapan |
|-----|----------|---------|
| Backend API health | `curl http://127.0.0.1:8000/api/health` | `{"status":"ok"}` (jika route ada) |
| Login superadmin | POST `/api/auth/login` email `admin@mialahmad.sch.id` pass `admin123` | Token + user role `superadmin` |
| Frontend load | Buka `http://127.0.0.1:3000` | Halaman beranda tampil |
| Dashboard admin | Login → `/admin` | Sidebar + tab Keamanan & Akun |

## 2.6 Perintah Berguna Development

```bash
# Backend
cd backend
php artisan test --compact           # Jalankan test (25 test)
php artisan test --filter=test_superadmin_can_create_admin_account
vendor/bin/pint --dirty              # Format code (Laravel Pint)
php artisan route:list --path=api    # Lihat route API
php artisan queue:work               # Jalankan queue worker
php artisan schedule:work            # Jalankan scheduler
php artisan tinker                   # REPL Laravel

# Frontend
cd frontend
npm run lint                         # TypeScript check (tsc --noEmit)
npm run build                        # Production build → dist/
npm run preview                      # Preview build lokal
npx playwright test                  # E2E test (jika ada)
```

## 2.7 Troubleshooting Setup Umum

| Masalah | Solusi |
|---------|--------|
| `php artisan migrate` error "database locked" | Hapus `database/database.sqlite`, buat ulang, `migrate --seed` |
| `composer install` timeout | `composer install --no-interaction --prefer-dist --no-progress --timeout=600` |
| `npm install` error `peer dep` | `npm install --legacy-peer-deps` |
| Frontend tidak konek ke API | Cek `VITE_API_BASE_URL` di `.env` frontend, restart `npm run dev` |
| CORS error di browser | Cek `backend/config/cors.php` → `allowed_origins` include `http://127.0.0.1:3000` |
| Sanctum token tidak tersimpan | Pastikan `SANCTUM_STATEFUL_DOMAINS` & `SESSION_DOMAIN` benar, clear browser cookie |

## 2.8 Database Alternatif: MySQL/MariaDB Lokal

```ini
# .env backend
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ta_mialahmad
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# Buat database
mysql -u root -e "CREATE DATABASE ta_mialahmad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate --seed
```

---

> **Next**: [03-DATABASE.md](./03-DATABASE.md) — Migrasi, Seeder, Password, Backup/Restore