import React, { useState, useEffect } from 'react';
import { Teacher, PageTab } from '../types';
import { api, resolveImageUrl } from '../services/api';
import { TEACHERS_DATA } from '../data/mockData';
import { 
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';

interface TeachersViewProps {
  onOpenContact: () => void;
  setActiveTab: (tab: PageTab) => void;
  settings?: Record<string, string>;
}

export const TeachersView: React.FC<TeachersViewProps> = ({ onOpenContact, setActiveTab, settings }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleTeachersChanged = (e?: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setTeachers(e.detail);
      } else {
        api.getTeachers().then((data) => {
          if (data && data.length > 0) setTeachers(data);
        }).catch(() => {});
      }
    };

    window.addEventListener('mi_teachers_changed', handleTeachersChanged);
    window.addEventListener('storage', handleTeachersChanged);

    api.getTeachers()
      .then((data) => {
        if (data && data.length > 0) setTeachers(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => {
      window.removeEventListener('mi_teachers_changed', handleTeachersChanged);
      window.removeEventListener('storage', handleTeachersChanged);
    };
  }, []);

  return (
    <div className="space-y-12 pb-16 bg-slate-50/50 min-h-screen">
      
      {/* HEADER BANNER WITH SILHOUETTE & TEACHERS PHOTO */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab('beranda') },
          { label: 'Dewan Guru & Staf' },
        ]}
        title={
          settings?.teachers_banner_title ? (
            settings.teachers_banner_title
          ) : (
            <>
              Dewan Guru & Tenaga Kependidikan <br />
              <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">
                MI AL-AHMAD Krian
              </span>
            </>
          )
        }
        subtitle={settings?.teachers_banner_subtitle || "Tenaga pendidik profesional berijazah sarjana & magister yang siap mendidik murid dengan keikhlasan, ilmu, dan kearifan akhlak Qur'ani."}
        backgroundImageUrl={resolveImageUrl(settings?.teachers_banner_image) || "/assets/dewan-guru-mi-al-ahmad.jpg"}
        imagePosition="object-[center_62%]"
      />

      {/* TEACHERS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#059669]">
            Pendidik Dedikatif
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-heading text-slate-900">
            Direktori Guru & Staf Pengajar
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Mendidik dengan hati, menginspirasi melalui keilmuan Al-Qur'an dan sains.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-emerald-600" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
            Belum ada data guru yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {teachers.map((t, idx) => {
              const fallbackAvatar = `/assets/teachers/guru-${(idx % 7) + 1}.svg`;
              const imageSrc = resolveImageUrl(t.imageUrl) || fallbackAvatar;
              const isSvgAvatar =
                typeof imageSrc === 'string' &&
                (imageSrc.includes('.svg') || imageSrc.includes('/assets/teachers/guru-'));

              return (
                <div 
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-52 sm:h-60 bg-slate-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={imageSrc}
                        alt={t.name}
                        className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                          isSvgAvatar ? 'object-contain p-3' : 'object-cover'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = fallbackAvatar;
                        }}
                      />
                    </div>
                  <div className="p-4 sm:p-6 space-y-2">
                    {t.degree && (
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#059669] font-bold text-xs border border-emerald-100">
                        {t.degree}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug font-heading">{t.name}</h3>
                    <p className="text-xs sm:text-sm font-bold text-[#059669]">{t.role}</p>
                    {t.subjects && (
                      <p className="text-xs sm:text-sm text-slate-600 pt-1.5 border-t border-slate-100">
                        Mata Pelajaran: <span className="font-medium text-slate-800">{t.subjects}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

      </div>

    </div>
  );
};
