import React, { useState, useRef, useEffect } from 'react';
import { PageTab } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Trophy,
  Newspaper,
  UserCheck,
  Target,
  Users,
  Phone,
  Clock,
  Award,
  FileText
} from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isProfileActive = ['visi-misi', 'guru', 'alumni', 'profil'].includes(activeTab);

  const profileSubItems: { id: PageTab; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'visi-misi',
      label: 'Visi & Misi',
      desc: 'Landasan Nilai & Haluan Pendidikan Madrasah',
      icon: <Target className="w-4 h-4 text-[#059669]" />
    },
    {
      id: 'guru',
      label: 'Guru & Tenaga Kependidikan',
      desc: 'Profil Pendidik Profesional & Staf Pengajar',
      icon: <Users className="w-4 h-4 text-[#059669]" />
    },
    {
      id: 'alumni',
      label: 'Jejak Alumni',
      desc: 'Profil Lulusan & Testimonial Alumni',
      icon: <UserCheck className="w-4 h-4 text-[#059669]" />
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">

      {/* 1. TOP UTILITY HEADER BAR (FORMAL SCHOOL INFORMATION) */}
      <div className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white text-xs py-2 px-4 border-b border-emerald-900/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left: Official Codes & Accreditation */}
          <div className="flex items-center gap-4 text-emerald-100 font-medium">
            <span className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-0.5 rounded text-[11px] font-semibold text-emerald-200 border border-emerald-700/50">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Akreditasi {SCHOOL_INFO.accreditation}
            </span>
            <span>NPSN: <strong>{SCHOOL_INFO.npsn}</strong></span>
            <span className="text-emerald-500">•</span>
            <span>NSM: <strong>{SCHOOL_INFO.nsm}</strong></span>
          </div>

          {/* Right: Operational Hours & Quick Contact */}
          <div className="flex items-center gap-6 text-emerald-100">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              Senin - Sabtu: 07.00 - 14.00 WIB
            </span>
            <button
              onClick={onOpenContact}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              {SCHOOL_INFO.phone}
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo & Title */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-12 h-14 sm:w-13 sm:h-[58px] shrink-0">
              <img
                alt="Logo MI AL-AHMAD"
                className="w-full h-full object-contain"
                src="/assets/logo-mi-al-ahmad.png"
              />
            </div>
            <div>
              <span className="block font-extrabold text-xl sm:text-2xl text-emerald-700 tracking-tight font-heading leading-none">
                MI AL-AHMAD
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1 font-body">
                Madrasah Ibtidaiyah Sidoarjo
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">

            {/* Beranda */}
            <button
              onClick={() => handleNavClick('beranda')}
              className={`px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'beranda'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Beranda
            </button>

            {/* Profil Sekolah (Dropdown Menu) */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`px-3 py-2 text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  isProfileActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <span>Profil Sekolah</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profil Dropdown Menu Overlay */}
              {profileDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-0.5">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Informasi Kelembagaan
                    </div>
                    {profileSubItems.map((subItem) => {
                      const isSubActive = activeTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavClick(subItem.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                            isSubActive
                              ? 'bg-slate-50 text-emerald-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                          }`}
                        >
                          <div className="text-sm font-bold flex items-center justify-between">
                            <span>{subItem.label}</span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                            {subItem.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Prestasi */}
            <button
              onClick={() => handleNavClick('prestasi')}
              className={`px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'prestasi'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Prestasi
            </button>

            {/* Berita & Artikel */}
            <button
              onClick={() => handleNavClick('artikel')}
              className={`px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'artikel'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Berita & Artikel
            </button>

            {/* Form Alumni */}
            <button
              onClick={() => handleNavClick('form-alumni')}
              className={`px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'form-alumni'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Form Alumni
            </button>

          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#059669] to-[#047857] text-white hover:from-[#047857] hover:to-[#065f46] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              Info PPDB & Kontak
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-md">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#059669] flex items-center justify-between">
            <div>
              <p className="font-bold">NPSN: {SCHOOL_INFO.npsn} | NSM: {SCHOOL_INFO.nsm}</p>
              <p className="text-[11px] text-slate-600">Akreditasi {SCHOOL_INFO.accreditation}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-200 text-[#059669] font-bold text-[10px]">TERDAFTAR</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('beranda')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-3 cursor-pointer ${activeTab === 'beranda' ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            {/* Mobile Profil Group */}
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 space-y-1">
              <button
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                className="w-full text-left px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center justify-between cursor-pointer"
              >
                <span>PROFIL SEKOLAH</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileProfileOpen && (
                <div className="space-y-1 pl-1">
                  {profileSubItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavClick(subItem.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${activeTab === subItem.id
                          ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white'
                          : 'text-slate-700 hover:bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('prestasi')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-3 cursor-pointer ${activeTab === 'prestasi' ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Prestasi</span>
            </button>

            <button
              onClick={() => handleNavClick('artikel')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-3 cursor-pointer ${activeTab === 'artikel' ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Berita & Artikel</span>
            </button>

            <button
              onClick={() => handleNavClick('form-alumni')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-3 cursor-pointer ${activeTab === 'form-alumni' ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Form Alumni</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#059669] to-[#047857] text-white font-bold text-sm shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              Informasi PPDB & Kontak
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
