import React from 'react';
import { FileText } from 'lucide-react';

interface AnnouncementCardProps {
  id: string;
  title: string;
  date: string;
  category: string;
  isImportant?: boolean;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  date,
  category,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-emerald-100/80 text-emerald-600 shrink-0 mt-0.5">
        <FileText className="w-5 h-5" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase tracking-wider ${
              category === 'PPDB'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {category}
          </span>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">{date}</span>
        </div>
        <h4 className="text-base font-bold text-slate-800 hover:text-emerald-600 cursor-pointer transition-colors leading-snug">
          {title}
        </h4>
      </div>
    </div>
  );
};
