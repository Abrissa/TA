import React, { useState } from 'react';
import { api } from '../../services/api';
import { PPDBFormData } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Send, 
  Loader2, 
  Copy, 
  MessageSquare, 
  User, 
  MapPin, 
  School, 
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PPDBModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PPDBModal: React.FC<PPDBModalProps> = ({ isOpen, onClose }) => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_number: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSaya ${formData.parentName}, wali dari ananda ${formData.childFullName}, telah melengkapi formulir pendaftaran PPDB Online MI AL-AHMAD dengan Nomor Registrasi: *${successData.registration_number}*.\n\nMohon informasi verifikasi berkas dan jadwal observasi selanjutnya. Terima kasih.`
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] p-6 text-white rounded-t-2xl relative border-b-4 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-1.5 transition-colors cursor-pointer"
            aria-label="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-emerald-100 border border-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Penerimaan Peserta Didik Baru (PPDB) 2026/2027
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Formulir Pendaftaran Santri Baru
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Lengkapi biodata ananda di bawah ini untuk memulai proses pendaftaran resmi di MI AL-AHMAD.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1">
          {successData ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-1 border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  Pendaftaran Berhasil Terkirim!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Data ananda <strong className="text-slate-900">{formData.childFullName}</strong> telah tercatat pada basis data panitia PPDB MI AL-AHMAD Krian.
                </p>
              </div>

              {/* Registration Code Badge Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 max-w-sm mx-auto space-y-2">
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Nomor Registrasi PPDB Anda
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-wider">
                    {successData.registration_number}
                  </span>
                  <button
                    onClick={handleCopyRegNumber}
                    className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="Salin Nomor Registrasi"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-600 font-semibold">Berhasil disalin ke papan klip!</p>
                )}
              </div>

              {/* Guidance & Next Steps */}
              <div className="text-left bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 space-y-2">
                <p className="font-bold text-slate-900">Langkah Verifikasi Selanjutnya:</p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                  <li>Simpan atau tangkap layar bukti nomor registrasi di atas.</li>
                  <li>Kirim konfirmasi via WhatsApp ke Panitia PPDB dengan menekan tombol hijau di bawah.</li>
                  <li>Panitia akan menjadwalkan agenda observasi kesiapan belajar dan penyerahan berkas fisik.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppConfirm}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-amber-300" />
                  <span>Konfirmasi via WhatsApp Panitia</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            /* FORM INPUT VIEW */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Group 1: Data Calon Santri */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 text-slate-800 font-bold text-sm">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Biodata Calon Santri</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Calon Santri <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="childFullName"
                    required
                    value={formData.childFullName}
                    onChange={handleChange}
                    placeholder="Contoh: Muhammad Rayhan Al-Fatih"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors bg-white"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Asal Sekolah / TK / RA <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="previousSchool"
                      required
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder="Contoh: RA Muslimat NU Krian"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tempat Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      required
                      value={formData.birthPlace}
                      onChange={handleChange}
                      placeholder="Contoh: Sidoarjo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      required
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Data Orang Tua / Kontak */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 text-slate-800 font-bold text-sm">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Data Orang Tua & Kontak Verifikasi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Contoh: H. Hendra Setiawan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Domisili <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nama jalan, RT/RW, Dusun, Desa/Kelurahan, Kecamatan, Kab. Sidoarjo"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submission Button */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-950/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim data...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pendaftaran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
