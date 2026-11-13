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
}

export const TeachersView: React.FC<TeachersViewProps> = ({ onOpenContact, setActiveTab }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getTeachers()
      .then((data) => {
        if (data && data.length > 0) setTeachers(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
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
          <>
            Dewan Guru & Tenaga Kependidikan <br />
            <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">
              MI AL-AHMAD Krian
            </span>
          </>
        }
        subtitle="Tenaga pendidik profesional berijazah sarjana & magister yang siap mendidik murid dengan keikhlasan, ilmu, dan kearifan akhlak Qur'ani."
        backgroundImageUrl="/assets/dewan-guru-mi-al-ahmad.jpg"
        imagePosition="object-[center_62%]"
      />

      {/* STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">
                {teachers.length > 0 ? teachers.length : '32'}
              </p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Guru & Staf</p>
            </div>

            <div className="space-y-1 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">100%</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Lulusan S1 / S2</p>
            </div>

            <div className="space-y-1 border-l-0 md:border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">15:1</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Rasio Guru:Siswa</p>
            </div>

            <div className="space-y-1 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-heading">Sertifikasi</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Kemenag & Kemdikbud</p>
            </div>

          </div>
        </div>
      </section>

      {/* TEACHERS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-sm font-bold uppercase tracking-wider text-[#059669]">
            Pendidik Dedikatif
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Direktori Guru & Staf Pengajar
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Mendidik dengan hati, menginspirasi melalui keilmuan Al-Qur'an dan sains.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
            Belum ada data guru yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((t, idx) => {
              const fallbackAvatar = `/assets/teachers/guru-${(idx % 7) + 1}.svg`;
              const imageSrc = resolveImageUrl(t.imageUrl) || fallbackAvatar;

              return (
                <div 
                  key={t.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={imageSrc}
                      alt={t.name}
                      className="w-full h-56 object-cover bg-slate-100"
                      onError={(e) => {
                        e.currentTarget.src = fallbackAvatar;
                      }}
                    />
                  <div className="p-5 sm:p-6 space-y-2.5">
                    {t.degree && (
                      <span className="inline-block px-3 py-1 rounded bg-emerald-50 text-[#059669] font-bold text-xs border border-emerald-100">
                        {t.degree}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-lg leading-snug font-heading">{t.name}</h3>
                    <p className="text-sm font-bold text-[#059669]">{t.role}</p>
                    {t.subjects && (
                      <p className="text-sm text-slate-600 pt-1.5 border-t border-slate-100">
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
