import React, { useState } from 'react';
import { AlumniFormData } from '../types';
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
  Users
} from 'lucide-react';

export const AlumniFormView: React.FC = () => {
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
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 border border-white/20 text-xs font-semibold">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Pendataan Resmi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Formulir Pendataan Alumni
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
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
              <h2 className="text-xl font-bold font-heading text-slate-900">
                Isi Informasi Data Alumni
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lengkapi rincian di bawah ini. Anda dapat mengunggah berkas foto atau memasukkan URL gambar.
              </p>
            </div>

            {showSuccessToast && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#059669]" />
                <span>Data alumni berhasil disimpan! Profil Anda kini telah masuk direktori alumni di bawah.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* Nama Lengkap & Tahun Lulus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: dr. Nabilah Zahrani"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tahun Lulus *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      required
                      min="1980"
                      max="2024"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>
              </div>

              {/* Pekerjaan / Profesi Saat Ini */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pekerjaan / Profesi / Aktivitas Saat Ini *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dokter Spesialis / Mahasiswa / Wirausaha"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Foto Profil */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Foto Profil Alumni
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(true)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                        useUrlInput ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      URL Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(false)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                        !useUrlInput ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Unggah Berkas
                    </button>
                  </div>
                </div>

                {useUrlInput ? (
                  <div className="space-y-1">
                    <div className="relative">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... (URL foto)"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center space-y-1 bg-slate-50">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">Pilih berkas foto dari komputer Anda</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUploadSimulated}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#059669] hover:file:bg-emerald-100 cursor-pointer"
                    />
                  </div>
                )}

                {/* Preview Image Box */}
                {(formData.photoUrl || customPhotoPreview) && (
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <img
                      src={customPhotoPreview || formData.photoUrl}
                      alt="Preview Foto Alumni"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#059669]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                      }}
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">Pratinjau Foto Profil Alumni</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-xs">{formData.photoUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tautan Sosial Media */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sosial Media / LinkedIn (Opsional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="instagram.com/username atau linkedin.com/in/username"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Pesan & Kesan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pesan & Kesan Selama Sekolah di MI AL-AHMAD
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <textarea
                    rows={3}
                    placeholder="Tuliskan kenangan atau pesan untuk sekolah dan adik-adik..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#059669] text-white font-bold text-xs rounded-lg hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  Simpan Data Alumni
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT SIDEBAR INFO (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold font-heading text-slate-900 text-base">
                Sekretariat Ikatan Alumni
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Punya pertanyaan mengenai temu alumni, legalisir ijazah, atau jejaring karier? Hubungi sekretariat kami.
              </p>

              <div className="space-y-2.5 text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span>Gedung Kesiswaan Lt. 2 MI AL-AHMAD</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#059669]" />
                  <span>+62 812-9876-5432 (Ustadz Rahmat)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#059669]" />
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
          <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#059669]" />
            Direktori Alumni Terdaftar ({submittedEntries.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submittedEntries.map((alm, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
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
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-bold font-heading text-slate-900 text-sm">{alm.fullName}</h4>
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-[#059669] font-bold text-[10px] rounded border border-emerald-100">
                    Angkatan {alm.graduationYear}
                  </span>
                  <p className="font-medium text-slate-600 pt-0.5">{alm.jobRole}</p>
                </div>
              </div>

              {alm.message && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  "{alm.message}"
                </p>
              )}

              {alm.socialMedia && (
                <div className="pt-1 text-right">
                  <a
                    href={`https://${alm.socialMedia}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#059669] hover:underline inline-flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
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
