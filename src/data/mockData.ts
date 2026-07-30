import { Teacher, Facility, Achievement, Article, AlumniProfile, Testimonial } from '../types';

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 't1',
    name: 'Drs. H. Ahmad Fauzi, M.Pd',
    degree: 'M.Pd',
    role: 'Kepala Sekolah & Guru Tahfidz',
    subjects: 'Kepemimpinan & Al-Qur\'an',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't2',
    name: 'Siti Aminah, S.Pd.I',
    degree: 'S.Pd.I',
    role: 'Guru Bahasa Arab',
    subjects: 'Bahasa Arab & Adab',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't3',
    name: 'Rahmat Hidayat, M.Sc',
    degree: 'M.Sc',
    role: 'Guru Matematika & IPA',
    subjects: 'Sains Eksperimental',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't4',
    name: 'Hj. Nurul Jannah, S.Pd',
    degree: 'S.Pd',
    role: 'Guru Bahasa Inggris',
    subjects: 'English Literacy',
    imageUrl: 'https://images.unsplash.com/photo-1580894732413-a704934d4008?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't5',
    name: 'Ustadz Mansur, S.Th.I',
    degree: 'S.Th.I',
    role: 'Guru Fiqih & Akidah',
    subjects: 'Fiqih Ibadah & Akidah',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't6',
    name: 'Indah Permata, S.E',
    degree: 'S.E',
    role: 'Guru SBdP & Prakarya',
    subjects: 'Seni Budaya & Kewirausahaan',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't7',
    name: 'Yusuf Mahendra, S.Pd',
    degree: 'S.Pd',
    role: 'Guru PJOK',
    subjects: 'Pendidikan Jasmani & Olahraga',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
  },
];

export const FACILITIES_DATA: Facility[] = [
  {
    id: 'f1',
    title: 'Ruang Kelas Digital',
    description: 'Dilengkapi dengan smart board dan akses internet cepat untuk pembelajaran interaktif.',
    iconName: 'MonitorSmart',
  },
  {
    id: 'f2',
    title: 'Perpustakaan & Literasi',
    description: 'Koleksi buku lengkap dan area baca yang nyaman untuk menumbuhkan minat baca siswa.',
    iconName: 'BookOpen',
  },
  {
    id: 'f3',
    title: 'Laboratorium Komputer',
    description: 'Fasilitas IT modern untuk mendukung penguasaan teknologi informasi sejak dini.',
    iconName: 'Laptop',
  },
  {
    id: 'f4',
    title: 'Area Olahraga',
    description: 'Lapangan olahraga yang luas untuk mendukung kesehatan fisik dan bakat atletik siswa.',
    iconName: 'Trophy',
  },
  {
    id: 'f5',
    title: 'Masjid Sekolah',
    description: 'Pusat kegiatan ibadah dan pembinaan karakter spiritual siswa di lingkungan sekolah.',
    iconName: 'Building2',
  },
  {
    id: 'f6',
    title: 'Laboratorium IPA',
    description: 'Ruang praktikum sains yang aman untuk mengeksplorasi ilmu pengetahuan alam.',
    iconName: 'FlaskConical',
  },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'a1',
    title: 'Juara 1 Olimpiade Matematika Sains',
    category: 'Provinsi',
    date: '14 Mei 2024',
    description: 'Siswa perwakilan MI AL-AHMAD berhasil meraih medali emas pada ajang bergengsi tahunan tingkat provinsi.',
    winner: 'Ahmad Fauzi (Kelas 5A)',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'a2',
    title: 'Terbaik 1 MHQ Tahfidz Juz 30',
    category: 'Kabupaten',
    date: '28 April 2024',
    description: 'Dedikasi dalam menghafal Al-Qur\'an membuahkan hasil gemilang pada Musabaqah Hifdzil Qur\'an.',
    winner: 'Siti Aminah (Kelas 4C)',
    imageUrl: 'https://images.unsplash.com/photo-1584697964358-3e14ca57658b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'a3',
    title: 'Juara Umum Lomba Pramuka Terampil',
    category: 'Juara Umum',
    date: '12 Maret 2024',
    description: 'Regu Elang dan Melati berhasil menyapu bersih berbagai kategori lomba ketangkasan kepramukaan.',
    winner: 'Regu Inti Pramuka',
    imageUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=800&auto=format&fit=crop',
  },
];

