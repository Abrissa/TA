export type PageTab = 'beranda' | 'profil' | 'visi-misi' | 'guru' | 'alumni' | 'form-alumni' | 'prestasi' | 'artikel';

export interface Teacher {
  id: string;
  name: string;
  degree: string;
  role: string;
  subjects: string;
  imageUrl: string;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Provinsi' | 'Kabupaten' | 'Nasional' | 'Juara Umum' | 'Internasional' | 'Kecamatan' | 'Regional' | 'Se-Pulau Jawa' | string;
  date: string;
  description: string;
  winner: string;
  winnerRole?: string;
  imageUrl?: string;
  year?: string;
  rank?: string;
  event?: string;
  details?: string[];
  medals?: {
    gold?: number;
    silver?: number;
    bronze?: number;
    total?: number;
  };
  highlight?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Kegiatan' | 'Prestasi' | 'Informasi' | 'Edukasi';
  date: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  isFeatured?: boolean;
  readTime?: string;
  sourceUrl?: string;
  sourceName?: string;
  tags?: string[];
}

export interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: string;
  title: string;
  currentRole: string;
  bio: string;
  quote?: string;
  imageUrl: string;
  socialUrl?: string;
  categoryBadge?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}

export interface AlumniFormData {
  fullName: string;
  graduationYear: string;
  jobRole: string;
  photoUrl: string;
  socialMedia: string;
  message: string;
}

export interface PPDBFormData {
  childFullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  parentName: string;
  whatsapp: string;
  address: string;
  previousSchool: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Kedinasan' | 'PPDB' | 'Kegiatan' | 'Ujian';
  isImportant?: boolean;
  fileLink?: string;
}

export interface CalendarAgenda {
  id: string;
  dateDay: string;
  dateMonth: string;
  title: string;
  time: string;
  location: string;
}

