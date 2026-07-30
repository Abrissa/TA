import React from 'react';
import { PageTab, Article } from '../types';
import {
  FACILITIES_DATA,
  ARTICLES_DATA,
  ANNOUNCEMENTS_DATA,
  AGENDA_DATA,
} from '../data/mockData';
import {
  BookOpen,
  Building2,
  FlaskConical,
  Laptop,
  Monitor,
  Trophy,
  Megaphone,
  Calendar,
  ChevronRight,
} from 'lucide-react';

import { HeroSection } from '../components/sections/HeroSection';
import { PrincipalSection } from '../components/sections/PrincipalSection';
import { AnnouncementCard } from '../components/cards/AnnouncementCard';
import { AgendaCard } from '../components/cards/AgendaCard';
import { ArticleCard } from '../components/cards/ArticleCard';

interface HomeViewProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
  onSelectArticle: (art: Article) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenContact,
  onSelectArticle,
}) => {
  const facilityIcons: Record<string, React.ReactNode> = {
    MonitorSmart: <Monitor className="w-6 h-6 text-emerald-600" />,
    BookOpen: <BookOpen className="w-6 h-6 text-emerald-600" />,
    Laptop: <Laptop className="w-6 h-6 text-emerald-600" />,
    Trophy: <Trophy className="w-6 h-6 text-emerald-600" />,
    Building2: <Building2 className="w-6 h-6 text-emerald-600" />,
    FlaskConical: <FlaskConical className="w-6 h-6 text-emerald-600" />,
  };

  return (
    <div className="space-y-0 pb-16">
      {/* 1. HERO SECTION (ORGANISM) */}
      <HeroSection setActiveTab={setActiveTab} onOpenContact={onOpenContact} />

      {/* 2. PROFIL & SAMBUTAN KEPALA MADRASAH (ORGANISM) */}
      <PrincipalSection setActiveTab={setActiveTab} onSelectArticle={onSelectArticle} />

      {/* 3. PENGUMUMAN & AGENDA (MOLECULES) */}
      <section className="bg-white py-12 border-b border-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Pengumuman (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Pengumuman Resmi Madrasah
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Terbaru</span>
            </div>

            <div className="space-y-3">
              {ANNOUNCEMENTS_DATA.map((item) => (
                <AnnouncementCard key={item.id} {...item} />
              ))}
            </div>
          </div>

          {/* Right: Agenda (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold font-heading text-slate-900">Agenda Kegiatan</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Mendatang</span>
            </div>

            <div className="space-y-4">
              {AGENDA_DATA.map((ag) => (
                <AgendaCard key={ag.id} {...ag} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FASILITAS PEMBELAJARAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Fasilitas Lengkap & Modern
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Lingkungan Belajar Kondusif & Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Fasilitas pendukung pembelajaran dikembangkan untuk menunjang potensi akademik,
            keagamaan, dan minat bakat setiap murid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES_DATA.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all space-y-3"
            >
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 inline-block">
                {facilityIcons[fac.iconName] || <Building2 className="w-6 h-6 text-emerald-600" />}
              </div>
              <h3 className="font-bold text-slate-900 text-base font-heading">{fac.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BERITA & ARTIKEL (MOLECULES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Kabar Madrasah
            </span>
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Berita & Artikel Terkini
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('artikel')}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Berita
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.slice(0, 3).map((art) => (
            <ArticleCard key={art.id} article={art} onSelect={onSelectArticle} />
          ))}
        </div>
      </section>
    </div>
  );
};
