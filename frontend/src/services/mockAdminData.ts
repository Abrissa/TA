import { AdminStats, AdminUser, AlumniSubmissionRecord, MasterDataResponse, MasterPpdbPath, PpdbRecord, SchoolProfileData } from './api';
import { Article, Achievement } from '../types';
import { ARTICLES_DATA, ACHIEVEMENTS_DATA, TEACHERS_DATA, SCHOOL_INFO } from '../data/mockData';

export function isNetworkError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  return (
    err instanceof TypeError ||
    msg.includes('failed to fetch') ||
    msg.includes('network') ||
    msg.includes('connection refused') ||
    msg.includes('load failed') ||
    msg.includes('err_connection_refused')
  );
}

export const INITIAL_MOCK_PPDB: PpdbRecord[] = [
  {
    id: 1,
    registration_number: 'PPDB-2026-001',
    child_full_name: 'Muhammad Rayyan Al-Fatih',
    gender: 'Laki-laki',
    birth_place: 'Sidoarjo',
    birth_date: '2019-05-12',
    parent_name: 'Bambang Santoso',
    whatsapp: '081234567891',
    address: 'Perumahan Griya Krian Asri Blok B-12, Krian',
    previous_school: 'TK Islam Bakti Mulia Krian',
    status: 'menunggu_verifikasi',
    admin_notes: 'Berkas akta kelahiran dan KK lengkap.',
    registered_at: '2026-10-25 08:30:00',
    reviewed_at: null,
  },
  {
    id: 2,
    registration_number: 'PPDB-2026-002',
    child_full_name: 'Aisyah Putri Azzahra',
    gender: 'Perempuan',
    birth_place: 'Surabaya',
    birth_date: '2019-08-20',
    parent_name: 'Hadi Prasetyo',
    whatsapp: '081345678912',
    address: 'Jl. Raya Tropodo No. 45, Krian, Sidoarjo',
    previous_school: 'RA Muslimat NU Al-Hikmah',
    status: 'terverifikasi',
    admin_notes: 'Pendaftar jalur khusus Tahfidz Juz 30.',
    registered_at: '2026-10-24 14:15:00',
    reviewed_at: '2026-10-25 09:00:00',
    reviewer: { name: 'Operator PPDB' },
  },
  {
    id: 3,
    registration_number: 'PPDB-2026-003',
    child_full_name: 'Fathan Malik Ibrahim',
    gender: 'Laki-laki',
    birth_place: 'Sidoarjo',
    birth_date: '2019-03-10',
    parent_name: 'Dr. Ahmad Fauzi',
    whatsapp: '081298765431',
    address: 'Desa Sidomulyo RT 04 RW 02, Krian',
    previous_school: 'TK Aisyiyah Bustanul Athfal Krian',
    status: 'diterima',
    admin_notes: 'Lolos seleksi observasi dan tahfidz.',
    registered_at: '2026-10-22 10:00:00',
    reviewed_at: '2026-10-23 11:30:00',
    reviewer: { name: 'Administrator Utama' },
  },
  {
    id: 4,
    registration_number: 'PPDB-2026-004',
    child_full_name: 'Nabila Zahra Khairunnisa',
    gender: 'Perempuan',
    birth_place: 'Mojokerto',
    birth_date: '2019-11-05',
    parent_name: 'Siti Rohmah',
    whatsapp: '081287654321',
    address: 'Jl. Diponegoro No. 8, Tarik, Sidoarjo',
    previous_school: 'TK Kartika Candra Kirana',
    status: 'menunggu_verifikasi',
    admin_notes: null,
    registered_at: '2026-10-26 11:20:00',
    reviewed_at: null,
  },
  {
    id: 5,
    registration_number: 'PPDB-2026-005',
    child_full_name: 'Kenzi Al-Ghazali',
    gender: 'Laki-laki',
    birth_place: 'Sidoarjo',
    birth_date: '2019-07-14',
    parent_name: 'Eko Wahyudi',
    whatsapp: '081223344556',
    address: 'Perum Krian Indah Regency C-08',
    previous_school: 'PAUD Melati Sidoarjo',
    status: 'terverifikasi',
    admin_notes: 'Jalur reguler - observasi tanggal 2 November 2026.',
    registered_at: '2026-10-25 16:45:00',
    reviewed_at: '2026-10-26 08:30:00',
    reviewer: { name: 'Operator PPDB' },
  },
];

