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
    id: 'ach-iksc-2025',
    title: 'International Kangaroo Science Contest (IKSC) ke-18',
    category: 'Internasional',
    date: 'Tahun 2025',
    year: '2025',
    rank: '301 Medali (9 Emas, 74 Perak, 218 Perunggu)',
    event: 'International Kangaroo Science Contest (IKSC) 18th 2025',
    winner: 'Siswa - Siswi MI AL-AHMAD',
    winnerRole: 'Delegasi Sains Internasional',
    description:
      'Selamat atas prestasi gemilang yang diraih oleh siswa-siswi MI AL-AHMAD dalam ajang kompetisi sains bertaraf internasional IKSC 18th 2025 dengan memborong total 301 medali: 9 Gold, 74 Silver, dan 218 Bronze. #JAWARA Jaya Istimewa Berkah!',
    imageUrl: '/assets/prestasi-iksc-2025.jpg',
    highlight: '#JAWARA (Jaya Istimewa Berkah)',
    medals: {
      gold: 9,
      silver: 74,
      bronze: 218,
      total: 301,
    },
    details: [
      '9 Medali Emas (Gold)',
      '74 Medali Perak (Silver)',
      '218 Medali Perunggu (Bronze)',
      'Madrasah Maju, Bermutu, Mendunia',
    ],
  },
  {
    id: 'ach-paskibra-sancaka-2025',
    title: 'LKBB SANCAKA S3 2025 Tingkat SD/MI Se-Pulau Jawa',
    category: 'Se-Pulau Jawa',
    date: 'Tahun 2025',
    year: '2025',
    rank: 'Juara 2 Utama & Borong 6 Kategori Prestasi',
    event: 'LKBB SANCAKA S3 2025 Tingkat SD/MI Se-Pulau Jawa',
    winner: 'Tim Paskibra MI AL AHMAD (KOPASMILAD)',
    winnerRole: 'Regu Paskibra Tingkat SD/MI',
    description:
      'Selamat & Sukses atas torehan gemilang Tim Paskibra MI AL AHMAD (KOPASMILAD) di ajang LKBB SANCAKA S3 2025 Tingkat SD/MI Se-Pulau Jawa dengan memborong 6 piala kejuaraan bergengsi.',
    imageUrl: '/assets/prestasi-paskibra-kopasmilad.jpg',
    highlight: 'Tingkat SD/MI Se-Pulau Jawa',
    details: [
      'Juara 2 Utama + Medali 16',
      'Best Kostum 2',
      'Best Danton 1',
      'Best PBB 2',
      'Best Formasi 2',
      'Best Parade Danton 3',
    ],
  },
  {
    id: 'ach-azka-renang-2025',
    title: 'Juara 3 Lomba Renang SD/MI Kecamatan Krian',
    category: 'Kecamatan',
    date: 'Tahun 2025',
    year: '2025',
    rank: 'Juara 3 Renang (Piala & Piagam)',
    event: 'Lomba Renang Tingkat SD/MI Kecamatan Krian - Pekan Olahraga HUT RI ke-80',
    winner: 'Azka Haidar Amirudin',
    winnerRole: 'Siswa Berprestasi Cabang Akuatik/Renang',
    description:
      'Selamat dan sukses atas keberhasilan ananda Azka Haidar Amirudin meraih Juara 3 Lomba Renang Tingkat SD/MI Kecamatan Krian dalam rangka memperingati Pekan Olahraga HUT RI ke-80.',
    imageUrl: '/assets/prestasi-azka-haidar.jpg',
    highlight: 'Juara 3 Kecamatan (Piala & Piagam)',
    details: [
      'Juara 3 Lomba Renang SD/MI',
      'Pekan Olahraga HUT RI ke-80',
      'Tingkat Kecamatan Krian',
    ],
  },
];

