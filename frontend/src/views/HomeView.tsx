import React, { useState, useEffect } from 'react';
import { PageTab, Article, Achievement, AlumniProfile } from '../types';
import { api } from '../services/api';
import { mockAdminStore } from '../services/mockAdminData';
import {
  FACILITIES_DATA,
  ARTICLES_DATA,
  ACHIEVEMENTS_DATA,
} from '../data/mockData';
import {
  BookOpen,
  Building2,
  FlaskConical,
  Laptop,
  Monitor,
  Trophy,
  ChevronRight,
  Sparkles,
  GraduationCap,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { motion } from 'motion/react';

import { HeroSection } from '../components/sections/HeroSection';
import { PrincipalSection } from '../components/sections/PrincipalSection';
import { AdvantagesSection } from '../components/sections/AdvantagesSection';
import { MarqueeBanner } from '../components/sections/MarqueeBanner';
import { ArticleCard } from '../components/cards/ArticleCard';
import { ScrollFadeUp, StaggerContainer, StaggerItem } from '../components/ui/ScrollReveal';

interface HomeViewProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
  onOpenPPDB?: () => void;
  onSelectArticle: (art: Article) => void;
  settings?: Record<string, string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenContact,
  onOpenPPDB,
  onSelectArticle,
  settings: propSettings,
}) => {
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    return {
      ...mockAdminStore.getSettings(),
      ...(propSettings || {}),
    };
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    return mockAdminStore.getArticles();
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    return mockAdminStore.getAchievements();
  });
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);

  useEffect(() => {
    if (propSettings && Object.keys(propSettings).length > 0) {
      setSettings((prev) => ({ ...prev, ...propSettings }));
    }
  }, [propSettings]);

  useEffect(() => {
    const handleSettingsChanged = (e?: any) => {
      if (e?.detail && typeof e.detail === 'object') {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        setSettings(mockAdminStore.getSettings());
      }
    };
    const handleArticlesChanged = () => {
      setArticles(mockAdminStore.getArticles());
    };
    const handleAchievementsChanged = () => {
      setAchievements(mockAdminStore.getAchievements());
    };
    const handleAlumniChanged = () => {
      api.getAlumni().then((data) => {
        if (data && data.length > 0) setAlumniList(data);
      }).catch(() => {});
    };

    window.addEventListener('mi_settings_changed', handleSettingsChanged);
    window.addEventListener('mi_articles_changed', handleArticlesChanged);
    window.addEventListener('mi_achievements_changed', handleAchievementsChanged);
    window.addEventListener('mi_alumni_changed', handleAlumniChanged);
    window.addEventListener('storage', handleSettingsChanged);

    api.getSettings().then((res) => {
      if (res) setSettings((prev) => ({ ...prev, ...res }));
    }).catch(() => {});

    api.getArticles().then((res) => {
      if (res && res.length > 0) setArticles(res);
    }).catch(() => {});

    api.getAchievements().then((res) => {
      if (res && res.length > 0) setAchievements(res);
    }).catch(() => {});

    api.getAlumni().then((res) => {
      if (res && res.length > 0) setAlumniList(res);
    }).catch(() => {});

    return () => {
      window.removeEventListener('mi_settings_changed', handleSettingsChanged);
      window.removeEventListener('mi_articles_changed', handleArticlesChanged);
      window.removeEventListener('mi_achievements_changed', handleAchievementsChanged);
      window.removeEventListener('mi_alumni_changed', handleAlumniChanged);
      window.removeEventListener('storage', handleSettingsChanged);
    };
  }, []);

  const facilityIcons: Record<string, React.ReactNode> = {
    MonitorSmart: <Monitor className="w-6 h-6" />,
    BookOpen: <BookOpen className="w-6 h-6" />,
    Laptop: <Laptop className="w-6 h-6" />,
    Trophy: <Trophy className="w-6 h-6" />,
    Building2: <Building2 className="w-6 h-6" />,
    FlaskConical: <FlaskConical className="w-6 h-6" />,
  };

  return (
    <div className="space-y-0 pb-16">
      {settings.section_hero_visible !== 'false' && (
        <HeroSection 
          setActiveTab={setActiveTab} 
          onOpenContact={onOpenPPDB || onOpenContact} 
          settings={settings}
        />
      )}

      {settings.section_principal_visible !== 'false' && (
        <PrincipalSection 
          setActiveTab={setActiveTab} 
          onSelectArticle={onSelectArticle} 
          settings={settings}
          articles={articles}
        />
      )}

      {settings.section_advantages_visible !== 'false' && (
        <AdvantagesSection setActiveTab={setActiveTab} />
      )}

      {/* RUNNING TEXT TICKER BANNER (ANIMASI TEKS BERGERAK) */}
      {settings.section_marquee_visible !== 'false' && (
        <MarqueeBanner
          announcementText={
            settings.announcement_banner_active === 'true' && settings.announcement_banner_text
              ? settings.announcement_banner_text
              : undefined
          }
        />
      )}

      {/* Fasilitas Pembelajaran */}
      {settings.section_facilities_visible !== 'false' && (
        <section
          id="fasilitas-section"
          className="relative bg-gradient-to-b from-[#EEFBF4] via-[#F4FCF7] to-[#EEFBF4] py-20 lg:py-24 border-y border-emerald-100/70 overflow-hidden"
        >
          {/* Subtle Watermark Islamic Arabesque Vector Pattern */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full text-emerald-800/[0.045]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="soft-arabesque-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35 0 L70 35 L35 70 L0 35 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M35 10 L60 35 L35 60 L10 35 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <path
                  d="M0 0 L35 35 L70 0 M0 70 L35 35 L70 70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.7"
                />
                <circle cx="35" cy="35" r="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#soft-arabesque-pattern)" />
          </svg>

          {/* Ambient Glowing Orbs */}
          <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[700px] rounded-full bg-white/60 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
            {/* Header */}
            <ScrollFadeUp direction="up" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-emerald-800 bg-white/90 px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Fasilitas Lengkap & Modern
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                Lingkungan Belajar <span className="text-emerald-700">Kondusif & Terpadu</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-body">
                Fasilitas pendukung pembelajaran dikembangkan untuk menunjang potensi akademik,
                keagamaan Al-Qur'an, dan minat bakat setiap murid.
              </p>
            </ScrollFadeUp>

            {/* Facility Cards Grid */}
            <StaggerContainer
              staggerDelay={0.08}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {FACILITIES_DATA.map((fac, idx) => (
                <StaggerItem key={fac.id}>
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="h-full bg-white rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white transition-all duration-300 shadow-xs">
                          {facilityIcons[fac.iconName] || <Building2 className="w-6 h-6" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors uppercase tracking-wider">
                          Sarana
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xl font-heading group-hover:text-emerald-700 transition-colors">
                          {fac.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-body mt-2">
                          {fac.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100/80 flex items-center justify-between text-sm font-bold text-slate-500 group-hover:text-emerald-700 transition-colors">
                      <span>Standar Mutu Madrasah</span>
                      <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Prestasi Gemilang Terkini */}
      {settings.section_achievements_visible !== 'false' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8">
          <ScrollFadeUp
            direction="up"
            delay={0.1}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                <Trophy className="w-4 h-4 text-amber-500" />
                #JAWARA • Rekam Jejak Prestasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-2">
                Prestasi Gemilang Siswa Terkini
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-1">
                Pencapaian membanggakan santri MI AL-AHMAD di kancah daerah, regional hingga internasional
              </p>
            </div>
            <button
              onClick={() => setActiveTab('prestasi')}
              className="text-sm sm:text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              <span>Lihat Semua Prestasi ({achievements.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </ScrollFadeUp>

          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {achievements.slice(0, 3).map((ach) => (
              <StaggerItem key={ach.id}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => setActiveTab('prestasi')}
                  className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                      <img
                        src={ach.imageUrl || '/assets/prestasi-iksc-2025.jpg'}
                        alt={ach.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/prestasi-iksc-2025.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-black/60 backdrop-blur-md">
                          {ach.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm gap-2">
                        Lihat Detail Prestasi
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                        {ach.rank || 'Prestasi'}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {ach.title}
                      </h3>
                      <p className="text-sm font-bold text-emerald-800">
                        {ach.winner}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                      <span>Buka Rincian</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Berita & Artikel */}
      {settings.section_articles_visible !== 'false' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8">
          <ScrollFadeUp
            direction="up"
            delay={0.1}
            className="flex items-center justify-between border-b border-slate-200 pb-4"
          >
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                Kabar Madrasah
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Berita & Artikel Terkini
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('artikel')}
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              Lihat Semua Berita
              <ChevronRight className="w-4 h-4" />
            </button>
          </ScrollFadeUp>

          <StaggerContainer
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {articles.slice(0, 3).map((art) => (
              <StaggerItem key={art.id}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <ArticleCard article={art} onSelect={onSelectArticle} />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Kisah & Jejak Alumni */}
      {alumniList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8">
          <ScrollFadeUp
            direction="up"
            delay={0.1}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                #LULUSAN • Rekam Jejak Alumni
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-2">
                Inspirasi & Kisah Alumni
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-1">
                Kiprah santri dan lulusan MI AL-AHMAD yang berkontribusi bagi masyarakat dan bangsa
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('alumni');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-sm sm:text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                <span>Lihat Semua Alumni</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollFadeUp>

          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {alumniList.slice(0, 3).map((alm) => (
              <StaggerItem key={alm.id}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => {
                    setActiveTab('alumni');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      {alm.imageUrl ? (
                        <img
                          src={alm.imageUrl}
                          alt={alm.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 shadow-xs shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.alumni-avatar-fallback')) {
                              const div = document.createElement('div');
                              div.className = 'alumni-avatar-fallback w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0';
                              div.textContent = alm.name ? alm.name.charAt(0) : 'A';
                              parent.prepend(div);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                          {alm.name ? alm.name.charAt(0) : 'A'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                          {alm.name}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-700">
                          Lulusan {alm.graduationYear}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                          {alm.profession || alm.currentRole}
                        </p>
                      </div>
                    </div>

                    {alm.quote && (
                      <p className="text-sm text-slate-600 italic bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                        "{alm.quote}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Lihat Profil Lengkap</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA Form Alumni Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold font-heading">
                Apakah Anda Alumni MI AL-AHMAD?
              </h3>
              <p className="text-sm text-emerald-100 max-w-xl">
                Jalin silaturahmi kembali bersama almamater tercinta. Bagikan jejak profesi dan inspirasi Anda untuk adik-adik santri.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('form-alumni');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Isi Pendataan Alumni</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

