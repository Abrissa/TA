# 06 - PPDB: ALUR DAFTAR, VERIFIKASI, STATUS, CETAK

## 6.1 Alur Umum PPDB

```
┌──────────────┐     1. Submit Form      ┌──────────────┐
│  CALON SANTRI │ ──────────────────────► │  BACKEND API │
│  (Public Web) │                         │  (Laravel)   │
└──────────────┘                         └──────┬───────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  DATABASE    │
                                         │  ppdb_       │
                                         │  registrations│
                                         │  status:     │
                                         │  'pending'   │
                                         └──────┬───────┘
                                                │
                                                ▼
┌──────────────┐     2. Login & Verifikasi    ┌──────────────┐
│  ADMIN PPDB  │ ◄─────────────────────────── │  BACKEND API │
│  (Dashboard) │                              │  (Laravel)   │
└──────────────┘                              └──────┬───────┘
                                                     │
                          3. Update Status           ▼
                   (menunggu_verifikasi/             ┌──────────────┐
                    terverifikasi/                   │  DATABASE    │
                    diterima/ditolak)               │  status      │
                                                     │  updated     │
                                                     └──────┬───────┘
                                                            │
                                                            ▼
                                                 ┌──────────────────┐
                                                 │  4. Cetak Formulir│
                                                 │  Bukti Pendaftaran│
                                                 │  / Rekapitulasi   │
                                                 └──────────────────┘
```

## 6.2 Pendaftaran Publik (Frontend → API)

### 6.2.1 Form Fields (PublicPpdbView.tsx)
| Field | Validasi | Catatan |
|-------|----------|---------|
| `child_full_name` | required, string, max 150 | Nama lengkap calon santri |
| `gender` | required, in: Laki-laki, Perempuan | Radio button |
| `birth_place` | required, string, max 100 | Tempat lahir |
| `birth_date` | required, date | Tanggal lahir (date picker) |
| `parent_name` | required, string, max 150 | Nama orang tua/wali |
| `whatsapp` | required, string, max 30 | Nomor WA aktif |
| `address` | required, string, max 500 | Alamat lengkap |
| `previous_school` | nullable, string, max 150 | TK/RA asal |

### 6.2.2 Endpoint
```
POST /api/ppdb/register
Content-Type: application/json
```

### 6.2.3 Backend Logic (PublicApiController::submitPpdb)
```php
$registration = PpdbRegistration::create([
    'academic_year_id' => $activeYear?->id,
    'ppdb_path_id' => $defaultPath?->id,
    'child_full_name' => $data['child_full_name'],
    'gender' => $data['gender'],
    'birth_place' => $data['birth_place'],
    'birth_date' => $data['birth_date'],
    'parent_name' => $data['parent_name'],
    'whatsapp' => $data['whatsapp'],
    'address' => $data['address'],
    'previous_school' => $data['previous_school'],
    'status' => 'pending',  // default controller
]);
```

### 6.2.4 Response Sukses
```json
{
  "success": true,
  "message": "Pendaftaran PPDB berhasil diajukan.",
  "registration_number": "PPDB-2026-0001"
}
```

> **Catatan**: `registration_number` auto-generate: `PPDB-{tahun}-{sequence}`

## 6.3 Dashboard Admin PPDB (AdminPpdbTab.tsx)

### 6.3.1 Fitur Utama
- **Filter Status**: Semua, Menunggu, Terverifikasi, Diterima, Ditolak
- **Search**: Nama calon santri, no registrasi, nama wali, WA
- **Tabel**: No.Reg, Calon Santri, Orang Tua, Status (badge), Tanggal Daftar, Aksi
- **Aksi per Baris**: Cetak Formulir, Detail/Update Status, WhatsApp Wali, Hapus
- **Bulk Export**: CSV, Excel (.xls)
- **Cetak Rekap**: PDF via browser print

### 6.3.2 Status Badge Mapping (Fixed v2026-11-28)
| DB Status | Label Tampilan | Warna Badge |
|-----------|----------------|-------------|
| `menunggu_verifikasi` / `pending` | Menunggu Verifikasi | Amber |
| `terverifikasi` | Berkas Valid | Blue |
| `diterima` | Diterima | Emerald |
| `ditolak` | Ditolak | Rose |

### 6.3.3 Update Status (Modal Detail)
**Dropdown Status**:
- Menunggu Verifikasi (Berkas Baru)
- Terverifikasi (Berkas Lengkap & Valid)
- Diterima Sebagai Santri Baru
- Ditolak / Berkas Tidak Memenuhi Syarat