export const INITIAL_MOCK_ALUMNI_SUBMISSIONS: AlumniSubmissionRecord[] = [
  {
    id: 1,
    full_name: 'Ahmad Faiz Robbani, S.Kom',
    graduation_year: '2015',
    job_role: 'Cloud Solutions Architect di Tech Provider Surabaya',
    photo_url: '/assets/alumni/alumni-1.svg',
    social_media: 'https://linkedin.com/in/ahmadfaiz',
    phone: '081234567890',
    email: 'faiz.robbani@gmail.com',
    message: 'Alhamdulillah pondasi karakter dan tahfidz di MI Al-Ahmad sangat membimbing langkah saya di dunia profesional.',
    status: 'pending',
    notes: null,
    created_at: '2026-10-26 09:30:00',
    reviewed_at: null,
  },
  {
    id: 2,
    full_name: 'dr. Faradiba Ramadhani',
    graduation_year: '2012',
    job_role: 'Dokter Residen RSUD Dr. Soetomo Surabaya',
    photo_url: '/assets/alumni/alumni-2.svg',
    social_media: 'https://instagram.com/dr.faradiba',
    phone: '081298765432',
    email: 'faradiba.rm@gmail.com',
    message: 'Guru-guru di MI Al-Ahmad mendidik dengan hati dan keteladanan yang tiada duanya.',
    status: 'approved',
    notes: 'Profil inspiratif, sudah ditayangkan di direktori alumni.',
    created_at: '2026-10-20 14:00:00',
    reviewed_at: '2026-10-21 10:15:00',
    reviewer: { name: 'Administrator Utama' },
  },
  {
    id: 3,
    full_name: 'Zulfa Nadhiroh, S.Pd',
    graduation_year: '2018',
    job_role: 'Guru & Penggiat Literasi Anak di Sidoarjo',
    photo_url: '/assets/alumni/alumni-3.svg',
    social_media: null,
    phone: '081276543210',
    email: 'zulfa.nadhiroh@yahoo.com',
    message: 'Bangga menjadi bagian dari keluarga besar madrasah tercinta!',
    status: 'pending',
    notes: null,
    created_at: '2026-10-27 10:45:00',
    reviewed_at: null,
  },
];

