import { Teacher, Facility, Achievement, Article, AlumniProfile, Testimonial } from '../types';

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 't1',
    name: 'Drs. H. Ahmad Fauzi, M.Pd',
    degree: 'M.Pd',
    role: 'Kepala Sekolah & Guru Tahfidz',
    subjects: 'Kepemimpinan & Al-Qur\'an',
    imageUrl: '/assets/teachers/guru-1.svg',
  },
  {
    id: 't2',
    name: 'Siti Aminah, S.Pd.I',
    degree: 'S.Pd.I',
    role: 'Guru Bahasa Arab',
    subjects: 'Bahasa Arab & Adab',
    imageUrl: '/assets/teachers/guru-2.svg',
  },
  {
    id: 't3',
    name: 'Rahmat Hidayat, M.Sc',
    degree: 'M.Sc',
    role: 'Guru Matematika & IPA',
    subjects: 'Sains Eksperimental',
    imageUrl: '/assets/teachers/guru-3.svg',
  },
  {
    id: 't4',
    name: 'Hj. Nurul Jannah, S.Pd',
    degree: 'S.Pd',
    role: 'Guru Bahasa Inggris',
    subjects: 'English Literacy',
    imageUrl: '/assets/teachers/guru-4.svg',
  },
  {
    id: 't5',
    name: 'Ustadz Mansur, S.Th.I',
    degree: 'S.Th.I',
    role: 'Guru Fiqih & Akidah',
    subjects: 'Fiqih Ibadah & Akidah',
    imageUrl: '/assets/teachers/guru-5.svg',
  },
  {
    id: 't6',
    name: 'Indah Permata, S.E',
    degree: 'S.E',
    role: 'Guru SBdP & Prakarya',
    subjects: 'Seni Budaya & Kewirausahaan',
    imageUrl: '/assets/teachers/guru-6.svg',
  },
  {
    id: 't7',
    name: 'Yusuf Mahendra, S.Pd',
    degree: 'S.Pd',
    role: 'Guru PJOK',
    subjects: 'Pendidikan Jasmani & Olahraga',
    imageUrl: '/assets/teachers/guru-7.svg',
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
  {
    id: 'ach-karate-arkadewi-2024',
    title: 'Juara 1 Kumite -30 Kg SD Putri - International Karate Championship Yogyakarta Open VI',
    category: 'Internasional',
    date: '23-25 Agustus 2024',
    year: '2024',
    rank: 'Juara 1 (Medali Emas & Piagam Kemenpora RI)',
    event: 'International Karate Championship Yogyakarta Open Tournament VI "Kemenpora RI Cup"',
    winner: 'Arkadewi Laras Maulida',
    winnerRole: 'Atlet Karate Pelajar Putri (Kumite -30 Kg)',
    description:
      'Selamat dan sukses atas prestasi membanggakan yang diraih oleh ananda Arkadewi Laras Maulida meraih Juara 1 Medali Emas Kumite -30 Kg SD 3-4 Putri pada ajang bergengsi International Karate Championship Yogyakarta Open Tournament VI memperebutkan Piala Kemenpora RI di GOR Universitas Negeri Yogyakarta.',
    imageUrl: '/assets/prestasi-arkadewi-karate.jpg',
    highlight: 'Piala Kemenpora RI - Juara 1 Internasional',
    medals: {
      gold: 1,
      silver: 0,
      bronze: 0,
      total: 1,
    },
    details: [
      'Juara 1 Kumite -30 Kg SD 3-4 Putri',
      'Medali Emas & Piagam Prestasi Kemenpora RI',
      'International Karate Championship Yogyakarta Open Tournament VI',
      'GOR Universitas Negeri Yogyakarta (23-25 Agustus 2024)',
    ],
  },
  {
    id: 'ach-renang-zafar-azka-2024',
    title: 'Juara 1 & 2 Dolphin Fun Swimming Championship 2024',
    category: 'Regional',
    date: '10 Agustus 2024',
    year: '2024',
    rank: 'Juara 1 (Emas) & Juara 2 (Perak)',
    event: 'Dolphin Fun Swimming Championship 2024 Surabaya',
    winner: 'Zafar Mirza Wahyudin & Azka Haidar Amirudin',
    winnerRole: 'Siswa Berprestasi Cabang Akuatik/Renang Pelajar',
    description:
      'Torehan prestasi gemilang diraih oleh santri MI AL-AHMAD dalam ajang Dolphin Fun Swimming Championship 2024 di Kolam Renang UNESA Surabaya. Ananda Zafar Mirza Wahyudin sukses meraih Juara 1 (Medali Emas) dan ananda Azka Haidar Amirudin meraih Juara 2 (Medali Perak).',
    imageUrl: '/assets/prestasi-renang-zafar-azka.jpg',
    highlight: 'Borong Juara 1 & 2 Renang Pelajar',
    medals: {
      gold: 1,
      silver: 1,
      bronze: 0,
      total: 2,
    },
    details: [
      'Zafar Mirza Wahyudin - Juara 1 (Medali Emas)',
      'Azka Haidar Amirudin - Juara 2 (Medali Perak)',
      'Dolphin Fun Swimming Championship 2024',
      'Kolam Renang UNESA Lidah Wetan, Surabaya (10 Agustus 2024)',
    ],
  },
  {
    id: 'ach-catur-ghina-2024',
    title: 'Juara 3 Lomba Catur Tingkat SD/MI Bawah Putri Kecamatan Krian',
    category: 'Kecamatan',
    date: '26 Agustus 2024',
    year: '2024',
    rank: 'Juara 3 (Piala & Piagam Penghargaan PERCASI)',
    event: 'Lomba Catur Tingkat SD/MI Bawah Putri - Peringatan HUT RI Ke-79 Kecamatan Krian',
    winner: 'Ghina Arsyila',
    winnerRole: 'Siswi Berprestasi Cabang Catur Pelajar Putri',
    description:
      'Selamat dan bangga atas capaian ananda Ghina Arsyila yang berhasil menorehkan prestasi sebagai Juara 3 Lomba Catur Tingkat SD/MI Bawah Putri dalam rangka Peringatan Hari Besar Nasional HUT Kemerdekaan RI ke-79 di Kecamatan Krian yang diselenggarakan bersama PERCASI.',
    imageUrl: '/assets/prestasi-catur-ghina.jpg',
    highlight: 'Juara 3 Catur Putri Kecamatan Krian',
    details: [
      'Juara 3 Lomba Catur Tingkat SD/MI Bawah Putri',
      'Piala Kejuaraan & Piagam Resmi PERCASI & Panitia PHBN',
      'Peringatan HUT RI ke-79 Kecamatan Krian (26 Agustus 2024)',
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
  {
    id: 'art-karate-arkadewi-2024',
    title: 'Juara 1 Kumite Karate Putri International Yogyakarta Open VI Piala Kemenpora RI',
    excerpt:
      'Siswi MI AL-AHMAD, Arkadewi Laras Maulida sukses menyabet Medali Emas Juara 1 Kumite -30 Kg SD Putri di ajang bergengsi International Karate Championship Yogyakarta Open Tournament VI.',
    content: `Yogyakarta: Torehan prestasi membanggakan di tingkat internasional kembali dipersembahkan oleh santri putri MI AL-AHMAD. Ananda Arkadewi Laras Maulida berhasil keluar sebagai Juara 1 (Medali Emas) pada nomor Kumite -30 Kg SD 3-4 Putri dalam kejuaraan International Karate Championship Yogyakarta Open Tournament VI memperebutkan Piala Kemenpora RI di GOR UNY Yogyakarta.

Melalui perjuangan gigih menghadapi atlet-atlet karate terbaik dari berbagai perguruan dalam dan luar negeri, Arkadewi menunjukkan teknik pukulan dan tendangan yang akurat serta ketenangan bertanding yang luar biasa.

Kepala Madrasah mengungkapkan rasa syukur dan apresiasi tinggi atas capaian gemilang ini, membuktikan bahwa santri madrasah mampu berprestasi maksimal dalam seni bela diri di kancah internasional.`,
    category: 'Prestasi',
    date: '25 Agustus 2024',
    author: 'Kesiswaan & Olahraga',
    authorRole: 'Pembina Ekstrakurikuler Karate',
    imageUrl: '/assets/prestasi-arkadewi-karate.jpg',
    readTime: '3 menit baca',
    tags: ['Karate', 'Piala Kemenpora', 'Internasional', 'Medali Emas'],
  },
  {
    id: 'art-renang-zafar-azka-2024',
    title: 'Santri MI AL-AHMAD Borong Juara 1 & 2 Dolphin Fun Swimming Championship Surabaya',
    excerpt:
      'Zafar Mirza Wahyudin (Juara 1 Emas) dan Azka Haidar Amirudin (Juara 2 Perak) mengharumkan nama madrasah dalam kejuaraan renang pelajar di Kolam Renang UNESA.',
    content: `Surabaya: Prestasi membanggakan ditorehkan santri MI AL-AHMAD pada cabang olahraga akuatik. Dalam kejuaraan Dolphin Fun Swimming Championship 2024 yang diselenggarakan di Kolam Renang UNESA Surabaya, dua santri madrasah sukses memborong podium juara.

Ananda Zafar Mirza Wahyudin berhasil meraih Juara 1 (Medali Emas) dan ananda Azka Haidar Amirudin meraih Juara 2 (Medali Perak). Keduanya tampil impresif di nomor gaya dada dan gaya bebas pelajar dengan catatan waktu terbaik.

Pencapaian ini membuktikan efektivitas pembinaan minat dan bakat olahraga di lingkungan madrasah yang terus didorong untuk melahirkan atlet-atlet cilik berprestasi.`,
    category: 'Prestasi',
    date: '10 Agustus 2024',
    author: 'Tim Prestasi Olahraga',
    authorRole: 'Pelatih Renang Pelajar',
    imageUrl: '/assets/prestasi-renang-zafar-azka.jpg',
    readTime: '2 menit baca',
    tags: ['Renang Pelajar', 'Dolphin Championship', 'Medali Emas', 'UNESA'],
  },
  {
    id: 'art-catur-ghina-2024',
    title: 'Ghina Arsyila Raih Juara 3 Lomba Catur Putri SD/MI Peringatan HUT RI Kecamatan Krian',
    excerpt:
      'Ananda Ghina Arsyila menorehkan prestasi gemilang sebagai Juara 3 Lomba Catur Tingkat SD/MI Bawah Putri yang diselenggarakan bersama PERCASI Krian.',
    content: `Krian: Kemampuan strategi dan analisis langkah bidak catur santriwati MI AL-AHMAD membuahkan hasil manis. Ananda Ghina Arsyila sukses meraih Juara 3 dalam ajang Lomba Catur Tingkat SD/MI Bawah Putri yang diselenggarakan dalam rangka memperingati HUT Kemerdekaan RI ke-79 di Kecamatan Krian bersama PERCASI.

Menghadapi para pecatur cilik terbaik se-Kecamatan Krian, Ghina menunjukkan ketenangan luar biasa sepanjang ronde pertandingan dengan mengantongi kemenangan penting.

Prestasi ini menambah deretan piala kejuaraan yang berhasil dibawa pulang oleh para siswa MI AL-AHMAD di berbagai bidang kecerdasan dan ketangkasan.`,
    category: 'Prestasi',
    date: '26 Agustus 2024',
    author: 'Humas & Ekstrakurikuler',
    authorRole: 'Redaksi Madrasah',
    imageUrl: '/assets/prestasi-catur-ghina.jpg',
    readTime: '2 menit baca',
    tags: ['Catur Pelajar', 'PERCASI', 'Kecamatan Krian', 'HUT RI'],
  },
  {
    id: 'art-renang-azka-2025',
    title: 'Azka Haidar Amirudin Raih Juara 3 Lomba Renang Tingkat SD/MI Kecamatan Krian',
    excerpt:
      'Konsistensi prestasi cabang olahraga akuatik ditunjukkan kembali oleh Azka Haidar Amirudin dengan meraih Juara 3 Lomba Renang Pekan Olahraga HUT RI ke-80.',
    content: `Krian: Prestasi di cabang olahraga renang kembali dipersembahkan oleh ananda Azka Haidar Amirudin. Dalam ajang Pekan Olahraga HUT RI ke-80 tingkat SD/MI se-Kecamatan Krian, Azka sukses merebut Juara 3 sekaligus menambah koleksi medali akuatik madrasah.

Semangat juang dan kedisiplinan berlatih secara konsisten menjadi kunci ketangguhan Azka saat melintasi kolam renang dalam persaingan ketat antar pelajar.

Madrasah memberikan apresiasi setinggi-tingginya kepada para santri atlet dan orang tua wali murid yang senantiasa mendampingi pengembangan talenta putra-putri mereka.`,
    category: 'Prestasi',
    date: 'Tahun 2025',
    author: 'Kesiswaan & Olahraga',
    authorRole: 'Pembina Akuatik',
    imageUrl: '/assets/prestasi-azka-haidar.jpg',
    readTime: '2 menit baca',
    tags: ['Renang', 'Pekan Olahraga', 'HUT RI ke-80', 'Krian'],
  },
  {
    id: 'art-kegiatan-matsama-2026',
    title: 'Keseruan Matsama dan Pengenalan Budaya Qur\'ani Santri Baru MI AL-AHMAD',
    excerpt:
      'Ratusan santri baru mengikuti Masa Ta\'aruf Siswa Madrasah (Matsama) dengan antusias, diisi pengenalan tahfidz dan pembiasaan adab Islami.',
    content: `Krian: Suasana ceria dan penuh semangat menyelimuti kampus MI AL-AHMAD saat pelaksanaan Masa Ta'aruf Siswa Madrasah (Matsama) Tahun Ajaran 2026/2027. Sebanyak ratusan santri baru kelas satu disambut dengan hangat oleh seluruh dewan guru dan kakak kelas.

Rangkaian kegiatan Matsama dikemas edukatif dan menyenangkan melalui ice breaking, dongeng Islami, pengenalan lingkungan madrasah, pengenalan kurikulum merdeka terpadu tahfidz, serta pembiasaan doa dan adab harian.

Kepala Madrasah berpesan agar ananda santri baru senantiasa ceria, bersemangat menuntut ilmu, dan saling menyayangi antar sesama teman.`,
    category: 'Kegiatan',
    date: '15 Juli 2026',
    author: 'Tim Panitia Matsama',
    authorRole: 'Kesiswaan Madrasah',
    imageUrl: '/assets/gedung-mi-al-ahmad.jpg',
    readTime: '3 menit baca',
    tags: ['Matsama', 'Santri Baru', 'Kegiatan Siswa', 'Budaya Qurani'],
  },
  {
    id: 'art-informasi-ppdb-2026',
    title: 'Informasi Resmi Pembukaan PPDB Tahun Ajaran 2026/2027: Kuota dan Jalur Unggulan',
    excerpt:
      'Pendaftaran Peserta Didik Baru dibuka untuk Jalur Reguler, Prestasi Sains & Seni, serta Jalur Khusus Tahfidz Al-Qur\'an Juz 30.',
    content: `Krian: Panitia Penerimaan Peserta Didik Baru (PPDB) MI AL-AHMAD secara resmi mengumumkan pembukaan pendaftaran santri baru untuk Tahun Ajaran 2026/2027. Pada periode ini, madrasah membuka tiga jalur pendaftaran utama, yaitu Jalur Reguler Umum, Jalur Prestasi Sains & Seni, dan Jalur Beasiswa Khusus Tahfidz Al-Qur'an.

Calon wali murid dapat mendaftar secara online melalui portal resmi atau langsung datang ke sekretariat pendaftaran madrasah pada hari dan jam kerja. Kuota peserta didik sangat terbatas guna menjaga rasio ideal dan kualitas pembelajaran tatap muka.

Untuk konsultasi pendaftaran, madrasah menyediakan layanan responsif melalui WhatsApp resmi PPDB yang siap membantu orang tua dalam proses verifikasi berkas.`,
    category: 'Informasi',
    date: '01 Juni 2026',
    author: 'Panitia PPDB',
    authorRole: 'Pusat Informasi Madrasah',
    imageUrl: '/assets/gedung-mi-al-ahmad.jpg',
    readTime: '3 menit baca',
    tags: ['PPDB', 'Pendaftaran Santri', 'Tahfidz', 'Informasi Resmi'],
  },
  {
    id: 'art-edukasi-adab-2026',
    title: 'Membiasakan Adab Belajar Islami dan Karakter Mandiri Sejak Dini di Madrasah',
    excerpt:
      'Pentingnya sinergi antara madrasah dan keluarga dalam menanamkan cinta Al-Qur\'an, adab kepada guru, dan kemandirian santri.',
    content: `Krian: Menanamkan adab sebelum ilmu merupakan pondasi utama pendidikan karakter di MI AL-AHMAD. Dalam era digital yang penuh dinamika informasi, pembiasaan akhlakul karimah seperti menghormati guru dan orang tua, menjaga kebersihan, serta kejujuran menjadi benteng utama moral ananda.

Kepala Madrasah menekankan pentingnya sinergi yang harmonis antara lingkungan madrasah dan rumah. Kebiasaan membaca Al-Qur'an tartil, sholat dhuha berjamaah, dan disiplin waktu yang dilatih di madrasah perlu didukung dengan pembiasaan yang selaras di keluarga.

Dengan kolaborasi yang kuat, insyaAllah lahir generasi santri yang tidak hanya unggul secara akademis dan sains, namun juga kokoh spiritualitasnya.`,
    category: 'Edukasi',
    date: '20 Mei 2026',
    author: 'Drs. H. Ahmad Fauzi, M.Pd',
    authorRole: 'Kepala Madrasah',
    imageUrl: '/assets/gedung-mi-al-ahmad.jpg',
    readTime: '3 menit baca',
    tags: ['Edukasi', 'Karakter Qurani', 'Pendidikan Anak', 'Parenting Islami'],
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
    imageUrl: '/assets/alumni/alumni-1.svg',
    categoryBadge: '50+ Dokter & Peneliti',
  },
  {
    id: 'alm-2',
    name: 'Siti Aminah, B.Des.',
    graduationYear: 'Lulusan 2012',
    title: 'Creative Director',
    currentRole: 'Creative Director di Agency ternama di Jakarta',
    bio: 'Memimpin kampanye sosial kreatif dan komunikasi visual dampak tinggi.',
    imageUrl: '/assets/alumni/alumni-2.svg',
    categoryBadge: '120+ Insinyur & Kreatif',
  },
  {
    id: 'alm-3',
    name: 'Budi Santoso, S.Kom.',
    graduationYear: 'Lulusan 2015',
    title: 'Founder Startup Edutech',
    currentRole: 'CEO & Founder EduNusantara',
    bio: 'Memberdayakan ribuan guru di pelosok daerah melalui teknologi.',
    imageUrl: '/assets/alumni/alumni-3.svg',
    categoryBadge: '30+ Praktisi Hukum & Tech',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    name: 'Lestari Wahyuni',
    role: 'Pengusaha & Aktivis Sosial (Alumni 1998)',
    quote: 'Fondasi akhlak dan disiplin yang saya dapatkan di MI AL-AHMAD adalah kunci kesuksesan saya hari ini. Para guru tidak hanya mengajar, tapi mendidik dengan hati.',
    avatarUrl: '/assets/alumni/alumni-2.svg',
  },
  {
    id: 't-2',
    name: 'Drs. Ridwan Hakim',
    role: 'Dosen Universitas Negeri (Alumni 2002)',
    quote: 'Lingkungan yang kompetitif namun tetap kekeluargaan membuat saya selalu rindu kembali ke sekolah ini. Terima kasih MI AL-AHMAD telah membentuk karakter saya.',
    avatarUrl: '/assets/alumni/alumni-1.svg',
  },
];

export const SCHOOL_INFO = {
  name: 'MI AL-AHMAD',
  fullName: 'Madrasah Ibtidaiyah AL-AHMAD',
  npsn: '69781234',
  nsm: '111235150001',
  accreditation: 'A (Unggul)',
  address: 'Jl. Setiabudi No. 12, Krian, Kec. Krian, Kabupaten Sidoarjo, Jawa Timur 61262',
  phone: '(031) 8971234',
  whatsapp: '+62 812-3456-7890',
  email: 'info@mialahmad.sch.id',
  website: 'https://mialahmad.sch.id',
  socialInstagram: 'https://www.instagram.com/mialahmadkrian',
  socialFacebook: 'https://www.facebook.com/mialahmadkrian',
  socialYoutube: 'https://www.youtube.com/@mial-ahmadkrianofficial3604',
  socialTiktok: 'https://www.tiktok.com/@mialahmadkrian',
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

