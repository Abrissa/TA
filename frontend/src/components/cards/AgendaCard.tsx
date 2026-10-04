import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface AgendaCardProps {
  id: string;
  title: string;
  dateDay: string;
  dateMonth: string;
  time: string;
  location: string;
}

export const AgendaCard: React.FC<AgendaCardProps> = ({
  title,
  dateDay,
  dateMonth,
  time,
  location,
}) => {
  return (
    <div className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
      <div className="w-14 bg-gradient-to-b from-[#059669] to-[#047857] text-white rounded-xl p-2 text-center shrink-0 shadow-xs">
        <span className="block text-xs font-bold uppercase tracking-wider">{dateMonth}</span>
        <span className="block text-xl font-black leading-none mt-0.5">{dateDay}</span>
      </div>
      <div className="space-y-1.5 text-sm text-slate-600">
        <h4 className="font-bold text-slate-900 text-base leading-snug">{title}</h4>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};
