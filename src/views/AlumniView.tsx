import React from 'react';
import { ALUMNI_DATA, TESTIMONIALS_DATA } from '../data/mockData';
import { PageTab } from '../types';
import { Users, UserCheck, Quote, Home, ChevronRight } from 'lucide-react';

interface AlumniViewProps {
  setActiveTab: (tab: PageTab) => void;
}

export const AlumniView: React.FC<AlumniViewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER (LEFT-ALIGNED WITH BREADCRUMB) */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto space-y-4 text-left">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pb-1">
            <ol className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-emerald-100">
              <li className="inline-flex items-center">
                <button
                  onClick={() => setActiveTab('beranda')}
                  className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-emerald-100"
                >
                  <Home className="w-4 h-4 text-amber-300" />
                  <span>Beranda</span>
                </button>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                <span className="text-amber-300 font-bold" aria-current="page">
                  Alumni
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-4xl">
            Jejak Langkah Alumni MI AL-AHMAD
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-3xl">
            Mencetak lulusan unggul yang berkiprah di berbagai profesi dengan membawa nilai-nilai akhlakul karimah.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('form-alumni')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              Isi Formulir Pendataan Alumni
            </button>
          </div>
        </div>
      </section>

      {/* STAT COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">3,500+</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Lulusan Tersebar</p>
            </div>
            <div className="space-y-1 md:border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">45+ Tahun</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Perjalanan Pengabdian</p>
            </div>
            <div className="space-y-1 md:border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-heading">Ikatan Alumni</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Jejak Silaturahmi Terjaga</p>
            </div>
          </div>
        </div>
      </section>

      {/* ALUMNI CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Profil Lulusan Berprestasi</h2>
          <p className="text-base text-slate-600">Kisah inspiratif alumni MI AL-AHMAD di berbagai bidang profesi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALUMNI_DATA.map((alm) => (
            <div key={alm.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={alm.imageUrl}
                  alt={alm.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#059669]"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{alm.name}</h3>
                  <p className="text-sm text-[#059669] font-bold">{alm.graduationYear}</p>
                  <p className="text-sm text-slate-600 font-medium">{alm.title}</p>
                </div>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{alm.bio}"
              </p>
            </div>
          ))}
        </div>

        {/* TESTIMONIALS */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 space-y-6 border border-emerald-200">
          <div className="flex items-center gap-2">
            <Quote className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kesan & Pesan Alumni</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS_DATA.map((t) => (
              <div key={t.id} className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img src={t.avatarUrl} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-200" />
                  <div>
                    <p className="font-bold text-slate-900 text-base">{t.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
