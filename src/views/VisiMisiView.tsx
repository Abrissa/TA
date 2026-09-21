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
import { SCHOOL_INFO } from '../data/mockData';

interface VisiMisiViewProps {
  onOpenContact: () => void;
  setActiveTab: (tab: any) => void;
}

export const VisiMisiView: React.FC<VisiMisiViewProps> = ({ onOpenContact, setActiveTab }) => {
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
                  Visi & Misi
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-4xl">
            Visi, Misi & Landasan Pendidikan
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-3xl">
            Membangun pendidikan dasar Islam berkarakter, berorientasi Al-Qur'an, serta unggul dalam penguasaan sains dan teknologi.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* VISI CARD (LEFT-ALIGNED) */}
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
                MI AL-AHMAD
              </h2>
            </div>
          </div>
          <blockquote className="text-lg sm:text-xl lg:text-2xl font-bold font-heading text-[#059669] leading-relaxed bg-emerald-50/80 p-6 sm:p-8 rounded-2xl border border-emerald-200 text-left">
            "Terwujudnya Generasi Qur'ani yang Unggul dalam Prestasi, Berakhlakul Karimah, dan Memiliki Kecerdasan Sains serta Teknologi."
          </blockquote>
        </div>

        {/* MISI KAMI + IMAGE */}
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
              Upaya nyata MI AL-AHMAD dalam menyelenggarakan proses pembelajaran dasar berkualitas tinggi.
            </p>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">Integrasi Kurikulum Merdeka & Al-Qur'an</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">
                    Menyelenggarakan pembelajaran akademik terpadu yang didukung program Tahfidz Al-Qur'an dan bimbingan membaca Al-Qur'an metode Tartil.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">Pembiasaan Akhlak & Karakter Islami</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">
                    Membiasakan salat Dhuha, Dzuhur berjamaah, kultum santri, serta penanaman adab kesopanan sehari-hari.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">Pengembangan Minat & Teknologi</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">
                    Fasilitas laboratorium komputer, sains interaktif, serta ekstrakurikuler kepramukaan dan seni budaya Islami.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
                alt="Kegiatan Belajar Siswa MI AL-AHMAD"
                className="w-full h-[380px] object-cover rounded-xl"
              />
            </div>
          </div>

        </div>

        {/* NILAI UTAMA SEKOLAH */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-6 border border-emerald-200">
          <div className="space-y-1.5 text-left">
            <span className="text-sm font-bold uppercase tracking-widest text-[#059669]">
              Fondasi Karakter
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">4 Pilar Utama Pendidikan MI AL-AHMAD</h3>
            <p className="text-base text-slate-600">Nilai dasar yang mendasari setiap proses pengajaran dan pengasuhan di sekolah.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
              <h4 className="font-bold text-emerald-700 text-base">1. Religius & Qur'ani</h4>
              <p className="text-slate-600 leading-relaxed">Menjadikan Al-Qur'an dan Sunnah sebagai pedoman utama dalam sikap dan tindakan.</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-amber-200 shadow-xs space-y-2">
              <h4 className="font-bold text-amber-700 text-base">2. Unggul Akademik</h4>
              <p className="text-slate-600 leading-relaxed">Menguasai ilmu pengetahuan sains, matematika, dan bahasa dengan hasil memuaskan.</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
              <h4 className="font-bold text-emerald-700 text-base">3. Berakhlak Mulia</h4>
              <p className="text-slate-600 leading-relaxed">Menghormati orang tua, guru, serta memiliki empati sosial yang tinggi di masyarakat.</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-amber-200 shadow-xs space-y-2">
              <h4 className="font-bold text-amber-700 text-base">4. Berwawasan IT</h4>
              <p className="text-slate-600 leading-relaxed">Menguasai pemanfaatan teknologi digital secara bijak dan produktif sejak dini.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
