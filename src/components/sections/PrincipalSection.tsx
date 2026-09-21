import React from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTab, Article } from '../../types';
import { SCHOOL_INFO, ARTICLES_DATA } from '../../data/mockData';
import { StackedArticleSlider } from '../cards/StackedArticleSlider';
import { ScrollFadeUp } from '../ui/ScrollReveal';

interface PrincipalSectionProps {
  setActiveTab: (tab: PageTab) => void;
  onSelectArticle: (article: Article) => void;
}

export const PrincipalSection: React.FC<PrincipalSectionProps> = ({
  setActiveTab,
  onSelectArticle,
}) => {
  return (
    <section
      id="sambutan-section"
      className="relative overflow-hidden bg-gradient-to-b from-[#EEFBF4] via-emerald-50/90 to-emerald-100/70 pb-28 pt-16 lg:pb-36 lg:pt-20 border-t border-emerald-100/80 shadow-[0_-10px_30px_-5px_rgba(4,120,87,0.04)]"
    >
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute left-[-80px] top-[10%] h-[300px] w-[300px] rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[10%] right-[-80px] h-[300px] w-[300px] rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Pengantar Sekolah MI AL-AHMAD */}
          <ScrollFadeUp
            direction="up"
            delay={0.1}
            duration={0.7}
            className="space-y-5 text-center lg:col-span-4 lg:text-left"
          >
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-xs">
                <Award className="h-4 w-4 text-amber-500" />
                <span>MI AL-AHMAD SIDOARJO</span>
              </span>
              <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-slate-900 lg:text-4xl font-heading">
                MI AL-AHMAD <br className="hidden lg:block" />
                SIDOARJO
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
              "Yuk, jelajahi serunya dunia sekolah di MI AL-AHMAD Sidoarjo! 🎓 ✨ Temukan informasi
              tentang program keunggulan Tahfidz, fasilitas modern, kegiatan siswa, dan prestasi
              terbaru. Klik tombol di bawah ini untuk tahu lebih banyak."
            </p>

            <div className="flex justify-center pt-2 lg:justify-start">
              <button
                onClick={() => setActiveTab('visi-misi')}
                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
              >
                <span>Baca Selengkapnya</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </ScrollFadeUp>

          {/* Middle Column: Cutout Principal Photo with Decorative Organic Shape */}
          <ScrollFadeUp
            direction="up"
            delay={0.25}
            duration={0.7}
            className="relative my-6 flex justify-center lg:col-span-4 lg:my-0"
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.04, 1],
                  rotate: [0, 1.5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="pointer-events-none absolute h-[340px] w-[280px] rounded-[50%_50%_40%_60%/60%_40%_60%_40%] bg-gradient-to-br from-rose-200/60 via-pink-100/70 to-emerald-200/50 blur-xs sm:h-[380px] sm:w-[320px]"
              />

              <img
                src="/assets/principal.png"
                alt={SCHOOL_INFO.principalName}
                className="relative z-10 h-auto max-h-[420px] w-[280px] object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02] sm:w-[330px]"
              />
            </div>
          </ScrollFadeUp>

          {/* Right Column: Interactive Stacked Cards Slider */}
          <ScrollFadeUp
            direction="up"
            delay={0.35}
            duration={0.7}
            className="space-y-4 lg:col-span-4"
          >
            <StackedArticleSlider articles={ARTICLES_DATA} onSelectArticle={onSelectArticle} />
          </ScrollFadeUp>
        </div>
      </div>

      {/* Bottom Curved Arc Divider */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-hidden leading-none">
        <svg
          className="relative block h-14 w-full text-white sm:h-20 lg:h-28"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,65 Q720,-15 1440,65 L1440,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};
