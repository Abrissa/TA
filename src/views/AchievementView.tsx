import React from 'react';
import { ACHIEVEMENTS_DATA, HISTORICAL_MILESTONES } from '../data/mockData';
import { Trophy, Calendar, Award, Star } from 'lucide-react';

interface AchievementViewProps {
  onOpenContact: () => void;
}

export const AchievementView: React.FC<AchievementViewProps> = ({ onOpenContact }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold border border-white/20">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Prestasi & Rekam Jejak</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Prestasi Siswa MI AL-AHMAD
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Bukti nyata dedikasi dan kerja keras para siswa dan pembimbing dalam ajang perlombaan akademik, tahfidz, dan seni keagamaan.
          </p>
        </div>
      </section>

      {/* MAIN ACHIEVEMENTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#059669]" />
              Penghargaan & Medali Terkini
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACHIEVEMENTS_DATA.map((ach) => (
              <div key={ach.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <img src={ach.imageUrl} alt={ach.title} className="w-full h-48 object-cover" />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {ach.category}
                      </span>
                      <span className="text-slate-500">{ach.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{ach.title}</h3>
                    <p className="text-xs font-semibold text-[#059669]">Pemenang: {ach.winner}</p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{ach.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HISTORICAL MILESTONES */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 space-y-6 border border-emerald-200">
          <div className="border-b border-emerald-200 pb-3">
            <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Pencapaian Kelembagaan Utama
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {HISTORICAL_MILESTONES.map((ms, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-xs">
                  {ms.year}
                </span>
                <h4 className="font-bold text-slate-900 text-sm pt-1">{ms.title}</h4>
                <p className="text-slate-600 leading-relaxed">{ms.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
