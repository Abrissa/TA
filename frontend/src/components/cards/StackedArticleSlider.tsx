import React, { useState, useEffect } from 'react';
import { ChevronRight, Eye, ArrowUpRight, Sparkles, Clock, Calendar, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Article } from '../../types';
import { resolveImageUrl } from '../../services/api';

interface StackedArticleSliderProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const StackedArticleSlider: React.FC<StackedArticleSliderProps> = ({
  articles,
  onSelectArticle,
}) => {
  const visibleArticles = articles.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (isAdvancing || visibleArticles.length < 2) return;

    setIsAdvancing(true);
    window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % visibleArticles.length);
      setIsAdvancing(false);
    }, 520);
  };

  // Auto-play timer: slides automatically every 4.5 seconds and pauses on hover
  useEffect(() => {
    if (isHovered || visibleArticles.length < 2) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, visibleArticles.length, isAdvancing]);

  if (visibleArticles.length === 0) return null;

  const currentArticle = visibleArticles[activeIndex] || visibleArticles[0];
  const nextArticle = visibleArticles[(activeIndex + 1) % visibleArticles.length] || currentArticle;
  const thirdArticle = visibleArticles[(activeIndex + 2) % visibleArticles.length] || nextArticle;

  const renderStackCard = (article: Article) => {
    const imgSrc = resolveImageUrl(article.imageUrl) || '/assets/berita-maulana-ksm.jpg';

    return (
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 flex flex-col justify-between h-full bg-white rounded-3xl">
        <div className="space-y-3">
          {/* Article Thumbnail Image: Full Visibility with Ambient Backdrop */}
          <div
            onClick={() => onSelectArticle(article)}
            className="relative rounded-2xl overflow-hidden h-40 sm:h-48 bg-slate-950 flex items-center justify-center cursor-pointer group/img select-none border border-slate-900/10 shadow-inner"
            title="Klik untuk membaca artikel"
          >
            {/* Ambient blurred backdrop so any image aspect ratio fits gracefully */}
            <img
              src={imgSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35 select-none pointer-events-none"
            />
            {/* Sharp foreground image */}
            <img
              src={imgSrc}
              alt={article.title}
              className="relative z-10 max-h-full max-w-full object-contain p-1 transition-transform duration-300 group-hover/img:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = '/assets/berita-maulana-ksm.jpg';
              }}
            />
            {/* Subtle click-to-view hint overlay on hover */}
            <div className="absolute inset-0 z-20 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-[2px]">
              <Eye className="w-4 h-4 text-white" />
              <span>Baca Artikel</span>
            </div>
          </div>

          {/* Article Meta Info */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="inline-flex items-center gap-1 bg-emerald-900 text-emerald-100 text-[11px] sm:text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-700/50 shrink-0">
                {article.category || 'Berita'}
              </span>
              {article.readTime && (
                <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{article.readTime}</span>
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-slate-500 text-xs shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.date}</span>
            </span>
          </div>

          {/* Article Title */}
          <h4
            onClick={() => onSelectArticle(article)}
            className="text-base sm:text-lg font-extrabold font-heading text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700 transition-colors"
          >
            {article.title}
          </h4>

          {/* Author */}
          {article.author && (
            <p className="text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Oleh {article.author} {article.authorRole ? `(${article.authorRole})` : ''}
              </span>
            </p>
          )}

          {/* Article Excerpt */}
          <p className="text-xs sm:text-[14px] text-slate-600 line-clamp-2 leading-relaxed font-body">
            {article.excerpt}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onSelectArticle(article)}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Baca artikel</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </button>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Pilihan</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="space-y-4 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative max-w-[340px] sm:max-w-sm mx-auto lg:max-w-none pr-3 sm:pr-0">
        {/* Card 2 behind (Middle stack layer) */}
        <motion.div
          key={`next-${nextArticle.id}`}
          initial={false}
          animate={{
            y: isMobile ? 6 : 8,
            x: isMobile ? 8 : 18,
            scale: 0.985,
            rotate: isMobile ? 0.8 : 1.2,
            opacity: 1,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
          style={{ zIndex: 2 }}
          className="absolute top-0 right-0 left-0 min-h-[440px] sm:min-h-[470px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md pointer-events-none"
          aria-hidden="true"
        >
          {renderStackCard(nextArticle)}
        </motion.div>

        {/* Card 3 behind (Bottom-most stack layer) */}
        <motion.div
          key={`third-${thirdArticle.id}`}
          initial={false}
          animate={{
            y: isMobile ? 12 : 16,
            x: isMobile ? 14 : 30,
            scale: 0.97,
            rotate: isMobile ? 1.4 : 2,
            opacity: 1,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
          style={{ zIndex: 1 }}
          className="absolute top-0 right-0 left-0 min-h-[440px] sm:min-h-[470px] overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm pointer-events-none"
          aria-hidden="true"
        >
          {renderStackCard(thirdArticle)}
        </motion.div>

        {/* Main Front Active Card */}
        <div className="relative z-20 min-h-[440px] sm:min-h-[470px] [perspective:1200px]">
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
              className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl"
            >
              {renderStackCard(currentArticle)}
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
          className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Artikel Selanjutnya"
          title="Artikel Selanjutnya"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
