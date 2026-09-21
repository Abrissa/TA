import React from 'react';
import { ChevronRight, Calendar, Clock, User } from 'lucide-react';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onSelect: (art: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Prestasi':
        return 'bg-amber-100 text-amber-900 border border-amber-200';
      case 'Kegiatan':
        return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Informasi':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'Edukasi':
        return 'bg-purple-50 text-purple-800 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(article)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full"
    >
      <div>
        {/* Image Container with Hover Scale */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-xs ${getCategoryBadgeClass(
                article.category
              )}`}
            >
              {article.category}
            </span>
          </div>

          {/* Reading Time */}
          {article.readTime && (
            <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{article.readTime}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {article.date}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5 font-medium truncate max-w-[140px]">
              <User className="w-4 h-4 text-slate-400" />
              {article.author}
            </span>
          </div>

          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 font-heading">
            {article.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed font-body">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 sm:p-6 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
          <span className="group-hover:underline">Baca Selengkapnya</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-200">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
