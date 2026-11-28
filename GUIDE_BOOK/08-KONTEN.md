# 08 - KONTEN: BERITA, GALERI, PENGUMUMAN, PROFIL MADRASAH

## 8.1 Overview Modul Konten

| Modul | Tabel | CRUD | Publik | Role Akses |
|-------|-------|------|--------|------------|
| Berita/Artikel | `news` + `categories` | ✅ | ✅ | Superadmin, Admin Humas |
| Galeri Foto | `galleries` | ✅ | ✅ | Superadmin, Admin Humas |
| Pengumuman | `announcements` | ✅ | ✅ | Superadmin, Admin Humas |
| Profil Madrasah | `school_profile` (single row) | ✅ | ✅ | Superadmin, Admin Humas |

> **Catatan**: Semua modul konten diakses via **Dashboard Admin → Tab terkadas**. Admin PPDB & Kesiswaan **tidak** akses modul ini.

## 8.2 Berita & Kategori (AdminNewsTab.tsx)

### 8.2.1 Kategori (Master Data)
- **Tabel**: `categories` (`id, name, slug, created_at`)
- **CRUD**: Tambah, Edit, Hapus kategori
- **Slug**: Auto-generate dari nama (unique)

### 8.2.2 Berita (News)
**Fields**:
| Field | Tipe | Validasi |
|-------|------|----------|
| `title` | text | required, max 200 |
| `slug` | text | auto dari title, unique |
| `excerpt` | textarea | required, max 500 |
| `content` | rich text (HTML) | required |
| `featured_image` | file upload | nullable, image, max 2MB |
| `category_id` | select | required |
| `status` | select | draft / published |
| `published_at` | datetime | nullable (auto set saat publish) |

### 8.2.3 Endpoint Admin
```
GET    /api/admin/news              # List + filter + paginate
POST   /api/admin/news              # Create
GET    /api/admin/news/{id}         # Detail
PUT    /api/admin/news/{id}         # Update
DELETE /api/admin/news/{id}         # Delete
POST   /api/admin/news/{id}/publish # Publish (set published_at)
POST   /api/admin/news/{id}/unpublish # Unpublish
```

### 8.2.4 Endpoint Publik
```
GET /api/news                    # List published + paginate
GET /api/news/{slug}             # Detail by slug
GET /api/news/category/{slug}    # By category
GET /api/categories              # All categories
```

### 8.2.5 Upload Gambar
- **Disk**: `public` → `storage/app/public/news/{uuid}.{ext}`
- **URL**: `/storage/news/{uuid}.{ext}` (via `storage` symlink)
- **Frontend**: Preview sebelum submit, hapus gambar lama saat update

## 8.3 Galeri Foto (AdminGalleryTab.tsx)

### 8.3.1 Fields
| Field | Tipe | Validasi |
|-------|------|----------|
| `title` | text | required, max 150 |
| `image_url` | file upload | required, image, max 3MB |
| `category` | text | nullable (mis: "Kegiatan", "Fasilitas", "Prestasi") |
| `sort_order` | number | default 0 (urutan tampil) |

### 8.3.2 Endpoint Admin
```
GET    /api/admin/galleries
POST   /api/admin/galleries
PUT    /api/admin/galleries/{id}
DELETE /api/admin/galleries/{id}
POST   /api/admin/galleries/reorder  # Bulk update sort_order
```

### 8.3.3 Endpoint Publik
```
GET /api/galleries  # All, ordered by sort_order
```

## 8.4 Pengumuman (AdminAnnouncementTab.tsx)

### 8.4.1 Fields
| Field | Tipe | Validasi |
|-------|------|----------|
| `title` | text | required, max 200 |
| `content` | rich text | required |
| `priority` | select | low / normal / high |
| `status` | select | draft / published |
| `published_at` | datetime | nullable |