export const INITIAL_MOCK_MASTER_DATA: MasterDataResponse = {
  academic_years: [
    { id: 1, code: '2025-2026', name: 'Tahun Ajaran 2025/2026', start_date: '2025-07-15', end_date: '2026-06-25', is_active: false },
    { id: 2, code: '2026-2027', name: 'Tahun Ajaran 2026/2027', start_date: '2026-07-15', end_date: '2027-06-25', is_active: true },
  ],
  categories: [
    { id: 1, type: 'article', name: 'Prestasi', slug: 'prestasi', badge_color: 'amber', description: 'Liputan capaian santri dan madrasah.', is_active: true },
    { id: 2, type: 'article', name: 'Kegiatan', slug: 'kegiatan', badge_color: 'emerald', description: 'Dokumentasi aktivitas belajar dan ekstrakurikuler.', is_active: true },
    { id: 3, type: 'article', name: 'Informasi', slug: 'informasi', badge_color: 'blue', description: 'Warta resmi madrasah dan kementerian.', is_active: true },
    { id: 4, type: 'article', name: 'Edukasi', slug: 'edukasi', badge_color: 'indigo', description: 'Artikel edukatif dan wawasan Islami.', is_active: true },
    { id: 5, type: 'achievement', name: 'Internasional', slug: 'internasional', badge_color: 'purple', description: 'Kompetisi tingkat internasional/global.', is_active: true },
    { id: 6, type: 'achievement', name: 'Se-Pulau Jawa', slug: 'se-pulau-jawa', badge_color: 'rose', description: 'Kejuaraan tingkat regional Pulau Jawa.', is_active: true },
    { id: 7, type: 'achievement', name: 'Nasional', slug: 'nasional', badge_color: 'blue', description: 'Kompetisi tingkat nasional.', is_active: true },
    { id: 8, type: 'achievement', name: 'Kecamatan', slug: 'kecamatan', badge_color: 'slate', description: 'Kompetisi tingkat Kecamatan Krian.', is_active: true },
  ],
  ppdb_paths: [
    { id: 1, code: 'REGULER', name: 'Jalur Reguler Umum', quota: 60, description: 'Pendaftaran umum dengan observasi kesiapan belajar anak.', is_active: true },
    { id: 2, code: 'PRESTASI', name: 'Jalur Prestasi Akademik & Sains', quota: 30, description: 'Bagi calon santri berprestasi lomba sains, matematika, atau seni.', is_active: true },
    { id: 3, code: 'TAHFIDZ', name: 'Jalur Khusus Tahfidz Al-Qur\'an', quota: 30, description: 'Bagi calon santri yang memiliki hafalan Al-Qur\'an minimal Juz 30.', is_active: true },
  ],
  cohorts: [
    { id: 1, year: '2005', name: 'Angkatan 2005', motto: 'Generasi Pelopor Peradaban' },
    { id: 2, year: '2010', name: 'Angkatan 2010', motto: 'Inovator Tangguh & Berakhlak' },
    { id: 3, year: '2012', name: 'Angkatan 2012', motto: 'Kreator Masa Depan' },
    { id: 4, year: '2015', name: 'Angkatan 2015', motto: 'Pilar Teknologi & Kemandirian' },
    { id: 5, year: '2018', name: 'Angkatan 2018', motto: 'Generasi Emas Qur\'ani' },
  ],
  roles: [
    { id: 1, code: 'superadmin', name: 'Super Administrator', description: 'Akses penuh ke semua modul sistem dan pengaturan global.' },
    { id: 2, code: 'admin_humas', name: 'Admin Humas & Publikasi', description: 'Pengelolaan konten berita, artikel, dan pengumuman madrasah.' },
    { id: 3, code: 'operator_ppdb', name: 'Operator PPDB', description: 'Verifikasi dan pengelolaan berkas calon peserta didik baru.' },
    { id: 4, code: 'admin_kesiswaan', name: 'Admin Kesiswaan', description: 'Pengelolaan prestasi santri, ekstrakurikuler, dan alumni.' },
  ],
};