export const HISTORICAL_MILESTONES = [
  {
    year: '2023',
    title: 'Penghargaan Sekolah Adiwiyata',
    description: 'Diakui secara resmi sebagai sekolah berbasis lingkungan yang sehat dan asri oleh Dinas Lingkungan Hidup.',
  },
  {
    year: '2022',
    title: 'Juara 2 Lomba Inovasi Media Pembelajaran',
    description: 'Guru MI AL-AHMAD menciptakan platform digital interaktif untuk pengenalan huruf hijaiyah.',
  },
  {
    year: '2021',
    title: 'Predikat Akreditasi \'A\' (Unggul)',
    description: 'Mempertahankan standar kualitas pendidikan tertinggi berdasarkan penilaian BAN-S/M.',
  },
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-feat',
    title: 'Persiapan Menuju Olimpiade Sains Nasional Tingkat Kabupaten',
    excerpt: 'Siswa-siswi terpilih MI AL-AHMAD mulai menjalani pelatihan intensif untuk menghadapi ajang OSN. Dukungan penuh diberikan oleh tim guru pembina.',
    content: `Siswa-siswi terpilih MI AL-AHMAD mulai menjalani pelatihan intensif untuk menghadapi ajang Olimpiade Sains Nasional (OSN) tingkat kabupaten tahun 2024. Program persiapan ini dirancang terstruktur dengan mengedepankan pemahaman konsep mendalam serta penyelesaian soal-soal bernalar tinggi (HOTS).\n\nKepala Madrasah, Drs. H. Ahmad Fauzi, M.Pd, menyampaikan bahwa madrasah memberikan pendampingan khusus serta fasilitas penunjang laboratorium digital. Pembinaan dilaksanakan setiap hari sehabis jam kegiatan belajar mengajar dengan bimbingan langsung dari tim guru IPA dan Matematika.\n\n"Kami percaya bahwa potensi anak-anak akan terpancar maksimal saat dipadukan dengan latihan tekun dan doa yang khusyuk. Semoga perwakilan kita dapat memberikan persembahan terbaik," tutur beliau.`,
    category: 'Edukasi',
    date: '24 Mei 2024',
    author: 'Admin Sekolah',
    authorRole: 'Humas & Informasi',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    id: 'art-1',
    title: 'Kemah Ukhuwah: Membangun Kemandirian Siswa Sejak Dini',
    excerpt: 'Kegiatan tahunan pramuka yang bertujuan melatih mental, kedisiplinan, dan rasa persaudaraan antar sesama siswa.',
    content: 'Kegiatan Kemah Ukhuwah tahun ini berlangsung dengan penuh semangat dan keceriaan di kawasan perkemahan hijau. Siswa diajarkan keterampilan manajerial mandiri, mendirikan tenda, memasak bersama, serta malam keakraban api unggun.',
    category: 'Kegiatan',
    date: '18 Mei 2024',
    author: 'Admin',
    authorRole: 'Tim Kesiswaan',
    imageUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'art-2',
    title: 'Juara 1 Olimpiade Matematika Tingkat Kabupaten',
    excerpt: 'Kebanggaan bagi sekolah, ananda Zikri berhasil meraih medali emas dalam kompetisi bergengsi tingkat daerah.',
    content: 'Prestasi membanggakan kembali diukir oleh ananda Zikri siswa kelas 5 MI AL-AHMAD yang berhasil menyabet predikat Juara 1 dalam Olimpiade Matematika SD/MI tingkat Kabupaten.',
    category: 'Prestasi',
    date: '12 Mei 2024',
    author: 'Guru',
    authorRole: 'Pembina OSN',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'art-3',
    title: 'Tips Mendampingi Anak Belajar Al-Qur\'an di Rumah',
    excerpt: 'Panduan praktis bagi orang tua untuk menciptakan suasana belajar yang menyenangkan bagi anak dalam menghafal Al-Qur\'an.',
    content: 'Proses murajaah dan tahfidz Al-Qur\'an tidak hanya terbatas di ruang kelas madrasah, tetapi memerlukan peran aktif orang tua di rumah melalui rutinitas ba\'da Maghrib.',
    category: 'Informasi',
    date: '05 Mei 2024',
    author: 'Kesiswaan',
    authorRole: 'Koordinator Tahfidz',
    imageUrl: 'https://images.unsplash.com/photo-1584697964358-3e14ca57658b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'art-4',
    title: 'Eksperimen Seru di Laboratorium IPA Terpadu',
    excerpt: 'Belajar sains menjadi lebih menyenangkan dengan praktik langsung di lab IPA modern MI AL-AHMAD.',
    content: 'Siswa kelas 4 dan 5 antusias mengikuti sesi praktikum sains mengenai sifat-sifat wujud benda dan eksperimen reaksi asam-basa menggunakan media pembelajaran interaktif.',
    category: 'Kegiatan',
    date: '02 Mei 2024',
    author: 'Guru IPA',
    authorRole: 'Pengelola Lab',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'art-5',
    title: 'Tim Futsal Sekolah Menembus Final Liga Pelajar',
    excerpt: 'Setelah melalui babak kualifikasi yang sengit, tim kebanggaan kita akhirnya mengamankan tiket final.',
    content: 'Semangat pantang menyerah ditunjukkan oleh tim futsal MI AL-AHMAD yang berhasil menundukkan tim unggulan pada semifinal Liga Pelajar Sidoarjo.',
    category: 'Prestasi',
    date: '28 April 2024',
    author: 'Pelatih Olahraga',
    authorRole: 'Guru PJOK',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  },
];