export const HISTORICAL_MILESTONES = [
  {
    year: '2025',
    title: 'Prestasi Internasional & Se-Pulau Jawa',
    description:
      'Meraih 301 Medali di ajang International Kangaroo Science Contest (IKSC 2025) serta Juara 2 Utama dan 6 Kategori LKBB SANCAKA S3 Se-Pulau Jawa.',
  },
  {
    year: '2024',
    title: 'Juara 1 KSM Matematika & Renang Pelajar',
    description:
      'Juara 1 Kompetisi Sains Madrasah (KSM) Tingkat Kabupaten melaju ke Tingkat Provinsi dan Juara 3 Lomba Renang HUT RI ke-80.',
  },
  {
    year: '2023',
    title: 'Penghargaan Sekolah Adiwiyata',
    description:
      'Diakui secara resmi sebagai sekolah berbasis lingkungan yang sehat, asri, dan berwawasan lingkungan hidup.',
  },
  {
    year: '2021',
    title: 'Predikat Akreditasi \'A\' (Unggul)',
    description:
      'Mempertahankan standar mutu pendidikan dasar Islam tertinggi dengan akreditasi A oleh BAN-S/M.',
  },
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-maulana-ksm-2024',
    title: 'Maulana, Siswa MI dari Kabupaten Sidoarjo Tembus Kompetisi Sains Madrasah Tingkat Provinsi',
    excerpt:
      'Siswa kelas 5 MI Al-Ahmad Krian, Maulana Kenzie Adha Ariyanto berhasil meraih Juara 1 Kompetisi Sains Madrasah (KSM) bidang matematika tingkat Kabupaten Sidoarjo dan melaju ke tingkat provinsi.',
    content: `Jakarta: Siswa kelas 5 Madrasah Ibtidaiyah (MI) Al-Ahmad Krian, Maulana Kenzie Adha Ariyanto berhasil meraih Juara 1 Kompetisi Sains Madrasah (KSM) bidang matematika tingkat Kabupaten Sidoarjo. Keberhasilan itu membuat Maulana dapat melanjutkan kompetisi ke tingkat provinsi.

“Untuk persiapan ke tingkat provinsi harus terus belajar dan mengasah kemampuan dengan berlatih soal-soal,” kata Wakil Kepala Madrasah bidang Kurikulum, Aat Choiruddin, dikutip dari laman nu.or.id, Rabu, 10 Juli 2024.

Wakil Sekretaris Pengurus Cabang Nahdlatul Ulama (PCNU) Sidoarjo itu menyampaikan pada ajang resmi Kemenag ini, MI Al-Ahmad Krian mengirimkan masing-masing satu siswa pada bidang matematika dan Ilmu Pengetahuan Alam (IPA) Terpadu, serta satu grup kategori beregu.

"Mengikuti olimpiade terlebih resmi dari Kemenag sangat penting untuk meningkatkan kemampuan berpikir kritis dan problem solving serta memperoleh pengalaman mengikuti kompetisi sampai ke tingkat nasional,” ujar beliau.

Aat mengatakan setiap siswa MI Al-Ahmad berpotensi mengikuti olimpiade. Syaratnya, memiliki minat dan bakat di bidang yang dilombakan, belajar dengan tekun dan sungguh-sungguh, serta bergabung dengan komunitas olimpiade.

“Nah kebetulan di MI Al-Ahmad ada kelas program khusus olimpiade. Jika ingin berhasil di olimpiade juga harus sering-sering berlatih mengerjakan soal-soal,” ungkap dia.

Ia menjelaskan MI Al-Ahmad merupakan salah satu sekolah paling representatif di wilayah Sidoarjo Barat. Tidak hanya dari Krian, siswanya banyak dari kecamatan sekitar, seperti Balongbendo, Wonoayu, Prambon, bahkan Legundi Gresik.

Salah satu alasan orang tua menyekolahkan anaknya di MI Al-Ahmad karena memiliki program dan fasilitas lengkap. Selain itu, memiliki berbagai prestasi dengan layanan pendidikan istimewa, kelas khusus tahfiz, dan olimpiade.

“Peminat kelas-kelas tersebut dua kali lipat, sehingga harus dilakukan seleksi dan kurikulumnya juga didesain khusus agar hasilnya sesuai target yang diharapkan,” ungkap Aat.`,
    category: 'Prestasi',
    date: '10 Juli 2024',
    author: 'Renatha Swasty',
    authorRole: 'Jurnalis Medcom.id / Liputan Khusus',
    sourceName: 'Medcom.id & nu.or.id',
    sourceUrl: 'https://www.medcom.id/pendidikan/news-pendidikan/4KZ92W6k-maulana-siswa-mi-dari-kabupaten-sidoarjo-tembus-kompetisi-sains-madrasah-tingkat-provinsi',
    imageUrl: '/assets/berita-maulana-ksm.jpg',
    readTime: '3 menit baca',
    tags: ['KSM Sidoarjo', 'Olimpiade Matematika', 'Prestasi Santri', 'Kemenag', 'Provinsi Jatim'],
    isFeatured: true,
  },
  {
    id: 'art-iksc-2025',
    title: 'Prestasi Mendunia: Siswa MI AL-AHMAD Borong 301 Medali di Ajang Internasional IKSC 2025',
    excerpt:
      'Delegasi sains MI AL-AHMAD membuktikan kualitas pendidikan global dengan memborong total 301 medali (9 Emas, 74 Perak, dan 218 Perunggu) pada International Kangaroo Science Contest ke-18.',
    content: `Krian: Prestasi membanggakan di panggung internasional kembali diukir oleh santri-santri MI AL-AHMAD Krian. Dalam ajang bergengsi International Kangaroo Science Contest (IKSC) ke-18 tahun 2025, delegasi madrasah sukses memborong total 301 medali kejuaraan yang terdiri dari 9 Medali Emas (Gold), 74 Medali Perak (Silver), dan 218 Medali Perunggu (Bronze).

Kompetisi sains bertaraf internasional ini diikuti oleh ribuan peserta unggulan dari berbagai penjuru dunia. Keberhasilan delegasi MI AL-AHMAD membuktikan bahwa penguatan kurikulum sains terpadu yang dipadukan dengan pembinaan kelas olimpiade intensif mampu bersaing di panggung dunia.

Kepala Madrasah menyampaikan rasa syukur dan apresiasi mendalam atas kerja keras para siswa, guru pembina, dan dukungan penuh orang tua wali santri. Capaian ini sejalan dengan visi madrasah untuk mencetak generasi Qur'ani yang berakhlak mulia sekaligus unggul dalam sains dan teknologi berstandar global.

"Dengan semangat #JAWARA (Jaya Istimewa Berkah), MI AL-AHMAD berkomitmen terus mendampingi putra-putri bangsa untuk mewujudkan potensi terbaik mereka hingga ke tingkat dunia," tutur beliau.`,
    category: 'Prestasi',
    date: 'Tahun 2025',
    author: 'Tim Humas Madrasah',
    authorRole: 'Humas & Informasi Publik',
    imageUrl: '/assets/prestasi-iksc-2025.jpg',
    readTime: '3 menit baca',
    tags: ['IKSC 2025', 'Sains Internasional', '301 Medali', '#JAWARA'],
  },
  {
    id: 'art-paskibra-sancaka-2025',
    title: 'KOPASMILAD MI AL-AHMAD Sabet Juara 2 Utama & Borong 6 Gelar LKBB SANCAKA S3 Se-Pulau Jawa',
    excerpt:
      'Regu Paskibra KOPASMILAD tampil memukau di ajang LKBB SANCAKA S3 2025 tingkat SD/MI se-Pulau Jawa dengan memboyong Juara 2 Utama, Best Danton, Best Kostum, Best PBB, dan Best Formasi.',
    content: `Krian: Penampilan memukau dan formasi baris-berbaris yang presisi berhasil mengantarkan Tim Paskibra MI AL-AHMAD (KOPASMILAD) meraih prestasi gemilang pada ajang LKBB SANCAKA S3 2025 tingkat SD/MI Se-Pulau Jawa.

Dalam perlombaan yang diikuti oleh regu-regu terbaik dari berbagai provinsi di Pulau Jawa ini, KOPASMILAD berhasil memborong enam piala dan penghargaan bergengsi, yaitu Juara 2 Utama + 16 Medali, Best Kostum 2, Best Danton 1, Best PBB 2, Best Formasi 2, serta Best Parade Danton 3.

Kekompakan gerakan, ketegasan instruksi komandan peleton, serta kostum elegan bernuansa merah putih kebanggaan madrasah memukau para juri dan penonton yang memadati arena lomba.

Pembina ekstrakurikuler Paskibra mengungkapkan bahwa disiplin tinggi, latihan teratur, dan penanaman nilai-nilai kepemimpinan sejak dini menjadi kunci sukses tim dalam menorehkan prestasi gemilang ini.`,
    category: 'Prestasi',
    date: 'Tahun 2025',
    author: 'Kesiswaan & Ekstrakurikuler',
    authorRole: 'Pelatih KOPASMILAD',
    imageUrl: '/assets/prestasi-paskibra-kopasmilad.jpg',
    readTime: '2 menit baca',
    tags: ['Paskibra', 'LKBB Sancaka', 'Se-Pulau Jawa', 'KOPASMILAD'],
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

