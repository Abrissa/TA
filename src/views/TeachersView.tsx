import React from 'react';
import { TEACHERS_DATA } from '../data/mockData';
import { 
  GraduationCap,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

interface TeachersViewProps {
  onOpenContact: () => void;
  setActiveTab: (tab: any) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({ onOpenContact, setActiveTab }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 border border-white/20 text-xs font-semibold">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Tenaga Pendidik & Kependidikan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Dewan Guru & Staf MI AL-AHMAD
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Tenaga pendidik profesional berijazah sarjana & magister yang siap mendidik murid dengan keikhlasan, ilmu, dan kearifan akhlak.
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-[#059669] font-heading">32</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Guru & Staf</p>
            </div>

            <div className="space-y-1 border-l border-slate-100">
              <p className="text-3xl font-extrabold text-[#059669] font-heading">100%</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Lulusan S1 / S2</p>
            </div>

            <div className="space-y-1 border-l border-slate-100">
              <p className="text-3xl font-extrabold text-[#059669] font-heading">15:1</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Rasio Guru:Siswa</p>
            </div>

            <div className="space-y-1 border-l border-slate-100">
              <p className="text-3xl font-extrabold text-amber-600 font-heading">Sertifikasi</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Kemenag & Kemdikbud</p>
            </div>

          </div>
        </div>
      </section>

      {/* TEACHERS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Pendidik Dedikatif
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Direktori Guru & Staf Pengajar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Mendidik dengan hati, menginspirasi melalui keilmuan Al-Qur'an dan sains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEACHERS_DATA.map((t) => (
            <div 
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={t.imageUrl}
                  alt={t.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-[#059669] font-bold text-[10px] border border-emerald-100">
                    {t.degree}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug font-heading">{t.name}</h3>
                  <p className="text-xs font-semibold text-[#059669]">{t.role}</p>
                  <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                    Mata Pelajaran: <span className="font-medium text-slate-800">{t.subjects}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
