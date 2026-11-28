# 13 - TROUBLESHOOTING: ERROR UMUM & SOLUSI CEPAT

## 13.1 Backend (Laravel) Errors

### 13.1.1 Error 500: "No application encryption key has been specified"
**Penyebab**: `APP_KEY` kosong di `.env`
**Solusi**:
```bash
php artisan key:generate --force
# Atau manual set di .env:
# APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 13.1.2 Error 500: "SQLSTATE[HY000] [1049] Unknown database"
**Penyebab**: Database MySQL tidak exist / nama salah di `.env`
**Solusi**:
```bash
# Buat database
mysql -u root -p -e "CREATE DATABASE ta_mialahmad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Cek .env
DB_DATABASE=ta_mialahmad
```

### 13.1.3 Error 500: "SQLSTATE[HY000] [2002] Connection refused"
**Penyebab**: MySQL service down / host/port salah
**Solusi**:
```bash
# Cek service
sudo systemctl status mysql
# Atau cPanel: restart MySQL via WHM

# Cek .env
DB_HOST=127.0.0.1
DB_PORT=3306
```

### 13.1.4 Error 500: "SQLSTATE[HY000]: General error: 5 database is locked" (SQLite)
**Penyebab**: Multiple process akses SQLite (serve + tinker + test)
**Solusi**:
```bash
# Tutup proses lain yang pakai SQLite
# Atau gunakan MySQL untuk dev
```

### 13.1.5 Error 422: "The email has already been taken" (Unique violation)
**Penyebab**: Email sudah terdaftar di `users` / `ppdb_registrations`
**Solusi**:
```bash
# Cek existing
php artisan tinker --execute 'App\Models\User::where("email","email@domain.com")->first()'

# Hapus atau gunakan email lain
```

### 13.1.6 Error 403: "Akses ditolak. Peran administrator diperlukan."
**Penyebab**: User login bukan role admin / token tidak valid
**Solusi**:
```bash
# Cek user role
php artisan tinker --execute 'App\Models\User::find(1)->role'

# Pastikan middleware EnsureAdmin terdaftar di Kernel.php
# 'ensure.admin' => \App\Http\Middleware\EnsureAdmin::class,
```

### 13.1.7 Error 401: "Unauthenticated" / Token Expired
**Penyebab**: Token hilang / expired / revoked
**Solusi**:
```bash
# Frontend: auto logout → login ulang
# Atau cek token di DB
php artisan tinker --execute 'Laravel\Sanctum\PersonalAccessToken::where("tokenable_id",1)->get(["name","last_used_at","expires_at"])'

# Hapus token expired
php artisan sanctum:prune-expired
```

### 13.1.8 Error: "Class 'App\Http\Controllers\...' not found"
**Penyebab**: Autoload tidak update / namespace salah
**Solusi**:
```bash
composer dump-autoload -o
# Atau:
composer install --no-dev --prefer-dist --optimize-autoloader
```

### 13.1.9 Error: "View [xxx] not found" / "Unable to locate file in Vite manifest"
**Penyebab**: Cache view lama / build frontend tidak sinkron
**Solusi**:
```bash
php artisan view:clear
php artisan view:cache

# Frontend:
npm run build
```

### 13.1.10 Migration Error: "Foreign key constraint fails"
**Penyebab**: Hapus parent record yang masih punya child
**Solusi**:
```bash
# Cek relasi di migration: ->nullOnDelete() / ->cascadeOnDelete()
# Atau hapus child dulu:
php artisan tinker --execute 'App\Models\Child::where("parent_id",1)->delete()'
```

---

## 13.2 Frontend (React + Vite) Errors

### 13.2.1 Error: "Module not found: Can't resolve '@/components/...'"
**Penyebab**: Path alias `@` tidak resolve / tsconfig.json salah
**Solusi**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 13.2.2 Error: "Unable to locate file in Vite manifest"
**Penyebab**: `npm run build` tidak dijalankan / manifest hilang
**Solusi**:
```bash
npm run build
# Cek dist/.vite/manifest.json exist
```

### 13.2.3 Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Penyebab**: Backend CORS tidak allow origin frontend
**Solusi**:
```php
// backend/config/cors.php
'allowed_origins' => [
    'https://mialahmadkrian.id',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'supports_credentials' => true,
```

### 13.2.4 Error: "401 Unauthorized" di Network tab tapi token ada di localStorage
**Penyebab**: Token format salah / header tidak terkirim
**Solusi**:
```typescript
// services/api.ts - cek getAuthHeaders()
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // pastikan "Bearer " + space
  };
}
```

### 13.2.5 Error: Tailwind class tidak apply / styling broken
**Penyebab**: `@import "tailwindcss"` missing / JIT tidak jalan
**Solusi**:
```css
/* src/index.css */
@import "tailwindcss";
// Restart dev server: npm run dev
```

### 13.2.6 Error: TypeScript "Property 'xxx' does not exist on type 'yyy'"
**Penyebab**: Type definition kurang / API response beda
**Solusi**:
```bash
npm run lint
# Fix type di src/types/api.ts atau cast: response as MyType
```

### 13.2.7 Build Warning: "Some chunks are larger than 500 kB"
**Penyebab**: Bundle utama terlalu besar (semua tab di bundle satu)
**Solusi**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'admin-ppdb': ['./src/admin/tabs/AdminPpdbTab.tsx'],
          'admin-alumni': ['./src/admin/tabs/AdminAlumniTab.tsx'],
          'admin-news': ['./src/admin/tabs/AdminNewsTab.tsx'],
        },
      },
    },
  },
});
// Atau lazy load tab: React.lazy(() => import('./tabs/AdminPpdbTab'))
```

