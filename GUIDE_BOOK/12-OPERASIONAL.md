# 12 - OPERASIONAL: LOG, MONITORING, QUEUE, SCHEDULER, CACHE

## 12.1 Logging

### 12.1.1 Laravel Log (Backend)
**File**: `backend/storage/logs/laravel-<date>.log` (daily rotation)

**Level**: `debug` (local), `error` (production) — set di `.env`:
```ini
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_STACK=single
```

**Struktur Log**:
```json
{
  "timestamp": "2026-11-28T07:00:00.000000Z",
  "level": "ERROR",
  "message": "SQLSTATE[HY000]: General error: 5 database is locked",
  "context": { "exception": {...}, "url": "/api/ppdb/register" }
}
```

**Tail Real-time**:
```bash
# Lokal
tail -f backend/storage/logs/laravel.log

# Production (cPanel)
tail -f ~/apps/TA/backend/storage/logs/laravel.log
```

### 12.1.2 Cloudflare Workers Log (Frontend)
```bash
# Real-time via wrangler
npx wrangler tail --name ta-mialahmadkrian67

# Atau dashboard: Workers → Logs → Live tail
```

### 12.1.3 Nginx/Apache Access & Error Log (cPanel)
```bash
# cPanel → Metrics → Errors / Raw Access
# Atau SSH:
tail -f /usr/local/apache/logs/error_log
tail -f /usr/local/apache/logs/access_log
```

## 12.2 Monitoring Kesehatan Aplikasi

### 12.2.1 Health Check Endpoint
Tambah di `routes/api.php`:
```php
Route::get('/health', fn() => response()->json(['status' => 'ok', 'time' => now()]));
```

**Monitoring Eksternal** (UptimeRobot, Better Uptime, dll.):
- URL: `https://api.mialahmadkrian.id/api/health`
- Interval: 1 menit
- Alert: Telegram/Email/Slack jika down > 2 menit

### 12.2.2 Database Monitoring
```bash
# Cek koneksi & performa
php artisan db:monitor
# Atau query manual:
php artisan tinker --execute 'DB::select("SHOW PROCESSLIST")'
```

### 12.2.3 Queue Monitoring
```bash
# Cek job pending/failed
php artisan queue:monitor
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
# Atau spesifik:
php artisan queue:retry 123
```

### 12.2.4 Horizon (Jika Pakai Redis)
```bash
# Install: composer require laravel/horizon
# php artisan horizon:install
# php artisan horizon
# Dashboard: /horizon (protect dengan auth)
```

## 12.3 Queue Worker Management

### 12.3.1 Production (cPanel) — Supervisor
**File**: `/etc/supervisor/conf.d/laravel-worker.conf`
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/user/apps/TA/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=user
numprocs=2
redirect_stderr=true
stdout_logfile=/home/user/apps/TA/backend/storage/logs/worker.log
stopwaitsecs=3600
```

**Control**:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status laravel-worker:*
sudo supervisorctl restart laravel-worker:*
```

### 12.3.2 Development
```bash
# Foreground
php artisan queue:work --verbose

# Daemon (background)
nohup php artisan queue:work --sleep=3 --tries=3 > storage/logs/queue.log 2>&1 &
```

## 12.4 Scheduler (Cron)

### 12.4.1 Crontab Entry (cPanel)
```
* * * * * /usr/local/bin/php /home/user/apps/TA/backend/artisan schedule:run >> /dev/null 2>&1
```

### 12.4.2 Definisi Jadwal (Kernel.php)
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule): void
{
    // Hapus token expired harian jam 2 pagi
    $schedule->command('sanctum:token:prune --expired')
        ->dailyAt('02:00')
        ->withoutOverlapping();

    // Backup database harian jam 3 pagi (custom command)
    // $schedule->command('db:backup')->dailyAt('03:00');

    // Kirim laporan PPDB bulanan
    // $schedule->command('ppdb:monthly-report')->monthlyOn(1, '08:00');
}
```

### 12.4.3 Test Scheduler
```bash
# Jalankan sekali (non-daemon)
php artisan schedule:run

