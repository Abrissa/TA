export type PageTab = 'beranda' | 'profil' | 'visi-misi' | 'guru' | 'alumni' | 'form-alumni' | 'prestasi' | 'artikel' | 'ppdb';

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
  id: string | number;
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
  isHighlighted?: boolean;
}

export interface Article {
  id: string | number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: 'Kegiatan' | 'Prestasi' | 'Informasi' | 'Edukasi';
  date?: string;
  publishedAt?: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  isFeatured?: boolean;
  readTime?: string;
  sourceUrl?: string;
  sourceName?: string;
  tags?: string[];
  status?: 'published' | 'draft';
}

export interface AlumniProfile {
  id: string | number;
  name: string;
  graduationYear: string;
  title: string;
  currentRole: string;
  profession?: string;
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
  currentRole?: string;
  photoUrl: string;
  socialMedia: string;
  message: string;
  phone?: string;
  email?: string;
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

