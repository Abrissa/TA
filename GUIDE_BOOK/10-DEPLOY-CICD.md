# 10 - DEPLOY CI/CD: GITHUB ACTIONS → CLOUDFLARE (FE) + CPANEL (BE)

## 10.1 Arsitektur Pipeline

```
┌─────────────┐
│  PUSH TO    │
│  MAIN       │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│         GITHUB ACTIONS WORKFLOW              │
│  .github/workflows/deploy.yml               │
└─────────────────────────────────────────────┘
       │                    │
       ▼                    ▼
┌───────────────┐    ┌───────────────┐
│ TEST BACKEND  │    │ TEST FRONTEND │
│ (PHPUnit)     │    │ (TSLint,Build)│
└───────┬───────┘    └───────┬───────┘
        │                    │
        ▼                    ▼
┌───────────────┐    ┌───────────────┐
│ DEPLOY BACKEND│    │ DEPLOY FRONTEND│
│ (SSH → cPanel)│    │ (Wrangler→CF) │
└───────────────┘    └───────────────┘
```

## 10.2 File Workflow: `.github/workflows/deploy.yml`

```yaml
name: Test and deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy-main
  cancel-in-progress: false

jobs:
  # ─── BACKEND TEST ───
  test-backend:
    name: Test backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, pdo_sqlite
          coverage: none
      - run: composer install --no-interaction --prefer-dist --no-progress
      - run: php artisan key:generate --force
      - run: php artisan test --compact

  # ─── FRONTEND TEST ───
  test-frontend:
    name: Test frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  # ─── DEPLOY FRONTEND → CLOUDFLARE ───
  deploy-frontend:
    name: Deploy frontend to Cloudflare
    needs: [test-frontend]
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_BASE_URL: https://api.mialahmadkrian.id
      - run: npx wrangler deploy --assets ./dist
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.ACCOUNT_ID }}

  # ─── DEPLOY BACKEND → CPANEL (MANUAL TRIGGER) ───
  deploy-backend:
    name: Deploy backend to cPanel
    needs: [test-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.CPANEL_HOST }}
          username: ${{ secrets.CPANEL_USERNAME }}
          key: ${{ secrets.CPANEL_SSH_PRIVATE_KEY }}
          port: ${{ secrets.CPANEL_SSH_PORT }}
          script_stop: true
          script: |
            cd ~/apps/TA
            git fetch origin main
            git reset --hard origin/main
            cd backend
            composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
```

## 10.3 Required GitHub Secrets

Buka: **Repository → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Deskripsi |
|-------------|-------|-----------|
| `CLOUDFLARE_API_TOKEN` | `CF_API_TOKEN_xxx` | Token Cloudflare dengan izin **Account > Workers Scripts > Edit** + **Account > Workers KV Storage > Edit** |
| `ACCOUNT_ID` | `abc123...` | Cloudflare Account ID (dari dashboard: `https://dash.cloudflare.com/.../accounts/<ACCOUNT_ID>`) |
| `CPANEL_HOST` | `ssh.yourdomain.com` | Hostname/IP server cPanel |
| `CPANEL_USERNAME` | `miae8644` | Username SSH cPanel |
| `CPANEL_SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Private key SSH (tanpa passphrase) |
| `CPANEL_SSH_PORT` | `22` | Port SSH (default 22) |

### 10.3.1 Generate SSH Key Pair (untuk CPANEL_SSH_PRIVATE_KEY)

```bash
# Di lokal (atau CI runner)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key -N ""

# Public key → taruh di server cPanel ~/.ssh/authorized_keys
cat deploy_key.pub

# Private key → copy ke GitHub Secret CPANEL_SSH_PRIVATE_KEY
cat deploy_key
```

## 10.4 Cloudflare Workers Setup

### 10.4.1 Buat Worker (sekali saja)
```bash
# Di lokal frontend/
npx wrangler login
npx wrangler deploy --assets ./dist
# → Akan buat worker bernama `ta-mialahmadkrian67` (dari wrangler.toml)
```

### 10.4.2 Custom Domain (Opsional)
Di Cloudflare Dashboard → Workers & Pages → `ta-mialahmadkrian67` → Triggers → Custom Domains → Add `mialahmadkrian.id`

### 10.4.3 Environment Variables di Worker (Jika Perlu)
Dashboard → Worker → Settings → Variables → Add:
- `API_BASE_URL` = `https://api.mialahmadkrian.id` (sudah di-build time via `VITE_API_BASE_URL`)

## 10.5 cPanel Backend Setup (Sekali Saja)

### 10.5.1 Persiapan Server
```bash
# SSH ke cPanel
ssh user@host

# Clone repo
cd ~/apps
git clone https://github.com/mialahmadkrian67-dotcom/TA.git
cd TA/backend

# Copy & edit .env production
cp .env.example .env
# Edit: APP_KEY, APP_URL=https://api.mialahmadkrian.id, DB MySQL, MAIL, dll.

# Install deps
composer install --no-dev --prefer-dist --optimize-autoloader

# Migrasi & cache
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# Setup queue worker (via cPanel "Setup Node.js App" atau systemd/supervisor)
# php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

### 10.5.2 Cron Scheduler (cPanel → Cron Jobs)
```
* * * * * /usr/local/bin/php /home/user/apps/TA/backend/artisan schedule:run >> /dev/null 2>&1
```

## 10.6 Menjalankan Deploy

### 10.6.1 Otomatis (Push ke Main)
```bash
git add .
git commit -m "feat: ..."
git push origin main
# → GitHub Actions otomatis jalan
```

### 10.6.2 Manual Trigger (Workflow Dispatch)
GitHub → Actions → **Test and deploy** → **Run workflow** → Branch `main` → Run

### 10.6.3 Deploy Hanya Frontend / Backend
- Comment job `deploy-backend` / `deploy-frontend` di workflow
- Atau gunakan `if: github.event_name == 'workflow_dispatch'` dengan input

## 10.7 Monitoring & Debug

| Tempat | Apa Dicek |
|--------|-----------|
| GitHub Actions → Runs | Log test, build, deploy |
| Cloudflare Dashboard → Workers → Logs | Real-time log FE (console.log, error) |
| cPanel → Terminal / SSH | `tail -f storage/logs/laravel.log` |
| Browser DevTools → Network | Request/Response API |

## 10.8 Rollback Cepat

### Frontend (Cloudflare)
```bash
# Cloudflare Dashboard → Worker → Deployments → pilih versi sebelumnya → "Rollback"
# Atau CLI:
npx wrangler rollback
```

### Backend (cPanel)
```bash
ssh user@host
cd ~/apps/TA
git log --oneline -5
git reset --hard <commit-sebelumnya>
cd backend
composer install --no-dev --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 10.9 Checklist Pre-Deploy

- [ ] Semua test lokal pass (`php artisan test`, `npm run lint`, `npm run build`)
- [ ] `.env` production backend sudah benar (APP_KEY, DB, MAIL, APP_URL)
- [ ] `.env` production frontend `VITE_API_BASE_URL` = URL API production
- [ ] GitHub Secrets sudah lengkap (6 secret)
- [ ] Cloudflare Worker sudah exist (nama sesuai `wrangler.toml`)
- [ ] cPanel repo sudah clone, `.env` exist, storage link ok
- [ ] Queue worker & scheduler jalan di cPanel
- [ ] SSL/HTTPS aktif di kedua domain

---

> **Next**: [11-DEPLOY-MANUAL.md](./11-DEPLOY-MANUAL.md) — Deploy Manual SSH (tanpa CI/CD)