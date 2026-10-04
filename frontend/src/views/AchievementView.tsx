import React, { useState, useEffect, useRef } from 'react';
import { Achievement, PageTab } from '../types';
import { api } from '../services/api';
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
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';

interface AchievementViewProps {
  onOpenContact: () => void;
  setActiveTab?: (tab: PageTab) => void;
}

export const AchievementView: React.FC<AchievementViewProps> = ({ onOpenContact, setActiveTab }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<Achievement | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [stackIndex, setStackIndex] = useState<number>(0);
  const stackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.getAchievements().then((data) => {
      setAchievements(data);
    }).catch(() => {
      setAchievements([]);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  // Auto-play spotlight
  useEffect(() => {
    if (activeModalItem || achievements.length === 0) return;
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % achievements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeModalItem, achievements.length]);

  // Auto-play stacked carousel — defined after filteredAchievements, see below

  const handleNextSpotlight = () => {
    setSpotlightIndex((prev) => (prev + 1) % achievements.length);
  };

  const handlePrevSpotlight = () => {
    setSpotlightIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  const activeSpotlight = achievements[spotlightIndex];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const uniqueCategories = Array.from(new Set(achievements.map((a) => a.category)));
  const categories = [
    { label: 'Semua', count: achievements.length },
    ...uniqueCategories.map((cat) => ({
      label: cat,
      count: achievements.filter((a) => a.category === cat).length,
    })),
  ].filter((cat) => cat.count > 0);

  const filteredAchievements = achievements.filter((ach) => {
    const matchesCategory = selectedCategory === 'Semua' || ach.category === selectedCategory;
    const matchesSearch =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.winner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ach.event && ach.event.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ach.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ▸ Auto-play spotlight stacked card carousel
  useEffect(() => {
    if (achievements.length <= 1) return;
    stackTimerRef.current = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % achievements.length);
    }, 3800);
    return () => { if (stackTimerRef.current) clearInterval(stackTimerRef.current); };
  }, [achievements.length]);

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
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab && setActiveTab('beranda') },
          { label: 'Prestasi Siswa' },
        ]}
        title={
          <>
            Etalase Prestasi Gemilang <br />
            <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">
              Siswa MI AL-AHMAD
            </span>
          </>
        }
        subtitle="Bukti nyata dedikasi, kedisiplinan, dan ikhtiar santri bersama para pembimbing dalam mengharumkan nama madrasah dari tingkat kecamatan hingga kancah internasional."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* SPOTLIGHT STACKED CARD CAROUSEL (GAMBAR 3 & 4 REFERENCE) */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Belum ada data prestasi yang dipublikasikan.
          </div>
        ) : (
          <div 
            className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-emerald-500/40 shadow-2xl overflow-hidden relative"
            onMouseEnter={() => { if (stackTimerRef.current) clearInterval(stackTimerRef.current); }}
            onMouseLeave={() => {
              if (achievements.length > 1) {
                stackTimerRef.current = setInterval(() => {
                  setSpotlightIndex((prev) => (prev + 1) % achievements.length);
                }, 3800);
              }
            }}
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Slider Controls Bar */}
            <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs sm:text-sm font-bold border border-emerald-600/50 shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Sorotan Prestasi Utama
                </span>
              </div>

              {/* Prev / Next Buttons & Counter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-amber-300 mr-2">
                  {String(spotlightIndex + 1).padStart(2, '0')} / {String(achievements.length).padStart(2, '0')}
                </span>
                <button
                  onClick={handlePrevSpotlight}
                  aria-label="Prestasi Sebelumnya"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextSpotlight}
                  aria-label="Prestasi Berikutnya"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                  title="Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* HORIZONTAL STACKED CARDS DECK (GAMBAR 4 REFERENCE - PURE WHITE CARDS) */}
            <div className="relative min-h-[510px] sm:min-h-[530px] flex items-center justify-center py-4 z-10 overflow-hidden">
              <div className="relative w-full max-w-4xl h-[480px] sm:h-[500px] flex items-center justify-center">
                {achievements.map((ach, idx) => {
                  const total = achievements.length;
                  let diff = (idx - spotlightIndex + total) % total;
                  if (diff > total / 2) diff -= total;

                  const isCenter = diff === 0;
                  const isLeft = diff === -1 || (total === 2 && diff === 1);
                  const isRight = diff === 1;

                  let transformStyle = '';
                  let zIndex = 10;
                  let opacity = 0;
                  let pointerEvents = 'none';

                  if (isCenter) {
                    transformStyle = 'translateX(0) scale(1) rotate(0deg)';
                    zIndex = 30;
                    opacity = 1;
                    pointerEvents = 'auto';
                  } else if (isLeft) {
                    transformStyle = 'translateX(-36%) sm:translateX(-45%) scale(0.88) rotate(-2deg)';
                    zIndex = 20;
                    opacity = 0.75;
                    pointerEvents = 'auto';
                  } else if (isRight) {
                    transformStyle = 'translateX(36%) sm:translateX(45%) scale(0.88) rotate(2deg)';
                    zIndex = 20;
                    opacity = 0.75;
                    pointerEvents = 'auto';
                  } else {
                    transformStyle = `translateX(${diff > 0 ? '70%' : '-70%'}) scale(0.7)`;
                    zIndex = 10;
                    opacity = 0;
                  }

                  return (
                    <div
                      key={ach.id}
                      onClick={() => {
                        if (isCenter) {
                          setActiveModalItem(ach);
                        } else {
                          setSpotlightIndex(idx);
                        }
                      }}
                      className="absolute top-0 w-[290px] sm:w-[360px] lg:w-[400px] bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 flex flex-col justify-between cursor-pointer transition-all duration-500 ease-out select-none"
                      style={{
                        transform: transformStyle,
                        zIndex,
                        opacity,
                        pointerEvents: pointerEvents as any,
                        filter: isCenter ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.18))',
                      }}
                    >
                      {/* Top Poster Preview Box */}
                      <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 h-56 sm:h-64 flex items-center justify-center p-2 group">
                        <img
                          src={ach.imageUrl || '/assets/prestasi-iksc-2025.jpg'}
                          alt={ach.title}
                          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/prestasi-iksc-2025.jpg';
                          }}
                        />
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${getCategoryBadgeStyle(ach.category)}`}>
                          Tingkat {ach.category}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold">
                          {ach.year || '2025'}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="pt-4 space-y-2 text-left">
                        <h3 className="font-black font-heading text-slate-900 text-base sm:text-lg line-clamp-2 leading-tight">
                          {ach.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-emerald-700 line-clamp-1">
                          {ach.winnerRole ? `${ach.winnerRole} • ` : ''}{ach.winner}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {ach.description}
                        </p>
                      </div>

                      {/* Bottom Button */}
                      <div className="pt-3 border-t border-slate-100 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalItem(ach);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Lihat Poster Lengkap</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex items-center justify-center gap-2 pt-4 relative z-10">
              {achievements.map((ach, idx) => (
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
        )}

        {/* Filter & Search Controls */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 flex items-center gap-2">
                <Award className="w-7 h-7 text-emerald-700" />
                Semua Koleksi Prestasi Siswa
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
                onClick={() => { setSelectedCategory(cat.label); setStackIndex(0); }}
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

        {/* RESPONSIVE GALLERY GRID OF ALL ACHIEVEMENTS */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">Tidak ada prestasi yang sesuai kriteria</h3>
            <p className="text-sm text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
              className="mt-2 text-sm font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                onClick={() => setActiveModalItem(ach)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100 h-64 sm:h-72 flex items-center justify-center p-2 mb-4">
                    <img
                      src={ach.imageUrl || '/assets/prestasi-iksc-2025.jpg'}
                      alt={ach.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/prestasi-iksc-2025.jpg';
                      }}
                    />
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${getCategoryBadgeStyle(ach.category)}`}>
                      {ach.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold">
                      {ach.year || '2025'}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                    {ach.rank || 'Juara & Prestasi'}
                  </span>
                  <h3 className="font-extrabold font-heading text-slate-900 text-lg leading-snug line-clamp-2 mt-1">
                    {ach.title}
                  </h3>
                  <p className="text-sm font-bold text-emerald-700 mt-1 line-clamp-1">
                    {ach.winnerRole ? `${ach.winnerRole} • ` : ''}{ach.winner}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Buka Poster Lengkap</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Call to Action SPMB Banner */}
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

      {/* Interactive Lightbox Modal */}
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
                  src={activeModalItem.imageUrl || '/assets/prestasi-iksc-2025.jpg'}
                  alt={activeModalItem.title}
                  className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/prestasi-iksc-2025.jpg';
                  }}
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
