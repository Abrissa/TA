import React, { useState, useEffect } from 'react';
import { PageTab, AlumniProfile } from '../types';
import { api, resolveImageUrl } from '../services/api';
import { 
  Users, 
  UserCheck, 
  Quote, 
  Loader2, 
  Briefcase, 
  GraduationCap,
  Globe,
  Instagram,
  Linkedin,
  CheckCircle2
} from 'lucide-react';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';

const parseSocialLink = (url?: string | null) => {
  if (!url || !url.trim()) return null;
  const raw = url.trim();
  const fullUrl = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
  const isInstagram = /instagram\.com|instagr\.am/i.test(raw);
  const isLinkedIn = /linkedin\.com/i.test(raw);
  const display = raw.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return {
    url: fullUrl,
    display,
    isInstagram,
    isLinkedIn,
  };
};

interface AlumniViewProps {
  setActiveTab: (tab: PageTab) => void;
  settings?: Record<string, string>;
}

export const AlumniView: React.FC<AlumniViewProps> = ({ setActiveTab, settings }) => {
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAlumni = () => {
    api.getAlumni()
      .then((data) => {
        setProfiles(data || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAlumni();
    window.addEventListener('mi_alumni_changed', fetchAlumni);
    return () => {
      window.removeEventListener('mi_alumni_changed', fetchAlumni);
    };
  }, []);

  return (
    <div className="space-y-12 pb-16 bg-slate-50/50 min-h-screen">
      
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab('beranda') },
          { label: 'Alumni' },
        ]}
        title={
          settings?.alumni_banner_title ? (
            settings.alumni_banner_title
          ) : (
            <>
              Jejak Langkah Alumni <br />
              <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">
                MI AL-AHMAD Krian
              </span>
            </>
          )
        }
        subtitle={settings?.alumni_banner_subtitle || "Mencetak generasi Qur'ani dan cendekia berakhlak mulia yang berkiprah di berbagai penjuru nusantara dan dunia."}
        backgroundImageUrl={resolveImageUrl(settings?.alumni_banner_image || '/storage/school/gedung-mi-al-ahmad.jpg')}
      >
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('form-alumni')}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-slate-950" />
            <span>{settings?.alumni_cta_text || 'Isi Formulir Pendataan Alumni'}</span>
          </button>
        </div>
      </PageHeroBanner>

      {/* STAT COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">
                {settings?.alumni_stat_graduates || '3,500+'}
              </p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {settings?.alumni_stat_graduates_label || 'Lulusan Tersebar'}
              </p>
            </div>
            <div className="space-y-1 md:border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#059669] font-heading">
                {settings?.alumni_stat_years || '45+ Tahun'}
              </p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {settings?.alumni_stat_years_label || 'Perjalanan Pengabdian'}
              </p>
            </div>
            <div className="space-y-1 md:border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-heading">
                {settings?.alumni_stat_network || 'Ikatan Alumni'}
              </p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {settings?.alumni_stat_network_label || 'Jejak Silaturahmi Terjaga'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ALUMNI CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {settings?.alumni_section_title || 'Profil Lulusan Berprestasi'}
          </h2>
          <p className="text-base text-slate-600">
            {settings?.alumni_section_subtitle || 'Kisah inspiratif alumni MI AL-AHMAD di berbagai bidang profesi.'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p, idx) => {
              const fallbackAvatar = resolveImageUrl(`/storage/alumni/alumni-${(idx % 3) + 1}.svg`);
              const imageSrc = resolveImageUrl(p.imageUrl) || fallbackAvatar;
              const socialInfo = parseSocialLink(p.socialUrl);

              return (
                <div key={p.id || idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={imageSrc} 
                        alt={p.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 shrink-0" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackAvatar;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 text-base truncate">{p.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span>Lulusan {p.graduationYear.replace(/^[^\d]*/, '')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{p.profession || p.currentRole || p.title}</span>
                        </div>
                      </div>
                    </div>
                    {(p.quote || p.bio) && (
                      <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed line-clamp-3">
                        "{p.quote || p.bio}"
                      </p>
                    )}
                  </div>

                  {/* Card Footer - always present so cards have identical height and balanced styling */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Alumni Terverifikasi</span>
                    </span>

                    {socialInfo ? (
                      <a
                        href={socialInfo.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors max-w-[150px] sm:max-w-[180px] truncate ${
                          socialInfo.isInstagram
                            ? 'text-pink-600 hover:text-pink-700'
                            : socialInfo.isLinkedIn
                            ? 'text-sky-700 hover:text-sky-800'
                            : 'text-[#059669] hover:text-[#047857]'
                        }`}
                        title={socialInfo.display}
                      >
                        {socialInfo.isInstagram ? (
                          <Instagram className="w-3.5 h-3.5 shrink-0 text-pink-600" />
                        ) : socialInfo.isLinkedIn ? (
                          <Linkedin className="w-3.5 h-3.5 shrink-0 text-sky-700" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 shrink-0 text-[#059669]" />
                        )}
                        <span className="truncate">{socialInfo.display}</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>MI AL-AHMAD</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
