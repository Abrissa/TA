# 11 - DEPLOY MANUAL: SSH KE CPANEL & CLOUDFLARE

## 11.1 Kapan Pakai Manual Deploy

- CI/CD belum disetup / gagal
- Hotfix cepat tanpa push ke main
- Debug di server production
- First-time setup server

## 11.2 Prasyarat

- Akses SSH ke cPanel (user + private key)
- Node.js 22+ + npm + wrangler di lokal (untuk FE)
- Cloudflare API Token + Account ID (untuk FE)
- Repo sudah clone di `~/apps/TA` di server

---

## 11.3 Deploy Backend Manual (cPanel)

### 11.3.1 Quick Command (Satu Baris)

```bash
# Ganti USER@HOST dengan kredensial cPanel
ssh USER@HOST "cd ~/apps/TA && git fetch origin main && git reset --hard origin/main && cd backend && composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan queue:restart"
```

### 11.3.2 Step-by-Step (Interaktif)

```bash
# 1. SSH ke server
ssh USER@HOST

# 2. Masuk folder repo
cd ~/apps/TA

# 3. Ambil perubahan terbaru
git fetch origin main
git reset --hard origin/main
# → HEAD sekarang di commit terbaru main

# 4. Masuk folder backend
cd backend

# 5. Install dependency production
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts

# 6. Migrasi database (aman untuk production)
php artisan migrate --force

# 7. Clear & rebuild cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Restart queue worker (jika pakai supervisor/systemd)
php artisan queue:restart
# atau: sudo supervisorctl restart laravel-worker:*

# 9. Verifikasi
php artisan --version
php artisan route:list --path=api | head -20
```

### 11.3.3 Script Deploy Reusable (`deploy-backend.sh`)

Simpan di lokal, `chmod +x deploy-backend.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Config
CPANEL_SSH="${CPANEL_SSH:-user@host}"
REPO_PATH="${REPO_PATH:-~/apps/TA}"

echo "🚀 Deploy backend ke $CPANEL_SSH:$REPO_PATH"

ssh "$CPANEL_SSH" << 'ENDSSH'
  set -euo pipefail
  cd "$REPO_PATH"
  echo "📥 Git fetch & reset..."
  git fetch origin main
  git reset --hard origin/main

  cd backend
  echo "📦 Composer install..."
  composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts

  echo "🗄️ Migrasi database..."
  php artisan migrate --force

  echo "⚡ Cache rebuild..."
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache

  echo "🔄 Queue restart..."
  php artisan queue:restart

  echo "✅ Deploy backend selesai!"
ENDSSH
```

**Usage**:
```bash
CPANEL_SSH=user@host ./deploy-backend.sh
```

---

## 11.4 Deploy Frontend Manual (Cloudflare Workers)

### 11.4.1 Prasyarat Lokal

```bash
# Install wrangler (jika belum)
npm install -g wrangler

# Login Cloudflare (sekali saja)
wrangler login
# → Buka browser, authorize, pilih account
```

### 11.4.2 Build & Deploy

```bash
cd frontend

# 1. Set env production
echo "VITE_API_BASE_URL=https://api.mialahmadkrian.id" > .env.production

# 2. Build production
npm run build
# → Output di ./dist/

# 3. Deploy ke Cloudflare
npx wrangler deploy --assets ./dist
# → Menggunakan wrangler.toml di root frontend/
```

### 11.4.3 Deploy dengan Env Inline (Tanpa File .env)

```bash
cd frontend
VITE_API_BASE_URL=https://api.mialahmadkrian.id npm run build
npx wrangler deploy --assets ./dist
```

### 11.4.4 Verifikasi Deploy

```bash
# Cek worker status
npx wrangler deployments list --name ta-mialahmadkrian67

# Cek logs real-time
npx wrangler tail --name ta-mialahmadkrian67
```

### 11.4.5 Rollback Manual

```bash
# List deployments
npx wrangler deployments list --name ta-mialahmadkrian67

# Rollback ke deployment ID tertentu
npx wrangler rollback --name ta-mialahmadkrian67 <deployment-id>

# Atau deploy ulang commit lama
git checkout <commit-hash> -- frontend/
cd frontend && npm run build && npx wrangler deploy --assets ./dist
git checkout main -- frontend/
```

---

## 11.5 Deploy Frontend Alternatif: Cloudflare Pages (Static)

Jika prefer **Cloudflare Pages** (bukan Workers):

### 11.5.1 Setup Pages (Sekali)
1. Cloudflare Dashboard → Pages → Create a project → Connect to Git → Select repo `TA`
2. Build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: `/` (repo root)
3. Environment variables: `VITE_API_BASE_URL` = `https://api.mialahmadkrian.id`
4. Deploy trigger: Push ke `main`

### 11.5.2 Manual Deploy Pages (CLI)
```bash
# Install pages CLI
npm install -g @cloudflare/pages

# Deploy manual dari dist
cd frontend && npm run build
npx @cloudflare/pages deploy ./dist --project-name=ta-mialahmad --branch=main
```

---

## 11.6 Troubleshooting Manual Deploy

### Backend (cPanel)

| Error | Solusi |
|-------|--------|
| `composer: command not found` | Pakai full path: `/usr/local/bin/composer` atau `php /path/to/composer.phar` |
| `php artisan migrate` error "Access denied" | Cek `.env` DB credentials, pastikan user MySQL punya akses |
| `Class "App\Http\Controllers\..." not found` | Jalankan `composer dump-autoload -o` |
| `view cache` error permission | `chmod -R 775 storage bootstrap/cache` |
| `queue:restart` tidak work | Cek supervisor config: `command=php artisan queue:work --sleep=3 --tries=3` |

### Frontend (Cloudflare)

| Error | Solusi |
|-------|--------|
| `wrangler: command not found` | `npm install -g wrangler` atau `npx wrangler` |
| `Authentication error` | `wrangler logout && wrangler login` |
| `Asset not found` | Pastikan `wrangler.toml` `[assets] directory = "./dist"` |
| `Build fails: VITE_API_BASE_URL undefined` | Set env saat build: `VITE_API_BASE_URL=... npm run build` |
| `Custom domain not working` | Cek DNS: CNAME `mialahmadkrian.id` → `<worker>.workers.dev` |

---

## 11.7 Checklist Manual Deploy

### Backend
- [ ] `git fetch && git reset --hard origin/main` di server
- [ ] `composer install --no-dev` sukses
- [ ] `php artisan migrate --force` tidak error
- [ ] Cache rebuilt: config, route, view
- [ ] Queue restarted
- [ ] Test endpoint: `curl https://api.mialahmadkrian.id/api/health`

### Frontend
- [ ] `npm run build` lokal sukses (tanpa error TypeScript)
- [ ] `wrangler deploy --assets ./dist` sukses
- [ ] Worker aktif di dashboard Cloudflare
- [ ] Test halaman: `https://mialahmadkrian.id` load OK
- [ ] Test API call dari FE ke BE: Network tab → 200 OK

---

> **Next**: [12-OPERASIONAL.md](./12-OPERASIONAL.md) — Log, Monitoring, Queue, Scheduler, Cache