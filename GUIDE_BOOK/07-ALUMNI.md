# 07 - ALUMNI: SUBMIT, VERIFIKASI, EKSPOR

## 7.1 Alur Alumni

```
┌──────────────┐     1. Submit Form       ┌──────────────┐
│   ALUMNI     │ ──────────────────────►  │  BACKEND API │
│  (Public Web)│                          │  (Laravel)   │
└──────────────┘                         └──────┬───────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  DATABASE    │
                                         │  alumni_     │
                                         │  submissions │
                                         │  status:     │
                                         │  'pending'   │
                                         └──────┬───────┘
                                                │
                                                ▼
┌──────────────┐     2. Login & Verifikasi   ┌──────────────┐
│  ADMIN HUMAS │ ◄─────────────────────────── │  BACKEND API │
│  (Dashboard) │                              │  (Laravel)   │
└──────────────┘                              └──────┬───────┘
                                                     │
                          3. Update Status           ▼
                   (pending/approved/rejected)      ┌──────────────┐
                                                     │  DATABASE    │
                                                     │  status      │
                                                     │  updated     │
                                                     └──────────────┘
```

## 7.2 Form Submit Publik (PublicAlumniView.tsx)

### 7.2.1 Fields
| Field | Tipe | Validasi | Catatan |
|-------|------|----------|---------|
| `full_name` | text | required, max 150 | Nama lengkap |
| `graduation_year` | select | required | Tahun lulus (dari `master_alumni_cohorts`) |
| `job_role` | text | required, max 100 | Pekerjatan/Jabatan |
| `photo_url` | text/url | nullable, url | Link foto (opsional) |
| `social_media` | textarea | nullable | Link LinkedIn, Instagram, dll. |
| `phone` | text | required, max 30 | Nomor HP/WA |
| `email` | email | required, email, max 255 | Email aktif |
| `message` | textarea | nullable | Pesan untuk madrasah |

### 7.2.2 Endpoint
```
POST /api/alumni/submit
Content-Type: application/json
```

### 7.2.3 Backend Logic (PublicApiController::submitAlumni)
```php
$submission = AlumniSubmission::create([
    'cohort_id' => $cohort?->id,
    'full_name' => $data['full_name'],
    'graduation_year' => $data['graduation_year'],
    'job_role' => $data['job_role'],
    'photo_url' => $data['photo_url'],
    'social_media' => $data['social_media'],
    'phone' => $data['phone'],
    'email' => $data['email'],
    'message' => $data['message'],
    'status' => 'pending',
]);
```

### 7.2.4 Response
```json
{
  "success": true,
  "message": "Terima kasih! Data alumni Anda berhasil dikirim dan akan diverifikasi oleh admin madrasah.",
  "data": { "id": 12, "status": "pending" }
}
```

## 7.3 Dashboard Admin Alumni (AdminAlumniTab.tsx)

### 7.3.1 Fitur
- **Filter Status**: Semua, Pending, Disetujui, Ditolak
- **Search**: Nama, angkatan, pekerjaan
- **Tabel**: Nama, Angkatan, Pekerjaan, Status, Tanggal Submit, Aksi
- **Aksi**: Detail/Update Status, Hapus
- **Ekspor**: CSV, Excel

### 7.3.2 Status Mapping
| DB Status | Label | Warna |
|-----------|-------|-------|
| `pending` | Pending / Menunggu | Amber |
| `approved` | Disetujui | Emerald |
| `rejected` | Ditolak | Rose |

### 7.3.3 Update Status (Modal)
**Dropdown**:
- Pending (Kembali ke antrean verifikasi)
- Disetujui (Tampil di halaman publik alumni)
- Ditolak (Tidak tampil publik)

**Endpoint**:
```
PUT /api/admin/alumni/{id}/status
Body: { status, admin_notes? }
```

**Backend** (Admin\AlumniController::updateStatus):
```php
$submission->update([
    'status' => $validated['status'],
    'admin_notes' => $validated['admin_notes'] ?? $submission->admin_notes,
    'reviewed_at' => now(),
    'reviewed_by' => $request->user()->id,
]);
```

### 7.3.4 Hapus Data Alumni
- Konfirmasi modal
- **Endpoint**: `DELETE /api/admin/alumni/{id}`

## 7.4 Master Data: Kohort Alumni (master_alumni_cohorts)

```php
// Contoh data seeder
MasterAlumniCohort::create([
    'year' => '2020',
    'name' => 'Angkatan 2020',
    'motto' => 'Berkarya untuk Negeri',
]);
MasterAlumniCohort::create([
    'year' => '2021',
    'name' => 'Angkatan 2021',
    'motto' => 'Generasi Qur\'ani Berprestasi',
]);
```

> Hanya dipakai untuk dropdown `graduation_year` di form publik.

## 7.5 Ekspor Data Alumni

Sama seperti PPDB: CSV (UTF-8 BOM) + Excel (.xls HTML/XML).

**Kolom**: No, Nama, Angkatan, Pekerjaan, Foto, Sosmed, Telepon, Email, Pesan, Status, Catatan, Tgl Submit

## 7.5 Tampilan Publik Alumni (Halaman Alumni)

- Hanya menampilkan data dengan `status = 'approved'`
- Grid card: Foto, Nama, Angkatan, Pekerjaan
- Pagination / load more

## 7.6 Testing Checklist Alumni

- [ ] Public form submit → DB `alumni_submissions` status `pending`
- [ ] Admin Humas login → tab Alumni → data muncul
- [ ] Update status "Disetujui" → muncul di halaman publik alumni
- [ ] Update status "Ditolak" → tidak muncul di publik
- [ ] Search & filter works
- [ ] Ekspor CSV/Excel OK
- [ ] Hapus data → konfirmasi → hilang

---

> **Next**: [08-KONTEN.md](./08-KONTEN.md) — Berita, Galeri, Pengumuman, Profil Madrasah