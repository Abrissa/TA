import React, { useEffect, useState } from 'react';
import { api, resolveImageUrl } from '../../services/api';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Megaphone, 
  UserCheck, 
  Layout, 
  Save,
  Image as ImageIcon,
  Upload,
  X,
  Sparkles,
  User,
  Phone,
  Building,
  Target,
  FileText,
  Globe,
  Trophy,
  Users,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';

type CmsSection = 
  | 'branding' 
  | 'hero' 
  | 'principal' 
  | 'visimisi' 
  | 'page_prestasi'
  | 'page_berita'
  | 'page_guru'
  | 'page_alumni'
  | 'ppdb' 
  | 'appearance'
  | 'announcement' 
  | 'contact' 
  | 'footer' 
  | 'visibility';

export const AdminPageControlTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<CmsSection>('branding');
  const [settings, setSettings] = useState<Record<string, string>>(() => ({}));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSettings();
      const initial: Record<string, string> = {};
      if (res) {
        Object.entries(res).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            initial[k] = v;
          }
        });
      }
      setSettings(initial);
    } catch (err: any) {
      setErrorMessage('Gagal memuat pengaturan konten website.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    const current = settings[key] === 'true';
    setSettings((prev) => ({
      ...prev,
      [key]: current ? 'false' : 'true',
    }));
    setSaveSuccess(false);
  };

  const handleTextChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaveSuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: string, folder = 'homepage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya file gambar (JPG, PNG, WebP) yang diizinkan.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 4 MB.');
      return;
    }

    try {
      setUploadingField(settingKey);
      setUploadError(null);
      const res = await api.uploadMedia(file, folder);
      handleTextChange(settingKey, res.url);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah gambar ke server penyimpanan.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const payload = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));
      await api.updateAdminSettings(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan perubahan konten.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const navTabs: { id: CmsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'branding', label: 'Identitas & Logo', icon: <Building className="w-4 h-4" /> },
    { id: 'hero', label: 'Banner Beranda', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'principal', label: 'Sambutan Kepala', icon: <User className="w-4 h-4" /> },
    { id: 'visimisi', label: 'Visi, Misi & Pilar', icon: <Target className="w-4 h-4" /> },
    { id: 'page_prestasi', label: 'Halaman Prestasi', icon: <Trophy className="w-4 h-4" /> },
    { id: 'page_berita', label: 'Halaman Berita', icon: <FileText className="w-4 h-4" /> },
    { id: 'page_guru', label: 'Halaman Guru & Staf', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'page_alumni', label: 'Halaman Alumni', icon: <Users className="w-4 h-4" /> },
    { id: 'ppdb', label: 'Halaman & Alur PPDB', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'appearance', label: 'Navigasi & Tombol CTA', icon: <Sliders className="w-4 h-4" /> },
    { id: 'announcement', label: 'Pita Pengumuman', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'contact', label: 'Kontak & Sosmed', icon: <Phone className="w-4 h-4" /> },
    { id: 'footer', label: 'Footer & Hak Cipta', icon: <FileText className="w-4 h-4" /> },
    { id: 'visibility', label: 'Visibilitas Seksi', icon: <Layout className="w-4 h-4" /> },
  ];

  const sectionToggles = [
    { key: 'section_hero_visible', label: 'Seksi Hero Banner Utama', desc: 'Gambar gedung, tagline madrasah, foto siswa pop-out, dan statistik.' },
    { key: 'section_advantages_visible', label: 'Seksi Keunggulan Madrasah', desc: 'Nilai-nilai keunggulan Tahfidz Al-Qur\'an, Sains & IT, Kelas Adiwiyata.' },
    { key: 'section_principal_visible', label: 'Seksi Sambutan Kepala Sekolah', desc: 'Foto resmi, narasi sambutan, dan visi kepala madrasah.' },
    { key: 'section_facilities_visible', label: 'Seksi Fasilitas Pembelajaran', desc: 'Ruang kelas digital, perpustakaan, lab komputer, dan sarana lainnya.' },
    { key: 'section_achievements_visible', label: 'Seksi Prestasi Santri', desc: 'Capaian medali kejuaraan IKSC, Paskibra, dan trofi santri.' },
    { key: 'section_articles_visible', label: 'Seksi Berita & Artikel Terkini', desc: 'Warta madrasah dan liputan agenda kegiatan terbaru.' },
    { key: 'section_marquee_visible', label: 'Pita Teks Pengumuman Berjalan', desc: 'Running text ticker informasi mendesak di bawah banner.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-600" />
            <span>Pusat Kendali Konten Website (CMS)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kendalikan teks narasi, perbarui foto & banner, atur info lembaga, serta kelola seluruh halaman portal publik.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {/* Status Messages */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Seluruh perubahan konten website berhasil disimpan ke database dan langsung aktif di portal publik.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {navTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* BRANDING & IDENTITAS LEMBAGA */}
      {activeSubTab === 'branding' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>Identitas & Logo Resmi Madrasah</span>
            </h3>

            {/* Logo Madrasah */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Logo Resmi Madrasah</span>
                  <span className="text-xs text-slate-500">Ditampilkan pada navbar, footer, banner admisi, dan dokumen resmi.</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">/storage/school/logo-mi-al-ahmad.png</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group flex items-center justify-center p-2 shadow-xs">
                  <img
                    src={resolveImageUrl(settings['school_logo_url'] || '/storage/school/logo-mi-al-ahmad.png')}
                    alt="Preview Logo"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = resolveImageUrl('/storage/school/logo-mi-al-ahmad.png');
                    }}
                  />
                  {settings['school_logo_url'] && (
                    <button
                      type="button"
                      onClick={() => handleTextChange('school_logo_url', '')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Kembalikan ke bawaan"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    {uploadingField === 'school_logo_url' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah Logo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Pilih & Unggah File Logo Baru</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'school_logo_url', 'branding')}
                      disabled={uploadingField !== null}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={settings['school_logo_url'] ?? ''}
                    onChange={(e) => handleTextChange('school_logo_url', e.target.value)}
                    placeholder="Atau tautkan URL file logo (/storage/...)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Nama & Semboyan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Resmi Madrasah
                </label>
                <input
                  type="text"
                  value={settings['school_name'] ?? ''}
                  onChange={(e) => handleTextChange('school_name', e.target.value)}
                  placeholder="MI AL-AHMAD"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tagline / Sub-nama Lembaga
                </label>
                <input
                  type="text"
                  value={settings['school_tagline'] ?? ''}
                  onChange={(e) => handleTextChange('school_tagline', e.target.value)}
                  placeholder="Madrasah Ibtidaiyah Sidoarjo"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Akreditasi, NPSN, NSM, Jam Layanan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Status Akreditasi
                </label>
                <input
                  type="text"
                  value={settings['school_accreditation'] ?? ''}
                  onChange={(e) => handleTextChange('school_accreditation', e.target.value)}
                  placeholder="A (Unggul)"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor Pokok (NPSN)
                </label>
                <input
                  type="text"
                  value={settings['school_npsn'] ?? ''}
                  onChange={(e) => handleTextChange('school_npsn', e.target.value)}
                  placeholder="111235150000"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor Statistik (NSM)
                </label>
                <input
                  type="text"
                  value={settings['school_nsm'] ?? ''}
                  onChange={(e) => handleTextChange('school_nsm', e.target.value)}
                  placeholder="111235150000"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jam Layanan Kantor
                </label>
                <input
                  type="text"
                  value={settings['office_hours'] ?? ''}
                  onChange={(e) => handleTextChange('office_hours', e.target.value)}
                  placeholder="Senin - Sabtu: 07.00 - 14.00 WIB"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Status Buka / Tutup Sekolah Toggle */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Status Operasional Madrasah</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        settings['school_is_open'] !== 'false'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {settings['school_is_open'] !== 'false' ? 'BUKA (ON)' : 'TUTUP (OFF)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Menampilkan penanda Buka atau Tutup secara live di bar atas website publik.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings['school_is_open'] !== 'false'}
                    onClick={() => handleToggle('school_is_open')}
                    className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings['school_is_open'] !== 'false' ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-flex items-center justify-center h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out text-[10px] font-bold ${
                        settings['school_is_open'] !== 'false' ? 'translate-x-8 text-emerald-700' : 'translate-x-0 text-slate-400'
                      }`}
                    >
                      {settings['school_is_open'] !== 'false' ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Catatan Keterangan Status (Opsional)
                </label>
                <input
                  type="text"
                  value={settings['school_status_note'] ?? ''}
                  onChange={(e) => handleTextChange('school_status_note', e.target.value)}
                  placeholder="Contoh: Libur Hari Raya / KBM Aktif"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Catatan ini akan tampil di samping badge status buka/tutup di baris atas website.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO & BANNER UTAMA */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Teks & Slogan Utama Hero Banner</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subjudul / Badge Sapaan
                </label>
                <input
                  type="text"
                  value={settings['hero_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('hero_subtitle', e.target.value)}
                  placeholder="Selamat Datang di MI AL-AHMAD"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Utama Banner
                </label>
                <textarea
                  rows={2}
                  value={settings['hero_headline'] ?? ''}
                  onChange={(e) => handleTextChange('hero_headline', e.target.value)}
                  placeholder="Berkarakter, Peduli & Berprestasi di Era Teknologi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teks Tombol Aksi Utama
                </label>
                <input
                  type="text"
                  value={settings['hero_cta_text'] ?? ''}
                  onChange={(e) => handleTextChange('hero_cta_text', e.target.value)}
                  placeholder="Jelajahi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 max-w-sm"
                />
              </div>
            </div>
          </div>

          {/* Media Gambar Hero (Background & Students) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              <span>Gambar & Visual Hero Banner</span>
            </h3>

            {/* Foto Gedung Background */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Foto Latar Belakang Gedung Madrasah</span>
                  <span className="text-xs text-slate-500">Ditampilkan sebagai latar belakang dengan soft white overlay.</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">/storage/school/gedung-mi-al-ahmad.jpg</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-36 h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-200 shrink-0 relative group">
                  <img
                    src={resolveImageUrl(settings['hero_image_url']) || resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg')}
                    alt="Preview Gedung"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg');
                    }}
                  />
                  {settings['hero_image_url'] && (
                    <button
                      type="button"
                      onClick={() => handleTextChange('hero_image_url', '')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Kembalikan ke bawaan"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    {uploadingField === 'hero_image_url' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah Gambar Gedung...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Pilih & Unggah Foto Gedung Baru</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'hero_image_url', 'hero')}
                      disabled={uploadingField !== null}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={settings['hero_image_url'] ?? ''}
                    onChange={(e) => handleTextChange('hero_image_url', e.target.value)}
                    placeholder="Atau tautkan URL file (/storage/...)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Foto Siswa Pop-out */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Foto Siswa Pop-out Berprestasi</span>
                  <span className="text-xs text-slate-500">Foto transparan santri berprestasi di bagian depan kartu banner.</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">/storage/school/hero-students.png</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-36 h-24 rounded-lg overflow-hidden border border-slate-300 bg-emerald-950/20 shrink-0 relative group flex items-center justify-center">
                  <img
                    src={resolveImageUrl(settings['hero_students_image_url'] || '/storage/school/hero-students.png')}
                    alt="Preview Siswa"
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = resolveImageUrl('/storage/school/hero-students.png');
                    }}
                  />
                  {settings['hero_students_image_url'] && (
                    <button
                      type="button"
                      onClick={() => handleTextChange('hero_students_image_url', '')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Kembalikan ke bawaan"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    {uploadingField === 'hero_students_image_url' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah Foto Siswa...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Pilih & Unggah Foto Siswa (PNG Transparan)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'hero_students_image_url', 'hero')}
                      disabled={uploadingField !== null}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={settings['hero_students_image_url'] ?? ''}
                    onChange={(e) => handleTextChange('hero_students_image_url', e.target.value)}
                    placeholder="Atau tautkan URL file (/storage/...)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Counter */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Angka Capaian & Statistik Terkini
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jumlah Siswa Aktif
                </label>
                <input
                  type="text"
                  value={settings['hero_stat_students'] ?? ''}
                  onChange={(e) => handleTextChange('hero_stat_students', e.target.value)}
                  placeholder="850"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jumlah Alumni Terdata
                </label>
                <input
                  type="text"
                  value={settings['hero_stat_alumni'] ?? ''}
                  onChange={(e) => handleTextChange('hero_stat_alumni', e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Total Prestasi Terkumpul
                </label>
                <input
                  type="text"
                  value={settings['hero_stat_achievements'] ?? ''}
                  onChange={(e) => handleTextChange('hero_stat_achievements', e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAMBUTAN KEPALA MADRASAH */}
      {activeSubTab === 'principal' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Profil & Sambutan Resmi Kepala Madrasah</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Lengkap Kepala Madrasah
              </label>
              <input
                type="text"
                value={settings['principal_name'] ?? ''}
                onChange={(e) => handleTextChange('principal_name', e.target.value)}
                placeholder="Drs. H. Ahmad Fauzi, M.Pd"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Jabatan / Gelar Kelembagaan
              </label>
              <input
                type="text"
                value={settings['principal_role'] ?? ''}
                onChange={(e) => handleTextChange('principal_role', e.target.value)}
                placeholder="Kepala Madrasah MI AL-AHMAD"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Foto Resmi Kepala Madrasah */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-sm block">Foto Resmi Kepala Madrasah</span>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-28 rounded-lg overflow-hidden border border-slate-300 bg-slate-200 shrink-0 relative group flex items-center justify-center">
                <img
                  src={resolveImageUrl(settings['principal_image_url'] || '/storage/school/principal.png')}
                  alt="Kepala Madrasah"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = resolveImageUrl('/storage/school/principal.png');
                  }}
                />
                {settings['principal_image_url'] && (
                  <button
                    type="button"
                    onClick={() => handleTextChange('principal_image_url', '')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                    title="Kembalikan ke bawaan"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                  {uploadingField === 'principal_image_url' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Mengunggah Foto Kepala Sekolah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Unggah Foto Kepala Sekolah Baru</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'principal_image_url', 'principal')}
                    disabled={uploadingField !== null}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={settings['principal_image_url'] ?? ''}
                  onChange={(e) => handleTextChange('principal_image_url', e.target.value)}
                  placeholder="Atau tautkan URL file (/storage/...)"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Teks Narasi Sambutan
            </label>
            <textarea
              rows={5}
              value={settings['principal_greeting'] ?? ''}
              onChange={(e) => handleTextChange('principal_greeting', e.target.value)}
              placeholder="Tuliskan narasi sambutan kepala madrasah yang tampil di beranda..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>
        </div>
      )}

      {/* VISI, MISI & PILAR KARAKTER */}
      {activeSubTab === 'visimisi' && (
        <div className="space-y-6">
          {/* Header Banner Visi Misi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Banner Header Halaman Visi & Misi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Banner Visi Misi
                </label>
                <input
                  type="text"
                  value={settings['visimisi_banner_title'] ?? ''}
                  onChange={(e) => handleTextChange('visimisi_banner_title', e.target.value)}
                  placeholder="Visi, Misi & Landasan Pendidikan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subjudul / Deskripsi Banner
                </label>
                <textarea
                  rows={2}
                  value={settings['visimisi_banner_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('visimisi_banner_subtitle', e.target.value)}
                  placeholder="Membangun pendidikan dasar Islam berkarakter..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Foto Latar Banner Visi Misi
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                    <img
                      src={resolveImageUrl(settings['visimisi_banner_image'] || '/storage/school/plang-mi-al-ahmad.jpg')}
                      alt="Preview Banner Visi Misi"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = resolveImageUrl('/storage/school/plang-mi-al-ahmad.jpg');
                      }}
                    />
                    {settings['visimisi_banner_image'] && (
                      <button
                        type="button"
                        onClick={() => handleTextChange('visimisi_banner_image', '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        title="Hapus / Reset Foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                      {uploadingField === 'visimisi_banner_image' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Mengunggah Foto...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Unggah Foto Banner Visi Misi</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'visimisi_banner_image', 'profile')}
                        disabled={uploadingField !== null}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={settings['visimisi_banner_image'] ?? ''}
                      onChange={(e) => handleTextChange('visimisi_banner_image', e.target.value)}
                      placeholder="Atau masukkan tautan URL foto (/storage/...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Visi & Foto Dokumentasi Madrasah</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Visi Utama Madrasah
              </label>
              <textarea
                rows={3}
                value={settings['vision_text'] ?? ''}
                onChange={(e) => handleTextChange('vision_text', e.target.value)}
                placeholder="Visi utama..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed"
              />
            </div>

            {/* Foto Dokumentasi Visi Misi */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-sm block">Foto Dokumentasi Kegiatan Pembelajaran</span>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-36 h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-200 shrink-0 relative group">
                  <img
                    src={resolveImageUrl(settings['vision_image_url'] || '/storage/school/gedung-mi-al-ahmad.jpg')}
                    alt="Preview Kegiatan"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg');
                    }}
                  />
                  {settings['vision_image_url'] && (
                    <button
                      type="button"
                      onClick={() => handleTextChange('vision_image_url', '')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Kembalikan ke bawaan"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    {uploadingField === 'vision_image_url' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah Foto Kegiatan...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Unggah Foto Dokumentasi Baru</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'vision_image_url', 'profile')}
                      disabled={uploadingField !== null}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={settings['vision_image_url'] ?? ''}
                    onChange={(e) => handleTextChange('vision_image_url', e.target.value)}
                    placeholder="Atau tautkan URL file (/storage/...)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Misi Strategis Madrasah */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Misi Pendidikan Madrasah
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Misi Bidang Kurikulum & Al-Qur'an</label>
                <input
                  type="text"
                  value={settings['mission_1_title'] ?? ''}
                  onChange={(e) => handleTextChange('mission_1_title', e.target.value)}
                  placeholder="Judul misi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['mission_1_desc'] ?? ''}
                  onChange={(e) => handleTextChange('mission_1_desc', e.target.value)}
                  placeholder="Uraian misi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Misi Bidang Karakter & Akhlak</label>
                <input
                  type="text"
                  value={settings['mission_2_title'] ?? ''}
                  onChange={(e) => handleTextChange('mission_2_title', e.target.value)}
                  placeholder="Judul misi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['mission_2_desc'] ?? ''}
                  onChange={(e) => handleTextChange('mission_2_desc', e.target.value)}
                  placeholder="Uraian misi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Misi Bidang Sains & Teknologi</label>
                <input
                  type="text"
                  value={settings['mission_3_title'] ?? ''}
                  onChange={(e) => handleTextChange('mission_3_title', e.target.value)}
                  placeholder="Judul misi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['mission_3_desc'] ?? ''}
                  onChange={(e) => handleTextChange('mission_3_desc', e.target.value)}
                  placeholder="Uraian misi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Pilar Karakter Madrasah */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>4 Pilar Fondasi Karakter Madrasah</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Pilar 1: Karakter Qur'ani</label>
                <input
                  type="text"
                  value={settings['pillar_1_title'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_1_title', e.target.value)}
                  placeholder="Religius & Qur'ani"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['pillar_1_desc'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_1_desc', e.target.value)}
                  placeholder="Uraian pilar..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Pilar 2: Karakter Akademik</label>
                <input
                  type="text"
                  value={settings['pillar_2_title'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_2_title', e.target.value)}
                  placeholder="Unggul Akademik"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['pillar_2_desc'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_2_desc', e.target.value)}
                  placeholder="Uraian pilar..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Pilar 3: Karakter Akhlak</label>
                <input
                  type="text"
                  value={settings['pillar_3_title'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_3_title', e.target.value)}
                  placeholder="Berakhlak Mulia"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['pillar_3_desc'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_3_desc', e.target.value)}
                  placeholder="Uraian pilar..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Pilar 4: Karakter IT & Wawasan</label>
                <input
                  type="text"
                  value={settings['pillar_4_title'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_4_title', e.target.value)}
                  placeholder="Berwawasan IT"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['pillar_4_desc'] ?? ''}
                  onChange={(e) => handleTextChange('pillar_4_desc', e.target.value)}
                  placeholder="Uraian pilar..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HALAMAN PRESTASI SANTRI */}
      {activeSubTab === 'page_prestasi' && (
        <div className="space-y-6">
          {/* Header Banner Prestasi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <span>Banner Header Halaman Prestasi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Banner Prestasi
                </label>
                <input
                  type="text"
                  value={settings['achievements_banner_title'] ?? ''}
                  onChange={(e) => handleTextChange('achievements_banner_title', e.target.value)}
                  placeholder="Etalase Prestasi Gemilang Siswa MI AL-AHMAD"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subjudul / Deskripsi Banner
                </label>
                <textarea
                  rows={2}
                  value={settings['achievements_banner_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('achievements_banner_subtitle', e.target.value)}
                  placeholder="Bukti nyata dedikasi, kedisiplinan..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Foto Latar Banner Prestasi
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                    <img
                      src={resolveImageUrl(settings['achievements_banner_image'] || '/storage/school/trofi-prestasi-mi-al-ahmad.jpg')}
                      alt="Preview Banner Prestasi"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = resolveImageUrl('/storage/school/trofi-prestasi-mi-al-ahmad.jpg');
                      }}
                    />
                    {settings['achievements_banner_image'] && (
                      <button
                        type="button"
                        onClick={() => handleTextChange('achievements_banner_image', '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        title="Hapus / Reset Foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                      {uploadingField === 'achievements_banner_image' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Mengunggah Foto...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Unggah Foto Banner Prestasi</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'achievements_banner_image', 'prestasi')}
                        disabled={uploadingField !== null}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={settings['achievements_banner_image'] ?? ''}
                      onChange={(e) => handleTextChange('achievements_banner_image', e.target.value)}
                      placeholder="Atau masukkan tautan URL foto (/storage/...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight & Statistik Prestasi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Sorotan Card Pilihan & Statistik Prestasi</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Headline Sorotan Prestasi
                </label>
                <input
                  type="text"
                  value={settings['achievements_spotlight_headline'] ?? ''}
                  onChange={(e) => handleTextChange('achievements_spotlight_headline', e.target.value)}
                  placeholder="Kilau Prestasi Santri MI AL-AHMAD di Berbagai Ajang"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deskripsi Narasi Sorotan
                </label>
                <textarea
                  rows={2}
                  value={settings['achievements_spotlight_desc'] ?? ''}
                  onChange={(e) => handleTextChange('achievements_spotlight_desc', e.target.value)}
                  placeholder="Koleksi prestasi teratas yang diraih santri MI AL-AHMAD..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Badge 1: Total Trofi</label>
                  <input
                    type="text"
                    value={settings['achievements_stat_trophies'] ?? ''}
                    onChange={(e) => handleTextChange('achievements_stat_trophies', e.target.value)}
                    placeholder="500+"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings['achievements_stat_trophies_label'] ?? ''}
                    onChange={(e) => handleTextChange('achievements_stat_trophies_label', e.target.value)}
                    placeholder="Trofi Kejuaraan"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Badge 2: Jangkauan Ajang</label>
                  <input
                    type="text"
                    value={settings['achievements_stat_global'] ?? ''}
                    onChange={(e) => handleTextChange('achievements_stat_global', e.target.value)}
                    placeholder="Global"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings['achievements_stat_global_label'] ?? ''}
                    onChange={(e) => handleTextChange('achievements_stat_global_label', e.target.value)}
                    placeholder="Internasional"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Badge 3: Kategori Utama</label>
                  <input
                    type="text"
                    value={settings['achievements_stat_favorite'] ?? ''}
                    onChange={(e) => handleTextChange('achievements_stat_favorite', e.target.value)}
                    placeholder="Juara 1"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings['achievements_stat_favorite_label'] ?? ''}
                    onChange={(e) => handleTextChange('achievements_stat_favorite_label', e.target.value)}
                    placeholder="Sains & Tahfidz"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HALAMAN BERITA & ARTIKEL */}
      {activeSubTab === 'page_berita' && (
        <div className="space-y-6">
          {/* Header Banner Berita */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Banner Header Halaman Berita & Artikel</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Banner Berita
                </label>
                <input
                  type="text"
                  value={settings['news_banner_title'] ?? ''}
                  onChange={(e) => handleTextChange('news_banner_title', e.target.value)}
                  placeholder="Berita, Artikel & Kabar Prestasi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subjudul / Deskripsi Banner
                </label>
                <textarea
                  rows={2}
                  value={settings['news_banner_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('news_banner_subtitle', e.target.value)}
                  placeholder="Ikuti perkembangan terkini seputar prestasi santri..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Foto Latar Banner Berita
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                    <img
                      src={resolveImageUrl(settings['news_banner_image'] || '/storage/school/gedung-berita-mi-al-ahmad.jpg')}
                      alt="Preview Banner Berita"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = resolveImageUrl('/storage/school/gedung-berita-mi-al-ahmad.jpg');
                      }}
                    />
                    {settings['news_banner_image'] && (
                      <button
                        type="button"
                        onClick={() => handleTextChange('news_banner_image', '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        title="Hapus / Reset Foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                      {uploadingField === 'news_banner_image' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Mengunggah Foto...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Unggah Foto Banner Berita</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'news_banner_image', 'berita')}
                        disabled={uploadingField !== null}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={settings['news_banner_image'] ?? ''}
                      onChange={(e) => handleTextChange('news_banner_image', e.target.value)}
                      placeholder="Atau masukkan tautan URL foto (/storage/...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight & Kategori Liputan Berita */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Sorotan Liputan & Lencana Statistik</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Headline Sorotan Liputan
                </label>
                <input
                  type="text"
                  value={settings['news_spotlight_headline'] ?? ''}
                  onChange={(e) => handleTextChange('news_spotlight_headline', e.target.value)}
                  placeholder="Kabar & Informasi Terkini MI AL-AHMAD Krian"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deskripsi Narasi Sorotan
                </label>
                <textarea
                  rows={2}
                  value={settings['news_spotlight_desc'] ?? ''}
                  onChange={(e) => handleTextChange('news_spotlight_desc', e.target.value)}
                  placeholder="Informasi terpercaya seputar kegiatan madrasah..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Badge 1: Liputan Resmi</label>
                  <input
                    type="text"
                    value={settings['news_stat_coverage'] ?? ''}
                    onChange={(e) => handleTextChange('news_stat_coverage', e.target.value)}
                    placeholder="Aktual"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings['news_stat_coverage_label'] ?? ''}
                    onChange={(e) => handleTextChange('news_stat_coverage_label', e.target.value)}
                    placeholder="Liputan Resmi"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Badge 2: Artikel Edukatif</label>
                  <input
                    type="text"
                    value={settings['news_stat_education'] ?? ''}
                    onChange={(e) => handleTextChange('news_stat_education', e.target.value)}
                    placeholder="Edukatif"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings['news_stat_education_label'] ?? ''}
                    onChange={(e) => handleTextChange('news_stat_education_label', e.target.value)}
                    placeholder="Inspirasi Santri"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HALAMAN DEWAN GURU & STAF */}
      {activeSubTab === 'page_guru' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>Banner Header Dewan Guru & Tenaga Pendidik</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Banner Halaman Guru
                </label>
                <input
                  type="text"
                  value={settings['teachers_banner_title'] ?? ''}
                  onChange={(e) => handleTextChange('teachers_banner_title', e.target.value)}
                  placeholder="Dewan Guru & Tenaga Kependidikan MI AL-AHMAD Krian"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subjudul / Deskripsi Banner Guru
                </label>
                <textarea
                  rows={2}
                  value={settings['teachers_banner_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('teachers_banner_subtitle', e.target.value)}
                  placeholder="Tenaga pendidik profesional berijazah sarjana & magister..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Foto Latar Banner Dewan Guru
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                    <img
                      src={resolveImageUrl(settings['teachers_banner_image'] || '/storage/school/dewan-guru-mi-al-ahmad.jpg')}
                      alt="Preview Banner Guru"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = resolveImageUrl('/storage/school/dewan-guru-mi-al-ahmad.jpg');
                      }}
                    />
                    {settings['teachers_banner_image'] && (
                      <button
                        type="button"
                        onClick={() => handleTextChange('teachers_banner_image', '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        title="Hapus / Reset Foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                      {uploadingField === 'teachers_banner_image' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Mengunggah Foto...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Unggah Foto Dewan Guru</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'teachers_banner_image', 'teachers')}
                        disabled={uploadingField !== null}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={settings['teachers_banner_image'] ?? ''}
                      onChange={(e) => handleTextChange('teachers_banner_image', e.target.value)}
                      placeholder="Atau masukkan tautan URL foto (/storage/...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik & Filosofi Guru */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Filosofi & Metrik Kompetensi Guru</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kutipan Filosofi Pendidikan Dewan Guru
                </label>
                <input
                  type="text"
                  value={settings['teachers_quote_text'] ?? ''}
                  onChange={(e) => handleTextChange('teachers_quote_text', e.target.value)}
                  placeholder="Mendidik dengan keikhlasan, ilmu, dan kearifan akhlak Qur'ani."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Rasio Guru : Murid
                  </label>
                  <input
                    type="text"
                    value={settings['teachers_stat_ratio'] ?? ''}
                    onChange={(e) => handleTextChange('teachers_stat_ratio', e.target.value)}
                    placeholder="15:1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tingkat Pendidikan Guru
                  </label>
                  <input
                    type="text"
                    value={settings['teachers_stat_degree'] ?? ''}
                    onChange={(e) => handleTextChange('teachers_stat_degree', e.target.value)}
                    placeholder="100% S1 / S2"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Sertifikasi Pendidik
                  </label>
                  <input
                    type="text"
                    value={settings['teachers_stat_cert'] ?? ''}
                    onChange={(e) => handleTextChange('teachers_stat_cert', e.target.value)}
                    placeholder="Sertifikasi Kemenag & Kemdikbud"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HALAMAN ALUMNI & SEKRETARIAT */}
      {activeSubTab === 'page_alumni' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Banner Header Halaman Alumni</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Banner Alumni
                </label>
                <input
                  type="text"
                  value={settings['alumni_banner_title'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_banner_title', e.target.value)}
                  placeholder="Jejak Langkah Alumni MI AL-AHMAD Krian"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subjudul / Deskripsi Banner Alumni
                </label>
                <textarea
                  rows={2}
                  value={settings['alumni_banner_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_banner_subtitle', e.target.value)}
                  placeholder="Mencetak generasi Qur'ani dan cendekia..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teks Tombol Aksi Formulir Alumni
                </label>
                <input
                  type="text"
                  value={settings['alumni_cta_text'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_cta_text', e.target.value)}
                  placeholder="Isi Formulir Pendataan Alumni"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Foto Latar Banner Alumni
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                    <img
                      src={resolveImageUrl(settings['alumni_banner_image']) || resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg')}
                      alt="Preview Banner Alumni"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg');
                      }}
                    />
                    {settings['alumni_banner_image'] && (
                      <button
                        type="button"
                        onClick={() => handleTextChange('alumni_banner_image', '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        title="Hapus / Reset Foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                      {uploadingField === 'alumni_banner_image' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Mengunggah Foto...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Unggah Foto Banner Alumni</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'alumni_banner_image', 'alumni')}
                        disabled={uploadingField !== null}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={settings['alumni_banner_image'] ?? ''}
                      onChange={(e) => handleTextChange('alumni_banner_image', e.target.value)}
                      placeholder="Atau masukkan tautan URL foto (/storage/...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BANNER FORMULIR PENDATAAN ALUMNI */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Banner Khusus Formulir Pendataan Alumni (/form-alumni)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Judul Banner Formulir Alumni
                  </label>
                  <input
                    type="text"
                    value={settings['alumni_form_banner_title'] ?? ''}
                    onChange={(e) => handleTextChange('alumni_form_banner_title', e.target.value)}
                    placeholder="Formulir Pendataan Alumni"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subjudul / Deskripsi Banner Formulir Alumni
                  </label>
                  <textarea
                    rows={2}
                    value={settings['alumni_form_banner_subtitle'] ?? ''}
                    onChange={(e) => handleTextChange('alumni_form_banner_subtitle', e.target.value)}
                    placeholder="Silakan perbarui data diri Anda untuk mempererat silaturahmi..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Foto Latar Belakang Banner Formulir Alumni
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                      <img
                        src={
                          resolveImageUrl(settings['alumni_form_banner_image']) ||
                          resolveImageUrl(settings['alumni_banner_image']) ||
                          resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg')
                        }
                        alt="Preview Banner Form Alumni"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg');
                        }}
                      />
                      {settings['alumni_form_banner_image'] && (
                        <button
                          type="button"
                          onClick={() => handleTextChange('alumni_form_banner_image', '')}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Hapus / Reset Foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                        {uploadingField === 'alumni_form_banner_image' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                            <span>Mengunggah Foto...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-emerald-600" />
                            <span>Unggah Foto Banner Formulir Alumni</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'alumni_form_banner_image', 'alumni')}
                          disabled={uploadingField !== null}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={settings['alumni_form_banner_image'] ?? ''}
                        onChange={(e) => handleTextChange('alumni_form_banner_image', e.target.value)}
                        placeholder="Atau masukkan tautan URL foto (/storage/...)"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                      />
                      <p className="text-[11px] text-slate-400">
                        Foto latar belakang khusus untuk header formulir pendataan alumni. Jika dikosongkan, otomatis menggunakan banner utama alumni.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATISTIK & COUNTER ALUMNI */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Statistik & Counter Alumni (3 Baris Angka)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Statistik 1: Lulusan</label>
                <input
                  type="text"
                  value={settings['alumni_stat_graduates'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_stat_graduates', e.target.value)}
                  placeholder="3,500+"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={settings['alumni_stat_graduates_label'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_stat_graduates_label', e.target.value)}
                  placeholder="LULUSAN TERSEBAR"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Statistik 2: Pengabdian</label>
                <input
                  type="text"
                  value={settings['alumni_stat_years'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_stat_years', e.target.value)}
                  placeholder="45+ Tahun"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={settings['alumni_stat_years_label'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_stat_years_label', e.target.value)}
                  placeholder="PERJALANAN PENGABDIAN"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Statistik 3: Jaringan</label>
                <input
                  type="text"
                  value={settings['alumni_stat_network'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_stat_network', e.target.value)}
                  placeholder="Ikatan Alumni"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-600"
                />
                <input
                  type="text"
                  value={settings['alumni_stat_network_label'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_stat_network_label', e.target.value)}
                  placeholder="JEJAK SILATURAHMI TERJAGA"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* HEADING DIREKTORI ALUMNI */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Judul & Pengantar Seksi Direktori Alumni</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Seksi Profil Alumni
                </label>
                <input
                  type="text"
                  value={settings['alumni_section_title'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_section_title', e.target.value)}
                  placeholder="Profil Lulusan Berprestasi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deskripsi / Subjudul Seksi Profil Alumni
                </label>
                <textarea
                  rows={2}
                  value={settings['alumni_section_subtitle'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_section_subtitle', e.target.value)}
                  placeholder="Kisah inspiratif alumni MI AL-AHMAD di berbagai bidang profesi."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Kontak & Informasi Sekretariat Alumni */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>Sekretariat Ikatan Alumni & Layanan Legalisir</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Kantor Sekretariat
                </label>
                <input
                  type="text"
                  value={settings['alumni_secretariat_title'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_secretariat_title', e.target.value)}
                  placeholder="Sekretariat Ikatan Alumni"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Lokasi Gedung / Ruangan
                </label>
                <input
                  type="text"
                  value={settings['alumni_secretariat_location'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_secretariat_location', e.target.value)}
                  placeholder="Gedung Kesiswaan Lt. 2 MI AL-AHMAD"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Uraian Deskripsi / Layanan Sekretariat
                </label>
                <textarea
                  rows={2}
                  value={settings['alumni_secretariat_desc'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_secretariat_desc', e.target.value)}
                  placeholder="Punya pertanyaan mengenai temu alumni, legalisir ijazah, atau jejaring karier?..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Narahubung / WhatsApp Alumni
                </label>
                <input
                  type="text"
                  value={settings['alumni_secretariat_phone'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_secretariat_phone', e.target.value)}
                  placeholder="+62 812-9876-5432 (Ustadz Rahmat)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Khusus Alumni
                </label>
                <input
                  type="email"
                  value={settings['alumni_secretariat_email'] ?? ''}
                  onChange={(e) => handleTextChange('alumni_secretariat_email', e.target.value)}
                  placeholder="alumni@mialahmad.sch.id"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMISI & PPDB */}
      {activeSubTab === 'ppdb' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Pengaturan Informasi & Admisi PPDB</h3>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('ppdb_open')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings['ppdb_open'] === 'true' ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings['ppdb_open'] === 'true' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Judul Banner Halaman PPDB
              </label>
              <input
                type="text"
                value={settings['ppdb_banner_title'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_banner_title', e.target.value)}
                placeholder="Penerimaan Peserta Didik Baru (PPDB)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Subjudul / Tagline Banner PPDB
              </label>
              <textarea
                rows={2}
                value={settings['ppdb_banner_subtitle'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_banner_subtitle', e.target.value)}
                placeholder="Mari bergabung bersama keluarga besar madrasah berprestasi..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Foto Latar Banner PPDB */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Foto Latar Banner Halaman PPDB
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 relative group">
                  <img
                    src={resolveImageUrl(settings['ppdb_banner_image']) || resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg')}
                    alt="Preview Banner PPDB"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = resolveImageUrl('/storage/school/gedung-mi-al-ahmad.jpg');
                    }}
                  />
                  {settings['ppdb_banner_image'] && (
                    <button
                      type="button"
                      onClick={() => handleTextChange('ppdb_banner_image', '')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Hapus / Reset Foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    {uploadingField === 'ppdb_banner_image' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah Foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Unggah Foto Banner PPDB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'ppdb_banner_image', 'ppdb')}
                      disabled={uploadingField !== null}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={settings['ppdb_banner_image'] ?? ''}
                    onChange={(e) => handleTextChange('ppdb_banner_image', e.target.value)}
                    placeholder="Atau masukkan tautan URL foto (/storage/...)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400">
                    Foto latar belakang untuk header halaman PPDB (/ppdb). Otomatis dipadukan dengan overlay gradien hijau Islami untuk keterbacaan teks maksimal.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Tahun Ajaran PPDB
              </label>
              <input
                type="text"
                value={settings['ppdb_academic_year'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_academic_year', e.target.value)}
                placeholder="2026/2027"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Gelombang Seleksi Aktif
              </label>
              <input
                type="text"
                value={settings['ppdb_wave'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_wave', e.target.value)}
                placeholder="Gelombang 1"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Periode Tanggal Pendaftaran
              </label>
              <input
                type="text"
                value={settings['ppdb_dates'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_dates', e.target.value)}
                placeholder="01 Nov 2025 - 30 Mar 2026"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Kuota Penerimaan Santri
              </label>
              <input
                type="text"
                value={settings['ppdb_quota'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_quota', e.target.value)}
                placeholder="120 Siswa"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Kontak Layanan & Narahubung PPDB
              </label>
              <input
                type="text"
                value={settings['ppdb_contact_person'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_contact_person', e.target.value)}
                placeholder="0812-3456-7890 (Ust. Ridwan)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Teks Narasi Pengantar PPDB
              </label>
              <textarea
                rows={3}
                value={settings['ppdb_intro_text'] ?? ''}
                onChange={(e) => handleTextChange('ppdb_intro_text', e.target.value)}
                placeholder="Narasi pengantar..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Tahapan Alur Seleksi PPDB */}
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4 Tahapan Alur Penerimaan Santri Baru</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tahap 1</span>
                <input
                  type="text"
                  value={settings['ppdb_step_1_title'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_1_title', e.target.value)}
                  placeholder="Pendaftaran Online"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['ppdb_step_1_desc'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_1_desc', e.target.value)}
                  placeholder="Uraian tahap 1..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tahap 2</span>
                <input
                  type="text"
                  value={settings['ppdb_step_2_title'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_2_title', e.target.value)}
                  placeholder="Penerbitan Bukti Registrasi"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['ppdb_step_2_desc'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_2_desc', e.target.value)}
                  placeholder="Uraian tahap 2..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tahap 3</span>
                <input
                  type="text"
                  value={settings['ppdb_step_3_title'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_3_title', e.target.value)}
                  placeholder="Observasi Ramah Anak"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['ppdb_step_3_desc'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_3_desc', e.target.value)}
                  placeholder="Uraian tahap 3..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tahap 4</span>
                <input
                  type="text"
                  value={settings['ppdb_step_4_title'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_4_title', e.target.value)}
                  placeholder="Daftar Ulang & Orientasi"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
                <textarea
                  rows={2}
                  value={settings['ppdb_step_4_desc'] ?? ''}
                  onChange={(e) => handleTextChange('ppdb_step_4_desc', e.target.value)}
                  placeholder="Uraian tahap 4..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGASI & TOMBOL CTA */}
      {activeSubTab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <span>Tombol Navigasi & Aksi (Navbar & Header)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teks Tombol Utama PPDB Navbar
                </label>
                <input
                  type="text"
                  value={settings['navbar_cta_text'] ?? ''}
                  onChange={(e) => handleTextChange('navbar_cta_text', e.target.value)}
                  placeholder="Daftar PPDB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-xs text-slate-400 mt-1">Tombol sorotan di bilah navigasi atas.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teks Tombol Modal Kontak
                </label>
                <input
                  type="text"
                  value={settings['navbar_contact_text'] ?? ''}
                  onChange={(e) => handleTextChange('navbar_contact_text', e.target.value)}
                  placeholder="Kontak"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-xs text-slate-400 mt-1">Tombol pembuka jendela kontak & lokasi di pojok kanan atas.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Status Operasional & Jam Pelayanan Madrasah</h3>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('school_is_open')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings['school_is_open'] === 'true' ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings['school_is_open'] === 'true' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jam Operasional Pelayanan Kantor
                </label>
                <input
                  type="text"
                  value={settings['office_hours'] ?? ''}
                  onChange={(e) => handleTextChange('office_hours', e.target.value)}
                  placeholder="Senin - Sabtu: 07.00 - 14.00 WIB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Catatan Tambahan Status Operasional
                </label>
                <input
                  type="text"
                  value={settings['school_status_note'] ?? ''}
                  onChange={(e) => handleTextChange('school_status_note', e.target.value)}
                  placeholder="Contoh: Kantor buka melayani konsultasi langsung"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PITA PENGUMUMAN BERJALAN (MARQUEE) */}
      {activeSubTab === 'announcement' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Pita Teks Pengumuman Berjalan (Marquee Ticker)</h3>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('announcement_banner_active')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings['announcement_banner_active'] === 'true' ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings['announcement_banner_active'] === 'true' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Isi Teks Pengumuman
            </label>
            <textarea
              rows={3}
              value={settings['announcement_banner_text'] ?? ''}
              onChange={(e) => handleTextChange('announcement_banner_text', e.target.value)}
              placeholder="Contoh: Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 telah dibuka..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Pesan ini bergerak dinamis di bawah hero banner pada halaman beranda utama.
            </p>
          </div>
        </div>
      )}

      {/* IDENTITAS, KONTAK & MEDIA SOSIAL */}
      {activeSubTab === 'contact' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Kontak Resmi & Media Sosial</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Nomor Telepon Kantor
              </label>
              <input
                type="text"
                value={settings['school_phone'] ?? ''}
                onChange={(e) => handleTextChange('school_phone', e.target.value)}
                placeholder="(031) 8971234"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Nomor WhatsApp Narahubung
              </label>
              <input
                type="text"
                value={settings['school_whatsapp'] ?? ''}
                onChange={(e) => handleTextChange('school_whatsapp', e.target.value)}
                placeholder="6281234567890"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Resmi Madrasah
              </label>
              <input
                type="email"
                value={settings['school_email'] ?? ''}
                onChange={(e) => handleTextChange('school_email', e.target.value)}
                placeholder="info@mialahmad.sch.id"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Alamat Lengkap Domisili Madrasah
              </label>
              <textarea
                rows={2}
                value={settings['school_address'] ?? ''}
                onChange={(e) => handleTextChange('school_address', e.target.value)}
                placeholder="Alamat lengkap..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Tautan Peta Lokasi (Google Maps)
              </label>
              <input
                type="text"
                value={settings['maps_embed_url'] ?? ''}
                onChange={(e) => handleTextChange('maps_embed_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Akun Media Sosial */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Tautan Akun Media Sosial Resmi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Instagram
                </label>
                <input
                  type="text"
                  value={settings['social_instagram'] ?? ''}
                  onChange={(e) => handleTextChange('social_instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Facebook
                </label>
                <input
                  type="text"
                  value={settings['social_facebook'] ?? ''}
                  onChange={(e) => handleTextChange('social_facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  YouTube
                </label>
                <input
                  type="text"
                  value={settings['social_youtube'] ?? ''}
                  onChange={(e) => handleTextChange('social_youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  TikTok
                </label>
                <input
                  type="text"
                  value={settings['social_tiktok'] ?? ''}
                  onChange={(e) => handleTextChange('social_tiktok', e.target.value)}
                  placeholder="https://tiktok.com/..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER & HAK CIPTA */}
      {activeSubTab === 'footer' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Teks Footer & Hak Cipta</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Narasi Singkat Sekolah di Footer
              </label>
              <textarea
                rows={3}
                value={settings['footer_description'] ?? ''}
                onChange={(e) => handleTextChange('footer_description', e.target.value)}
                placeholder="Narasi ringkas footer..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Teks Hak Cipta (Copyright)
              </label>
              <input
                type="text"
                value={settings['footer_copyright'] ?? ''}
                onChange={(e) => handleTextChange('footer_copyright', e.target.value)}
                placeholder="Copyright © 2026..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* VISIBILITAS SEKSI HALAMAN DEPAN */}
      {activeSubTab === 'visibility' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layout className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Visibilitas Seksi Halaman Depan</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {sectionToggles.map((item) => {
              const isVisible = settings[item.key] !== 'false';
              return (
                <div key={item.key} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 pr-4">
                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      {item.label}
                      {isVisible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Eye className="w-3 h-3" /> Tampil
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          <EyeOff className="w-3 h-3" /> Tersembunyi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isVisible ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
