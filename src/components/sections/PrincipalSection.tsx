import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageTab, Article } from '../../types';
import { SCHOOL_INFO, ARTICLES_DATA } from '../../data/mockData';
import { StackedArticleSlider } from '../cards/StackedArticleSlider';

interface PrincipalSectionProps {
  setActiveTab: (tab: PageTab) => void;
  onSelectArticle: (article: Article) => void;
}

export const PrincipalSection: React.FC<PrincipalSectionProps> = ({
  setActiveTab,
  onSelectArticle,
}) => {
  return (
    <section className="relative pt-16 pb-28 lg:pb-36 overflow-hidden bg-gradient-to-b from-[#EEFBF4] via-emerald-50/90 to-emerald-100/70">
      {/* Soft background glow accents */}
      <div className="absolute top-[10%] left-[-80px] w-[300px] h-[300px] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-80px] w-[300px] h-[300px] rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: School Introduction & Welcome Text */}
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs border border-slate-200/80 mb-4">
                <span>🏆</span>
                <span>MI AL-AHMAD SIDOARJO</span>
              </span>
              <h2 className="text-3xl lg:text-4xl font-black font-heading text-slate-900 uppercase tracking-tight leading-tight">
                MI AL-AHMAD <br className="hidden lg:block" />
                SIDOARJO
              </h2>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              "Yuk, jelajahi serunya dunia sekolah di MI AL-AHMAD Sidoarjo! 🎓 ✨ Temukan informasi
              tentang program keunggulan Tahfidz, fasilitas modern, kegiatan siswa, dan prestasi
              terbaru. Klik tombol di bawah ini untuk tahu lebih banyak."
            </p>

            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                onClick={() => setActiveTab('visi-misi')}
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Baca Selengkapnya</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CENTER COLUMN: Cutout Principal Photo with Decorative Organic Shape */}
          <div className="lg:col-span-4 flex justify-center relative my-6 lg:my-0">
            <div className="relative flex items-center justify-center">
              {/* Decorative organic shape / pastel blob behind photo */}
              <div className="absolute w-[280px] sm:w-[320px] h-[340px] sm:h-[380px] bg-gradient-to-br from-rose-200/60 via-pink-100/70 to-emerald-200/50 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] blur-xs pointer-events-none" />

              {/* Principal Cutout Image */}
              <img
                src="/assets/principal.png"
                alt={SCHOOL_INFO.principalName}
                className="relative z-10 w-[280px] sm:w-[330px] h-auto max-h-[420px] object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Stacked Cards Slider (Latest Articles / News) */}
          <div className="lg:col-span-4 space-y-4">
            <StackedArticleSlider articles={ARTICLES_DATA} onSelectArticle={onSelectArticle} />
          </div>
        </div>
      </div>

      {/* Bottom Curved Arc Divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          className="relative block w-full h-14 sm:h-20 lg:h-28 text-white"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,65 Q720,-15 1440,65 L1440,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};
