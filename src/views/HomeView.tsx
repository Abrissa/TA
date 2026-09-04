import React from 'react';
import { PageTab, Article } from '../types';
import {
  FACILITIES_DATA,
  ARTICLES_DATA,
} from '../data/mockData';
import {
  BookOpen,
  Building2,
  FlaskConical,
  Laptop,
  Monitor,
  Trophy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

import { HeroSection } from '../components/sections/HeroSection';
import { PrincipalSection } from '../components/sections/PrincipalSection';
import { AdvantagesSection } from '../components/sections/AdvantagesSection';
import { MarqueeBanner } from '../components/sections/MarqueeBanner';
import { ArticleCard } from '../components/cards/ArticleCard';
import { ScrollFadeUp, StaggerContainer, StaggerItem } from '../components/ui/ScrollReveal';

interface HomeViewProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
  onSelectArticle: (art: Article) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenContact,
  onSelectArticle,
}) => {
  const facilityIcons: Record<string, React.ReactNode> = {
    MonitorSmart: <Monitor className="w-6 h-6" />,
    BookOpen: <BookOpen className="w-6 h-6" />,
    Laptop: <Laptop className="w-6 h-6" />,
    Trophy: <Trophy className="w-6 h-6" />,
    Building2: <Building2 className="w-6 h-6" />,
    FlaskConical: <FlaskConical className="w-6 h-6" />,
  };

  return (
    <div className="space-y-0 pb-16">
      {/* 1. HERO SECTION (ORGANISM) */}
      <HeroSection setActiveTab={setActiveTab} onOpenContact={onOpenContact} />

      {/* 2. PROFIL & SAMBUTAN KEPALA MADRASAH (ORGANISM) */}
      <PrincipalSection setActiveTab={setActiveTab} onSelectArticle={onSelectArticle} />

      {/* 3. KEUNGGULAN SEKOLAH / ALASAN MEMILIH MI AL-AHMAD (ORGANISM) */}
      <AdvantagesSection setActiveTab={setActiveTab} />

      {/* RUNNING TEXT TICKER BANNER (ANIMASI TEKS BERGERAK) */}
      <MarqueeBanner />

      {/* 4. FASILITAS PEMBELAJARAN (LIGHT MINT-GREEN BACKGROUND CLOSE TO WHITE) */}
      <section
        id="fasilitas-section"
        className="relative bg-gradient-to-b from-[#EEFBF4] via-[#F4FCF7] to-[#EEFBF4] py-20 lg:py-24 border-y border-emerald-100/70 overflow-hidden"
      >
        {/* Subtle Watermark Islamic Arabesque Vector Pattern */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full text-emerald-800/[0.045]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="soft-arabesque-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
              <path
                d="M35 0 L70 35 L35 70 L0 35 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M35 10 L60 35 L35 60 L10 35 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <path
                d="M0 0 L35 35 L70 0 M0 70 L35 35 L70 70"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
              />
              <circle cx="35" cy="35" r="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#soft-arabesque-pattern)" />
        </svg>

        {/* Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[700px] rounded-full bg-white/60 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header */}
          <ScrollFadeUp direction="up" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-white/90 px-3.5 py-1 rounded-full border border-emerald-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Fasilitas Lengkap & Modern
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
              Lingkungan Belajar <span className="text-emerald-700">Kondusif & Terpadu</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
              Fasilitas pendukung pembelajaran dikembangkan untuk menunjang potensi akademik,
              keagamaan Al-Qur'an, dan minat bakat setiap murid.
            </p>
          </ScrollFadeUp>

          {/* Facility Cards Grid */}
          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FACILITIES_DATA.map((fac, idx) => (
              <StaggerItem key={fac.id}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="h-full bg-white rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white transition-all duration-300 shadow-xs">
                        {facilityIcons[fac.iconName] || <Building2 className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-black text-slate-300 group-hover:text-emerald-600 font-heading transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg font-heading group-hover:text-emerald-700 transition-colors">
                        {fac.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body mt-2">
                        {fac.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                    <span>Standar Mutu Madrasah</span>
                    <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. BERITA & ARTIKEL (MOLECULES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8">
        <ScrollFadeUp
          direction="up"
          delay={0.1}
          className="flex items-center justify-between border-b border-slate-200 pb-4"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Kabar Madrasah
            </span>
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Berita & Artikel Terkini
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('artikel')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            Lihat Semua Berita
            <ChevronRight className="w-4 h-4" />
          </button>
        </ScrollFadeUp>

        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {ARTICLES_DATA.slice(0, 3).map((art) => (
            <StaggerItem key={art.id}>
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <ArticleCard article={art} onSelect={onSelectArticle} />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
};