**Catatan Panitia** (textarea): Alasan verifikasi, jadwal observasi, dll.

**Endpoint**:
```
PUT /api/admin/ppdb/{id}/status
Body: { status, admin_notes? }
```

**Backend** (Admin\PpdbController::updateStatus):
```php
$registration->update([
    'status' => $validated['status'],
    'admin_notes' => $validated['admin_notes'] ?? $registration->admin_notes,
    'reviewed_at' => now(),
    'reviewed_by' => $request->user()->id,
]);
```

### 6.3.4 Hapus Data Pendaftar
- Hanya superadmin/admin PPDB
- Konfirmasi modal
- **Endpoint**: `DELETE /api/admin/ppdb/{id}`

## 6.4 Cetak Dokumen

### 6.4.1 Formulir Individual (Bukti Pendaftaran)
- **Trigger**: Tombol printer di tabel / modal detail
- **Format**: HTML print-ready → Browser Print → Save as PDF
- **Konten**:
  - Kop madrasah (logo, NSM, NPSN, alamat, kontak)
  - Nomor registrasi besar
  - Data calon santri (nama, jk, TT Lahir, sekolah asal)
  - Data orang tua (nama, WA, alamat)
  - Status seleksi + catatan panitia
  - Area tanda tangan: Orang Tua + Kepala Madrasah

### 6.4.2 Rekapitulasi (Tabel Semua Pendaftar)
- **Trigger**: Tombol "Cetak Rekap (PDF)" di toolbar
- **Filter**: Mengikuti filter status & search aktif
- **Format**: Tabel HTML compact → Print landscape → PDF
- **Konten**: No, No.Reg, Nama, L/P, TT Lahir, Sekolah Asal, Orang Tua, WA, Status

## 6.5 Ekspor Data

### 6.5.1 CSV (UTF-8 BOM)
- **Filename**: `PPDB_MI_AL_AHMAD_{STATUS}_{YYYY-MM-DD}.csv`
- **Encoding**: UTF-8 dengan BOM (`\uFEFF`) agar Excel baca benar
- **Kolom**: No, No.Reg, Nama, JK, Tempat Lahir, Tgl Lahir, Sekolah Asal, Orang Tua, WA, Alamat, Status, Catatan, Tgl Daftar

### 6.5.2 Excel (.xls HTML/XML)
- **Filename**: `PPDB_MI_AL_AHMAD_{STATUS}_{YYYY-MM-DD}.xls`
- **Format**: HTML table + Microsoft Office XML namespace
- **Styling**: Header hijau, border, font Arial 11px
- **Kolom**: Sama CSV + formatting number (WhatsApp, No.Reg sebagai text)

## 6.6 Master Data PPDB (Setup Awal)

### 6.6.1 Tahun Ajaran (master_academic_years)
```php
// Hanya 1 yang is_active = true
MasterAcademicYear::create([
    'year' => '2026/2027',
    'is_active' => true,
]);
```

### 6.6.2 Jalur PPDB (master_ppdb_paths)
```php
MasterPpdbPath::create([
    'name' => 'Jalur Reguler',
    'code' => 'reguler',
    'is_active' => true,
    'order' => 1,
]);
MasterPpdbPath::create([
    'name' => 'Jalur Afirmasi',
    'code' => 'afirmasi',
    'is_active' => true,
    'order' => 2,
]);
```

> Kelola via `php artisan tinker` atau buat admin UI terpisah (belum ada).

## 6.7 Testing Checklist PPDB

- [ ] Public form submit → cek DB `ppdb_registrations` status `pending`
- [ ] Admin login → buka tab PPDB → data muncul di filter "Menunggu"
- [ ] Search by nama / no.reg / WA → filter works
- [ ] Update status ke "Terverifikasi" → badge biru, reviewed_at terisi
- [ ] Update status ke "Diterima" → badge hijau
- [ ] Update status ke "Ditolak" → badge merah
- [ ] Cetak formulir individual → print preview OK
- [ ] Cetak rekap → print preview OK (landscape)
- [ ] Ekspor CSV → buka Excel, karakter Indonesia benar
- [ ] Ekspor Excel → buka Excel, formatting rapi
- [ ] Hapus data → konfirmasi → data hilang

---

> **Next**: [07-ALUMNI.md](./07-ALUMNI.md) — Data Alumni: Submit, Verifikasi, Ekspor