---

## 13.3 Deployment Errors

### 13.3.1 GitHub Actions: "composer install" timeout / memory limit
**Solusi**:
```yaml
# .github/workflows/deploy.yml
- run: composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader
  env:
    COMPOSER_MEMORY_LIMIT: -1
```

### 13.3.2 GitHub Actions: "php artisan test" failed "No application encryption key"
**Solusi**: (Sudah difix di workflow)
```yaml
- run: php artisan key:generate --force
- run: php artisan test --compact
```

### 13.3.3 Wrangler Deploy: "Expected name to be alphanumeric lowercase with dashes"
**Penyebab**: `wrangler.toml` name mengandung titik/underscore
**Solusi**:
```toml
# wrangler.toml
name = "ta-mialahmadkrian67"  # hanya lowercase, angka, dash
```

### 13.3.4 Wrangler Deploy: "Authentication error" / "Invalid API token"
**Solusi**:
```bash
# Cek secret GitHub: CLOUDFLARE_API_TOKEN, ACCOUNT_ID
# Pastikan token punya permission: Account > Workers Scripts > Edit
wrangler logout && wrangler login  # Test lokal
```

### 13.3.5 SSH Deploy: "Permission denied (publickey)"
**Solusi**:
```bash
# Pastikan private key benar di GitHub Secret CPANEL_SSH_PRIVATE_KEY
# Format: -----BEGIN OPENSSH PRIVATE KEY-----... (tanpa passphrase)
# Public key sudah di server ~/.ssh/authorized_keys
# Test: ssh -i deploy_key user@host
```

### 13.3.6 cPanel: "php: command not found" di SSH
**Solusi**:
```bash
# Cari path php
which php
# Atau: /usr/local/bin/php
# Gunakan full path di script deploy
/usr/local/bin/php artisan migrate --force
```

---

## 13.4 Database Errors

### 13.4.1 "Integrity constraint violation: 1062 Duplicate entry 'xxx' for key 'users_email_unique'"
**Solusi**: Gunakan email unik / hapus user lama

### 13.4.2 "Foreign key constraint fails" saat migrate:fresh
**Solusi**: Urutan migration salah / FK tidak `nullable()` / `nullOnDelete()`

### 13.4.3 "SQLSTATE[HY000]: General error: 1364 Field 'xxx' doesn't have a default value"
**Solusi**: Tambah `->nullable()` di migration atau set default di model `$attributes`

---

## 13.5 Quick Debug Commands

```bash
# Backend
cd backend
php artisan --version
php artisan route:list --path=api
php artisan config:show app
php artisan config:show database
php artisan tinker --execute 'DB::connection()->getPdo()'
tail -f storage/logs/laravel.log

# Frontend
cd frontend
npm run lint
npm run build 2>&1 | head -50
npx wrangler whoami
npx wrangler deployments list

# Server
df -h
free -h
top -bn1 | head -20
systemctl status mysql
supervisorctl status
```

---

## 13.6 Emergency Contacts & Escalation

| Issue Level | Contact | Response Time |
|-------------|---------|---------------|
| **Critical** (Site down, data loss) | Lead Dev / SysAdmin | < 30 menit |
| **High** (Fitur utama error, deploy gagal) | Backend/FE Dev | < 2 jam |
| **Medium** (Bug non-kritis, UI glitch) | Dev Team | < 1 hari |
| **Low** (Feature request, docs) | Backlog | Sprint berikutnya |

---

> **Next**: [14-CHECKLIST.md](./14-CHECKLIST.md) — Checklist Rilis & Go-Live