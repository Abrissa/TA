import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onSelect: (art: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
              {article.category}
            </span>
            <span>{article.date}</span>
          </div>
          <h3
            className="font-bold text-slate-900 text-base line-clamp-2 hover:text-emerald-600 transition-colors cursor-pointer"
            onClick={() => onSelect(article)}
          >
            {article.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={() => onSelect(article)}
          className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          Baca Selengkapnya
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
