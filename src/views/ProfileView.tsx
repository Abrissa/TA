import React, { useState } from 'react';
import { TEACHERS_DATA } from '../data/mockData';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  Heart, 
  ShieldCheck, 
  UserPlus, 
  ArrowRight,
  GraduationCap,
  Award,
  Users,
  Clock,
  Home,
  ChevronRight,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenPPDB: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenPPDB }) => {
  const [activeSubTab, setActiveSubTab] = useState<'guru' | 'visi-misi'>('guru');

  return (
    <div className="space-y-16 pb-16">
      
      {/* HEADER BANNER (LEFT-ALIGNED WITH BREADCRUMB) */}
      <section className="bg-gradient-to-r from-[#005235] via-[#006C47] to-[#00B87C] text-white rounded-b-3xl sm:rounded-b-[2.5rem] p-8 sm:p-14 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-4 text-left relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pb-1">
            <ol className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-emerald-100">
              <li className="inline-flex items-center">
                <span className="inline-flex items-center gap-1.5 text-emerald-100">
                  <Home className="w-4 h-4 text-amber-300" />
                  <span>Beranda</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                <span className="text-amber-300 font-bold" aria-current="page">
                  Profil Sekolah
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight max-w-4xl">
            Pendidik & Visi Pendidikan Kami
          </h1>

          <p className="text-emerald-50 text-base sm:text-lg max-w-3xl leading-relaxed">
            Membangun jembatan antara nilai-nilai luhur keislaman dengan keunggulan akademik modern untuk masa depan buah hati Anda.
          </p>

          {/* Navigation Sub-Tabs Toggle */}
          <div className="pt-4 flex justify-start gap-3">
            <button
              onClick={() => setActiveSubTab('guru')}
              className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                activeSubTab === 'guru'
                  ? 'bg-white text-[#006C47] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Tenaga Pendidik (Guru)
            </button>
            <button
              onClick={() => setActiveSubTab('visi-misi')}
              className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                activeSubTab === 'visi-misi'
                  ? 'bg-white text-[#006C47] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Visi, Misi & Nilai
            </button>
          </div>
        </div>
      </section>

      {/* VIEW SUB-SECTION 1: TENAGA PENDIDIK / GURU */}
      {activeSubTab === 'guru' && (
        <div className="space-y-16 animate-in fade-in duration-300">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="text-sm font-bold uppercase tracking-widest text-[#006C47]">
                AKADEMIK EKSELEN
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-slate-900">
                Tenaga Pendidik Kami
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Dipandu oleh pendidik yang berdedikasi dan kompeten, kami berkomitmen untuk mencetak generasi Qur'ani yang unggul dalam ilmu pengetahuan dan berakhlak mulia.
              </p>
            </div>

            {/* Grid of Teacher Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEACHERS_DATA.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 text-center flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="h-64 rounded-xl overflow-hidden bg-slate-100 mb-4">
                      <img
                        src={teacher.imageUrl}
                        alt={teacher.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-slate-900">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium mt-1">
                      {teacher.role}
                    </p>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <span className="inline-block w-full py-2 px-3 bg-emerald-50 text-[#006C47] text-xs sm:text-sm font-bold rounded-xl border border-emerald-200/60">
                      {teacher.subjects}
                    </span>
                  </div>
                </div>
              ))}

              {/* Recruitment Join Card */}
              <div className="bg-emerald-50/80 rounded-2xl border-2 border-dashed border-emerald-300 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#006C47] text-white flex items-center justify-center shadow-md">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#006C47]">
                    Ingin Bergabung?
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Kami selalu mencari pendidik berbakat dan berdedikasi tinggi untuk tim kami.
                  </p>
                </div>
                <button
                  onClick={() => alert('Informasi Lowongan Karir: Silakan kirimkan CV dan Berkas Pengajaran ke email karir@mialahmad.sch.id')}
                  className="px-5 py-2.5 bg-[#006C47] text-white text-sm font-bold rounded-xl hover:bg-[#005437] transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  Lihat Lowongan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <section className="bg-slate-50 border-y border-slate-200/80 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#006C47] font-heading">25+</p>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">GURU PROFESIONAL</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#006C47] font-heading">15+</p>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">TAHUN PENGALAMAN</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#006C47] font-heading">100%</p>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">SERTIFIKASI PENDIDIK</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#006C47] font-heading">12:1</p>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">RASIO GURU:SISWA</p>
                </div>

              </div>
            </div>
          </section>

        </div>
      )}

      {/* VIEW SUB-SECTION 2: VISI, MISI & NILAI */}
      {activeSubTab === 'visi-misi' && (
        <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
          
          {/* VISI CARD (LEFT-ALIGNED) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-5 text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#006C47] flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#006C47]">
                  Pondasi Masa Depan
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900">
                  Visi Sekolah
                </h2>
              </div>
            </div>
            <blockquote className="text-lg sm:text-xl lg:text-2xl font-semibold font-heading text-[#006C47] italic leading-relaxed bg-emerald-50/80 p-6 sm:p-8 rounded-2xl border border-emerald-200 text-left">
              "Terwujudnya Generasi Qur'ani yang Unggul dalam Prestasi, Berakhlakul Karimah, dan Memiliki Kecerdasan Global."
            </blockquote>
          </div>

          {/* MISI KAMI + IMAGE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#006C47]">
                Misi Kami
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Upaya nyata kami dalam mewujudkan visi sekolah melalui strategi pendidikan yang terukur dan berorientasi pada hasil.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006C47] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">Meningkatkan Kualitas Pembelajaran</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1">
                      Mengimplementasikan kurikulum nasional yang diintegrasikan dengan metode tahfidz dan literasi modern.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006C47] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">Menanamkan Nilai-Nilai Islam</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1">
                      Membentuk pembiasaan ibadah harian dan akhlak mulia dalam setiap interaksi di lingkungan sekolah.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006C47] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">Mengembangkan Potensi Siswa</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1">
                      Memfasilitasi bakat dan minat siswa melalui berbagai kegiatan ekstrakurikuler dan kompetisi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
                  alt="Siswa MI AL-AHMAD Belajar Bersama Guru"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-[#006C47] text-white px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="font-extrabold text-base leading-none">600+ Siswa Aktif</p>
                    <p className="text-xs text-emerald-100 mt-0.5">Tahun Ajaran 2024/2025</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* NILAI-NILAI UTAMA */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#006C47]">
                Nilai-Nilai Utama
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Karakter yang kami tanamkan kepada setiap pendidik dan siswa sebagai landasan bertindak.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006C47] flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl font-heading">Integritas</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Kejujuran dan ketulusan dalam bertindak sesuai dengan ajaran Islam dan etika akademik.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006C47] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl font-heading">Disiplin</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Menghargai waktu dan aturan sebagai kunci utama dalam meraih keberhasilan dunia dan akhirat.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006C47] flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl font-heading">Kasih Sayang</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Membangun lingkungan belajar yang penuh kehangatan, empati, dan saling menghormati.
                </p>
              </div>
            </div>
          </div>

          {/* MARI BERGABUNG CTA */}
          <div className="bg-gradient-to-r from-[#005235] to-[#006C47] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                Mari Bergabung Bersama Kami
              </h2>
              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
                Siapkan masa depan gemilang putra-putri Anda dengan pendidikan berkualitas yang berlandaskan nilai-nilai keislaman.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <button
                  onClick={onOpenPPDB}
                  className="px-6 py-3 bg-white text-[#006C47] font-bold text-base rounded-xl hover:bg-emerald-50 transition-colors shadow-md cursor-pointer"
                >
                  Daftar Sekarang
                </button>
                <button
                  onClick={() => alert('Kurikulum MI AL-AHMAD menggabungkan Kurikulum Merdeka dengan Muatan Lokal Keagamaan: Tahfidz, Bahasa Arab, Fiqih, & Aqidah Akhlak.')}
                  className="px-6 py-3 border border-white/60 hover:border-white text-white font-bold text-base rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Lihat Kurikulum
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
