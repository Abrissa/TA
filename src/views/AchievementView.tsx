import React, { useState, useEffect } from 'react';
import { ACHIEVEMENTS_DATA, HISTORICAL_MILESTONES } from '../data/mockData';
import { Achievement, PageTab } from '../types';
import {
  Trophy,
  Award,
  Star,
  Sparkles,
  Eye,
  X,
  CheckCircle2,
  Calendar,
  Medal,
  ChevronRight,
  ChevronLeft,
  PhoneCall,
  Flame,
  ShieldCheck,
  Search,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AchievementViewProps {
  onOpenContact: () => void;
  setActiveTab?: (tab: PageTab) => void;
}

export const AchievementView: React.FC<AchievementViewProps> = ({ onOpenContact, setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<Achievement | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  // Auto-play timer: slides continuously and loops infinitely 1 -> 2 -> 3 -> 4 -> 5 -> 1 ...
  useEffect(() => {
    if (activeModalItem) return; // Pause only if user opened the full poster modal
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % ACHIEVEMENTS_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeModalItem]);

  const handleNextSpotlight = () => {
    setSpotlightIndex((prev) => (prev + 1) % ACHIEVEMENTS_DATA.length);
  };

  const handlePrevSpotlight = () => {
    setSpotlightIndex((prev) => (prev - 1 + ACHIEVEMENTS_DATA.length) % ACHIEVEMENTS_DATA.length);
  };

  const activeSpotlight = ACHIEVEMENTS_DATA[spotlightIndex];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [
    { label: 'Semua', count: ACHIEVEMENTS_DATA.length },
    { label: 'Internasional', count: ACHIEVEMENTS_DATA.filter((a) => a.category === 'Internasional').length },
    { label: 'Se-Pulau Jawa', count: ACHIEVEMENTS_DATA.filter((a) => a.category === 'Se-Pulau Jawa').length },
    { label: 'Kecamatan', count: ACHIEVEMENTS_DATA.filter((a) => a.category === 'Kecamatan').length },
  ].filter((cat) => cat.count > 0);

  const filteredAchievements = ACHIEVEMENTS_DATA.filter((ach) => {
    const matchesCategory =
      selectedCategory === 'Semua' || ach.category === selectedCategory;
    const matchesSearch =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.winner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ach.event && ach.event.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ach.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Internasional':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-xs';
      case 'Se-Pulau Jawa':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xs';
      case 'Regional':
        return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-xs';
      case 'Kecamatan':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-xs';
      default:
        return 'bg-slate-800 text-white font-bold';
    }
  };

  return (
    <div className="space-y-12 pb-20 bg-slate-50/50 min-h-screen">
      {/* 1. HERO HEADER BANNER (LEFT-ALIGNED WITH BREADCRUMB) */}
      <section className="bg-[#047857] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
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
                <span className="text-amber-300 font-bold" aria-current="page">
                  Prestasi Siswa
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-4xl">
            Etalase Prestasi Gemilang <br />
            <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">
              Siswa MI AL-AHMAD
            </span>
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg max-w-3xl leading-relaxed">
            Bukti nyata dedikasi, kedisiplinan, dan ikhtiar santri bersama para pembimbing dalam mengharumkan nama madrasah dari tingkat kecamatan hingga kancah internasional.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* SPOTLIGHT SLIDER BANNER: BERGERAK BERGANTIAN SECARA OTOMATIS & MANUAL */}
        <div
          className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/40 shadow-xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Slider Controls Bar */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-sm font-bold border border-emerald-600/50">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Sorotan Prestasi Utama
              </span>
            </div>

            {/* Prev / Next Buttons & Counter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-amber-300 mr-1">
                {String(spotlightIndex + 1).padStart(2, '0')} / {String(ACHIEVEMENTS_DATA.length).padStart(2, '0')}
              </span>
              <button
                onClick={handlePrevSpotlight}
                aria-label="Prestasi Sebelumnya"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                title="Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSpotlight}
                aria-label="Prestasi Berikutnya"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                title="Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Animated Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpotlight.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10"
            >
              {/* Poster Thumbnail Clickable */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => setActiveModalItem(activeSpotlight)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/60 max-w-sm w-full bg-white/5 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={activeSpotlight.imageUrl}
                    alt={activeSpotlight.title}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
                    <div className="px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center gap-2 shadow-lg">
                      <Eye className="w-4 h-4" />
                      Lihat Poster Full
                    </div>
                  </div>
                </div>
              </div>

              {/* Spotlight Details */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3.5 py-1.5 rounded-full text-sm font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${getCategoryBadgeStyle(activeSpotlight.category)}`}>
                    <Trophy className="w-4 h-4" />
                    Tingkat {activeSpotlight.category}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-sm font-semibold border border-emerald-600/50">
                    Tahun {activeSpotlight.year || '2025'}
                  </span>
                  {activeSpotlight.highlight && (
                    <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-sm font-bold">
                      {activeSpotlight.highlight}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white leading-tight">
                    {activeSpotlight.title}
                  </h2>
                  <p className="text-amber-300 font-bold text-base sm:text-lg mt-1.5">
                    {activeSpotlight.winnerRole ? `${activeSpotlight.winnerRole} • ` : ''}{activeSpotlight.winner}
                  </p>
                </div>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  {activeSpotlight.description}
                </p>

                {/* Conditional Medal Breakdown OR Detail Badges */}
                {activeSpotlight.medals ? (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-gradient-to-b from-amber-500/20 to-amber-600/10 border border-amber-400/40 rounded-xl p-3 text-center">
                      <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                        <Medal className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-black text-amber-300 font-heading">{activeSpotlight.medals.gold}</p>
                      <p className="text-xs font-bold text-amber-200 uppercase tracking-wider">Gold Medals</p>
                    </div>

                    <div className="bg-gradient-to-b from-slate-300/20 to-slate-400/10 border border-slate-300/40 rounded-xl p-3 text-center">
                      <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-bold shadow-xs">
                        <Medal className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-black text-slate-100 font-heading">{activeSpotlight.medals.silver}</p>
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Silver Medals</p>
                    </div>

                    <div className="bg-gradient-to-b from-orange-500/20 to-orange-600/10 border border-orange-400/40 rounded-xl p-3 text-center">
                      <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-orange-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                        <Medal className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-black text-orange-300 font-heading">{activeSpotlight.medals.bronze}</p>
                      <p className="text-xs font-bold text-orange-200 uppercase tracking-wider">Bronze Medals</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeSpotlight.details &&
                      activeSpotlight.details.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-sm font-semibold text-emerald-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Call to Action Button */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setActiveModalItem(activeSpotlight)}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Eye className="w-5 h-5" />
                    Buka Poster Lengkap
                  </button>
                  <div className="flex items-center gap-2 text-sm text-emerald-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Prestasi Resmi Siswa MI AL-AHMAD
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-6 mt-4 border-t border-white/10 relative z-10">
            {ACHIEVEMENTS_DATA.map((ach, idx) => (
              <button
                key={ach.id}
                onClick={() => setSpotlightIndex(idx)}
                aria-label={`Slide ${idx + 1}: ${ach.title}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  spotlightIndex === idx
                    ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/40'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
                title={ach.title}
              />
            ))}
          </div>
        </div>

        {/* 3. FILTER & SEARCH CONTROLS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 flex items-center gap-2">
                <Award className="w-7 h-7 text-emerald-700" />
                Semua Koleksi Prestasi Terbaru
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-1">
                Menampilkan {filteredAchievements.length} poster prestasi resmi siswa MI AL-AHMAD
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] max-w-sm">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama lomba atau siswa..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${selectedCategory === cat.label
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
                  }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedCategory === cat.label
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. ACHIEVEMENTS GRID */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">Tidak ada prestasi yang sesuai kriteria</h3>
            <p className="text-sm text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-2 text-sm font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-emerald-400"
              >
                <div>
                  {/* Poster Image Container - Square Aspect Ratio with clickable preview */}
                  <div
                    onClick={() => setActiveModalItem(ach)}
                    className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={ach.imageUrl}
                      alt={ach.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${getCategoryBadgeStyle(ach.category)}`}>
                        {ach.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        {ach.year || '2025'}
                      </span>
                    </div>

                    {/* Hover Zoom Prompt */}
                    <div className="absolute inset-0 bg-emerald-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-bold text-sm pointer-events-none">
                      <div className="px-3.5 py-2 rounded-full bg-white text-emerald-900 font-bold flex items-center gap-2 shadow-lg">
                        <Eye className="w-4 h-4" />
                        Klik untuk Memperbesar Poster
                      </div>
                    </div>

                    {/* Bottom Winner Pill inside image */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 pointer-events-none">
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider drop-shadow-md">
                        {ach.rank || 'Juara & Prestasi'}
                      </p>
                      <h4 className="text-white font-black text-lg drop-shadow-md line-clamp-1">
                        {ach.winner}
                      </h4>
                    </div>
                  </div>

                  {/* Card Body Info */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-emerald-700 transition-colors">
                        {ach.title}
                      </h3>
                      {ach.event && (
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          Ajang: {ach.event}
                        </p>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-body">
                      {ach.description}
                    </p>

                    {/* Sub-award tags or details */}
                    {ach.details && ach.details.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Daftar Pencapaian:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ach.details.map((detail, dIdx) => (
                            <span
                              key={dIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => setActiveModalItem(ach)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <Eye className="w-4 h-4 text-slate-500 group-hover/btn:text-white transition-colors" />
                    <span>Lihat Poster Lengkap</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. HISTORICAL MILESTONES */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 rounded-3xl p-6 sm:p-10 space-y-6 border border-emerald-200/80 shadow-xs">
          <div className="border-b border-emerald-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Jejak Keunggulan Madrasah
              </span>
              <h3 className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
                Pencapaian & Tonggak Prestasi Lembaga
              </h3>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              MI AL-AHMAD Terus Berkembang Menuju Kemajuan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {HISTORICAL_MILESTONES.map((ms, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs font-heading">
                    {ms.year}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {ms.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {ms.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Rekam Jejak Resmi
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. CALL TO ACTION / INFO SPMB BANNER (SESUAI DENGAN KONTAK DI POSTER) */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-600/50">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Penerimaan Siswa Baru (SPMB)
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white">
                Wujudkan Potensi & Prestasi Ananda Bersama MI AL-AHMAD
              </h3>
              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
                Kami siap mendampingi putra-putri Anda meraih keunggulan akademik, tahfidz Al-Qur'an, dan bakat kejuaraan di lingkungan belajar yang nyaman dan islami.
              </p>

              {/* Kontak SPMB Resmi dari Poster */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-emerald-200">
                <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Bu Nurul: <strong>082142516613</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Pak Fikri: <strong>085812645357</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenContact}
                className="px-7 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <span>Daftar / Konsultasi PPDB</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 7. INTERACTIVE LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
            {/* Backdrop click */}
            <div
              className="fixed inset-0"
              onClick={() => setActiveModalItem(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row overflow-hidden border border-slate-200"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Poster Preview Section */}
              <div className="md:w-1/2 bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative min-h-[300px]">
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.title}
                  className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* Poster Detail Text Section */}
              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getCategoryBadgeStyle(activeModalItem.category)}`}>
                      {activeModalItem.category}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      Tahun {activeModalItem.year || '2025'}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-extrabold uppercase tracking-wider text-emerald-700">
                      {activeModalItem.rank || 'Juara & Prestasi'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-tight mt-1">
                      {activeModalItem.title}
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-sm font-bold text-emerald-800">
                      Pemenang / Delegasi:
                    </p>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">
                      {activeModalItem.winner}
                    </p>
                    {activeModalItem.winnerRole && (
                      <p className="text-sm text-slate-600 mt-0.5">
                        {activeModalItem.winnerRole}
                      </p>
                    )}
                  </div>

                  {activeModalItem.event && (
                    <div className="text-sm text-slate-600">
                      <span className="font-bold text-slate-800">Ajang Kejuaraan:</span>{' '}
                      {activeModalItem.event}
                    </div>
                  )}

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-body">
                    {activeModalItem.description}
                  </p>

                  {/* Medal breakdown if IKSC */}
                  {activeModalItem.medals && (
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                        <p className="text-xl font-black text-amber-700">{activeModalItem.medals.gold}</p>
                        <p className="text-xs font-bold text-amber-900 uppercase">Emas (Gold)</p>
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5">
                        <p className="text-xl font-black text-slate-700">{activeModalItem.medals.silver}</p>
                        <p className="text-xs font-bold text-slate-800 uppercase">Perak (Silver)</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                        <p className="text-xl font-black text-orange-700">{activeModalItem.medals.bronze}</p>
                        <p className="text-xs font-bold text-orange-900 uppercase">Perunggu</p>
                      </div>
                    </div>
                  )}

                  {/* Details / sub-awards list */}
                  {activeModalItem.details && activeModalItem.details.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-sm font-bold text-slate-700">Rincian Penghargaan:</p>
                      <ul className="space-y-1.5">
                        {activeModalItem.details.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={activeModalItem.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    Buka Gambar Tab Baru
                  </a>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
