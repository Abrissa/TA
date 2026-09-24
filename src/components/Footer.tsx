import React from 'react';
import { PageTab } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
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
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenContact }) => {
  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGoogleMaps = () => {
    window.open(
      'https://maps.google.com/?q=MI+AL-AHMAD+Krian+Sidoarjo',
      '_blank'
    );
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm font-body pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          {/* COL 1: Identity, Contact, Socials, Copyright (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo-mi-al-ahmad.png"
                alt="Logo MI AL-AHMAD"
                className="w-14 h-14 object-contain"
              />
              <div>
                <span className="block font-bold text-xl text-slate-900 font-heading leading-tight">
                  MI AL-AHMAD
                </span>
                <span className="block text-xs text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                  Sidoarjo - Jawa Timur
                </span>
              </div>
            </div>

            {/* Slogan */}
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Bersama MI AL-AHMAD, Berkarakter, Peduli & Berprestasi di Era Teknologi & Qur'ani.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{SCHOOL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://mialahmad.sch.id"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Website Resmi"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="TikTok"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs sm:text-sm text-slate-500 pt-2 font-medium">
              Copyright © 2026 All right reserved | MI AL-AHMAD Sidoarjo <br /> Supported by RPL SMK Krian 1 Sidoarjo
            </p>
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
                    onClick={onOpenContact}
                    className="hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    Kontak Informasi PPDB
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
      </div>
    </footer>
  );
};
