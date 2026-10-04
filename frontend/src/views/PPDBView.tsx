import React, { useState, useEffect } from 'react';
import { api, MasterPpdbPath } from '../services/api';
import { PPDBFormData } from '../types';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  User,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Loader2,
  Copy,
  MessageSquare,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollFadeUp, StaggerContainer, StaggerItem } from '../components/ui/ScrollReveal';

interface PPDBViewProps {
  onOpenContact?: () => void;
  settings?: Record<string, string>;
}

export const PPDBView: React.FC<PPDBViewProps> = ({ settings: propSettings }) => {
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(propSettings || {});

  useEffect(() => {
    if (!propSettings || Object.keys(propSettings).length === 0) {
      api.getSettings().then((res) => {
        if (res) setSiteSettings(res);
      }).catch(() => {});
    } else {
      setSiteSettings(propSettings);
    }
  }, [propSettings]);

  const [formData, setFormData] = useState<PPDBFormData>({
    childFullName: '',
    gender: 'Laki-laki',
    birthPlace: '',
    birthDate: '',
    parentName: '',
    whatsapp: '',
    address: '',
    previousSchool: '',
  });

  const [ppdbPaths, setPpdbPaths] = useState<MasterPpdbPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('REGULER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_number: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch dynamic master PPDB paths
    api.getMasterData().then((res) => {
      if (res?.ppdb_paths && res.ppdb_paths.length > 0) {
        setPpdbPaths(res.ppdb_paths.filter(p => p.is_active));
      }
    }).catch(() => {
      // Fallback default paths
      setPpdbPaths([
        { id: 1, code: 'REGULER', name: 'Jalur Reguler Umum', quota: 60, is_active: true, description: 'Observasi kesiapan belajar mandiri dan adaptasi sosial anak.' },
        { id: 2, code: 'PRESTASI', name: 'Jalur Prestasi Sains & Seni', quota: 30, is_active: true, description: 'Bagi santri dengan piagam kejuaraan minimal tingkat kecamatan.' },
        { id: 3, code: 'TAHFIDZ', name: 'Jalur Khusus Tahfidz', quota: 30, is_active: true, description: 'Bagi santri dengan hafalan minimal Juz 30 dengan tajwid tartil.' },
      ]);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.submitPpdbForm(formData);
      setSuccessData(res);
      const formEl = document.getElementById('formulir-ppdb');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Gagal mengirimkan formulir PPDB. Silakan periksa kembali data Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRegNumber = () => {
    if (successData?.registration_number) {
      navigator.clipboard.writeText(successData.registration_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenWhatsAppConfirm = () => {
    if (!successData) return;
    const msg = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSaya ${formData.parentName}, wali dari ananda *${formData.childFullName}*, telah melengkapi formulir pendaftaran PPDB Online MI AL-AHMAD dengan Nomor Registrasi: *${successData.registration_number}*.\n\nMohon petunjuk jadwal verifikasi berkas fisik dan observasi ananda. Terima kasih.`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  };

  const handleReset = () => {
    setFormData({
      childFullName: '',
      gender: 'Laki-laki',
      birthPlace: '',
      birthDate: '',
      parentName: '',
      whatsapp: '',
      address: '',
      previousSchool: '',
    });
    setSuccessData(null);
    setError(null);
  };

  const schoolName = siteSettings.school_name || 'MI AL-AHMAD Krian';
  const academicYear = siteSettings.ppdb_academic_year || '2026/2027';
  const wave = siteSettings.ppdb_wave || 'Gelombang 1';
  const dates = siteSettings.ppdb_dates || '01 Nov 2025 - 30 Mar 2026';
  const accreditation = siteSettings.school_accreditation || 'A (Unggul)';
  const introText = siteSettings.ppdb_intro_text || "Mari bergabung bersama keluarga besar madrasah berprestasi dengan kurikulum integrasi Kemenag, pembinaan tahfidz Al-Qur'an terpadu, dan pembinaan sains berstandar internasional.";
  const contactPerson = siteSettings.ppdb_contact_person || '0812-3456-7890 (Ust. Ridwan)';
  const phone = siteSettings.school_phone || '(031) 8971234';
  const hours = siteSettings.office_hours || 'Senin - Sabtu: 07.00 - 14.00 WIB';
  const logoUrl = siteSettings.school_logo_url || '/assets/logo-mi-al-ahmad.png';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <section className="relative bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#0f766e] text-white py-16 sm:py-20 lg:py-24 overflow-hidden border-b-4 border-amber-400">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase text-emerald-100 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>PPDB Tahun Ajaran {academicYear} • {wave}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Penerimaan Peserta Didik Baru <br className="hidden sm:inline" />
              <span className="text-amber-300">{schoolName}</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/95 leading-relaxed font-body">
              {introText}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-emerald-100">
              <div className="flex items-center gap-2 bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-700/50">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Pendaftaran: <strong>{dates}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-700/50">
                <Award className="w-4 h-4 text-emerald-300" />
                <span>Akreditasi: <strong>{accreditation}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(ppdbPaths.length > 0 ? ppdbPaths : [
            { id: 1, code: 'REGULER', name: 'Jalur Reguler Umum', quota: 60, description: 'Observasi kesiapan belajar mandiri dan adaptasi sosial anak.' },
            { id: 2, code: 'PRESTASI', name: 'Jalur Prestasi Sains & Seni', quota: 30, description: 'Bagi santri dengan piagam kejuaraan minimal tingkat kecamatan.' },
            { id: 3, code: 'TAHFIDZ', name: 'Jalur Khusus Tahfidz', quota: 30, description: 'Bagi santri dengan hafalan minimal Juz 30 dengan tajwid tartil.' },
          ]).map((path, idx) => (
            <div
              key={path.id || idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Jalur {path.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Kuota: <strong className="text-emerald-700">{path.quota} Siswa</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {path.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                  {path.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Kuota Terbuka</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <ScrollFadeUp direction="up" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1.5 rounded-full">
            Alur Pendaftaran Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            Tahapan Penerimaan Santri Baru
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Proses seleksi dirancang ramah anak dengan pendekatan observasi edukatif tanpa tekanan ujian formal.
          </p>
        </ScrollFadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { phase: 'Tahap 1', title: 'Pendaftaran Online', desc: 'Lengkapi biodata calon santri dan kontak wali secara daring melalui formulir di bawah ini.' },
            { phase: 'Tahap 2', title: 'Penerbitan Bukti Daftar', desc: 'Simpan nomor registrasi resmi yang diterbitkan sistem untuk konfirmasi berkas panitia.' },
            { phase: 'Tahap 3', title: 'Observasi Ramah Anak', desc: 'Ananda diundang mengikuti observasi kesiapan belajar dan penyerahan berkas fisik.' },
            { phase: 'Tahap 4', title: 'Pengumuman & Registrasi', desc: 'Pemberitahuan hasil seleksi resmi melalui portal website dan kontak WhatsApp terdaftar.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
                {item.phase}
              </span>
              <h4 className="font-bold text-slate-900 text-base font-heading mb-2">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="formulir-ppdb" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] p-6 sm:p-8 text-white border-b-4 border-amber-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                <img 
                  src={logoUrl || '/assets/logo-mi-al-ahmad.png'} 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.src = '/assets/logo-mi-al-ahmad.png';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Formulir Pendaftaran Online Santri Baru
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                  Tahun Ajaran {academicYear} • {schoolName}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {successData ? (
              /* TAMPILAN SUKSES PENDAFTARAN */
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-xs">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                    Pendaftaran Berhasil Dikirim!
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Alhamdulillah, berkas data pendaftaran ananda <strong className="text-slate-900">{formData.childFullName}</strong> telah tercatat pada pangkalan data panitia PPDB MI AL-AHMAD.
                  </p>
                </div>

                {/* Nomor Registrasi Badge */}
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 max-w-md mx-auto space-y-3">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest block">
                    Nomor Registrasi Resmi
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-wider">
                      {successData.registration_number}
                    </span>
                    <button
                      onClick={handleCopyRegNumber}
                      className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
                      title="Salin Nomor Registrasi"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-emerald-700 font-bold animate-fade-in">
                      Nomor registrasi berhasil disalin!
                    </p>
                  )}
                </div>

                {/* Panduan Konfirmasi WhatsApp */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-xl mx-auto space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Langkah Verifikasi Selanjutnya</span>
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <li>Simpan nomor registrasi resmi di atas (bisa difoto atau tangkap layar).</li>
                    <li>Lakukan konfirmasi langsung ke nomor WhatsApp Panitia PPDB dengan menekan tombol di bawah.</li>
                    <li>Panitia akan memberikan jadwal observasi ramah anak dan jadwal penyerahan berkas fisik (Akta, KK, Foto).</li>
                  </ol>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleOpenWhatsAppConfirm}
                    className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-300" />
                    <span>Konfirmasi WhatsApp Panitia</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Daftar Calon Santri Lain
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULIR MASUKAN */
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Biodata Calon Santri */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-base">
                    <User className="w-5 h-5 text-emerald-700" />
                    <span>Biodata Calon Santri</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Nama Lengkap Calon Santri <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="childFullName"
                      required
                      value={formData.childFullName}
                      onChange={handleChange}
                      placeholder="Contoh: Muhammad Rayhan Al-Fatih"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Jenis Kelamin <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white cursor-pointer"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Asal Sekolah / TK / RA <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="previousSchool"
                        required
                        value={formData.previousSchool}
                        onChange={handleChange}
                        placeholder="Contoh: RA Muslimat NU Krian"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Tempat Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="birthPlace"
                        required
                        value={formData.birthPlace}
                        onChange={handleChange}
                        placeholder="Contoh: Sidoarjo"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Tanggal Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        required
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Orang Tua & Kontak */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-base">
                    <Phone className="w-5 h-5 text-emerald-700" />
                    <span>Data Orang Tua & Kontak Verifikasi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Nama Lengkap Orang Tua / Wali <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleChange}
                        placeholder="Contoh: H. Hendra Setiawan"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="081234567890"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">Digunakan panitia untuk mengirim jadwal observasi dan informasi daftar ulang.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Alamat Lengkap Domisili <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Nama jalan, RT/RW, Dusun, Desa/Kelurahan, Kecamatan, Kab. Sidoarjo"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Section 3: Pernyataan & Tombol Kirim */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      Dengan menekan tombol di bawah, saya menyatakan bahwa data yang diisikan adalah benar dan bersedia mengikuti tahapan seleksi observasi sesuai ketentuan madrasah.
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirim Formulir...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Pendaftaran Santri Baru</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm space-y-2 shadow-xs">
          <p className="font-bold text-slate-800">Butuh Informasi Lebih Lanjut mengenai PPDB?</p>
          <p>Layanan Informasi & Tata Usaha: <strong>{phone}</strong> • WhatsApp Panitia: <strong>{contactPerson}</strong></p>
          <p className="text-slate-500">Jam Layanan Kantor: {hours} di Kantor Panitia PPDB Kampus {schoolName}.</p>
        </div>
      </section>
    </div>
  );
};
