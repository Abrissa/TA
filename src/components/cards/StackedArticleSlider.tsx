import React, { useState } from 'react';
import { ChevronRight, Eye, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Article } from '../../types';

interface StackedArticleSliderProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const StackedArticleSlider: React.FC<StackedArticleSliderProps> = ({
  articles,
  onSelectArticle,
}) => {
  const visibleArticles = articles.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const handleNext = () => {
    if (isAdvancing || visibleArticles.length < 2) return;

    setIsAdvancing(true);
    window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % visibleArticles.length);
      setIsAdvancing(false);
    }, 520);
  };

  const currentArticle = visibleArticles[activeIndex] || visibleArticles[0];
  const nextArticle = visibleArticles[(activeIndex + 1) % visibleArticles.length] || currentArticle;
  const thirdArticle = visibleArticles[(activeIndex + 2) % visibleArticles.length] || nextArticle;

  const renderStackCard = (article: Article) => (
    <div className="p-5 space-y-4">
      <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100">
        <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
        <span className="absolute top-3 right-3 bg-emerald-950/90 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
          Kabar terbaru
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          205 Dibaca
        </span>
        <span>{article.date}</span>
      </div>
      <h4 className="text-base font-extrabold font-heading text-slate-900 line-clamp-2 leading-snug">
        {article.title}
      </h4>
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-body">
        {article.excerpt}
      </p>
      <div className="pt-1 text-xs font-bold text-slate-900 flex items-center gap-1.5">
        <span>Baca artikel</span>
        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm mx-auto lg:max-w-none">
        {/* The next article is intentionally visible, so the interaction reads as a real stack. */}
        <motion.div
          key={`next-${nextArticle.id}`}
          initial={false}
          animate={{
            y: 8,
            x: 18,
            scale: 0.985,
            rotate: 1.2,
            opacity: 1,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
          style={{ zIndex: 2 }}
          className="absolute top-0 right-0 left-0 min-h-[430px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md pointer-events-none"
          aria-hidden="true"
        >
          {renderStackCard(nextArticle)}
        </motion.div>

        <motion.div
          key={`third-${thirdArticle.id}`}
          initial={false}
          animate={{
            y: 16,
            x: 30,
            scale: 0.97,
            rotate: 2,
            opacity: 1,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
          style={{ zIndex: 1 }}
          className="absolute top-0 right-0 left-0 min-h-[430px] overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm pointer-events-none"
          aria-hidden="true"
        >
          {renderStackCard(thirdArticle)}
        </motion.div>

        {/* Background offset card 2 (bottom-most stack layer) */}
        {/* <div className="absolute top-4 right-[-12px] left-[12px] h-full bg-white/60 rounded-3xl border border-slate-200/60 shadow-xs pointer-events-none z-[-1] transform rotate-2" /> */}

        {/* Background offset card 1 (middle stack layer) */}
        {/* <div className="absolute top-2 right-[-6px] left-[6px] h-full bg-white/85 rounded-3xl border border-slate-200/80 shadow-md pointer-events-none z-1" /> */}

        {/* Main Front Active Card */}
        <div className="relative z-20 min-h-[430px] [perspective:1200px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentArticle.id}
            initial={{ opacity: 1, x: 0, rotate: 0 }}
            animate={{
              opacity: 1,
              x: isAdvancing ? '-18%' : 0,
              y: isAdvancing ? 18 : 0,
              scale: isAdvancing ? 0.985 : 1,
              rotate: isAdvancing ? -5 : 0,
            }}
            exit={{ opacity: 1, x: '-18%', rotate: -5 }}
            transition={{
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ zIndex: 10, transformOrigin: 'center center' }}
            className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xl space-y-4"
          >
          {/* Article Thumbnail Image */}
          <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100">
            <img
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 right-3 bg-emerald-950/90 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
              Kabar terbaru
            </span>
          </div>

          {/* Article Meta Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              205 Dibaca
            </span>
            <span>{currentArticle.date}</span>
          </div>

          {/* Article Title */}
          <h4
            onClick={() => onSelectArticle(currentArticle)}
            className="text-base font-extrabold font-heading text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-600 transition-colors"
          >
            {currentArticle.title}
          </h4>

          {/* Article Excerpt */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-body">
            {currentArticle.excerpt}
          </p>

          {/* Read More Link */}
          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => onSelectArticle(currentArticle)}
              className="text-xs font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Baca artikel</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Slider Dots & Next Arrow Navigation */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          {visibleArticles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-7 bg-emerald-600'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
          aria-label="Artikel Selanjutnya"
          title="Artikel Selanjutnya"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