// Local storage helpers
function readStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function writeStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export const DEFAULT_CMS_SETTINGS: Record<string, string> = {
  school_logo_url: '/assets/logo-mi-al-ahmad.png',
  school_name: 'MI AL-AHMAD',
  school_tagline: 'Madrasah Ibtidaiyah Sidoarjo',
  school_accreditation: 'A (Unggul)',
  school_npsn: '111235150000',
  school_nsm: '111235150000',
  office_hours: 'Senin - Sabtu: 07.00 - 14.00 WIB',
  school_is_open: 'true',
  school_status_note: '',
  hero_subtitle: 'Selamat Datang di MI AL-AHMAD',
  hero_headline: 'Berkarakter, Peduli & Berprestasi di Era Teknologi',
  hero_cta_text: 'Jelajahi',
  hero_image_url: '/assets/gedung-mi-al-ahmad.jpg',
  hero_students_image_url: '/assets/hero-students.png',
  hero_stat_students: '850',
  hero_stat_alumni: '1000',
  hero_stat_achievements: '500',
  principal_name: 'Drs. H. Ahmad Fauzi, M.Pd',
  principal_role: 'Kepala Madrasah MI AL-AHMAD',
  principal_image_url: '/assets/principal.png',
  principal_greeting: "Yuk, jelajahi serunya dunia sekolah di MI AL-AHMAD Sidoarjo! 🎓 ✨ Temukan informasi tentang program keunggulan Tahfidz, fasilitas modern, kegiatan siswa, dan prestasi terbaru.",
  vision_text: "Terwujudnya Generasi Qur'ani yang Unggul dalam Prestasi, Berakhlakul Karimah, dan Memiliki Kecerdasan Sains serta Teknologi.",
  vision_image_url: '/assets/gedung-mi-al-ahmad.jpg',
  mission_1_title: "Integrasi Kurikulum Merdeka & Al-Qur'an",
  mission_1_desc: "Menyelenggarakan pembelajaran akademik terpadu yang didukung program Tahfidz Al-Qur'an dan bimbingan membaca Al-Qur'an metode Tartil.",
  mission_2_title: "Pembiasaan Akhlak & Karakter Islami",
  mission_2_desc: "Membiasakan salat Dhuha, Dzuhur berjamaah, kultum santri, serta penanaman adab kesopanan sehari-hari.",
  mission_3_title: "Pengembangan Minat & Teknologi",
  mission_3_desc: "Fasilitas laboratorium komputer, sains interaktif, serta ekstrakurikuler kepramukaan dan seni budaya Islami.",
  ppdb_academic_year: '2026/2027',
  ppdb_wave: 'Gelombang 1',
  ppdb_dates: '01 Nov 2025 - 30 Mar 2026',
  ppdb_quota: '120 Siswa',
  ppdb_contact_person: '0812-3456-7890 (Ust. Ridwan)',
  ppdb_intro_text: "Mari bergabung bersama keluarga besar madrasah berprestasi dengan kurikulum integrasi Kemenag, pembinaan tahfidz Al-Qur'an terpadu, dan pembinaan sains berstandar internasional.",
  announcement_banner_text: '',
  announcement_banner_active: 'true',
  school_phone: '(031) 8971234',
  school_whatsapp: '6281234567890',
  school_email: 'info@mialahmad.sch.id',
  school_address: 'Jl. Setiabudi No. 12, Krian, Sidoarjo, Jawa Timur',
  maps_embed_url: 'https://maps.google.com/?q=MI+AL-AHMAD+Krian+Sidoarjo',
  social_instagram: 'https://www.instagram.com/mialahmadkrian',
  social_facebook: 'https://www.facebook.com/mialahmadkrian',
  social_youtube: 'https://www.youtube.com/@mial-ahmadkrianofficial3604',
  social_tiktok: 'https://www.tiktok.com/@mialahmadkrian',
  footer_description: "Bersama MI AL-AHMAD, Berkarakter, Peduli & Berprestasi di Era Teknologi & Qur'ani.",
  footer_copyright: 'Copyright © 2026 All right reserved | MI AL-AHMAD Sidoarjo',
  section_hero_visible: 'true',
  section_advantages_visible: 'true',
  section_principal_visible: 'true',
  section_achievements_visible: 'true',
  section_articles_visible: 'true',
  section_facilities_visible: 'true',
  section_marquee_visible: 'true',
};

