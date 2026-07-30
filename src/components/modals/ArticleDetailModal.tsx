import React from 'react';
import { Article } from '../../types';
import { X, Calendar, User } from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors cursor-pointer"
          aria-label="Tutup Artikel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Cover Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white leading-snug drop-shadow-md">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-[#059669] font-bold text-[10px] border border-emerald-100">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author}
            </span>
          </div>

          <div className="prose prose-slate text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
            {article.content}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup Artikel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
