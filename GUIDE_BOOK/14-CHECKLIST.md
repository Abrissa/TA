# 14 - CHECKLIST RILIS & GO-LIVE

## 14.1 Pre-Commit (Developer Checklist)

### Code Quality
- [ ] `npm run lint` (frontend) — **PASS**
- [ ] `vendor/bin/pint --dirty` (backend) — **PASS**
- [ ] `php artisan test --compact` — **25/25 PASS**
- [ ] Tidak ada `console.log` / `dd()` / `dump()` di production code
- [ ] TypeScript strict mode: `tsc --noEmit` — **PASS**

### Git Hygiene
- [ ] Commit message konvensional: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- [ ] Satu commit = satu logical change
- [ ] Branch naming: `feat/nama-fitur`, `fix/nama-bug`
- [ ] Tidak commit file `.env`, `node_modules`, `vendor`, `dist`, `graphify-out`

---

## 14.2 Pre-Merge ke Main (Code Review Checklist)

### Backend
- [ ] Migration baru: `php artisan migrate:fresh --seed` bersih di lokal
- [ ] Seeder tidak overwrite password existing (`updateOrCreate` behavior)
- [ ] Sanctum token revoke di semua tempat ganti password/hapus user
- [ ] Rate limiter config: `throttle:api` di route group
- [ ] CORS allow origin production + localhost
- [ ] `.env.example` updated jika env baru

### Frontend
- [ ] `npm run build` sukses tanpa error TypeScript
- [ ] `VITE_API_BASE_URL` production di GitHub Actions env
- [ ] Build output `dist/` tidak di-commit (di-generate CI)
- [ ] Lazy load tab dipertimbangkan (chunk >500KB warning)

### Database
- [ ] Migration `up()` & `down()` tested
- [ ] Foreign key `nullOnDelete()` / `cascadeOnDelete()` sesuai kebutuhan
- [ ] Index di kolom yang sering di-query (`email`, `status`, `registration_number`)
- [ ] Seeder idempotent (bisa jalan berkali-kali)

### Security
- [ ] `APP_KEY` production unik & rahasia
- [ ] `APP_DEBUG=false` production
- [ ] `LOG_LEVEL=error` production
- [ ] Sanctum token expiry reasonable (default 1 tahun OK)
- [ ] Rate limit API aktif
- [ ] File upload validasi: mime, size, extension

---

## 14.3 Staging / Pre-Production Verification

### Environment Parity
- [ ] Staging mirror production: PHP 8.3, MySQL 8, Node 22
- [ ] `.env` staging beda domain tapi struktur sama
- [ ] SSL/HTTPS aktif di staging

### Functional Test (Manual)
- [ ] **Auth**: Login superadmin, admin humas, operator PPDB, admin kesiswaan
- [ ] **Keamanan & Akun**: CRUD admin, ganti email/password sendiri, reset password lain, force logout
- [ ] **PPDB**: Public daftar → admin verifikasi (pending→terverifikasi→diterima/ditolak) → cetak formulir & rekap → ekspor CSV/Excel
- [ ] **Alumni**: Public submit → admin verifikasi (pending→approved/rejected) → tampil di halaman publik
- [ ] **Konten**: CRUD berita (draft/publish), galeri (reorder), pengumuman (priority), profil madrasah
- [ ] **Upload**: Gambar berita, galeri, logo, hero → tampil di publik & cetak
- [ ] **Responsive**: Mobile, tablet, desktop — no horizontal scroll
- [ ] **Print**: Cetak formulir PPDB & rekap → PDF layout benar

### Performance
- [ ] API response < 500ms (local), < 1s (staging)
- [ ] Frontend Lighthouse: Performance > 80, Accessibility > 90, SEO > 90
- [ ] Bundle size gzipped < 200KB per chunk (target)

---

## 14.4 Production Go-Live Checklist

### DNS & SSL
- [ ] Domain `mialahmadkrian.id` → Cloudflare Workers/Pages
- [ ] Domain `api.mialahmadkrian.id` → cPanel (A record / CNAME)
- [ ] SSL Full (Strict) di Cloudflare
- [ ] HSTS enabled
- [ ] CAA record untuk SSL

