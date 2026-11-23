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
  History,
  Sparkles,
  Building2,
  Landmark,
  Compass,
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
  const visionImage = resolveImageUrl(settings?.vision_image_url) || '/assets/plang-mi-al-ahmad.jpg';

  const historyMilestones = [
    {
      year: "Awal Berdiri",
      title: "Prakarsa & Cikal Bakal",
      desc: "Didirikan atas musyawarah para tokoh ulama, kiai, dan sesepuh Nahdlatul Ulama di Krian yang bertekad menghadirkan madrasah ibtidaiyah terpercaya dengan memadukan penguatan akidah akhlak Ahlussunnah wal Jama'ah dan ilmu pengetahuan umum.",
      icon: <Landmark className="w-5 h-5 text-[#059669]" />
    },
    {
      year: "Pengembangan",
      title: "Pembangunan Kampus & Sarana",
      desc: "Pembangunan kampus terpadu (Gedung Abu Yazid) di Jl. Setiabudi / Jl. Raya Pendidikan Krian. Dilengkapi ruang kelas representatif, perpustakaan, laboratorium komputer, dan sarana ibadah untuk menunjang kegiatan belajar santri.",
      icon: <Building2 className="w-5 h-5 text-[#059669]" />
    },
    {
      year: "Pencapaian",
      title: "Akreditasi A & Prestasi Nasional",
      desc: "Keberhasilan meraih predikat Akreditasi A (Unggul) dari Badan Akreditasi Nasional (BAN-S/M). Santri MI AL-AHMAD konsisten menorehkan prestasi gemilang di ajang Kompetisi Sains Madrasah (KSM), olimpiade matematika, dan seni Islami.",
      icon: <Award className="w-5 h-5 text-amber-500" />
    },
    {
      year: "Masa Kini",
      title: "Integrasi Qur'ani & Digitalisasi",
      desc: "Penerapan kurikulum terpadu (Kurikulum Merdeka & Kemenag), program unggulan bimbingan Tahfidz Al-Qur'an metode Tartil, serta transformasi pembelajaran digital untuk mencetak generasi berkarakter dan berdaya saing global.",
      icon: <Sparkles className="w-5 h-5 text-[#059669]" />
    },
  ];

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
          { label: 'Sejarah, Visi & Misi' },
        ]}
        title={settings?.visimisi_banner_title || "Sejarah, Visi & Landasan Pendidikan"}
        subtitle={settings?.visimisi_banner_subtitle || "Mengenal rekam jejak historis berdirinya MI AL-AHMAD Krian serta komitmen luhur membangun generasi Qur'ani yang berakhlak mulia."}
        backgroundImageUrl={resolveImageUrl(settings?.visimisi_banner_image) || "/assets/plang-mi-al-ahmad.jpg"}
        imagePosition="object-[center_60%]"
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SEJARAH MADRASAH SECTION */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold uppercase tracking-wider border border-emerald-200/80">
                <History className="w-3.5 h-3.5" />
                Rekam Jejak & Kilas Sejarah
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900">
                Sejarah Singkat {schoolName}
              </h2>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-800">BPPPM NU AL-AHMAD KRIAN</p>
              <p className="text-emerald-700 font-semibold">Akreditasi A (Unggul) • BAN-S/M</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Narasi Sejarah */}
            <div className="lg:col-span-7 space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-body">
              <p>
                <strong>Madrasah Ibtidaiyah (MI) AL-AHMAD</strong> berdiri di bawah naungan <strong>Badan Pelaksana Penyelenggara Pendidikan Ma'arif Nahdlatul Ulama (BPPPM NU) Al-Ahmad Krian</strong>, Kabupaten Sidoarjo. Kelahiran madrasah ini berakar dari tekad luhur para alim ulama, sesepuh, dan tokoh masyarakat Krian untuk mendirikan institusi pendidikan dasar Islam yang kokoh dalam akidah <em>Ahlussunnah wal Jama'ah An-Nahdliyyah</em> sekaligus unggul dalam ilmu pengetahuan dan sains modern.
              </p>
              <p>
                Bermula dari sarana pembelajaran yang sederhana dan penuh dedikasi perjuangan keikhlasan, MI AL-AHMAD terus bertransformasi menjawab amanah dan kepercayaan umat. Dengan dukungan keluarga besar Nahdlatul Ulama, orang tua santri, serta para dermawan, madrasah berhasil membangun kampus representatif (Gedung Abu Yazid) di Jl. Setiabudi No. 12 / Jl. Raya Pendidikan Krian.
              </p>
              <p>
                Kini, MI AL-AHMAD telah berkembang menjadi salah satu madrasah ibtidaiyah terdepan di Sidoarjo dengan predikat <strong>Akreditasi A (Unggul)</strong>, mengintegrasikan Kurikulum Kementerian Agama, Kurikulum Merdeka, serta bimbingan intensif <strong>Tahfidz Al-Qur'an</strong> dan literasi sains berstandar nasional.
              </p>
            </div>

            {/* Kotak Sorotan Nilai Historis */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-[#059669] to-[#047857] text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                  <Compass className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Landasan Perjuangan</h3>
                  <p className="text-xs text-emerald-100">BPPPM NU AL-AHMAD Krian</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-emerald-50">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Kemandirian & Keikhlasan</strong>: Dirintis atas dasar pengabdian kepada umat dan persyarikatan.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Karakter Qur'ani</strong>: Menanamkan cinta Al-Qur'an dan akhlak mulia sejak usia dini.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Daya Saing Berkelanjutan</strong>: Terus berinovasi dengan fasilitas kelas digital dan laboratorium sains.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200">
                <span>NPSN: {settings?.school_npsn || '69781234'}</span>
                <span>•</span>
                <span>NSM: {settings?.school_nsm || '111235150001'}</span>
              </div>
            </div>
          </div>

          {/* Timeline Tonggak Sejarah */}
          <div className="pt-4 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#059669]" />
              Tonggak Perjalanan Madrasah
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {historyMilestones.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-[#059669] font-bold text-xs uppercase tracking-wider">
                      {item.year}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                src={visionImage || '/assets/plang-mi-al-ahmad.jpg'}
                alt={`Papan Nama Resmi ${schoolName} Gedung Abu Yazid`}
                className="w-full h-[380px] object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = '/assets/plang-mi-al-ahmad.jpg';
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