export const ALUMNI_DATA: AlumniProfile[] = [
  {
    id: 'alm-1',
    name: 'Dr. Ahmad Faisal, M.Sc.',
    graduationYear: 'Lulusan 2005',
    title: 'Senior Researcher & Innovator',
    currentRole: 'Peneliti Senior di Pusat Inovasi Teknologi Global',
    bio: 'Fokus pada pengembangan energi terbarukan yang berkelanjutan.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    categoryBadge: '50+ Dokter & Peneliti',
  },
  {
    id: 'alm-2',
    name: 'Siti Aminah, B.Des.',
    graduationYear: 'Lulusan 2012',
    title: 'Creative Director',
    currentRole: 'Creative Director di Agency ternama di Jakarta',
    bio: 'Memimpin kampanye sosial kreatif dan komunikasi visual dampak tinggi.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    categoryBadge: '120+ Insinyur & Kreatif',
  },
  {
    id: 'alm-3',
    name: 'Budi Santoso, S.Kom.',
    graduationYear: 'Lulusan 2015',
    title: 'Founder Startup Edutech',
    currentRole: 'CEO & Founder EduNusantara',
    bio: 'Memberdayakan ribuan guru di pelosok daerah melalui teknologi.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    categoryBadge: '30+ Praktisi Hukum & Tech',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    name: 'Lestari Wahyuni',
    role: 'Pengusaha & Aktivis Sosial (Alumni 1998)',
    quote: 'Fondasi akhlak dan disiplin yang saya dapatkan di MI AL-AHMAD adalah kunci kesuksesan saya hari ini. Para guru tidak hanya mengajar, tapi mendidik dengan hati.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't-2',
    name: 'Drs. Ridwan Hakim',
    role: 'Dosen Universitas Negeri (Alumni 2002)',
    quote: 'Lingkungan yang kompetitif namun tetap kekeluargaan membuat saya selalu rindu kembali ke sekolah ini. Terima kasih MI AL-AHMAD telah membentuk karakter saya.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
];

export const SCHOOL_INFO = {
  name: 'MI AL-AHMAD',
  fullName: 'Madrasah Ibtidaiyah AL-AHMAD',
  npsn: '69781234',
  nsm: '111235150001',
  accreditation: 'A (Unggul)',
  address: 'Jl. Raya Pendidikan No. 123, Kabupaten Sidoarjo, Jawa Timur 61254',
  phone: '(031) 8921-4567',
  whatsapp: '+62 812-3456-7890',
  email: 'info@mialahmad.sch.id',
  principalName: 'Hj. Siti Rahmah, M.Pd',
  principalMessage: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh.\nSelamat datang di portal resmi MI AL-AHMAD. Kami berkomitmen menyelenggarakan pendidikan dasar Islam yang mengintegrasikan kecerdasan intelektual, kedalaman spiritual Al-Qur\'an, serta penguasaan sains dan teknologi. Mari bersama membimbing generasi putra-putri kita menuju masa depan yang berakhlak mulia dan berprestasi unggul.',
  stats: {
    students: 480,
    teachers: 32,
    classes: 18,
    extracurriculars: 14,
  }
};

export const ANNOUNCEMENTS_DATA = [
  {
    id: 'ann-1',
    title: 'Informasi Pembukaan Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2024/2025',
    date: '10 Juni 2024',
    category: 'PPDB',
    isImportant: true,
  },
  {
    id: 'ann-2',
    title: 'Jadwal Penilaian Akhir Semester (PAS) Genap Madrasah Ibtidaiyah',
    date: '02 Juni 2024',
    category: 'Ujian',
    isImportant: true,
  },
  {
    id: 'ann-3',
    title: 'Surat Edaran Pelaksanaan Peringatan Hari Pendidikan Nasional dan Isra Mi\'raj',
    date: '25 Mei 2024',
    category: 'Kedinasan',
    isImportant: false,
  },
  {
    id: 'ann-4',
    title: 'Pengumuman Hasil Seleksi Lomba Tahfidz dan Seni Islami Antar Kelas',
    date: '18 Mei 2024',
    category: 'Kegiatan',
    isImportant: false,
  },
];

export const AGENDA_DATA = [
  {
    id: 'ag-1',
    dateDay: '15',
    dateMonth: 'JUN',
    title: 'Rapat Pleno Orang Tua Murid & Pembagian Raport Semester Genap',
    time: '08.00 - 12.00 WIB',
    location: 'Aula Utama MI AL-AHMAD',
  },
  {
    id: 'ag-2',
    dateDay: '24',
    dateMonth: 'JUN',
    title: 'Pelaksanaan Matsama (Masa Ta\'aruf Siswa Madrasah) Kelas 1 Baru',
    time: '07.00 - 11.00 WIB',
    location: 'Kampus MI AL-AHMAD',
  },
  {
    id: 'ag-3',
    dateDay: '05',
    dateMonth: 'JUL',
    title: 'Pemeriksaan Kesehatan Berkala Kerjasama dengan Puskesmas Setempat',
    time: '08.30 - 11.30 WIB',
    location: 'UKS Madrasah',
  },
];

