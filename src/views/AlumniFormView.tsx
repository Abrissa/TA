import React, { useState } from 'react';
import { AlumniFormData, PageTab } from '../types';
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
  MapPin,
  Phone,
  Mail,
  Users,
  Home,
  ChevronRight,
} from 'lucide-react';

interface AlumniFormViewProps {
  setActiveTab?: (tab: PageTab) => void;
}

export const AlumniFormView: React.FC<AlumniFormViewProps> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState<AlumniFormData>({
    fullName: '',
    graduationYear: '2015',
    jobRole: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    socialMedia: 'linkedin.com/in/alumni',
    message: '',
  });

  const [useUrlInput, setUseUrlInput] = useState<boolean>(true);
  const [customPhotoPreview, setCustomPhotoPreview] = useState<string>('');

  const [submittedEntries, setSubmittedEntries] = useState<AlumniFormData[]>([
    {
      fullName: 'Ahmad Faisal, S.T.',
      graduationYear: '2010',
      jobRole: 'Software Engineer di BUMN Tech',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      socialMedia: 'instagram.com/faisal_tech',
      message: 'MI AL-AHMAD mengajarkan pentingnya kejujuran dan disiplin Al-Qur\'an.',
    },
    {
      fullName: 'Siti Rahmawati, M.Pd.',
      graduationYear: '2012',
      jobRole: 'Dosen Muda Pendidikan Bahasa',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      socialMedia: 'linkedin.com/in/siti-rahmawati',
      message: 'Suasana sekolah yang asri dan ustadz-ustadzah yang sabar selalu menjadi kenangan paling manis.',
    }
  ]);

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handlePhotoUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setCustomPhotoPreview(simulatedUrl);
      setFormData({ ...formData, photoUrl: simulatedUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.jobRole) return;

    setSubmittedEntries([formData, ...submittedEntries]);
    setShowSuccessToast(true);

    // Reset form
    setFormData({
      fullName: '',
      graduationYear: '2018',
      jobRole: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      socialMedia: '',
      message: '',
    });
    setCustomPhotoPreview('');

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER (LEFT-ALIGNED WITH BREADCRUMB) */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto space-y-4 text-left">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pb-1">
            <ol className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-emerald-100">
              <li className="inline-flex items-center">
                <button
                  onClick={() => setActiveTab && setActiveTab('beranda')}
                  className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-emerald-100"
                >
                  <Home className="w-4 h-4 text-amber-300" />
                  <span>Beranda</span>
                </button>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                <button
                  onClick={() => setActiveTab && setActiveTab('alumni')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-emerald-100"
                >
                  Alumni
                </button>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                <span className="text-amber-300 font-bold" aria-current="page">
                  Formulir Pendataan
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-4xl">
            Formulir Pendataan Alumni
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-3xl">
            Silakan perbarui data diri Anda untuk mempererat silaturahmi dan memperluas jejaring alumni MI AL-AHMAD.
          </p>
        </div>
      </section>

      {/* FORM & SIDEBAR LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FORM (8 COLS) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Isi Informasi Data Alumni
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Lengkapi rincian di bawah ini. Anda dapat mengunggah berkas foto atau memasukkan URL gambar.
              </p>
            </div>

            {showSuccessToast && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#059669] text-sm font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#059669]" />
                <span>Data alumni berhasil disimpan! Profil Anda kini telah masuk direktori alumni di bawah.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nama Lengkap & Tahun Lulus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: dr. Nabilah Zahrani"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Tahun Lulus *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      required
                      min="1980"
                      max="2024"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>
              </div>

              {/* Pekerjaan / Profesi Saat Ini */}
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Pekerjaan / Profesi / Aktivitas Saat Ini *
                </label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dokter Spesialis / Mahasiswa / Wirausaha"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Foto Profil */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Foto Profil Alumni
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        useUrlInput ? 'bg-[#059669] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      URL Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        !useUrlInput ? 'bg-[#059669] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Unggah Berkas
                    </button>
                  </div>
                </div>

                {useUrlInput ? (
                  <div className="space-y-1">
                    <div className="relative">
                      <ImageIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... (URL foto)"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center space-y-1.5 bg-slate-50">
                    <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">Pilih berkas foto dari komputer Anda</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUploadSimulated}
                      className="block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#059669] hover:file:bg-emerald-100 cursor-pointer"
                    />
                  </div>
                )}

                {/* Preview Image Box */}
                {(formData.photoUrl || customPhotoPreview) && (
                  <div className="flex items-center gap-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={customPhotoPreview || formData.photoUrl}
                      alt="Preview Foto Alumni"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#059669]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                      }}
                    />
                    <div className="text-sm">
                      <p className="font-bold text-slate-800">Pratinjau Foto Profil Alumni</p>
                      <p className="text-slate-500 text-xs truncate max-w-xs">{formData.photoUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tautan Sosial Media */}
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
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
                <label className="block text-sm font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Pesan & Kesan Selama Sekolah di MI AL-AHMAD
                </label>
                <div className="relative">
                  <MessageSquare className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Tuliskan kenangan atau pesan untuk sekolah dan adik-adik..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#059669] text-white font-bold text-sm sm:text-base rounded-xl hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-5 h-5 text-amber-300" />
                  Simpan Data Alumni
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT SIDEBAR INFO (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold font-heading text-slate-900 text-lg">
                Sekretariat Ikatan Alumni
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Punya pertanyaan mengenai temu alumni, legalisir ijazah, atau jejaring karier? Hubungi sekretariat kami.
              </p>

              <div className="space-y-3 text-sm text-slate-700 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#059669] shrink-0" />
                  <span>Gedung Kesiswaan Lt. 2 MI AL-AHMAD</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#059669] shrink-0" />
                  <span>+62 812-9876-5432 (Ustadz Rahmat)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#059669] shrink-0" />
                  <span>alumni@mialahmad.sch.id</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DYNAMIC LIST OF SUBMITTED ALUMNI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#059669]" />
            Direktori Alumni Terdaftar ({submittedEntries.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submittedEntries.map((alm, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={alm.photoUrl}
                  alt={alm.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#059669] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                  }}
                />
                <div className="space-y-1">
                  <h4 className="font-bold font-heading text-slate-900 text-base">{alm.fullName}</h4>
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-[#059669] font-bold text-xs rounded border border-emerald-100">
                    Angkatan {alm.graduationYear}
                  </span>
                  <p className="font-medium text-slate-700 text-sm pt-0.5">{alm.jobRole}</p>
                </div>
              </div>

              {alm.message && (
                <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  "{alm.message}"
                </p>
              )}

              {alm.socialMedia && (
                <div className="pt-2 text-right border-t border-slate-100">
                  <a
                    href={`https://${alm.socialMedia}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#059669] hover:underline inline-flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" />
                    {alm.socialMedia}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
