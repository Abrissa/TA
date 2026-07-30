import React, { useState } from 'react';
import { ChevronRight, Eye, ArrowUpRight } from 'lucide-react';
import { Article } from '../../types';

interface StackedArticleSliderProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const StackedArticleSlider: React.FC<StackedArticleSliderProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % articles.length);
  };

  const currentArticle = articles[activeIndex] || articles[0];

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm mx-auto lg:max-w-none">
        {/* Background offset card 2 (bottom-most stack layer) */}
        <div className="absolute top-4 right-[-12px] left-[12px] h-full bg-white/60 rounded-3xl border border-slate-200/60 shadow-xs pointer-events-none z-0 transform rotate-2" />

        {/* Background offset card 1 (middle stack layer) */}
        <div className="absolute top-2 right-[-6px] left-[6px] h-full bg-white/85 rounded-3xl border border-slate-200/80 shadow-md pointer-events-none z-1" />

        {/* Main Front Active Card */}
        <div className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xl space-y-4 z-10 transition-all duration-300">
          {/* Article Thumbnail Image */}
          <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100">
            <img
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
              Hot News 🔥
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
              <span>Read More</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Dots & Next Arrow Navigation */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          {articles.slice(0, 3).map((_, idx) => (
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