export const mockAdminStore = {
  getSettings(): Record<string, string> {
    const stored = readStorage<Record<string, string>>('mi_site_settings', {});
    return {
      ...DEFAULT_CMS_SETTINGS,
      ...stored,
    };
  },

  updateSettings(settings: Array<{ key: string; value: boolean | string }>): void {
    const current = readStorage<Record<string, string>>('mi_site_settings', {});
    settings.forEach((s) => {
      current[s.key] = String(s.value);
    });
    writeStorage('mi_site_settings', current);
    try {
      window.dispatchEvent(new CustomEvent('mi_settings_changed', { detail: current }));
    } catch {}
  },

  login(email: string, pass: string): { token: string; user: AdminUser } | null {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@mialahmad.sch.id' && pass === 'admin123') {
      const user: AdminUser = {
        id: 1,
        name: 'Administrator Utama',
        email: 'admin@mialahmad.sch.id',
        role: 'superadmin',
        phone: '081234567890',
        last_login_at: new Date().toISOString(),
      };
      return { token: 'mock_superadmin_token_demo', user };
    }
    if (cleanEmail === 'humas@mialahmad.sch.id' && pass === 'humas123') {
      const user: AdminUser = {
        id: 2,
        name: 'Tim Humas & Redaksi',
        email: 'humas@mialahmad.sch.id',
        role: 'admin_humas',
        phone: '081298765432',
        last_login_at: new Date().toISOString(),
      };
      return { token: 'mock_humas_token_demo', user };
    }
    return null;
  },

  getArticles(): Article[] {
    const stored = readStorage<Article[]>('mi_mock_articles', []);
    if (stored.length === 0) {
      writeStorage('mi_mock_articles', ARTICLES_DATA);
      return ARTICLES_DATA;
    }
    // Merge any missing default articles
    const existingIds = new Set(stored.map((a) => String(a.id)));
    const missing = ARTICLES_DATA.filter((a) => !existingIds.has(String(a.id)));
    if (missing.length > 0) {
      const merged = [...stored, ...missing];
      writeStorage('mi_mock_articles', merged);
      return merged;
    }
    return stored;
  },

  getAchievements(category?: string, search?: string): Achievement[] {
    let list = readStorage<Achievement[]>('mi_mock_achievements', []);
    if (list.length === 0) {
      list = [...ACHIEVEMENTS_DATA];
      writeStorage('mi_mock_achievements', list);
    } else {
      const existingIds = new Set(list.map((a) => String(a.id)));
      const missing = ACHIEVEMENTS_DATA.filter((a) => !existingIds.has(String(a.id)));
      if (missing.length > 0) {
        list = [...list, ...missing];
        writeStorage('mi_mock_achievements', list);
      }
    }

    if (category && category !== 'Semua') {
      list = list.filter((a) => a.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.winner.toLowerCase().includes(q) ||
        (a.event && a.event.toLowerCase().includes(q))
      );
    }
    return list;
  },

  saveAchievement(data: Partial<Achievement>, id?: string | number): Achievement {
    const list = this.getAchievements();
    let result: Achievement;
    if (id) {
      const idx = list.findIndex((a) => String(a.id) === String(id));
      if (idx !== -1) {
        const updated: Achievement = {
          ...list[idx],
          ...data,
          id: String(id),
        };
        list[idx] = updated;
        writeStorage('mi_mock_achievements', list);
        result = updated;
      } else {
        const newId = String(id);
        result = {
          id: newId,
          title: data.title || 'Prestasi Baru',
          category: data.category || 'Tingkat Kabupaten',
          date: data.date || 'Tahun 2026',
          year: data.year || '2026',
          rank: data.rank || 'Juara',
          event: data.event || 'Kompetisi Pelajar',
          winner: data.winner || 'Santri Berprestasi',
          winnerRole: data.winnerRole || 'Santri MI AL-AHMAD',
          description: data.description || '',
          imageUrl: data.imageUrl || '/assets/prestasi-iksc-2025.jpg',
          highlight: data.highlight || undefined,
          medals: data.medals,
          details: data.details || [],
          isHighlighted: data.isHighlighted || false,
        };
        list.unshift(result);
        writeStorage('mi_mock_achievements', list);
      }
    } else {
      const newId = `ach-${Date.now()}`;
      result = {
        id: newId,
        title: data.title || 'Prestasi Baru',
        category: data.category || 'Tingkat Kabupaten',
        date: data.date || 'Tahun 2026',
        year: data.year || '2026',
        rank: data.rank || 'Juara',
        event: data.event || 'Kompetisi Pelajar',
        winner: data.winner || 'Santri Berprestasi',
        winnerRole: data.winnerRole || 'Santri MI AL-AHMAD',
        description: data.description || '',
        imageUrl: data.imageUrl || '/assets/prestasi-iksc-2025.jpg',
        highlight: data.highlight || undefined,
        medals: data.medals,
        details: data.details || [],
        isHighlighted: data.isHighlighted || false,
      };
      list.unshift(result);
      writeStorage('mi_mock_achievements', list);
    }
    try {
      window.dispatchEvent(new CustomEvent('mi_achievements_changed', { detail: list }));
    } catch {}
    return result;
  },

  deleteAchievement(id: string | number): void {
    const list = this.getAchievements().filter((a) => String(a.id) !== String(id));
    writeStorage('mi_mock_achievements', list);
    try {
      window.dispatchEvent(new CustomEvent('mi_achievements_changed', { detail: list }));
    } catch {}
  },

  saveArticle(article: Partial<Article>, id?: number): Article {
    const list = this.getArticles();
    let result: Article;
    if (id) {
      const index = list.findIndex((a) => a.id === id || String(a.id) === String(id));
      if (index !== -1) {
        const updated = { ...list[index], ...article, id } as Article;
        list[index] = updated;
        writeStorage('mi_mock_articles', list);
        result = updated;
      } else {
        const newId = id;
        result = {
          id: newId,
          title: article.title || 'Judul Baru',
          slug: article.slug || `artikel-${newId}`,
          category: article.category || 'Kegiatan',
          excerpt: article.excerpt || '',
          content: article.content || '',
          author: article.author || 'Tim Humas',
          authorRole: article.authorRole || 'Redaksi',
          imageUrl: article.imageUrl || '/assets/gedung-mi-al-ahmad.jpg',
          readTime: article.readTime || '3 menit',
          publishedAt: new Date().toISOString(),
          status: article.status || 'published',
          tags: article.tags || ['Madrasah'],
          isFeatured: article.isFeatured || false,
        };
        list.unshift(result);
        writeStorage('mi_mock_articles', list);
      }
    } else {
      const newId = Date.now();
      result = {
        id: newId,
        title: article.title || 'Judul Baru',
        slug: article.slug || `artikel-${newId}`,
        category: article.category || 'Kegiatan',
        excerpt: article.excerpt || '',
        content: article.content || '',
        author: article.author || 'Tim Humas',
        authorRole: article.authorRole || 'Redaksi',
        imageUrl: article.imageUrl || '/assets/gedung-mi-al-ahmad.jpg',
        readTime: article.readTime || '3 menit',
        publishedAt: new Date().toISOString(),
        status: article.status || 'published',
        tags: article.tags || ['Madrasah'],
        isFeatured: article.isFeatured || false,
      };
      list.unshift(result);
      writeStorage('mi_mock_articles', list);
    }
    try {
      window.dispatchEvent(new CustomEvent('mi_articles_changed', { detail: list }));
    } catch {}
    return result;
  },

  deleteArticle(id: number): void {
    const list = this.getArticles().filter((a) => a.id !== id && String(a.id) !== String(id));
    writeStorage('mi_mock_articles', list);
    try {
      window.dispatchEvent(new CustomEvent('mi_articles_changed', { detail: list }));
    } catch {}
  },

  getPpdb(status?: string, search?: string): { data: PpdbRecord[]; status_counts: Record<string, number> } {
    let list = readStorage<PpdbRecord[]>('mi_mock_ppdb', INITIAL_MOCK_PPDB);
    const counts: Record<string, number> = {
      all: list.length,
      total: list.length,
      menunggu_verifikasi: list.filter((r) => r.status === 'menunggu_verifikasi').length,
      terverifikasi: list.filter((r) => r.status === 'terverifikasi').length,
      diterima: list.filter((r) => r.status === 'diterima').length,
      ditolak: list.filter((r) => r.status === 'ditolak').length,
    };

    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.child_full_name.toLowerCase().includes(q) ||
          r.registration_number.toLowerCase().includes(q) ||
          r.parent_name.toLowerCase().includes(q)
      );
    }

    return { data: list, status_counts: counts };
  },

  updatePpdbStatus(id: number, status: string, adminNotes?: string): PpdbRecord {
    const list = readStorage<PpdbRecord[]>('mi_mock_ppdb', INITIAL_MOCK_PPDB);
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status: status as any,
        admin_notes: adminNotes !== undefined ? adminNotes : list[idx].admin_notes,
        reviewed_at: new Date().toISOString(),
        reviewer: { name: 'Administrator Utama' },
      };
      writeStorage('mi_mock_ppdb', list);
      return list[idx];
    }
    throw new Error('Data pendaftar tidak ditemukan.');
  },

  deletePpdbRecord(id: number): void {
    const list = readStorage<PpdbRecord[]>('mi_mock_ppdb', INITIAL_MOCK_PPDB).filter((r) => r.id !== id);
    writeStorage('mi_mock_ppdb', list);
    try {
      window.dispatchEvent(new CustomEvent('mi_ppdb_changed'));
    } catch {}
  },

  addPpdbSubmission(record: Partial<PpdbRecord>): PpdbRecord {
    const list = readStorage<PpdbRecord[]>('mi_mock_ppdb', INITIAL_MOCK_PPDB);
    const id = Date.now();
    const newRecord: PpdbRecord = {
      id,
      registration_number: `PPDB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      child_full_name: record.child_full_name || 'Santri Baru',
      gender: record.gender || 'Laki-laki',
      birth_place: record.birth_place || 'Sidoarjo',
      birth_date: record.birth_date || '2019-01-01',
      parent_name: record.parent_name || 'Orang Tua',
      whatsapp: record.whatsapp || '081234567890',
      address: record.address || 'Krian, Sidoarjo',
      previous_school: record.previous_school || null,
      status: 'menunggu_verifikasi',
      admin_notes: null,
      registered_at: new Date().toISOString(),
      reviewed_at: null,
    };
    list.unshift(newRecord);
    writeStorage('mi_mock_ppdb', list);
    return newRecord;
  },

  getAlumniSubmissions(status?: string): AlumniSubmissionRecord[] {
    let list = readStorage<AlumniSubmissionRecord[]>('mi_mock_alumni_submissions', INITIAL_MOCK_ALUMNI_SUBMISSIONS);
    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }
    return list;
  },

  updateAlumniSubmission(id: number, status: 'approved' | 'rejected', notes?: string): void {
    const list = readStorage<AlumniSubmissionRecord[]>('mi_mock_alumni_submissions', INITIAL_MOCK_ALUMNI_SUBMISSIONS);
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status,
        notes: notes !== undefined ? notes : list[idx].notes,
        reviewed_at: new Date().toISOString(),
        reviewer: { name: 'Administrator Utama' },
      };
      writeStorage('mi_mock_alumni_submissions', list);
      try {
        window.dispatchEvent(new CustomEvent('mi_alumni_changed'));
      } catch {}
    }
  },

  deleteAlumniSubmission(id: number): void {
    const list = readStorage<AlumniSubmissionRecord[]>('mi_mock_alumni_submissions', INITIAL_MOCK_ALUMNI_SUBMISSIONS).filter((r) => r.id !== id);
    writeStorage('mi_mock_alumni_submissions', list);
    try {
      window.dispatchEvent(new CustomEvent('mi_alumni_changed'));
    } catch {}
  },

  addAlumniSubmission(data: Partial<AlumniSubmissionRecord>): AlumniSubmissionRecord {
    const list = readStorage<AlumniSubmissionRecord[]>('mi_mock_alumni_submissions', INITIAL_MOCK_ALUMNI_SUBMISSIONS);
    const id = Date.now();
    const newRecord: AlumniSubmissionRecord = {
      id,
      full_name: data.full_name || 'Alumni Baru',
      graduation_year: data.graduation_year || '2020',
      job_role: data.job_role || 'Profesi Alumni',
      photo_url: data.photo_url || '/assets/alumni/alumni-1.svg',
      social_media: data.social_media || null,
      phone: data.phone || null,
      email: data.email || null,
      message: data.message || '',
      status: 'pending',
      notes: null,
      created_at: new Date().toISOString(),
      reviewed_at: null,
    };
    list.unshift(newRecord);
    writeStorage('mi_mock_alumni_submissions', list);
    try {
      window.dispatchEvent(new CustomEvent('mi_alumni_changed'));
    } catch {}
    return newRecord;
  },

  getMasterData(): MasterDataResponse {
    return readStorage<MasterDataResponse>('mi_mock_master_data', INITIAL_MOCK_MASTER_DATA);
  },

  setActiveAcademicYear(id: number): void {
    const data = this.getMasterData();
    data.academic_years = data.academic_years.map((y) => ({
      ...y,
      is_active: y.id === id,
    }));
    writeStorage('mi_mock_master_data', data);
  },

  updatePpdbPath(id: number, partial: Partial<MasterPpdbPath>): void {
    const data = this.getMasterData();
    data.ppdb_paths = data.ppdb_paths.map((p) => (p.id === id ? { ...p, ...partial } : p));
    writeStorage('mi_mock_master_data', data);
  },

  getStats(): AdminStats {
    const ppdb = this.getPpdb().data;
    const alumni = this.getAlumniSubmissions();
    const articles = this.getArticles();

    return {
      total_articles: articles.length,
      total_achievements: this.getAchievements().length,
      total_teachers: TEACHERS_DATA.length,
      total_ppdb: ppdb.length,
      pending_ppdb: ppdb.filter((r) => r.status === 'menunggu_verifikasi').length,
      pending_alumni: alumni.filter((r) => r.status === 'pending').length,
      total_admins: 2,
    };
  },

  getDashboardData() {
    const stats = this.getStats();
    const recent_ppdb = this.getPpdb().data.slice(0, 5);
    const recent_alumni = this.getAlumniSubmissions().slice(0, 5);
    const recent_articles = this.getArticles().slice(0, 5);
    return {
      stats,
      recent_ppdb,
      recent_alumni,
      recent_articles,
    };
  },
};
