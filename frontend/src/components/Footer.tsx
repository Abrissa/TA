import React from 'react';
import { PageTab } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Share2,
  Lock,
  Clock,
} from 'lucide-react';

import { resolveImageUrl } from '../services/api';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
  settings?: Record<string, string>;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenContact, onOpenAdmin, settings }) => {
  const schoolName = settings?.school_name || 'MI AL-AHMAD';
  const schoolTagline = settings?.school_tagline || 'Sidoarjo - Jawa Timur';
  const logoUrl = resolveImageUrl(settings?.school_logo_url) || '/assets/logo-mi-al-ahmad.png';
  const footerDesc = settings?.footer_description || "Bersama MI AL-AHMAD, Berkarakter, Peduli & Berprestasi di Era Teknologi & Qur'ani.";
  const address = settings?.school_address || 'Jl. Setiabudi No. 12, Krian, Sidoarjo, Jawa Timur';
  const phone = settings?.school_phone || '(031) 8971234';
  const email = settings?.school_email || 'info@mialahmad.sch.id';
  const officeHours = settings?.office_hours || 'Senin - Sabtu: 07.00 - 14.00 WIB';
  const isSchoolOpen = settings?.school_is_open !== 'false';
  const mapsUrl = settings?.maps_embed_url || 'https://maps.google.com/?q=MI+AL-AHMAD+Krian+Sidoarjo';
  const isGeneric = (url?: string) => {
    if (!url) return true;
    const clean = url.trim().replace(/\/$/, '');
    return (
      clean === '' ||
      clean === 'https://instagram.com' ||
      clean === 'https://www.instagram.com' ||
      clean === 'https://facebook.com' ||
      clean === 'https://www.facebook.com' ||
      clean === 'https://youtube.com' ||
      clean === 'https://www.youtube.com' ||
      clean === 'https://tiktok.com' ||
      clean === 'https://www.tiktok.com'
    );
  };

  const socialIg = !isGeneric(settings?.social_instagram) 
    ? settings!.social_instagram 
    : 'https://www.instagram.com/mialahmadkrian';

  const socialFb = !isGeneric(settings?.social_facebook) 
    ? settings!.social_facebook 
    : 'https://www.facebook.com/mialahmadkrian';

  const socialYt = !isGeneric(settings?.social_youtube) && settings?.social_youtube !== 'https://www.youtube.com/@mialahmadkrian' && settings?.social_youtube !== 'https://youtube.com/@mialahmadkrian'
    ? settings!.social_youtube 
    : 'https://www.youtube.com/@mial-ahmadkrianofficial3604';

  const socialTt = !isGeneric(settings?.social_tiktok) 
    ? settings!.social_tiktok 
    : 'https://www.tiktok.com/@mialahmadkrian';

  const copyright = settings?.footer_copyright || 'Copyright © 2026 All right reserved | MI AL-AHMAD Sidoarjo';

  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGoogleMaps = () => {
    window.open(mapsUrl, '_blank');
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm font-body pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          {/* Col 1: Identity, Contact, Socials, Copyright */}
          <div className="lg:col-span-4 space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logoUrl || '/assets/logo-mi-al-ahmad.png'}
                alt={`Logo ${schoolName}`}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/assets/logo-mi-al-ahmad.png';
                }}
              />
              <div>
                <span className="block font-bold text-xl text-slate-900 font-heading leading-tight">
                  {schoolName}
                </span>
                <span className="block text-xs text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                  {schoolTagline}
                </span>
              </div>
            </div>

            {/* Slogan */}
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              {footerDesc}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-slate-700 font-medium">
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="flex items-start gap-2.5 text-left hover:text-emerald-700 transition-colors cursor-pointer group"
                title="Buka Lokasi MI AL-AHMAD di Google Maps"
              >
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-tight">{address}</span>
              </button>
              <div>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2.5 hover:text-emerald-700 transition-colors group"
                  title="Hubungi Telepon MI AL-AHMAD"
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{phone}</span>
                </a>
              </div>
              <div>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2.5 hover:text-emerald-700 transition-colors group"
                  title="Kirim Email ke MI AL-AHMAD"
                >
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{email}</span>
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-600">{officeHours}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  isSchoolOpen
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSchoolOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  {isSchoolOpen ? 'Buka' : 'Tutup'}
                </span>
              </div>
            </div>

            {/* Social Icons Connected to MI AL-AHMAD Krian */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://mialahmad.sch.id"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Website Resmi MI AL-AHMAD Krian (mialahmad.sch.id)"
                aria-label="Website Resmi MI AL-AHMAD Krian"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={socialIg}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Instagram Resmi MI AL-AHMAD Krian (@mialahmadkrian)"
                aria-label="Instagram Resmi MI AL-AHMAD Krian"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={socialTt}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="TikTok Resmi MI AL-AHMAD Krian (@mialahmadkrian)"
                aria-label="TikTok Resmi MI AL-AHMAD Krian"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href={socialFb}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Facebook Resmi MI AL-AHMAD Krian (@mialahmadkrian)"
                aria-label="Facebook Resmi MI AL-AHMAD Krian"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={socialYt}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="YouTube Resmi MI AL-AHMAD Krian (@mial-ahmadkrianofficial3604)"
                aria-label="YouTube Resmi MI AL-AHMAD Krian"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* COL 2: Menu Utama & Tentang Kami (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Menu Utama */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-base font-heading">Menu Utama</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>
                  <button
                    onClick={() => handleNavClick('beranda')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Beranda
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('visi-misi')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Profil Sekolah
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('artikel')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Berita & Pengumuman
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('prestasi')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Prestasi Siswa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('alumni')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Jejak Alumni
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenContact}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Kontak Layanan
                  </button>
                </li>
              </ul>
            </div>

            {/* Tentang Kami */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-base font-heading">Tentang Kami</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>
                  <button
                    onClick={() => handleNavClick('visi-misi')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Profil Sekolah & Visi Misi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('guru')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Profil Tenaga Pendidik
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('beranda')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Sarana Prasarana
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('ppdb')}
                    className="hover:text-emerald-600 font-semibold text-emerald-700 transition-colors cursor-pointer"
                  >
                    Pendaftaran PPDB Baru
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('form-alumni')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Form Pendataan Alumni
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenContact}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Kontak Layanan
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* COL 3: Kategori Berita & Informasi (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Kategori Berita */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-base font-heading">Kategori Berita</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>
                  <button
                    onClick={() => handleNavClick('prestasi')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Prestasi Siswa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('artikel')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Kegiatan Sekolah
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('artikel')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Pengumuman Resmi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('artikel')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Karya & Inovasi Siswa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('alumni')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Direktori Alumni
                  </button>
                </li>
              </ul>
            </div>

            {/* Informasi */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-base font-heading">Informasi</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>
                  <button
                    onClick={() => handleNavClick('visi-misi')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Program Unggulan Tahfidz
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('beranda')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Ekstrakurikuler Siswa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('artikel')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Kalender Akademik
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('prestasi')}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Prestasi Siswa
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* COL 4: Lokasi Sekolah (Google Maps Card - 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 text-base font-heading">Lokasi Sekolah</h4>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group bg-slate-100">

              {/* Maps Card Image Preview */}
              <div className="relative h-44 w-full">
                <img
                  src="/assets/gedung-mi-al-ahmad.jpg"
                  alt="Lokasi Peta MI AL-AHMAD"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/gedung-mi-al-ahmad.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors" />

                {/* Map Pin Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="bg-slate-900/90 text-white text-xs font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap mt-1">
                    MI AL-AHMAD
                  </span>
                </div>

                {/* Buka di Maps Button Badge */}
                <button
                  onClick={handleOpenGoogleMaps}
                  className="absolute top-2 left-2 bg-white/95 hover:bg-white text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Buka di Maps</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </button>
              </div>

              <div className="p-3 bg-white border-t border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-800">BPPPM NU AL-AHMAD KRIAN</p>
                <p className="text-xs text-slate-500 truncate">Jl. Raya Pendidikan, Sidoarjo</p>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-Footer Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="font-medium text-slate-600">Copyright © 2026 All right reserved | MI AL-AHMAD Sidoarjo</p>
            <p className="text-slate-400">Supported by RPL SMK Krian 1 Sidoarjo</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.history.pushState(null, '', '/portal-admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Portal Administrator</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
