import { env } from '../config/env';
import {
  Article,
  Achievement,
  Teacher,
  Facility,
  AlumniProfile,
  AlumniFormData,
  PPDBFormData,
  Announcement,
  CalendarAgenda
} from '../types';
import {
  ARTICLES_DATA,
  ACHIEVEMENTS_DATA,
  TEACHERS_DATA,
  FACILITIES_DATA,
  ALUMNI_DATA,
  SCHOOL_INFO,
} from '../data/mockData';
import { isNetworkError, mockAdminStore } from './mockAdminData';

export interface SchoolProfileData {
  id: number;
  name: string;
  npsn: string;
  accreditation: string;
  tagline: string;
  description: string;
  vision: string;
  mission: string[];
  objectives: string[];
  principal_name: string;
  principal_greeting: string;
  principal_image_url: string;
  logo_url: string;
  hero_image_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_embed_url: string;
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  social_tiktok: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  last_login_at: string | null;
}

export interface AdminStats {
  total_articles: number;
  total_achievements: number;
  total_teachers: number;
  total_ppdb: number;
  pending_ppdb: number;
  pending_alumni: number;
  total_admins: number;
}

export interface PpdbRecord {
  id: number;
  registration_number: string;
  child_full_name: string;
  gender: 'Laki-laki' | 'Perempuan';
  birth_place: string;
  birth_date: string;
  parent_name: string;
  whatsapp: string;
  address: string;
  previous_school: string | null;
  status: 'menunggu_verifikasi' | 'terverifikasi' | 'diterima' | 'ditolak';
  admin_notes: string | null;
  registered_at: string;
  reviewed_at: string | null;
  reviewer?: { name: string } | null;
}

export interface AlumniSubmissionRecord {
  id: number;
  full_name: string;
  graduation_year: string;
  job_role: string;
  photo_url: string | null;
  social_media: string | null;
  phone: string | null;
  email: string | null;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewer?: { name: string } | null;
}

