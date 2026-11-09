import React, { useState, useEffect } from 'react';
import { PageTab, AlumniProfile } from '../types';
import { api } from '../services/api';
import { ALUMNI_DATA } from '../data/mockData';
import { Users, UserCheck, Quote, Loader2, Briefcase, GraduationCap } from 'lucide-react';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';

interface AlumniViewProps {
  setActiveTab: (tab: PageTab) => void;
}

export const AlumniView: React.FC<AlumniViewProps> = ({ setActiveTab }) => {
  const [profiles, setProfiles] = useState<AlumniProfile[]>(ALUMNI_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getAlumni()
      .then((data) => {
        if (data && data.length > 0) setProfiles(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-12 pb-16 bg-slate-50/50 min-h-screen">
      
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab('beranda') },
          { label: 'Alumni' },
        ]}
        title={
          <>
            Jejak Langkah Alumni <br />
            <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">
              MI AL-AHMAD Krian
            </span>
          </>
        }
        subtitle="Mencetak generasi Qur'ani dan cendekia berakhlak mulia yang berkiprah di berbagai penjuru nusantara dan dunia."
      >
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('form-alumni')}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-slate-950" />
            <span>Isi Formulir Pendataan Alumni</span>
          </button>
        </div>
      </PageHeroBanner>

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

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0" 
                      onError={(e) => {
                        // Fallback to initial letter if image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.alumni-avatar-fallback')) {
                          const div = document.createElement('div');
                          div.className = 'alumni-avatar-fallback w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0';
                          div.textContent = p.name ? p.name.charAt(0) : 'A';
                          parent.prepend(div);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Lulusan {p.graduationYear}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.profession}</span>
                    </div>
                  </div>
                </div>
                {p.quote && (
                  <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 italic">
                    "{p.quote}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
            <p className="text-slate-500 text-sm font-medium">Data profil alumni ditampilkan setelah diverifikasi admin.</p>
            <p className="text-slate-400 text-xs mt-1">Apakah Anda alumni MI AL-AHMAD? Mari terhubung dan daftarkan kiprah Anda melalui tombol di atas.</p>
          </div>
        )}

        {/* TESTIMONIALS */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 space-y-6 border border-emerald-200">
          <div className="flex items-center gap-2">
            <Quote className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kesan & Pesan Alumni</h3>
          </div>

          <div className="text-center py-8 text-slate-500 text-sm">
            Kesan &amp; pesan alumni dikumpulkan dari formulir pendataan alumni.
          </div>
        </div>

      </div>

    </div>
  );
};