### 8.4.2 Tampilan Publik
- **High priority**: Badge merah, tampil paling atas
- **Normal**: Badge biru
- **Low**: Badge abu
- Hanya `status = published` & `published_at <= now()`

### 8.4.3 Endpoint
```
GET    /api/admin/announcements
POST   /api/admin/announcements
PUT    /api/admin/announcements/{id}
DELETE /api/admin/announcements/{id}
GET    /api/announcements  # Publik (published only)
```

## 8.5 Profil Madrasah (AdminProfileTab.tsx)

### 8.5.1 Single Row (school_profile, id=1)
| Field | Tipe | Catatan |
|-------|------|---------|
| `name` | text | Nama madrasah |
| `npsn` | text | NPSN resmi |
| `accreditation` | text | Contoh: "A (Unggul)" |
| `tagline` | text | Tagline singkat |
| `description` | longtext | Deskripsi lengkap (HTML) |
| `address` | text | Alamat lengkap |
| `phone` | text | Telp kantor |
| `whatsapp` | text | WA admin |
| `email` | email | Email resmi |
| `website` | url | Website (opsional) |
| `principal_name` | text | Nama Kepala Madrasah |
| `vision` | longtext | Visi (HTML) |
| `mission` | longtext | Misi (HTML, list) |
| `logo_url` | file upload | Logo untuk kop surat & header |
| `hero_image_url` | file upload | Hero banner halaman beranda |

### 8.5.2 Endpoint
```
GET  /api/admin/school-profile
PUT  /api/admin/school-profile
GET  /api/school-profile  # Publik
```

### 8.5.3 Penggunaan di Sistem
- **Kop Surat Cetak PPDB**: Logo, nama, NPSN, alamat, kontak
- **Header Website**: Logo + nama
- **Footer**: Alamat, kontak, email
- **Meta Tag SEO**: `og:image` → `hero_image_url` atau `logo_url`
- **Schema.org**: JSON-LD di halaman beranda

## 8.6 Rich Text Editor (Frontend)

- **Library**: Native `contenteditable` div + toolbar sederhana (Bold, Italic, Link, List, Heading)
- **Output**: HTML sanitized (backend: `strip_tags` allowlist)
- **Allowed Tags**: `p, br, strong, em, u, a, ul, ol, li, h2, h3, h4, blockquote, img`
- **Image Upload**: Toolbar "Insert Image" → upload ke `/api/admin/upload` → return URL → inject `<img src="...">`

## 8.7 Upload File Umum (AdminUploadController)

### 8.7.1 Endpoint
```
POST /api/admin/upload
Content-Type: multipart/form-data
Field: file
```

### 8.7.2 Validasi
```php
$request->validate([
    'file' => 'required|file|image|max:3072', // 3MB
]);
```

### 8.7.3 Response
```json
{
  "success": true,
  "data": { "url": "/storage/uploads/{uuid}.{ext}" }
}
```

### 8.7.4 Storage Config
```php
// config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```
**Symlink**: `php artisan storage:link` → `public/storage` → `storage/app/public`

## 8.8 Testing Checklist Konten

- [ ] CRUD Kategori berita
- [ ] CRUD Berita: draft → publish → unpublish → delete
- [ ] Upload featured image berita → preview → hapus
- [ ] Slug auto-generate unique (title sama → slug-2)
- [ ] CRUD Galeri: upload, reorder drag-drop, delete
- [ ] CRUD Pengumuman: priority high/normal/low, publish/unpublish
- [ ] Edit Profil Madrasah: semua field, upload logo & hero
- [ ] Publik: halaman beranda tampil hero, berita terbaru, pengumuman prioritas
- [ ] Publik: halaman berita list + detail + kategori
- [ ] Publik: halaman galeri grid
- [ ] Publik: halaman profil madrasah lengkap
- [ ] SEO meta tags: title, description, og:image, twitter:card

---

> **Next**: [09-FRONTEND.md](./09-FRONTEND.md) — React + Vite + Tailwind: Struktur, Env, Build