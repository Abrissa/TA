import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Target, 
  Award, 
  ChevronRight, 
  FileText,
  Home,
} from 'lucide-react';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';
import { resolveImageUrl } from '../services/api';

interface VisiMisiViewProps {
  onOpenContact: () => void;
  setActiveTab: (tab: any) => void;
  settings?: Record<string, string>;
}

export const VisiMisiView: React.FC<VisiMisiViewProps> = ({ onOpenContact, setActiveTab, settings }) => {
  const schoolName = settings?.school_name || 'MI AL-AHMAD';
  const visionText = settings?.vision_text || "Terwujudnya Generasi Qur'ani yang Unggul dalam Prestasi, Berakhlakul Karimah, dan Memiliki Kecerdasan Sains serta Teknologi.";
  const visionImage = resolveImageUrl(settings?.vision_image_url) || '/assets/gedung-mi-al-ahmad.jpg';

  const missions = [
    {
      title: settings?.mission_1_title || "Integrasi Kurikulum Merdeka & Al-Qur'an",
      desc: settings?.mission_1_desc || "Menyelenggarakan pembelajaran akademik terpadu yang didukung program Tahfidz Al-Qur'an dan bimbingan membaca Al-Qur'an metode Tartil.",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: settings?.mission_2_title || "Pembiasaan Akhlak & Karakter Islami",
      desc: settings?.mission_2_desc || "Membiasakan salat Dhuha, Dzuhur berjamaah, kultum santri, serta penanaman adab kesopanan sehari-hari.",
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      title: settings?.mission_3_title || "Pengembangan Minat & Teknologi",
      desc: settings?.mission_3_desc || "Fasilitas laboratorium komputer, sains interaktif, serta ekstrakurikuler kepramukaan dan seni budaya Islami.",
      icon: <GraduationCap className="w-5 h-5" />
    },
  ];

  const pillars = [
    {
      title: settings?.pillar_1_title || "Religius & Qur'ani",
      desc: settings?.pillar_1_desc || "Menjadikan Al-Qur'an dan Sunnah sebagai pedoman utama dalam sikap dan tindakan.",
      border: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    {
      title: settings?.pillar_2_title || "Unggul Akademik",
      desc: settings?.pillar_2_desc || "Menguasai ilmu pengetahuan sains, matematika, dan bahasa dengan hasil memuaskan.",
      border: "border-amber-200",
      textColor: "text-amber-700",
    },
    {
      title: settings?.pillar_3_title || "Berakhlak Mulia",
      desc: settings?.pillar_3_desc || "Menghormati orang tua, guru, serta memiliki empati sosial yang tinggi di masyarakat.",
      border: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    {
      title: settings?.pillar_4_title || "Berwawasan IT",
      desc: settings?.pillar_4_desc || "Menguasai pemanfaatan teknologi digital secara bijak dan produktif sejak dini.",
      border: "border-amber-200",
      textColor: "text-amber-700",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab('beranda') },
          { label: 'Visi & Misi' },
        ]}
        title="Visi, Misi & Landasan Pendidikan"
        subtitle="Membangun pendidikan dasar Islam berkarakter, berorientasi Al-Qur'an, serta unggul dalam penguasaan sains dan teknologi."
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Visi Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-5 text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#059669]">
                Visi Utama Madrasah
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900">
                {schoolName}
              </h2>
            </div>
          </div>
          <blockquote className="text-lg sm:text-xl lg:text-2xl font-bold font-heading text-[#059669] leading-relaxed bg-emerald-50/80 p-6 sm:p-8 rounded-2xl border border-emerald-200 text-left">
            "{visionText.replace(/^["']|["']$/g, '')}"
          </blockquote>
        </div>

        {/* Misi & Gambar Dokumentasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-1.5">
              <span className="text-sm font-bold uppercase tracking-widest text-[#059669]">
                Komitmen Strategis
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                Misi Pendidikan Madrasah
              </h2>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Upaya nyata {schoolName} dalam menyelenggarakan proses pembelajaran dasar berkualitas tinggi.
            </p>

            <div className="space-y-4 text-sm sm:text-base">
              {missions.map((mission, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                    {mission.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{mission.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                      {mission.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <img
                src={visionImage || '/assets/gedung-mi-al-ahmad.jpg'}
                alt={`Kegiatan Belajar Siswa ${schoolName}`}
                className="w-full h-[380px] object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = '/assets/gedung-mi-al-ahmad.jpg';
                }}
              />
            </div>
          </div>

        </div>

        {/* Nilai Fondasi Karakter Siswa */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-6 border border-emerald-200">
          <div className="space-y-1.5 text-left">
            <span className="text-sm font-bold uppercase tracking-widest text-[#059669]">
              Fondasi Karakter
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Pilar Karakter Pendidikan {schoolName}</h3>
            <p className="text-base text-slate-600">Nilai dasar yang mendasari setiap proses pengajaran dan pengasuhan di sekolah.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {pillars.map((pillar, idx) => (
              <div key={idx} className={`p-5 rounded-xl bg-white border ${pillar.border} shadow-xs space-y-2`}>
                <h4 className={`font-bold ${pillar.textColor} text-base`}>{pillar.title}</h4>
                <p className="text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