### Backend (cPanel)
- [ ] Repo clone di `~/apps/TA`
- [ ] `.env` production: `APP_KEY`, `APP_URL=https://api.mialahmadkrian.id`, DB MySQL, MAIL, dll.
- [ ] `composer install --no-dev --prefer-dist --optimize-autoloader`
- [ ] `php artisan migrate --force`
- [ ] `php artisan config:cache && php artisan route:cache && php artisan view:cache`
- [ ] `php artisan storage:link`
- [ ] Queue worker (supervisor) running: `php artisan queue:work --sleep=3 --tries=3`
- [ ] Scheduler cron: `* * * * * php artisan schedule:run`
- [ ] Log rotation: `daily` + `max_files=30`

### Frontend (Cloudflare)
- [ ] `wrangler.toml` name valid: `ta-mialahmadkrian67`
- [ ] `npm run build` → `dist/` generated
- [ ] `npx wrangler deploy --assets ./dist` sukses
- [ ] Custom domain `mialahmadkrian.id` mapped ke worker
- [ ] Environment variable `VITE_API_BASE_URL=https://api.mialahmadkrian.id` di build time

### GitHub Actions
- [ ] 6 Secrets terisi: `CLOUDFLARE_API_TOKEN`, `ACCOUNT_ID`, `CPANEL_HOST`, `CPANEL_USERNAME`, `CPANEL_SSH_PRIVATE_KEY`, `CPANEL_SSH_PORT`
- [ ] Workflow `.github/workflows/deploy.yml` pass di push test
- [ ] Concurrency group `deploy-main` prevent race condition

### Monitoring
- [ ] Uptime monitor: `https://api.mialahmadkrian.id/api/health` + `https://mialahmadkrian.id`
- [ ] Alert ke Telegram/Email
- [ ] Log access: Cloudflare Workers logs + cPanel Laravel logs

### Backup
- [ ] DB backup cron harian (mysqldump + gzip, retain 30 hari)
- [ ] Storage backup mingguan (tar.gz public files)
- [ ] Test restore ke staging: OK

### Rollback Plan
- [ ] Frontend: `npx wrangler rollback` tested
- [ ] Backend: `git reset --hard <commit>` + `composer install` + `migrate` + `cache` documented
- [ ] DB: Restore dari backup `.sql.gz` tested

---

## 14.5 Post-Go-Live (Hari 1-7)

- [ ] Monitor error log setiap jam pertama 24 jam
- [ ] Cek queue: `php artisan queue:failed` kosong
- [ ] Cek scheduled jobs jalan: `php artisan schedule:list` + log
- [ ] Verifikasi user real bisa login & pakai fitur
- [ ] Collect feedback admin: UX, bug, performa
- [ ] Update docs jika ada perubahan proses

---

## 14.6 Versioning & Changelog

### Semantic Versioning
| Format | Contoh | Kapan |
|--------|--------|-------|
| `MAJOR.MINOR.PATCH` | `1.0.0` | Rilis pertama stabil |
| `MINOR` | `1.1.0` | Fitur baru backward-compatible |
| `PATCH` | `1.1.1` | Bug fix backward-compatible |

### Git Tag
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release"
git push origin v1.0.0
```

### Changelog (CHANGELOG.md)
```markdown
# Changelog

## [1.1.0] - 2026-12-01
### Added
- Fitur ekspor Excel PPDB dengan styling
- Lazy load tab admin untuk reduce bundle size

### Fixed
- Label status `pending` di tabel PPDB
- CORS preflight untuk custom domain

## [1.0.0] - 2026-11-28
### Added
- Initial release: Auth, PPDB, Alumni, Konten, Profil
- CI/CD GitHub Actions → Cloudflare + cPanel
```

---

## 14.7 Emergency Hotfix Flow

```
1. Buat branch hotfix dari main: `git checkout -b hotfix/fix-critical-bug main`
2. Fix bug minimal, test lokal
3. Commit: `fix: critical bug description`
4. Push & PR ke main (atau direct push jika emergency)
5. CI/CD auto deploy
6. Verify production
7. Tag patch version: `git tag v1.0.1`
8. Merge hotfix ke develop (jika ada branch develop)
```

---

> **END OF GUIDE_BOOK**  
> Dokumentasi ini living document — update setiap rilis signifikan.  
> Maintainer: Tim Teknis MI AL-AHMAD  
> Last Updated: `git log -1 --format="%ci %h %s"`