# List jadwal
php artisan schedule:list
```

## 12.5 Cache Management

### 12.5.1 Cache Tipe & Clear

| Cache | Command Clear | Kapan Clear |
|-------|---------------|-------------|
| Config | `php artisan config:clear` | Setelah ubah `.env` / `config/*.php` |
| Route | `php artisan route:clear` | Setelah ubah `routes/*.php` |
| View | `php artisan view:clear` | Setelah ubah `resources/views/*.blade.php` |
| Application | `php artisan cache:clear` | Setelah ubah data yang di-cache manual |
| Compiled | `php artisan clear-compiled` | Setelah update composer/deploy |

### 12.5.2 Cache Rebuild (Production)
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
# php artisan optimize (laravel 11+ includes above)
```

### 12.5.3 Cache Driver
- **Local/Dev**: `CACHE_STORE=file` (default)
- **Production**: `CACHE_STORE=redis` (butuh Redis server)
```ini
# .env production
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## 12.6 Storage & File Management

### 12.6.1 Symlink Storage
```bash
php artisan storage:link
# Creates: public/storage → storage/app/public
```

### 12.6.2 Disk Configuration
```php
// config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],

's3' => [  // Optional: AWS S3 / Cloudflare R2
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
],
```

### 12.6.3 Cleanup Old Files (Custom Command)
```bash
# Hapus file upload > 1 tahun yg tidak direferensi
php artisan storage:clean --older-than=365 --dry-run
php artisan storage:clean --older-than=365
```

## 12.7 Database Maintenance

### 12.7.1 Optimize Table (MySQL)
```bash
# Via mysql client
mysql -u root -p -e "OPTIMIZE TABLE ppdb_registrations, alumni_submissions, news, users;" ta_mialahmad

# Atau Laravel command (butuh package)
# composer require spatie/laravel-db-snapshots
```

### 12.7.2 Analyze Slow Query
```bash
# Enable slow query log di MySQL config (my.cnf)
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Analyze
mysqldumpslow -t 10 /var/log/mysql/slow.log
```

## 12.8 Security Operations

### 12.8.1 Rotate APP_KEY (Hati-hati!)
```bash
# Hanya jika key kompromi — INVALIDASI SEMUA SESSION & ENCRYPTED DATA
php artisan key:generate --force
# → Semua user logout, encrypted data (cookie, token) rusak
```

### 12.8.2 Rotate Sanctum Tokens
```bash
# Hapus token > 30 hari tidak dipakai
php artisan sanctum:prune-expired --hours=720
```

### 12.8.3 Audit Login
```bash
# Cek last_login_at users
php artisan tinker --execute 'App\Models\User::select("name","email","role","last_login_at")->get()'
```

## 12.9 Backup Operations

### 12.9.1 Database Backup (MySQL)
```bash
# Manual
mysqldump -u USER -p ta_mialahmad | gzip > backup_$(date +%F).sql.gz

# Otomatis via cron (lihat 03-DATABASE.md)
```

### 12.9.2 Files Backup (Storage)
```bash
# Backup folder storage/app/public
tar -czf storage_backup_$(date +%F).tar.gz -C /home/user/apps/TA/backend storage/app/public
```

### 12.9.3 Full Backup Script
```bash
#!/bin/bash
# backup_full.sh
DATE=$(date +%F_%H-%M)
DB="ta_mialahmad"
USER="backup_user"
PASS="secret"
DEST="/home/user/backups"

mysqldump -u $USER -p$PASS $DB | gzip > $DEST/db_$DATE.sql.gz
tar -czf $DEST/files_$DATE.tar.gz -C /home/user/apps/TA/backend storage/app/public

# Hapus > 30 hari
find $DEST -name "*.gz" -mtime +30 -delete
find $DEST -name "*.tar.gz" -mtime +30 -delete
```

## 12.10 Update & Maintenance Checklist (Mingguan)

- [ ] `git pull` di server → cek changelog
- [ ] `composer install --no-dev` (jika lock file berubah)
- [ ] `php artisan migrate --force` (jika migration baru)
- [ ] `php artisan config:cache && php artisan route:cache && php artisan view:cache`
- [ ] `php artisan queue:restart`
- [ ] Cek `php artisan queue:failed` → retry/clear
- [ ] Cek `storage/logs/laravel.log` error baru
- [ ] Cek disk space: `df -h`
- [ ] Cek backup terbaru exist & valid
- [ ] Test health endpoint: `curl -s https://api.mialahmadkrian.id/api/health`

---

> **Next**: [13-TROUBLESHOOTING.md](./13-TROUBLESHOOTING.md) — Error Umum & Solusi Cepat