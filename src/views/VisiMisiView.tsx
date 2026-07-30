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
  FileText
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/mockData';

interface VisiMisiViewProps {
  onOpenContact: () => void;
  setActiveTab: (tab: any) => void;
}

export const VisiMisiView: React.FC<VisiMisiViewProps> = ({ onOpenContact, setActiveTab }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold border border-white/20">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Profil Resmi Madrasah</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Visi, Misi & Landasan Pendidikan
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Membangun pendidikan dasar Islam berkarakter, berorientasi Al-Qur'an, serta unggul dalam penguasaan sains dan teknologi.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* VISI CARD */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center max-w-4xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto border border-emerald-100">
            <Target className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
            Visi Utama Madrasah
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            MI AL-AHMAD
          </h2>
          <blockquote className="text-lg sm:text-xl font-bold font-heading text-[#059669] leading-relaxed max-w-2xl mx-auto bg-emerald-50/80 p-6 rounded-xl border border-emerald-200">
            "Terwujudnya Generasi Qur'ani yang Unggul dalam Prestasi, Berakhlakul Karimah, dan Memiliki Kecerdasan Sains serta Teknologi."
          </blockquote>
        </div>

        {/* MISI KAMI + IMAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
                Komitmen Strategis
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                Misi Pendidikan Madrasah
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Upaya nyata MI AL-AHMAD dalam menyelenggarakan proses pembelajaran dasar berkualitas tinggi.
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Integrasi Kurikulum Merdeka & Al-Qur'an</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Menyelenggarakan pembelajaran akademik terpadu yang didukung program Tahfidz Al-Qur'an dan bimbingan membaca Al-Qur'an metode Tartil.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pembiasaan Akhlak & Karakter Islami</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Membiasakan salat Dhuha, Dzuhur berjamaah, kultum santri, serta penanaman adab kesopanan sehari-hari.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pengembangan Minat & Teknologi</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
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
                className="w-full h-[360px] object-cover rounded-xl"
              />
            </div>
          </div>

        </div>

        {/* NILAI UTAMA SEKOLAH */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 space-y-6 border border-emerald-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">4 Pilar Utama Pendidikan MI AL-AHMAD</h3>
            <p className="text-xs text-slate-600">Nilai dasar yang mendasari setiap proses pengajaran dan pengasuhan di sekolah.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
              <h4 className="font-bold text-emerald-700 text-sm">1. Religius & Qur'ani</h4>
              <p className="text-slate-600 leading-relaxed">Menjadikan Al-Qur'an dan Sunnah sebagai pedoman utama dalam sikap dan tindakan.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs space-y-2">
              <h4 className="font-bold text-amber-700 text-sm">2. Unggul Akademik</h4>
              <p className="text-slate-600 leading-relaxed">Menguasai ilmu pengetahuan sains, matematika, dan bahasa dengan hasil memuaskan.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
              <h4 className="font-bold text-emerald-700 text-sm">3. Berakhlak Mulia</h4>
              <p className="text-slate-600 leading-relaxed">Menghormati orang tua, guru, serta memiliki empati sosial yang tinggi di masyarakat.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs space-y-2">
              <h4 className="font-bold text-amber-700 text-sm">4. Berwawasan IT</h4>
              <p className="text-slate-600 leading-relaxed">Menguasai pemanfaatan teknologi digital secara bijak dan produktif sejak dini.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
