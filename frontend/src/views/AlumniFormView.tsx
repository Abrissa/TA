import React, { useState, useEffect } from 'react';
import { AlumniFormData, AlumniProfile, PageTab } from '../types';
import { api, resolveImageUrl } from '../services/api';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Link as LinkIcon, 
  MessageSquare, 
  Upload, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2,
  Globe,
  Instagram,
  Linkedin,
  Quote,
  MapPin,
  Phone,
  Mail,
  Users,
  Home,
  ChevronRight,
  Clock,
  ShieldCheck,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

const parseSocialLink = (url?: string | null) => {
  if (!url || !url.trim()) return null;
  const raw = url.trim();
  const fullUrl = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
  const isInstagram = /instagram\.com|instagr\.am/i.test(raw);
  const isLinkedIn = /linkedin\.com/i.test(raw);
  const display = raw.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return {
    url: fullUrl,
    display,
    isInstagram,
    isLinkedIn,
  };
};

interface AlumniFormViewProps {
  setActiveTab?: (tab: PageTab) => void;
  settings?: Record<string, string>;
}

export const AlumniFormView: React.FC<AlumniFormViewProps> = ({ setActiveTab, settings }) => {
  const [formData, setFormData] = useState<AlumniFormData>({
    fullName: '',
    graduationYear: '2015',
    jobRole: '',
    photoUrl: '/assets/alumni/alumni-1.svg',
    socialMedia: '',
    message: '',
  });

  const [useUrlInput, setUseUrlInput] = useState<boolean>(true);
  const [customPhotoPreview, setCustomPhotoPreview] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // Approved Alumni Directory (Only displays verified alumni approved by admin)
  const [approvedAlumni, setApprovedAlumni] = useState<AlumniProfile[]>([]);
  const [isLoadingAlumni, setIsLoadingAlumni] = useState<boolean>(true);

  // Form Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedSuccessInfo, setSubmittedSuccessInfo] = useState<{ name: string } | null>(null);

  const loadApprovedAlumni = () => {
    setIsLoadingAlumni(true);
    api.getAlumni()
      .then((data) => {
        if (data && data.length > 0) setApprovedAlumni(data);
      })
      .catch((err) => console.error('Failed to load approved alumni:', err))
      .finally(() => setIsLoadingAlumni(false));
  };

  useEffect(() => {
    loadApprovedAlumni();

    const handleAlumniChanged = () => {
      loadApprovedAlumni();
    };

    window.addEventListener('mi_alumni_changed', handleAlumniChanged);
    return () => {
      window.removeEventListener('mi_alumni_changed', handleAlumniChanged);
    };
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file foto gambar (JPG, PNG, WebP) yang diizinkan.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5 MB.');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const res = await api.uploadMedia(file, 'alumni');
      setCustomPhotoPreview(res.url);
      setFormData((prev) => ({ ...prev, photoUrl: res.url }));
    } catch {
      // Fallback: Read as base64 Data URL so local preview & persistence works
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomPhotoPreview(dataUrl);
        setFormData((prev) => ({ ...prev, photoUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.jobRole.trim()) {
      alert('Nama lengkap dan pekerjaan/aktivitas wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const submittedName = formData.fullName.trim();

    try {
      await api.submitAlumniForm({
        ...formData,
        fullName: submittedName,
        currentRole: formData.jobRole,
      });

      // Show confirmation that submission is awaiting admin approval
      setSubmittedSuccessInfo({ name: submittedName });

      // Reset form fields
      setFormData({
        fullName: '',
        graduationYear: '2018',
        jobRole: '',
        photoUrl: '/assets/alumni/alumni-1.svg',
        socialMedia: '',
        message: '',
      });
      setCustomPhotoPreview('');

      // Auto-hide banner after 12 seconds
      setTimeout(() => {
        setSubmittedSuccessInfo(null);
      }, 12000);
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal mengirim data ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab && setActiveTab('beranda') },
          { label: 'Alumni', onClick: () => setActiveTab && setActiveTab('alumni') },
          { label: 'Formulir Pendataan' },
        ]}
        title={settings?.alumni_form_banner_title || 'Formulir Pendataan Alumni'}
        subtitle={
          settings?.alumni_form_banner_subtitle ||
          'Silakan perbarui data diri Anda untuk mempererat silaturahmi dan memperluas jejaring alumni MI AL-AHMAD.'
        }
        backgroundImageUrl={
          settings?.alumni_form_banner_image
            ? resolveImageUrl(settings.alumni_form_banner_image)
            : undefined
        }
      />

      {/* FORM & SIDEBAR LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FORM (8 COLS) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Registrasi & Pembaruan Jejak Alumni</span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Isi Informasi Data Alumni
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Lengkapi rincian di bawah ini. Data Anda akan ditinjau dan disaring terlebih dahulu oleh Admin Madrasah sebelum diterbitkan ke direktori publik.
              </p>
            </div>

            {/* Notification: Submission Successful & Awaiting Admin Moderation */}
            {submittedSuccessInfo && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border-2 border-emerald-400 text-slate-800 shadow-sm space-y-2 animate-fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Alhamdulillah, Formulir Alumni Berhasil Dikirim!
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Menunggu Moderasi Admin</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Terima kasih, data alumni an. <strong className="text-emerald-900 font-bold">{submittedSuccessInfo.name}</strong> telah tersimpan di antrean sistem. Sesuai kebijakan madrasah, data ini akan disaring dan diverifikasi oleh Admin di <strong>Dashboard Admin bagian Alumni</strong> terlebih dahulu sebelum ditampilkan pada Direktori Publik.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nama Lengkap & Tahun Lulus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Contoh: dr. Nabilah Zahrani / Yusuf"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Tahun Lulus <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      name="graduationYear"
                      required
                      min="1980"
                      max="2026"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                    />
                  </div>
                </div>
              </div>

              {/* Pekerjaan / Profesi Saat Ini */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Pekerjaan / Profesi / Aktivitas Saat Ini <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="jobRole"
                    required
                    placeholder="Contoh: Dokter Spesialis / Mahasiswa / Wirausaha"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                  />
                </div>
              </div>

              {/* Foto Profil */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Foto Profil Alumni (JPG / PNG)
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        !useUrlInput ? 'bg-[#059669] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Unggah Berkas
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        useUrlInput ? 'bg-[#059669] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      URL Foto
                    </button>
                  </div>
                </div>

                {!useUrlInput ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center space-y-1.5 bg-slate-50">
                    <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">Pilih berkas foto dari perangkat Anda</p>
                    <p className="text-xs text-slate-400">Mendukung format JPG, PNG, atau WebP (Maks. 5 MB)</p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#059669] hover:file:bg-emerald-100 cursor-pointer pt-2"
                    />
                    {isUploadingPhoto && (
                      <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold pt-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengunggah foto...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="relative">
                      <ImageIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="https://... atau /assets/alumni/... (URL foto)"
                        value={formData.photoUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, photoUrl: e.target.value });
                          setCustomPhotoPreview(e.target.value);
                        }}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                      />
                    </div>
                  </div>
                )}

                {/* Preview Image Box */}
                {(formData.photoUrl || customPhotoPreview) && (
                  <div className="flex items-center gap-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={resolveImageUrl(customPhotoPreview || formData.photoUrl) || '/assets/alumni/alumni-1.svg'}
                      alt="Preview Foto Alumni"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#059669]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/alumni/alumni-1.svg';
                      }}
                    />
                    <div className="text-xs min-w-0 flex-1">
                      <p className="font-bold text-slate-800">Pratinjau Foto Profil Alumni</p>
                      <p className="text-slate-500 truncate max-w-xs">{customPhotoPreview || formData.photoUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tautan Sosial Media */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Sosial Media / LinkedIn (Opsional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="instagram.com/username atau linkedin.com/in/username"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Pesan & Kesan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Pesan &amp; Kesan Selama Sekolah di MI AL-AHMAD
                </label>
                <div className="relative">
                  <MessageSquare className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Tuliskan kenangan atau pesan untuk sekolah dan adik-adik..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {submitError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPhoto}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Formulir...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Data Alumni</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* RIGHT SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Alur Moderasi &amp; Verifikasi</span>
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Penyaringan Data Alumni
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Untuk menjaga akurasi dan integritas data alumni, setiap pengajuan akan diverifikasi oleh Admin Madrasah di Dashboard Admin terlebih dahulu sebelum diterbitkan ke direktori publik.
              </p>
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <span>Alumni mengisi formulir pendataan diri secara lengkap.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <span>Data masuk ke antrean moderasi dengan status <strong>Pending</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <span>Admin menyetujui pengajuan di Dashboard Admin, lalu data resmi tampil di direktori.</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                {settings?.alumni_secretariat_title || 'Sekretariat Ikatan Alumni'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {settings?.alumni_secretariat_desc || 'Punya pertanyaan mengenai temu alumni, legalisir ijazah, atau jejaring karier? Hubungi sekretariat kami.'}
              </p>
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>{settings?.alumni_secretariat_location || 'Gedung Kesiswaan Lt. 2 MI AL-AHMAD'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>{settings?.alumni_secretariat_phone || '+62 812-9876-5432 (Ustadz Rahmat)'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>{settings?.alumni_secretariat_email || 'alumni@mialahmad.sch.id'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DYNAMIC LIST OF APPROVED & VERIFIED ALUMNI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[#059669]" />
              Direktori Alumni Terverifikasi ({approvedAlumni.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Menampilkan alumni yang telah disetujui dan diverifikasi oleh admin madrasah.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            <Check className="w-3.5 h-3.5" />
            <span>Terverifikasi Resmi</span>
          </span>
        </div>

        {isLoadingAlumni ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : approvedAlumni.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 text-slate-500 text-sm">
            Belum ada data alumni yang disetujui untuk ditampilkan di direktori publik.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedAlumni.map((alm, idx) => {
              const fallbackAvatar = `/assets/alumni/alumni-${(idx % 3) + 1}.svg`;
              const imageSrc = resolveImageUrl(alm.imageUrl) || fallbackAvatar;
              const socialInfo = parseSocialLink(alm.socialUrl);

              return (
                <div
                  key={alm.id || idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={imageSrc}
                        alt={alm.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#059669] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackAvatar;
                        }}
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-bold font-heading text-slate-900 text-base truncate">{alm.name}</h4>
                        {alm.graduationYear && (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-[#059669] font-bold text-xs rounded border border-emerald-100">
                            Angkatan {alm.graduationYear.replace(/^[^\d]*/, '')}
                          </span>
                        )}
                        <p className="font-medium text-slate-700 text-sm pt-0.5 line-clamp-2">
                          {alm.profession || alm.currentRole || alm.title}
                        </p>
                      </div>
                    </div>

                    {(alm.quote || alm.bio) && (
                      <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed line-clamp-3">
                        "{alm.quote || alm.bio}"
                      </p>
                    )}
                  </div>

                  {/* Card Footer - always present and consistent across all cards */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Alumni Terverifikasi</span>
                    </span>

                    {socialInfo ? (
                      <a
                        href={socialInfo.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors max-w-[150px] sm:max-w-[180px] truncate ${
                          socialInfo.isInstagram
                            ? 'text-pink-600 hover:text-pink-700'
                            : socialInfo.isLinkedIn
                            ? 'text-sky-700 hover:text-sky-800'
                            : 'text-[#059669] hover:text-[#047857]'
                        }`}
                        title={socialInfo.display}
                      >
                        {socialInfo.isInstagram ? (
                          <Instagram className="w-3.5 h-3.5 shrink-0 text-pink-600" />
                        ) : socialInfo.isLinkedIn ? (
                          <Linkedin className="w-3.5 h-3.5 shrink-0 text-sky-700" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 shrink-0 text-[#059669]" />
                        )}
                        <span className="truncate">{socialInfo.display}</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>MI AL-AHMAD</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
