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
    const res = await fetch(`${BASE_URL}/api/v1/profile`);
    const json = await handleResponse<{ success: boolean; data: SchoolProfileData }>(res);
    const p = json.data;
    if (p) {
      p.logo_url = resolveImageUrl(p.logo_url) || '/assets/logo-mi-al-ahmad.png';
      p.hero_image_url = resolveImageUrl(p.hero_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
      p.principal_image_url = resolveImageUrl(p.principal_image_url) || '/assets/principal.png';
    }
    return p;
  },

  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${BASE_URL}/api/v1/settings`);
    const json = await handleResponse<{ success: boolean; data: Record<string, string> }>(res);
    const data = json.data || {};
    data.school_logo_url = resolveImageUrl(data.school_logo_url) || '/assets/logo-mi-al-ahmad.png';
    data.hero_image_url = resolveImageUrl(data.hero_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
    data.hero_students_image_url = resolveImageUrl(data.hero_students_image_url) || '/assets/hero-students.png';
    data.principal_image_url = resolveImageUrl(data.principal_image_url) || '/assets/principal.png';
    data.vision_image_url = resolveImageUrl(data.vision_image_url) || '/assets/gedung-mi-al-ahmad.jpg';
    return data;
  },

  async getArticles(category?: string): Promise<Article[]> {
    const url = new URL(`${BASE_URL}/api/v1/articles`);
    if (category && category !== 'Semua') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString());
    const json = await handleResponse<{ success: boolean; data: any[] }>(res);
    return (json.data || []).map((art: any) => ({
      ...art,
      id: String(art.id),
      imageUrl: resolveImageUrl(art.imageUrl || art.image_url) || '/assets/berita-maulana-ksm.jpg',
      authorRole: art.authorRole || art.author_role || '',
      readTime: art.readTime || art.read_time || '3 menit baca',
      isFeatured: Boolean(art.isFeatured ?? art.is_featured),
    }));
  },

  async getArticleDetail(slug: string): Promise<{ article: Article; related: Article[] }> {
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
    return {
      article: mapArt(json.data),
      related: (json.related || []).map(mapArt),
    };
  },

  async getAchievements(): Promise<Achievement[]> {
    const res = await fetch(`${BASE_URL}/api/v1/achievements`);
    const json = await handleResponse<{ success: boolean; data: any[] }>(res);
    return (json.data || []).map((ach: any) => ({
      ...ach,
      id: String(ach.id),
      imageUrl: resolveImageUrl(ach.imageUrl || ach.image_url) || '/assets/prestasi-iksc-2025.jpg',
      winnerRole: ach.winnerRole || ach.winner_role || '',
      isHighlighted: Boolean(ach.isHighlighted ?? ach.is_highlighted),
    }));
  },

  async getTeachers(): Promise<Teacher[]> {
    const res = await fetch(`${BASE_URL}/api/v1/teachers`);
    const json = await handleResponse<{ success: boolean; data: any[] }>(res);
    return (json.data || []).map((t: any, idx: number) => ({
      ...t,
      id: String(t.id),
      imageUrl: resolveImageUrl(t.imageUrl || t.image_url) || `/assets/teachers/guru-${(idx % 7) + 1}.svg`,
    }));
  },

  async getFacilities(): Promise<Facility[]> {
    const res = await fetch(`${BASE_URL}/api/v1/facilities`);
    const json = await handleResponse<{ success: boolean; data: Facility[] }>(res);
    return json.data;
  },

  async getAlumni(): Promise<AlumniProfile[]> {
    const res = await fetch(`${BASE_URL}/api/v1/alumni`);
    const json = await handleResponse<{ success: boolean; data: any[] }>(res);
    return (json.data || []).map((alm: any, idx: number) => ({
      ...alm,
      id: String(alm.id),
      imageUrl: resolveImageUrl(alm.imageUrl || alm.image_url) || `/assets/alumni/alumni-${(idx % 3) + 1}.svg`,
      graduationYear: alm.graduationYear || (alm.graduation_year ? String(alm.graduation_year).replace(/^[^\d]*/, '') : ''),
      profession: alm.profession || alm.current_role || alm.title || '',
      currentRole: alm.currentRole || alm.current_role || alm.title || '',
    }));
  },


  async submitAlumniForm(data: AlumniFormData): Promise<{ id: number; status: string; message: string }> {
    const res = await fetch(`${BASE_URL}/api/v1/alumni/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async submitPpdbForm(data: PPDBFormData): Promise<{ registration_number: string; message: string }> {
    const res = await fetch(`${BASE_URL}/api/v1/ppdb/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // -------------------------------------------------------------
  // Authentication Endpoints
  // -------------------------------------------------------------
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await handleResponse<{ success: boolean; data: { token: string; user: AdminUser } }>(res);
    localStorage.setItem('mi_admin_token', json.data.token);
    localStorage.setItem('mi_admin_user', JSON.stringify(json.data.user));
    return json.data;
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: AdminUser }>(res);
    return json.data;
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
    const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: any }>(res);
    return json.data;
  },

  async getAdminSettings(): Promise<Record<string, Array<{ key: string; value: string; label: string; type: string }>>> {
    const res = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: any }>(res);
    return json.data;
  },

  async updateAdminSettings(settings: Array<{ key: string; value: boolean | string }>): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings }),
    });
    await handleResponse(res);
  },

  async getAdminSchoolProfile(): Promise<SchoolProfileData> {
    const res = await fetch(`${BASE_URL}/api/admin/school-profile`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: SchoolProfileData }>(res);
    return json.data;
  },

  async updateAdminSchoolProfile(data: Partial<SchoolProfileData>): Promise<SchoolProfileData> {
    const res = await fetch(`${BASE_URL}/api/admin/school-profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await handleResponse<{ success: boolean; data: SchoolProfileData }>(res);
    return json.data;
  },

  async getAdminArticles(): Promise<Article[]> {
    const res = await fetch(`${BASE_URL}/api/admin/articles?per_page=100`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: Article[] }>(res);
    return json.data;
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
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await handleResponse<{ success: boolean; data: Article }>(res);
    return json.data;
  },

  async deleteArticle(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(res);
  },

  async getAdminPpdb(status?: string, search?: string): Promise<{
    data: PpdbRecord[];
    status_counts: Record<string, number>;
  }> {
    const url = new URL(`${BASE_URL}/api/admin/ppdb/registrations`);
    if (status && status !== 'all') url.searchParams.set('status', status);
    if (search) url.searchParams.set('search', search);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updatePpdbStatus(id: number, status: string, adminNotes?: string): Promise<PpdbRecord> {
    const res = await fetch(`${BASE_URL}/api/admin/ppdb/registrations/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });
    const json = await handleResponse<{ success: boolean; data: PpdbRecord }>(res);
    return json.data;
  },

  async getAdminAlumniSubmissions(status?: string): Promise<AlumniSubmissionRecord[]> {
    const url = new URL(`${BASE_URL}/api/admin/alumni/submissions`);
    if (status && status !== 'all') url.searchParams.set('status', status);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: AlumniSubmissionRecord[] }>(res);
    return json.data;
  },

  async updateAlumniSubmissionStatus(
    id: number, 
    status: 'approved' | 'rejected', 
    publishToDirectory: boolean,
    notes?: string
  ): Promise<void> {
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
  },

  async deleteAlumniSubmission(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/alumni/submissions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(res);
  },

  async getMasterData(): Promise<MasterDataResponse> {
    const res = await fetch(`${BASE_URL}/api/admin/master-data`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse<{ success: boolean; data: MasterDataResponse }>(res);
    return json.data;
  },

  async setActiveAcademicYear(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/master-data/academic-years/${id}/set-active`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    await handleResponse(res);
  },

  async updatePpdbPath(id: number, data: Partial<MasterPpdbPath>): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/master-data/ppdb-paths/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    await handleResponse(res);
  },

  async uploadMedia(file: File, folder = 'articles'): Promise<{ path: string; url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem('mi_admin_token');
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
  },

  resolveImageUrl,
};