export interface MasterAcademicYear {
  id: number;
  code: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface MasterCategory {
  id: number;
  type: 'article' | 'achievement' | 'announcement';
  name: string;
  slug: string;
  badge_color: string;
  description: string | null;
  is_active: boolean;
}

export interface MasterPpdbPath {
  id: number;
  code: string;
  name: string;
  description: string | null;
  quota: number;
  is_active: boolean;
}

export interface MasterDataResponse {
  academic_years: MasterAcademicYear[];
  categories: MasterCategory[];
  ppdb_paths: MasterPpdbPath[];
  cohorts: Array<{ id: number; year: string; name: string; motto: string | null }>;
  roles: Array<{ id: number; code: string; name: string; description: string | null }>;
}

export const BASE_URL = env.apiBaseUrl || 'http://127.0.0.1:8000';

export const resolveImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/storage/') || trimmed.startsWith('storage/')) {
    const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${BASE_URL}${clean}`;
  }
  if (trimmed.startsWith('/assets/') || trimmed.startsWith('assets/')) {
    const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return clean;
  }
  if (trimmed.endsWith('.png') || trimmed.endsWith('.jpg') || trimmed.endsWith('.jpeg') || trimmed.endsWith('.svg') || trimmed.endsWith('.webp')) {
    return trimmed.startsWith('/') ? `/assets${trimmed}` : `/assets/${trimmed}`;
  }
  return trimmed;
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mi_admin_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // -------------------------------------------------------------
  // Public Portal Endpoints
  // -------------------------------------------------------------
  async getProfile(): Promise<SchoolProfileData> {
    const s = mockAdminStore.getSettings();
    try {
      const res = await fetch(`${BASE_URL}/api/v1/profile`);
      const json = await handleResponse<{ success: boolean; data: SchoolProfileData }>(res);
      const p = json.data;
      if (p) {
        p.logo_url = resolveImageUrl(p.logo_url) || '/assets/logo-mi-al-ahmad.png';
        p.hero_image_url = resolveImageUrl(p.hero_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
        p.principal_image_url = resolveImageUrl(p.principal_image_url) || '/assets/principal.png';
        return p;
      }
    } catch (e) {
      console.warn('API getProfile failed, fallback to local settings:', e);
    }
    return {
      id: 1,
      name: s.school_name || SCHOOL_INFO.name,
      npsn: s.school_npsn || SCHOOL_INFO.npsn,
      accreditation: s.school_accreditation || SCHOOL_INFO.accreditation,
      tagline: s.school_tagline || 'Madrasah Maju, Bermutu, Mendunia',
      description: s.principal_greeting || SCHOOL_INFO.principalMessage,
      vision: s.vision_text || 'Menjadi Madrasah Ibtidaiyah Unggul Berbasis Karakter Qur\'ani dan IPTEK.',
      mission: [
        s.mission_1_desc || 'Menanamkan nilai-nilai keislaman dan akhlakul karimah.',
        s.mission_2_desc || 'Mengembangkan potensi akademik dan non-akademik.',
        s.mission_3_desc || 'Pengembangan minat, bakat, dan teknologi modern.'
      ],
      objectives: ['Mencetak lulusan hafidz minimal 1 juz.', 'Berprestasi di tingkat kabupaten hingga internasional.'],
      principal_name: s.principal_name || SCHOOL_INFO.principalName,
      principal_greeting: s.principal_greeting || SCHOOL_INFO.principalMessage,
      principal_image_url: s.principal_image_url || '/assets/principal.png',
      logo_url: s.school_logo_url || '/assets/logo-mi-al-ahmad.png',
      hero_image_url: s.hero_image_url || '/assets/gedung-mi-al-ahmad.jpg',
      phone: s.school_phone || SCHOOL_INFO.phone,
      whatsapp: s.school_whatsapp || SCHOOL_INFO.whatsapp,
      email: s.school_email || SCHOOL_INFO.email,
      address: s.school_address || SCHOOL_INFO.address,
      maps_embed_url: s.maps_embed_url || '',
      social_instagram: s.social_instagram || SCHOOL_INFO.socialInstagram,
      social_facebook: s.social_facebook || SCHOOL_INFO.socialFacebook,
      social_youtube: s.social_youtube || SCHOOL_INFO.socialYoutube,
      social_tiktok: s.social_tiktok || SCHOOL_INFO.socialTiktok,
    };
  },

  async getSettings(): Promise<Record<string, string>> {
    const local = mockAdminStore.getSettings();
    try {
      const res = await fetch(`${BASE_URL}/api/v1/settings`);
      const json = await handleResponse<{ success: boolean; data: Record<string, string> }>(res);
      const data = json.data || {};
      const merged: Record<string, string> = { ...local };
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          merged[k] = String(v);
        }
      });
      merged.school_logo_url = resolveImageUrl(merged.school_logo_url) || '/assets/logo-mi-al-ahmad.png';
      merged.hero_image_url = resolveImageUrl(merged.hero_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
      merged.hero_students_image_url = resolveImageUrl(merged.hero_students_image_url) || '/assets/hero-students.png';
      merged.principal_image_url = resolveImageUrl(merged.principal_image_url) || '/assets/principal.png';
      merged.vision_image_url = resolveImageUrl(merged.vision_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
      return merged;
    } catch (e) {
      local.school_logo_url = resolveImageUrl(local.school_logo_url) || '/assets/logo-mi-al-ahmad.png';
      local.hero_image_url = resolveImageUrl(local.hero_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
      local.hero_students_image_url = resolveImageUrl(local.hero_students_image_url) || '/assets/hero-students.png';
      local.principal_image_url = resolveImageUrl(local.principal_image_url) || '/assets/principal.png';
      local.vision_image_url = resolveImageUrl(local.vision_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
      return local;
    }
  },

  async getArticles(category?: string): Promise<Article[]> {
    try {
      const url = new URL(`${BASE_URL}/api/v1/articles`);
      if (category && category !== 'Semua') {
        url.searchParams.set('category', category);
      }
      const res = await fetch(url.toString());
      const json = await handleResponse<{ success: boolean; data: any[] }>(res);
      if (json.data && json.data.length > 0) {
        return json.data.map((art: any) => ({
          ...art,
          id: String(art.id),
          imageUrl: resolveImageUrl(art.imageUrl || art.image_url) || '/assets/berita-maulana-ksm.jpg',
          authorRole: art.authorRole || art.author_role || '',
          readTime: art.readTime || art.read_time || '3 menit baca',
          isFeatured: Boolean(art.isFeatured ?? art.is_featured),
        }));
      }
    } catch (e) {
      console.warn('API getArticles failed, using local/mock data:', e);
    }
    const articles = mockAdminStore.getArticles();
    const filtered = category && category !== 'Semua'
      ? articles.filter((a) => a.category === category)
      : articles;
    return filtered.map((art) => ({
      ...art,
      id: String(art.id),
      imageUrl: resolveImageUrl(art.imageUrl) || '/assets/berita-maulana-ksm.jpg',
      authorRole: art.authorRole || '',
      readTime: art.readTime || '3 menit baca',
      isFeatured: Boolean(art.isFeatured),
    }));
  },

  async getArticleDetail(slug: string): Promise<{ article: Article; related: Article[] }> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/articles/${encodeURIComponent(slug)}`);
      const json = await handleResponse<{ success: boolean; data: any; related: any[] }>(res);
      const mapArt = (art: any): Article => ({
        ...art,
        id: String(art.id),
        imageUrl: resolveImageUrl(art.imageUrl || art.image_url) || '/assets/berita-maulana-ksm.jpg',
        authorRole: art.authorRole || art.author_role || '',
        readTime: art.readTime || art.read_time || '3 menit baca',
        isFeatured: Boolean(art.isFeatured ?? art.is_featured),
      });
      if (json.data) {
        return {
          article: mapArt(json.data),
          related: (json.related || []).map(mapArt),
        };
      }
    } catch (e) {
      console.warn('API getArticleDetail failed, using local/mock data:', e);
    }
    const articles = mockAdminStore.getArticles();
    const found = articles.find((a) => String(a.id) === slug || a.slug === slug || a.title === slug) || articles[0];
    const related = articles.filter((a) => a.id !== found.id).slice(0, 3);
    return { article: found, related };
  },

  async getAchievements(): Promise<Achievement[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/achievements`);
      const json = await handleResponse<{ success: boolean; data: any[] }>(res);
      if (json.data && json.data.length > 0) {
        return json.data.map((ach: any) => ({
          ...ach,
          id: String(ach.id),
          imageUrl: resolveImageUrl(ach.imageUrl || ach.image_url) || '/assets/prestasi-iksc-2025.jpg',
          winnerRole: ach.winnerRole || ach.winner_role || '',
          isHighlighted: Boolean(ach.isHighlighted ?? ach.is_highlighted),
        }));
      }
    } catch (e) {
      console.warn('API getAchievements failed, using local/mock data:', e);
    }
    return mockAdminStore.getAchievements().map((ach) => ({
      ...ach,
      id: String(ach.id),
      imageUrl: resolveImageUrl(ach.imageUrl) || '/assets/prestasi-iksc-2025.jpg',
      winnerRole: ach.winnerRole || '',
      isHighlighted: Boolean(ach.isHighlighted),
    }));
  },

  async getTeachers(): Promise<Teacher[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/teachers`);
      const json = await handleResponse<{ success: boolean; data: any[] }>(res);
      if (json.data && json.data.length > 0) {
        return json.data.map((t: any, idx: number) => ({
          ...t,
          id: String(t.id),
          imageUrl: resolveImageUrl(t.imageUrl || t.image_url) || `/assets/teachers/guru-${(idx % 7) + 1}.svg`,
        }));
      }
    } catch (e) {
      console.warn('API getTeachers failed, using mock data:', e);
    }
    return TEACHERS_DATA.map((t, idx) => ({
      ...t,
      id: String(t.id),
      imageUrl: resolveImageUrl(t.imageUrl) || `/assets/teachers/guru-${(idx % 7) + 1}.svg`,
    }));
  },

  async getFacilities(): Promise<Facility[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/facilities`);
      const json = await handleResponse<{ success: boolean; data: Facility[] }>(res);
      if (json.data && json.data.length > 0) return json.data;
    } catch (e) {
      console.warn('API getFacilities failed, using mock data:', e);
    }
    return FACILITIES_DATA;
  },

  async getAlumni(): Promise<AlumniProfile[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/alumni`);
      const json = await handleResponse<{ success: boolean; data: any[] }>(res);
      if (json.data && json.data.length > 0) {
        return json.data.map((alm: any, idx: number) => ({
          ...alm,
          id: String(alm.id),
          imageUrl: resolveImageUrl(alm.imageUrl || alm.image_url) || `/assets/alumni/alumni-${(idx % 3) + 1}.svg`,
          graduationYear: alm.graduationYear || (alm.graduation_year ? String(alm.graduation_year).replace(/^[^\d]*/, '') : ''),
          profession: alm.profession || alm.current_role || alm.title || '',
          currentRole: alm.currentRole || alm.current_role || alm.title || '',
          quote: alm.quote || alm.bio || '',
        }));
      }
    } catch (e) {
      console.warn('API getAlumni failed, using mock data:', e);
    }

    const approvedSubmissions = mockAdminStore.getAlumniSubmissions('approved');
    const submissionProfiles: AlumniProfile[] = approvedSubmissions.map((sub, idx) => ({
      id: `sub-${sub.id}`,
      name: sub.full_name,
      graduationYear: String(sub.graduation_year || '').replace(/^[^\d]*/, ''),
      title: sub.job_role,
      profession: sub.job_role,
      currentRole: sub.job_role,
      bio: sub.message,
      quote: sub.message,
      imageUrl: resolveImageUrl(sub.photo_url) || `/assets/alumni/alumni-${(idx % 3) + 1}.svg`,
      socialUrl: sub.social_media || undefined,
      categoryBadge: 'Alumni Berprestasi',
    }));

    const baseProfiles: AlumniProfile[] = ALUMNI_DATA.map((alm, idx) => ({
      ...alm,
      id: String(alm.id),
      imageUrl: resolveImageUrl(alm.imageUrl) || `/assets/alumni/alumni-${(idx % 3) + 1}.svg`,
      graduationYear: String(alm.graduationYear || '').replace(/^[^\d]*/, ''),
      profession: alm.profession || alm.currentRole || alm.title || '',
      currentRole: alm.currentRole || alm.title || '',
      quote: alm.quote || alm.bio || '',
    }));

    return [...submissionProfiles, ...baseProfiles];
  },


  async submitAlumniForm(data: AlumniFormData): Promise<{ id: number; status: string; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/alumni/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (e: any) {
      if (isNetworkError(e)) {
        const item = mockAdminStore.addAlumniSubmission({
          full_name: data.fullName,
          graduation_year: data.graduationYear,
          job_role: data.currentRole,
          photo_url: data.photoUrl,
          social_media: data.socialMedia,
          phone: data.phone,
          email: data.email,
          message: data.message,
        });
        return {
          id: item.id,
          status: 'success',
          message: 'Data alumni berhasil dikirim dan tersimpan di sistem moderasi.',
        };
      }
      throw e;
    }
  },

  async submitPpdbForm(data: PPDBFormData): Promise<{ registration_number: string; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/ppdb/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (e: any) {
      if (isNetworkError(e)) {
        const reg = mockAdminStore.addPpdbSubmission({
          child_full_name: data.childFullName,
          gender: data.gender,
          birth_place: data.birthPlace,
          birth_date: data.birthDate,
          parent_name: data.parentName,
          whatsapp: data.whatsapp,
          address: data.address,
          previous_school: data.previousSchool || null,
        });
        return {
          registration_number: reg.registration_number,
          message: 'Pendaftaran PPDB berhasil diserahkan. Silakan simpan nomor registrasi Anda.',
        };
      }
      throw e;
    }
  },

  // -------------------------------------------------------------
  // Authentication Endpoints
  // -------------------------------------------------------------
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await handleResponse<{ success: boolean; data: { token: string; user: AdminUser } }>(res);
      localStorage.setItem('mi_admin_token', json.data.token);
      localStorage.setItem('mi_admin_user', JSON.stringify(json.data.user));
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const mockAuth = mockAdminStore.login(email, password);
        if (mockAuth) {
          localStorage.setItem('mi_admin_token', mockAuth.token);
          localStorage.setItem('mi_admin_user', JSON.stringify(mockAuth.user));
          return mockAuth;
        }
        throw new Error('Email atau kata sandi tidak cocok. Gunakan kredensial pengujian yang tertera di bawah.');
      }
      throw err;
    }
  },

  async getMe(): Promise<AdminUser> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: AdminUser }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const stored = this.getStoredUser();
        if (stored) return stored;
      }
      throw err;
    }
  },

  getStoredUser(): AdminUser | null {
    try {
      const data = localStorage.getItem('mi_admin_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  hasToken(): boolean {
    return Boolean(localStorage.getItem('mi_admin_token'));
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('mi_admin_token');
      localStorage.removeItem('mi_admin_user');
    }
  },

  // -------------------------------------------------------------
  // Admin Dashboard Endpoints
  // -------------------------------------------------------------
  async getDashboardStats(): Promise<{
    stats: AdminStats;
    recent_ppdb: PpdbRecord[];
    recent_alumni: AlumniSubmissionRecord[];
    recent_articles: Article[];
  }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: any }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.getDashboardData();
      }
      throw err;
    }
  },

  async getAdminSettings(): Promise<Record<string, Array<{ key: string; value: string; label: string; type: string }>>> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: any }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return {};
      }
      throw err;
    }
  },

  async updateAdminSettings(settings: Array<{ key: string; value: boolean | string }>): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ settings }),
      });
      await handleResponse(res);
      mockAdminStore.updateSettings(settings);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.updateSettings(settings);
        return;
      }
      throw err;
    }
  },

  async getAdminSchoolProfile(): Promise<SchoolProfileData> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/school-profile`, {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: SchoolProfileData }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return this.getProfile();
      }
      throw err;
    }
  },

  async updateAdminSchoolProfile(data: Partial<SchoolProfileData>): Promise<SchoolProfileData> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/school-profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await handleResponse<{ success: boolean; data: SchoolProfileData }>(res);
      const updated = json.data;
      try {
        localStorage.setItem('mi_school_profile', JSON.stringify(updated));
      } catch { }
      const syncList: Array<{ key: string; value: string }> = [];
      if (updated.name) syncList.push({ key: 'school_name', value: updated.name });
      if (updated.tagline) syncList.push({ key: 'school_tagline', value: updated.tagline });
      if (updated.phone) syncList.push({ key: 'school_phone', value: updated.phone });
      if (updated.email) syncList.push({ key: 'school_email', value: updated.email });
      if (updated.address) syncList.push({ key: 'school_address', value: updated.address });
      if (syncList.length > 0) mockAdminStore.updateSettings(syncList);
      return updated;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const current = await this.getProfile();
        const updated = { ...current, ...data };
        try {
          localStorage.setItem('mi_school_profile', JSON.stringify(updated));
        } catch { }
        const syncList: Array<{ key: string; value: string }> = [];
        if (updated.name) syncList.push({ key: 'school_name', value: updated.name });
        if (updated.tagline) syncList.push({ key: 'school_tagline', value: updated.tagline });
        if (updated.phone) syncList.push({ key: 'school_phone', value: updated.phone });
        if (updated.email) syncList.push({ key: 'school_email', value: updated.email });
        if (updated.address) syncList.push({ key: 'school_address', value: updated.address });
        if (syncList.length > 0) mockAdminStore.updateSettings(syncList);
        return updated;
      }
      throw err;
    }
  },

  async getAdminArticles(): Promise<Article[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/articles?per_page=100`, {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: Article[] }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.getArticles();
      }
      throw err;
    }
  },

  async saveArticle(article: Partial<Article>, id?: number): Promise<Article> {
    const url = id ? `${BASE_URL}/api/admin/articles/${id}` : `${BASE_URL}/api/admin/articles`;
    const method = id ? 'PUT' : 'POST';
    const payload = {
      ...article,
      image_url: article.imageUrl ?? (article as any).image_url,
      author_role: article.authorRole ?? (article as any).author_role ?? 'Redaksi',
      is_featured: article.isFeatured ?? false,
      read_time: article.readTime ?? '3 menit',
    };
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await handleResponse<{ success: boolean; data: Article }>(res);
      mockAdminStore.saveArticle(json.data, id);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.saveArticle(article, id);
      }
      throw err;
    }
  },

  async deleteArticle(id: number): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await handleResponse(res);
      mockAdminStore.deleteArticle(id);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.deleteArticle(id);
        return;
      }
      throw err;
    }
  },

  async getAdminAchievements(category?: string, search?: string): Promise<Achievement[]> {
    const url = new URL(`${BASE_URL}/api/admin/achievements`);
    if (category && category !== 'Semua') url.searchParams.set('category', category);
    if (search) url.searchParams.set('search', search);

    try {
      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: any[] }>(res);
      return (json.data || []).map((ach: any) => ({
        ...ach,
        id: String(ach.id),
        imageUrl: resolveImageUrl(ach.imageUrl || ach.image_url) || '/assets/prestasi-iksc-2025.jpg',
        winnerRole: ach.winnerRole || ach.winner_role || '',
        isHighlighted: Boolean(ach.isHighlighted ?? ach.is_highlighted),
      }));
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.getAchievements(category, search);
      }
      throw err;
    }
  },

  async saveAchievement(data: Partial<Achievement>, id?: string | number): Promise<Achievement> {
    const url = id ? `${BASE_URL}/api/admin/achievements/${id}` : `${BASE_URL}/api/admin/achievements`;
    const method = id ? 'PUT' : 'POST';
    const payload = {
      ...data,
      image_url: data.imageUrl ?? (data as any).image_url,
      winner_role: data.winnerRole ?? (data as any).winner_role,
      is_highlighted: data.isHighlighted ?? (data as any).is_highlighted ?? false,
    };
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await handleResponse<{ success: boolean; data: Achievement }>(res);
      mockAdminStore.saveAchievement(json.data, id);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.saveAchievement(data, id);
      }
      throw err;
    }
  },

  async deleteAchievement(id: string | number): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/achievements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await handleResponse(res);
      mockAdminStore.deleteAchievement(id);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.deleteAchievement(id);
        return;
      }
      throw err;
    }
  },

  async getAdminPpdb(status?: string, search?: string): Promise<{
    data: PpdbRecord[];
    status_counts: Record<string, number>;
  }> {
    const url = new URL(`${BASE_URL}/api/admin/ppdb/registrations`);
    if (status && status !== 'all') url.searchParams.set('status', status);
    if (search) url.searchParams.set('search', search);

    try {
      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.getPpdb(status, search);
      }
      throw err;
    }
  },

  async updatePpdbStatus(id: number, status: string, adminNotes?: string): Promise<PpdbRecord> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/ppdb/registrations/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      const json = await handleResponse<{ success: boolean; data: PpdbRecord }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.updatePpdbStatus(id, status, adminNotes);
      }
      throw err;
    }
  },

  async deletePpdbRecord(id: number): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/ppdb/registrations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.deletePpdbRecord(id);
        return;
      }
      throw err;
    }
  },

  async getAdminAlumniSubmissions(status?: string): Promise<AlumniSubmissionRecord[]> {
    const url = new URL(`${BASE_URL}/api/admin/alumni/submissions`);
    if (status && status !== 'all') url.searchParams.set('status', status);

    try {
      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: AlumniSubmissionRecord[] }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.getAlumniSubmissions(status);
      }
      throw err;
    }
  },

  async updateAlumniSubmissionStatus(
    id: number,
    status: 'approved' | 'rejected',
    publishToDirectory: boolean,
    notes?: string
  ): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/alumni/submissions/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
          publish_to_directory: publishToDirectory,
          notes,
        }),
      });
      await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.updateAlumniSubmission(id, status, notes);
        return;
      }
      throw err;
    }
  },

  async deleteAlumniSubmission(id: number): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/alumni/submissions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.deleteAlumniSubmission(id);
        return;
      }
      throw err;
    }
  },

  async getMasterData(): Promise<MasterDataResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/master-data`, {
        headers: getAuthHeaders(),
      });
      const json = await handleResponse<{ success: boolean; data: MasterDataResponse }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return mockAdminStore.getMasterData();
      }
      throw err;
    }
  },

  async setActiveAcademicYear(id: number): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/master-data/academic-years/${id}/set-active`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.setActiveAcademicYear(id);
        return;
      }
      throw err;
    }
  },

  async updatePpdbPath(id: number, data: Partial<MasterPpdbPath>): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/master-data/ppdb-paths/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminStore.updatePpdbPath(id, data);
        return;
      }
      throw err;
    }
  },

  async uploadMedia(file: File, folder = 'articles'): Promise<{ path: string; url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem('mi_admin_token');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/media/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const json = await handleResponse<{ success: boolean; data: { path: string; url: string; filename: string } }>(res);
      return json.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            resolve({
              path: dataUrl,
              url: dataUrl,
              filename: file.name,
            });
          };
          reader.onerror = () => {
            resolve({
              path: '/assets/gedung-mi-al-ahmad.jpg',
              url: '/assets/gedung-mi-al-ahmad.jpg',
              filename: file.name,
            });
          };
          reader.readAsDataURL(file);
        });
      }
      throw err;
    }
  },

  resolveImageUrl,
};
