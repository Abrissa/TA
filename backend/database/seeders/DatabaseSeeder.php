<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\AlumniProfile;
use App\Models\Announcement;
use App\Models\Article;
use App\Models\CalendarAgenda;
use App\Models\Facility;
use App\Models\MasterAcademicYear;
use App\Models\MasterAlumniCohort;
use App\Models\MasterCategory;
use App\Models\MasterPpdbPath;
use App\Models\MasterRole;
use App\Models\SchoolProfile;
use App\Models\SiteSetting;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // -------------------------------------------------------------
        // 1. MASTER DATA TABLES (Fondasi Master DB)
        // -------------------------------------------------------------

        // Master Roles
        $masterRoles = [
            ['code' => 'superadmin', 'name' => 'Super Administrator', 'description' => 'Akses penuh ke semua modul sistem dan pengaturan global.'],
            ['code' => 'admin_humas', 'name' => 'Admin Humas & Publikasi', 'description' => 'Pengelolaan konten berita, artikel, dan pengumuman madrasah.'],
            ['code' => 'operator_ppdb', 'name' => 'Operator PPDB', 'description' => 'Verifikasi dan pengelolaan berkas calon peserta didik baru.'],
            ['code' => 'admin_kesiswaan', 'name' => 'Admin Kesiswaan', 'description' => 'Pengelolaan prestasi santri, ekstrakurikuler, dan alumni.'],
        ];
        $roleMap = [];
        foreach ($masterRoles as $role) {
            $created = MasterRole::updateOrCreate(['code' => $role['code']], $role);
            $roleMap[$role['code']] = $created->id;
        }

        // Master Academic Years
        $masterYears = [
            ['code' => '2025-2026', 'name' => 'Tahun Ajaran 2025/2026', 'start_date' => '2025-07-15', 'end_date' => '2026-06-25', 'is_active' => false],
            ['code' => '2026-2027', 'name' => 'Tahun Ajaran 2026/2027', 'start_date' => '2026-07-15', 'end_date' => '2027-06-25', 'is_active' => true],
        ];
        $activeYear = null;
        foreach ($masterYears as $year) {
            $created = MasterAcademicYear::updateOrCreate(['code' => $year['code']], $year);
            if ($created->is_active) {
                $activeYear = $created;
            }
        }

        // Master Categories (Berita, Prestasi, Pengumuman)
        $masterCategories = [
            // Articles
            ['type' => 'article', 'name' => 'Prestasi', 'slug' => 'prestasi', 'badge_color' => 'amber', 'description' => 'Liputan capaian santri dan madrasah.'],
            ['type' => 'article', 'name' => 'Kegiatan', 'slug' => 'kegiatan', 'badge_color' => 'emerald', 'description' => 'Dokumentasi aktivitas belajar dan ekstrakurikuler.'],
            ['type' => 'article', 'name' => 'Informasi', 'slug' => 'informasi', 'badge_color' => 'blue', 'description' => 'Warta resmi madrasah dan kementerian.'],
            ['type' => 'article', 'name' => 'Edukasi', 'slug' => 'edukasi', 'badge_color' => 'indigo', 'description' => 'Artikel edukatif dan wawasan Islami.'],
            // Achievements
            ['type' => 'achievement', 'name' => 'Internasional', 'slug' => 'internasional', 'badge_color' => 'purple', 'description' => 'Kompetisi tingkat internasional/global.'],
            ['type' => 'achievement', 'name' => 'Se-Pulau Jawa', 'slug' => 'se-pulau-jawa', 'badge_color' => 'rose', 'description' => 'Kejuaraan tingkat regional Pulau Jawa.'],
            ['type' => 'achievement', 'name' => 'Nasional', 'slug' => 'nasional', 'badge_color' => 'blue', 'description' => 'Kompetisi tingkat nasional.'],
            ['type' => 'achievement', 'name' => 'Provinsi', 'slug' => 'provinsi', 'badge_color' => 'cyan', 'description' => 'Kompetisi tingkat Provinsi Jawa Timur.'],
            ['type' => 'achievement', 'name' => 'Kabupaten', 'slug' => 'kabupaten', 'badge_color' => 'emerald', 'description' => 'Kompetisi tingkat Kabupaten Sidoarjo.'],
            ['type' => 'achievement', 'name' => 'Kecamatan', 'slug' => 'kecamatan', 'badge_color' => 'slate', 'description' => 'Kompetisi tingkat Kecamatan Krian.'],
            // Announcements
            ['type' => 'announcement', 'name' => 'PPDB', 'slug' => 'ppdb', 'badge_color' => 'emerald', 'description' => 'Warta penerimaan santri baru.'],
            ['type' => 'announcement', 'name' => 'Ujian', 'slug' => 'ujian', 'badge_color' => 'amber', 'description' => 'Jadwal dan evaluasi ujian madrasah.'],
            ['type' => 'announcement', 'name' => 'Kedinasan', 'slug' => 'kedinasan', 'badge_color' => 'blue', 'description' => 'Edaran resmi Kemenag & Kemendikbud.'],
            ['type' => 'announcement', 'name' => 'Kegiatan', 'slug' => 'kegiatan', 'badge_color' => 'purple', 'description' => 'Agenda acara dan festival.'],
        ];
        $categoryMap = [];
        foreach ($masterCategories as $cat) {
            $created = MasterCategory::updateOrCreate(['type' => $cat['type'], 'slug' => $cat['slug']], $cat);
            $categoryMap[$cat['type'] . ':' . $cat['slug']] = $created->id;
        }

        // Master PPDB Paths
        $masterPaths = [
            ['code' => 'REGULER', 'name' => 'Jalur Reguler Umum', 'quota' => 60, 'description' => 'Pendaftaran umum dengan observasi kesiapan belajar anak.'],
            ['code' => 'PRESTASI', 'name' => 'Jalur Prestasi Akademik & Sains', 'quota' => 30, 'description' => 'Bagi calon santri berprestasi lomba sains, matematika, atau seni.'],
            ['code' => 'TAHFIDZ', 'name' => 'Jalur Khusus Tahfidz Al-Qur\'an', 'quota' => 30, 'description' => 'Bagi calon santri yang memiliki hafalan Al-Qur\'an minimal Juz 30.'],
        ];
        foreach ($masterPaths as $path) {
            MasterPpdbPath::updateOrCreate(['code' => $path['code']], $path);
        }

        // Master Alumni Cohorts
        $cohorts = [
            ['year' => '2005', 'name' => 'Angkatan 2005', 'motto' => 'Generasi Pelopor Peradaban'],
            ['year' => '2010', 'name' => 'Angkatan 2010', 'motto' => 'Inovator Tangguh & Berakhlak'],
            ['year' => '2012', 'name' => 'Angkatan 2012', 'motto' => 'Kreator Masa Depan'],
            ['year' => '2015', 'name' => 'Angkatan 2015', 'motto' => 'Pilar Teknologi & Kemandirian'],
            ['year' => '2018', 'name' => 'Angkatan 2018', 'motto' => 'Generasi Emas Qur\'ani'],
        ];
        $cohortMap = [];
        foreach ($cohorts as $cohort) {
            $created = MasterAlumniCohort::updateOrCreate(['year' => $cohort['year']], $cohort);
            $cohortMap[$cohort['year']] = $created->id;
        }

        // -------------------------------------------------------------
        // 2. USERS & AUTENTIKASI
        // -------------------------------------------------------------
        User::updateOrCreate(
            ['email' => 'admin@mialahmad.sch.id'],
            [
                'name' => 'Administrator Utama',
                'password' => Hash::make('admin123'),
                'role' => 'superadmin',
                'role_id' => $roleMap['superadmin'] ?? null,
                'status' => 'active',
                'phone' => '081234567890',
            ]
        );

        User::updateOrCreate(
            ['email' => 'humas@mialahmad.sch.id'],
            [
                'name' => 'Tim Humas & Redaksi',
                'password' => Hash::make('humas123'),
                'role' => 'admin_humas',
                'role_id' => $roleMap['admin_humas'] ?? null,
                'status' => 'active',
                'phone' => '081298765432',
            ]
        );

        // -------------------------------------------------------------
        // 3. PROFIL MADRASAH
        // -------------------------------------------------------------
        SchoolProfile::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'MI AL-AHMAD Krian',
                'npsn' => '60717281',
                'accreditation' => 'A (Unggul)',
                'tagline' => "Membentuk Generasi Qur'ani, Berakhlak Mulia & Berprestasi Unggul",
                'description' => "Madrasah Ibtidaiyah AL-AHMAD Krian Sidoarjo adalah lembaga pendidikan dasar Islam terpadu yang memadukan kurikulum Kemenag, kurikulum nasional, pendalaman tahfidz Al-Qur'an, dan pembinaan sains berstandar internasional.",
                'vision' => "Terwujudnya Generasi yang Beriman, Bertaqwa, Berakhlaqul Karimah, Unggul dalam Prestasi Akademik dan Non-Akademik, serta Berwawasan Lingkungan Global.",
                'mission' => [
                    "Menyelenggarakan pendidikan dasar Islam yang mengintegrasikan nilai-nilai Al-Qur'an dan As-Sunnah dalam kehidupan sehari-hari.",
                    "Mengembangkan potensi kecerdasan intelektual siswa melalui penguatan kurikulum sains, matematika, dan literasi teknologi.",
                    "Melaksanakan pembinaan tahfidz Al-Qur'an secara intensif dengan target hafalan terukur dan mutqin.",
                    "Menumbuhkan semangat kompetitif, percaya diri, dan kepemimpinan santri melalui berbagai ajang olimpiade dan ekstrakurikuler unggulan.",
                    "Menciptakan lingkungan madrasah yang asri, bersih, berbudaya Adiwiyata, dan ramah anak.",
                ],
                'objectives' => [
                    "Mencapai kelulusan 100% dengan standar kompetensi lulusan bernilai tinggi.",
                    "Menghasilkan lulusan yang hafal minimal Juz 30 dan mampu membaca Al-Qur'an dengan tartil.",
                    "Meraih prestasi dalam kompetisi sains (KSM, OSN, IKSC), keagamaan, dan seni olahraga di tingkat Kabupaten, Provinsi, hingga Internasional.",
                ],
                'principal_name' => 'Drs. H. Ahmad Fauzi, M.Pd',
                'principal_greeting' => "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di portal informasi resmi MI AL-AHMAD Krian Sidoarjo. Sebagai madrasah yang mengedepankan kualitas pendidikan dan penanaman karakter Qur'ani, kami berikhtiar mendampingi setiap ananda agar tumbuh menjadi pribadi yang berilmu, beradab, mandiri, dan siap menjawab tantangan masa depan. Terima kasih atas kepercayaan para orang tua dan masyarakat.",
                'principal_image_url' => '/assets/principal.png',
                'logo_url' => '/assets/logo-mi-al-ahmad.png',
                'hero_image_url' => '/assets/gedung-mi-al-ahmad.jpg',
                'phone' => '(031) 8971234',
                'whatsapp' => '6281234567890',
                'email' => 'info@mialahmad.sch.id',
                'address' => 'Jl. Setiabudi No. 12, Krian, Kec. Krian, Kabupaten Sidoarjo, Jawa Timur 61262',
                'maps_embed_url' => 'https://maps.google.com/maps?q=MI+Al+Ahmad+Krian&t=&z=15&ie=UTF8&iwloc=&output=embed',
                'social_instagram' => 'https://instagram.com/mialahmadkrian',
                'social_facebook' => 'https://facebook.com/mialahmadkrian',
                'social_youtube' => 'https://youtube.com/@mialahmadkrian',
                'social_tiktok' => 'https://tiktok.com/@mialahmadkrian',
            ]
        );

        // -------------------------------------------------------------
        // 4. KONTROL TAMPILAN HALAMAN (SITE SETTINGS)
        // -------------------------------------------------------------
        $defaultSettings = [
            ['key' => 'section_hero_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Seksi Hero Banner'],
            ['key' => 'section_advantages_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Keunggulan Madrasah'],
            ['key' => 'section_principal_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Sambutan Kepala Madrasah'],
            ['key' => 'section_achievements_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Seksi Prestasi'],
            ['key' => 'section_articles_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Seksi Berita & Artikel'],
            ['key' => 'section_alumni_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Jejak Alumni'],
            ['key' => 'section_agenda_visible', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'label' => 'Tampilkan Agenda & Kalender'],
            ['key' => 'ppdb_open', 'value' => 'true', 'type' => 'boolean', 'group' => 'ppdb', 'label' => 'Status Pendaftaran PPDB Dibuka'],
            ['key' => 'ppdb_academic_year', 'value' => '2026/2027', 'type' => 'text', 'group' => 'ppdb', 'label' => 'Tahun Ajaran PPDB'],
            ['key' => 'ppdb_wave', 'value' => 'Gelombang 1', 'type' => 'text', 'group' => 'ppdb', 'label' => 'Gelombang Pendaftaran PPDB'],
            ['key' => 'ppdb_contact_person', 'value' => '081234567890 (Ust. Ridwan)', 'type' => 'text', 'group' => 'ppdb', 'label' => 'Kontak Layanan PPDB'],
            ['key' => 'announcement_banner_text', 'value' => 'Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Telah Dibuka. Kuota Terbatas!', 'type' => 'text', 'group' => 'announcement', 'label' => 'Teks Pengumuman Berjalan'],
            ['key' => 'announcement_banner_active', 'value' => 'true', 'type' => 'boolean', 'group' => 'announcement', 'label' => 'Aktifkan Banner Pengumuman'],
        ];
        foreach ($defaultSettings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        // -------------------------------------------------------------
        // 5. DEWAN GURU & FASILITAS
        // -------------------------------------------------------------
        $teachers = [
            ['name' => 'Drs. H. Ahmad Fauzi, M.Pd', 'degree' => 'M.Pd', 'role' => "Kepala Sekolah & Guru Tahfidz", 'subjects' => "Kepemimpinan & Al-Qur'an", 'image_url' => '/assets/teachers/guru-1.svg', 'order' => 1],
            ['name' => 'Siti Aminah, S.Pd.I', 'degree' => 'S.Pd.I', 'role' => 'Guru Bahasa Arab', 'subjects' => 'Bahasa Arab & Adab', 'image_url' => '/assets/teachers/guru-2.svg', 'order' => 2],
            ['name' => 'Rahmat Hidayat, M.Sc', 'degree' => 'M.Sc', 'role' => 'Guru Matematika & IPA', 'subjects' => 'Sains Eksperimental', 'image_url' => '/assets/teachers/guru-3.svg', 'order' => 3],
            ['name' => 'Hj. Nurul Jannah, S.Pd', 'degree' => 'S.Pd', 'role' => 'Guru Bahasa Inggris', 'subjects' => 'English Literacy', 'image_url' => '/assets/teachers/guru-4.svg', 'order' => 4],
            ['name' => 'Ustadz Mansur, S.Th.I', 'degree' => 'S.Th.I', 'role' => 'Guru Fiqih & Akidah', 'subjects' => 'Fiqih Ibadah & Akidah', 'image_url' => '/assets/teachers/guru-5.svg', 'order' => 5],
            ['name' => 'Indah Permata, S.E', 'degree' => 'S.E', 'role' => 'Guru SBdP & Prakarya', 'subjects' => 'Seni Budaya & Kewirausahaan', 'image_url' => '/assets/teachers/guru-6.svg', 'order' => 6],
            ['name' => 'Yusuf Mahendra, S.Pd', 'degree' => 'S.Pd', 'role' => 'Guru PJOK', 'subjects' => 'Pendidikan Jasmani & Olahraga', 'image_url' => '/assets/teachers/guru-7.svg', 'order' => 7],
        ];
        foreach ($teachers as $teacher) {
            Teacher::updateOrCreate(['name' => $teacher['name']], $teacher);
        }

        $facilities = [
            ['title' => 'Ruang Kelas Digital', 'description' => 'Dilengkapi dengan smart board dan akses internet cepat untuk pembelajaran interaktif.', 'icon_name' => 'MonitorSmart', 'order' => 1],
            ['title' => 'Perpustakaan & Literasi', 'description' => 'Koleksi buku lengkap dan area baca yang nyaman untuk menumbuhkan minat baca siswa.', 'icon_name' => 'BookOpen', 'order' => 2],
            ['title' => 'Laboratorium Komputer', 'description' => 'Fasilitas IT modern untuk mendukung penguasaan teknologi informasi sejak dini.', 'icon_name' => 'Laptop', 'order' => 3],
            ['title' => 'Area Olahraga', 'description' => 'Lapangan olahraga yang luas untuk mendukung kesehatan fisik dan bakat atletik siswa.', 'icon_name' => 'Trophy', 'order' => 4],
            ['title' => 'Masjid Sekolah', 'description' => 'Pusat kegiatan ibadah dan pembinaan karakter spiritual siswa di lingkungan sekolah.', 'icon_name' => 'Building2', 'order' => 5],
            ['title' => 'Laboratorium IPA', 'description' => 'Ruang praktikum sains yang aman untuk mengeksplorasi ilmu pengetahuan alam.', 'icon_name' => 'FlaskConical', 'order' => 6],
        ];
        foreach ($facilities as $facility) {
            Facility::updateOrCreate(['title' => $facility['title']], $facility);
        }

        // -------------------------------------------------------------
        // 6. PRESTASI SANTRI (Terkoneksi ke Master Category & Master Year)
        // -------------------------------------------------------------
        $achievements = [
            [
                'title' => 'International Kangaroo Science Contest (IKSC) ke-18',
                'category' => 'Internasional',
                'category_id' => $categoryMap['achievement:internasional'] ?? null,
                'academic_year_id' => $activeYear?->id,
                'date' => 'Tahun 2025',
                'year' => '2025',
                'rank' => '301 Medali (9 Emas, 74 Perak, 218 Perunggu)',
                'event' => 'International Kangaroo Science Contest (IKSC) 18th 2025',
                'winner' => 'Siswa - Siswi MI AL-AHMAD',
                'winner_role' => 'Delegasi Sains Internasional',
                'description' => 'Selamat atas prestasi gemilang yang diraih oleh siswa-siswi MI AL-AHMAD dalam ajang kompetisi sains bertaraf internasional IKSC 18th 2025 dengan memborong total 301 medali: 9 Gold, 74 Silver, dan 218 Bronze. #JAWARA Jaya Istimewa Berkah!',
                'image_url' => '/assets/prestasi-iksc-2025.jpg',
                'highlight' => '#JAWARA (Jaya Istimewa Berkah)',
                'is_highlighted' => true,
                'medals' => ['gold' => 9, 'silver' => 74, 'bronze' => 218, 'total' => 301],
                'details' => ['9 Medali Emas (Gold)', '74 Medali Perak (Silver)', '218 Medali Perunggu (Bronze)', 'Madrasah Maju, Bermutu, Mendunia'],
            ],
            [
                'title' => 'LKBB SANCAKA S3 2025 Tingkat SD/MI Se-Pulau Jawa',
                'category' => 'Se-Pulau Jawa',
                'category_id' => $categoryMap['achievement:se-pulau-jawa'] ?? null,
                'academic_year_id' => $activeYear?->id,
                'date' => 'Tahun 2025',
                'year' => '2025',
                'rank' => 'Juara 2 Utama & Borong 6 Kategori Prestasi',
                'event' => 'LKBB SANCAKA S3 2025 Tingkat SD/MI Se-Pulau Jawa',
                'winner' => 'Tim Paskibra MI AL AHMAD (KOPASMILAD)',
                'winner_role' => 'Regu Paskibra Tingkat SD/MI',
                'description' => 'Selamat & Sukses atas torehan gemilang Tim Paskibra MI AL AHMAD (KOPASMILAD) di ajang LKBB SANCAKA S3 2025 Tingkat SD/MI Se-Pulau Jawa dengan memborong 6 piala kejuaraan bergengsi.',
                'image_url' => '/assets/prestasi-paskibra-kopasmilad.jpg',
                'highlight' => 'Tingkat SD/MI Se-Pulau Jawa',
                'is_highlighted' => true,
                'details' => ['Juara 2 Utama + Medali 16', 'Best Kostum 2', 'Best Danton 1', 'Best PBB 2', 'Best Formasi 2', 'Best Parade Danton 3'],
            ],
            [
                'title' => 'Juara 3 Lomba Renang SD/MI Kecamatan Krian',
                'category' => 'Kecamatan',
                'category_id' => $categoryMap['achievement:kecamatan'] ?? null,
                'academic_year_id' => $activeYear?->id,
                'date' => 'Tahun 2025',
                'year' => '2025',
                'rank' => 'Juara 3 Renang (Piala & Piagam)',
                'event' => 'Lomba Renang Tingkat SD/MI Kecamatan Krian - Pekan Olahraga HUT RI ke-80',
                'winner' => 'Azka Haidar Amirudin',
                'winner_role' => 'Siswa Berprestasi Cabang Akuatik/Renang',
                'description' => 'Selamat dan sukses atas keberhasilan ananda Azka Haidar Amirudin meraih Juara 3 Lomba Renang Tingkat SD/MI Kecamatan Krian dalam rangka memperingati Pekan Olahraga HUT RI ke-80.',
                'image_url' => '/assets/prestasi-azka-haidar.jpg',
                'highlight' => 'Juara 3 Kecamatan (Piala & Piagam)',
                'is_highlighted' => false,
                'details' => ['Juara 3 Lomba Renang SD/MI', 'Pekan Olahraga HUT RI ke-80', 'Tingkat Kecamatan Krian'],
            ],
        ];
        foreach ($achievements as $ach) {
            Achievement::updateOrCreate(['title' => $ach['title']], $ach);
        }

        // -------------------------------------------------------------
        // 7. ARTIKEL BERITA (Terkoneksi ke Master Category)
        // -------------------------------------------------------------
        $articles = [
            [
                'title' => 'Maulana, Siswa MI dari Kabupaten Sidoarjo Tembus Kompetisi Sains Madrasah Tingkat Provinsi',
                'slug' => 'maulana-siswa-mi-sidoarjo-tembus-ksm-provinsi',
                'category' => 'Prestasi',
                'category_id' => $categoryMap['article:prestasi'] ?? null,
                'excerpt' => 'Siswa kelas 5 MI Al-Ahmad Krian, Maulana Kenzie Adha Ariyanto berhasil meraih Juara 1 Kompetisi Sains Madrasah (KSM) bidang matematika tingkat Kabupaten Sidoarjo dan melaju ke tingkat provinsi.',
                'content' => "Jakarta: Siswa kelas 5 Madrasah Ibtidaiyah (MI) Al-Ahmad Krian, Maulana Kenzie Adha Ariyanto berhasil meraih Juara 1 Kompetisi Sains Madrasah (KSM) bidang matematika tingkat Kabupaten Sidoarjo. Keberhasilan itu membuat Maulana dapat melanjutkan kompetisi ke tingkat provinsi.\n\n“Untuk persiapan ke tingkat provinsi harus terus belajar dan mengasah kemampuan dengan berlatih soal-soal,” kata Wakil Kepala Madrasah bidang Kurikulum, Aat Choiruddin, dikutip dari laman nu.or.id, Rabu, 10 Juli 2024.\n\nWakil Sekretaris Pengurus Cabang Nahdlatul Ulama (PCNU) Sidoarjo itu menyampaikan pada ajang resmi Kemenag ini, MI Al-Ahmad Krian mengirimkan masing-masing satu siswa pada bidang matematika dan Ilmu Pengetahuan Alam (IPA) Terpadu, serta satu grup kategori beregu.",
                'author' => 'Renatha Swasty',
                'author_role' => 'Jurnalis Medcom.id / Liputan Khusus',
                'source_name' => 'Medcom.id & nu.or.id',
                'source_url' => 'https://www.medcom.id/pendidikan/news-pendidikan/4KZ92W6k-maulana-siswa-mi-dari-kabupaten-sidoarjo-tembus-kompetisi-sains-madrasah-tingkat-provinsi',
                'image_url' => '/assets/berita-maulana-ksm.jpg',
                'read_time' => '3 menit baca',
                'tags' => ['KSM Sidoarjo', 'Olimpiade Matematika', 'Prestasi Santri', 'Kemenag', 'Provinsi Jatim'],
                'is_featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
            ],
            [
                'title' => 'Prestasi Mendunia: Siswa MI AL-AHMAD Borong 301 Medali di Ajang Internasional IKSC 2025',
                'slug' => 'prestasi-mendunia-siswa-mi-al-ahmad-borong-301-medali-iksc-2025',
                'category' => 'Prestasi',
                'category_id' => $categoryMap['article:prestasi'] ?? null,
                'excerpt' => 'Delegasi sains MI AL-AHMAD membuktikan kualitas pendidikan global dengan memborong total 301 medali (9 Emas, 74 Perak, dan 218 Perunggu) pada International Kangaroo Science Contest ke-18.',
                'content' => "Krian: Prestasi membanggakan di panggung internasional kembali diukir oleh santri-santri MI AL-AHMAD Krian. Dalam ajang bergengsi International Kangaroo Science Contest (IKSC) ke-18 tahun 2025, delegasi madrasah sukses memborong total 301 medali kejuaraan yang terdiri dari 9 Medali Emas (Gold), 74 Medali Perak (Silver), dan 218 Medali Perunggu (Bronze).",
                'author' => 'Tim Humas Madrasah',
                'author_role' => 'Humas & Informasi Publik',
                'image_url' => '/assets/prestasi-iksc-2025.jpg',
                'read_time' => '3 menit baca',
                'tags' => ['IKSC 2025', 'Sains Internasional', '301 Medali', '#JAWARA'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(30),
            ],
        ];
        foreach ($articles as $art) {
            Article::updateOrCreate(['slug' => $art['slug']], $art);
        }

        // -------------------------------------------------------------
        // 8. ALUMNI PROFILES (Terkoneksi ke Master Cohort)
        // -------------------------------------------------------------
        $alumni = [
            [
                'name' => 'Dr. Ahmad Faisal, M.Sc.',
                'graduation_year' => 'Lulusan 2005',
                'cohort_id' => $cohortMap['2005'] ?? null,
                'title' => 'Senior Researcher & Innovator',
                'current_role' => 'Peneliti Senior di Pusat Inovasi Teknologi Global',
                'bio' => 'Fokus pada riset pengembangan energi terbarukan ramah lingkungan dan teknologi material.',
                'image_url' => '/assets/alumni/alumni-1.svg',
                'category_badge' => '50+ Dokter & Peneliti',
                'order' => 1,
            ],
            [
                'name' => 'Siti Aminah, B.Des.',
                'graduation_year' => 'Lulusan 2012',
                'cohort_id' => $cohortMap['2012'] ?? null,
                'title' => 'Creative Director',
                'current_role' => 'Creative Director di Agency ternama di Jakarta',
                'bio' => 'Memimpin kampanye sosial kreatif dan komunikasi visual berdampak tinggi bagi organisasi nirlaba.',
                'image_url' => '/assets/alumni/alumni-2.svg',
                'category_badge' => '120+ Insinyur & Kreatif',
                'order' => 2,
            ],
            [
                'name' => 'Budi Santoso, S.Kom.',
                'graduation_year' => 'Lulusan 2015',
                'cohort_id' => $cohortMap['2015'] ?? null,
                'title' => 'Founder Startup Edutech',
                'current_role' => 'CEO & Founder EduNusantara',
                'bio' => 'Memberdayakan ribuan guru dan santri di pelosok daerah melalui integrasi teknologi digital.',
                'image_url' => '/assets/alumni/alumni-3.svg',
                'category_badge' => '30+ Praktisi Hukum & Tech',
                'order' => 3,
            ],
        ];
        foreach ($alumni as $alm) {
            AlumniProfile::updateOrCreate(['name' => $alm['name']], $alm);
        }

        // -------------------------------------------------------------
        // 9. PENGUMUMAN & AGENDA
        // -------------------------------------------------------------
        $announcements = [
            ['title' => 'Informasi Pembukaan Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027', 'date' => '10 Juni 2026', 'category' => 'PPDB', 'category_id' => $categoryMap['announcement:ppdb'] ?? null, 'is_important' => true],
            ['title' => 'Jadwal Penilaian Akhir Semester (PAS) Genap Madrasah Ibtidaiyah', 'date' => '02 Juni 2026', 'category' => 'Ujian', 'category_id' => $categoryMap['announcement:ujian'] ?? null, 'is_important' => true],
            ['title' => "Surat Edaran Pelaksanaan Peringatan Hari Pendidikan Nasional dan Isra Mi'raj", 'date' => '25 Mei 2026', 'category' => 'Kedinasan', 'category_id' => $categoryMap['announcement:kedinasan'] ?? null, 'is_important' => false],
            ['title' => 'Pengumuman Hasil Seleksi Lomba Tahfidz dan Seni Islami Antar Kelas', 'date' => '18 Mei 2026', 'category' => 'Kegiatan', 'category_id' => $categoryMap['announcement:kegiatan'] ?? null, 'is_important' => false],
        ];
        foreach ($announcements as $ann) {
            Announcement::updateOrCreate(['title' => $ann['title']], $ann);
        }

        $agendas = [
            ['date_day' => '15', 'date_month' => 'JUN', 'title' => 'Rapat Pleno Orang Tua Murid & Pembagian Raport Semester Genap', 'time' => '08.00 - 12.00 WIB', 'location' => 'Aula Utama MI AL-AHMAD', 'order' => 1],
            ['date_day' => '24', 'date_month' => 'JUN', 'title' => "Pelaksanaan Matsama (Masa Ta'aruf Siswa Madrasah) Siswa Baru", 'time' => '07.00 - 11.00 WIB', 'location' => 'Kampus MI AL-AHMAD', 'order' => 2],
            ['date_day' => '05', 'date_month' => 'JUL', 'title' => 'Pemeriksaan Kesehatan Berkala Kerjasama dengan Puskesmas Krian', 'time' => '08.30 - 11.30 WIB', 'location' => 'UKS Madrasah', 'order' => 3],
        ];
        foreach ($agendas as $ag) {
            CalendarAgenda::updateOrCreate(['title' => $ag['title']], $ag);
        }
    }
}
