import React from 'react';
import { SCHOOL_INFO } from '../../data/mockData';
import { X, MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: Record<string, string>;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  const schoolName = settings?.school_name || 'MI AL-AHMAD';
  const phone = settings?.school_phone || SCHOOL_INFO.phone;
  const whatsapp = settings?.school_whatsapp || '6281234567890';
  const email = settings?.school_email || SCHOOL_INFO.email;
  const address = settings?.school_address || SCHOOL_INFO.address;
  const hours = settings?.office_hours || 'Senin - Sabtu: 07.00 - 14.00 WIB';
  const isSchoolOpen = settings?.school_is_open !== 'false';
  const schoolStatusNote = settings?.school_status_note || '';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Assalamu'alaikum, saya ingin bertanya mengenai Informasi Pendaftaran PPDB ${schoolName}.`
    );
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] p-6 text-white rounded-t-2xl relative border-b-4 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 rounded-full p-1.5 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-emerald-100 border border-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Informasi & Layanan Pendaftaran PPDB
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Kontak Resmi {schoolName}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Quick WhatsApp Action Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-bold text-[#059669] uppercase tracking-wider text-sm">
                Layanan Cepat WhatsApp
              </p>
              <p className="text-slate-700 text-sm">Respons cepat panitia PPDB & Informasi</p>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl text-sm transition-colors shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              Chat Panitia
            </button>
          </div>

          {/* Contact Details List */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Alamat Lengkap Madrasah</p>
                <p className="text-sm text-slate-600 leading-relaxed">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Telepon Layanan Informasi</p>
                <p className="text-sm text-slate-600">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Email Resmi Sekolah</p>
                <p className="text-sm text-slate-600">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">Jam Operasional Tata Usaha</p>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                    isSchoolOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSchoolOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                    {isSchoolOpen ? 'Sedang Buka' : 'Sedang Tutup'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{hours}</p>
                {schoolStatusNote && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{schoolStatusNote}"</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
