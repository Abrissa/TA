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
  FileText,
  GraduationCap
} from 'lucide-react';

import { resolveImageUrl } from '../services/api';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
  onOpenPPDB?: () => void;
  onOpenAdmin?: () => void;
  settings?: Record<string, string>;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenContact,
  onOpenPPDB,
  onOpenAdmin,
  settings,
}) => {
  const schoolName = settings?.school_name || 'MI AL-AHMAD';
  const schoolTagline = settings?.school_tagline || 'Madrasah Ibtidaiyah Sidoarjo';
  const logoUrl = resolveImageUrl(settings?.school_logo_url) || '/assets/logo-mi-al-ahmad.png';
  const accreditation = settings?.school_accreditation || SCHOOL_INFO.accreditation;
  const npsn = settings?.school_npsn || SCHOOL_INFO.npsn;
  const nsm = settings?.school_nsm || SCHOOL_INFO.nsm;
  const officeHours = settings?.office_hours || 'Senin - Sabtu: 07.00 - 14.00 WIB';
  const isSchoolOpen = settings?.school_is_open !== 'false';
  const schoolStatusNote = settings?.school_status_note || '';
  const phone = settings?.school_phone || SCHOOL_INFO.phone;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [alumniDropdownOpen, setAlumniDropdownOpen] = useState(false);
  const [mobileAlumniOpen, setMobileAlumniOpen] = useState(true);
  const alumniDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (alumniDropdownRef.current && !alumniDropdownRef.current.contains(event.target as Node)) {
        setAlumniDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setAlumniDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isProfileActive = ['visi-misi', 'guru', 'profil'].includes(activeTab);
  const isAlumniActive = ['alumni', 'form-alumni'].includes(activeTab);

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
  ];

  const alumniSubItems: { id: PageTab; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'alumni',
      label: 'Jejak Alumni',
      desc: 'Profil Lulusan & Testimonial Alumni',
      icon: <GraduationCap className="w-4 h-4 text-[#059669]" />
    },
    {
      id: 'form-alumni',
      label: 'Form Pendataan Alumni',
      desc: 'Formulir Penelusuran & Update Data Alumni',
      icon: <UserCheck className="w-4 h-4 text-[#059669]" />
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Header Bar */}
      <div className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white text-xs sm:text-sm py-2 px-4 border-b border-emerald-900/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left: Official Codes & Accreditation */}
          <div className="flex items-center gap-4 text-emerald-100 font-medium">
            <span className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-0.5 rounded text-xs font-bold text-emerald-200 border border-emerald-700/50">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Akreditasi {accreditation}
            </span>
            <span>NPSN: <strong>{npsn}</strong></span>
            <span className="text-emerald-500">•</span>
            <span>NSM: <strong>{nsm}</strong></span>
          </div>

          {/* Right: Operational Hours, School Status & Quick Contact */}
          <div className="flex items-center gap-5 text-emerald-100">
            {/* Status Sekolah Buka/Tutup Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs transition-colors ${
                  isSchoolOpen
                    ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-400/40'
                    : 'bg-rose-950/80 text-rose-200 border border-rose-400/50'
                }`}
                title={isSchoolOpen ? 'Madrasah sedang beroperasi / buka' : 'Madrasah sedang tutup / libur'}
              >
                <span className={`w-2 h-2 rounded-full ${isSchoolOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                <span>{isSchoolOpen ? 'BUKA' : 'TUTUP'}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>{officeHours}</span>
                {schoolStatusNote && (
                  <span className="text-[11px] text-emerald-200/90 font-normal">({schoolStatusNote})</span>
                )}
              </span>
            </div>

            <button
              onClick={onOpenContact}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              {phone}
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo & Title */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-12 h-14 sm:w-13 sm:h-[58px] shrink-0">
              <img
                alt={`Logo ${schoolName}`}
                className="w-full h-full object-contain"
                src={logoUrl || '/assets/logo-mi-al-ahmad.png'}
                onError={(e) => {
                  e.currentTarget.src = '/assets/logo-mi-al-ahmad.png';
                }}
              />
            </div>
            <div>
              <span className="block font-extrabold text-xl sm:text-2xl text-emerald-700 tracking-tight font-heading leading-none">
                {schoolName}
              </span>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 font-body">
                {schoolTagline}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">

            {/* Beranda */}
            <button
              onClick={() => handleNavClick('beranda')}
              className={`px-3 py-2 text-[15px] font-semibold transition-colors cursor-pointer ${
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
                className={`px-3 py-2 text-[15px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
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
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
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
                          <div className="text-xs text-slate-500 font-normal leading-tight mt-0.5">
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
              className={`px-3 py-2 text-[15px] font-semibold transition-colors cursor-pointer ${
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
              className={`px-3 py-2 text-[15px] font-semibold transition-colors cursor-pointer ${
                activeTab === 'artikel'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Berita & Artikel
            </button>

            {/* Alumni (Dropdown Menu) */}
            <div
              className="relative"
              ref={alumniDropdownRef}
              onMouseEnter={() => setAlumniDropdownOpen(true)}
              onMouseLeave={() => setAlumniDropdownOpen(false)}
            >
              <button
                onClick={() => setAlumniDropdownOpen(!alumniDropdownOpen)}
                className={`px-3 py-2 text-[15px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  isAlumniActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
                aria-expanded={alumniDropdownOpen}
                aria-haspopup="true"
              >
                <span>Alumni</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${alumniDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Alumni Dropdown Menu Overlay */}
              {alumniDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-0.5">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                      Jejak & Pendataan Alumni
                    </div>
                    {alumniSubItems.map((subItem) => {
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
                          <div className="text-xs text-slate-500 font-normal leading-tight mt-0.5">
                            {subItem.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenContact}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors border border-slate-200 cursor-pointer"
            >
              Kontak
            </button>
            <button
              onClick={() => handleNavClick('ppdb')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                activeTab === 'ppdb'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                  : 'bg-gradient-to-r from-[#059669] to-[#047857] text-white hover:from-[#047857] hover:to-[#065f46]'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'ppdb' ? 'text-slate-950' : 'text-amber-300'}`} />
              <span>Daftar PPDB</span>
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
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm flex items-center justify-between">
            <div>
              <p className="font-bold text-[#059669]">NPSN: {npsn} | NSM: {nsm}</p>
              <p className="text-xs text-slate-600">Akreditasi {accreditation}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-emerald-600" />
                {officeHours}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                isSchoolOpen
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSchoolOpen ? 'bg-emerald-200 animate-pulse' : 'bg-rose-200'}`}></span>
                {isSchoolOpen ? 'BUKA' : 'TUTUP'}
              </span>
              {schoolStatusNote && (
                <span className="text-[10px] text-slate-500 max-w-[120px] truncate">{schoolStatusNote}</span>
              )}
            </div>
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

            {/* Mobile Alumni Group */}
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 space-y-1">
              <button
                onClick={() => setMobileAlumniOpen(!mobileAlumniOpen)}
                className="w-full text-left px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center justify-between cursor-pointer"
              >
                <span>ALUMNI</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAlumniOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileAlumniOpen && (
                <div className="space-y-1 pl-1">
                  {alumniSubItems.map((subItem) => (
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
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                handleNavClick('ppdb');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] text-white font-bold text-sm shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Daftar PPDB Online</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Informasi & Kontak Layanan
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
