import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTab } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface HeroSectionProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setActiveTab,
  onOpenContact,
}) => {
  const handleExplore = () => {
    const el = document.getElementById('sambutan-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('visi-misi');
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-36 lg:pt-24 lg:pb-48 min-h-[680px] lg:min-h-[780px] flex items-center">
      {/* Background: Gedung Sekolah MI AL-AHMAD (Lebih Luas & Terbuka Melebar ke Bawah) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          alt="Gedung MI AL-AHMAD"
          className="w-full h-full object-cover object-center filter brightness-[1.04] saturate-[0.82] contrast-[0.96]"
          src="/assets/gedung-mi-al-ahmad.jpg"
        />
        {/* Soft daylight white overlay persis seperti gambar referensi */}
        <div className="absolute inset-0 bg-white/45 backdrop-blur-[0.5px]" />
        {/* Gradient fade to white at bottom persis seperti referensi */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent via-35% to-white pointer-events-none" />
      </div>

      {/* Main Floating Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[360px] sm:min-h-[400px] lg:min-h-[430px] flex items-end overflow-visible"
        >
          {/* Card Background: Kotak Lurus Elegan & Lebih Ringkas (Compact Sleek Card) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl lg:rounded-[40px] bg-gradient-to-r from-[#047857] via-[#059669] to-[#0284c7] border border-white/35 shadow-[0_28px_65px_rgba(4,120,87,0.46)] overflow-hidden pointer-events-none">
            {/* Subtle internal glow & top highlight */}
            <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
          </div>

          {/* 2-Column Grid Layout: Foto & Teks Terpisah Rapi */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 items-end min-h-[360px] sm:min-h-[400px] lg:min-h-[430px]">
            {/* Kolom Kiri (5 Kolom): Foto Siswa Diperbesar Signifikan dengan Efek Pop-out Megah */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-start items-end order-2 lg:order-1 h-full pl-4 sm:pl-8 lg:pl-10 overflow-visible">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[600px] xl:max-w-[640px] flex items-end justify-center lg:justify-start overflow-visible scale-[1.05] sm:scale-[1.1] lg:scale-[1.16] xl:scale-[1.2] origin-bottom lg:-mb-1"
              >
                <img
                  src="/assets/hero-students.png"
                  alt="Siswa Berprestasi MI AL-AHMAD"
                  className="w-full max-h-[420px] sm:max-h-[520px] lg:max-h-[620px] xl:max-h-[680px] object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] -mb-0 lg:-mt-32 xl:-mt-36"
                />
              </motion.div>
            </div>

            {/* Kolom Kanan (7 Kolom): Teks Judul, Tombol, dan Statistik Berskala Besar yang Pas */}
            <div className="lg:col-span-7 order-1 lg:order-2 px-6 sm:px-10 lg:pr-16 lg:pl-6 py-8 sm:py-10 lg:py-10 text-center lg:text-left space-y-4 sm:space-y-5 lg:space-y-5">
              {/* Subjudul dengan Badge Rapi */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-center lg:justify-start"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-300/30 text-emerald-100 text-xs sm:text-sm lg:text-base font-semibold tracking-wide backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Selamat Datang di MI AL-AHMAD
                </span>
              </motion.div>

              {/* Judul Utama yang Besar & Berwibawa */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-extrabold text-white leading-[1.14] font-heading tracking-tight"
              >
                Berkarakter, Peduli <br className="hidden sm:inline" />
                &amp;{' '}
                <span className="font-serif-italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] text-white underline decoration-emerald-300/40 underline-offset-8">
                  Berprestasi
                </span>{' '}
                di Era Teknologi
              </motion.h1>

              {/* Tombol Aksi: Kapsul "Jelajahi" + Lingkaran Panah */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center lg:justify-start gap-4 pt-1"
              >
                <button
                  onClick={handleExplore}
                  className="bg-white text-slate-900 font-bold px-9 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg flex items-center justify-center cursor-pointer"
                >
                  Jelajahi
                </button>
                <button
                  onClick={onOpenContact}
                  title="Hubungi Kami"
                  aria-label="Hubungi Kami"
                  className="bg-white text-slate-900 w-14 h-14 rounded-full shadow-lg hover:shadow-2xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
                >
                  <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                </button>
              </motion.div>

              {/* Baris Statistik Cepat */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-4 border-t border-white/25 flex items-center justify-center lg:justify-start gap-8 sm:gap-12 text-white"
              >
                <div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading">
                    <AnimatedCounter end={SCHOOL_INFO.stats.students} suffix="+" duration={1800} delay={400} />
                  </p>
                  <p className="text-sm sm:text-base text-emerald-100 font-semibold">Siswa Aktif</p>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading">
                    <AnimatedCounter end={1000} suffix="+" duration={2000} delay={400} />
                  </p>
                  <p className="text-sm sm:text-base text-emerald-100 font-semibold">Alumni</p>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading">
                    <AnimatedCounter end={500} suffix="+" duration={1800} delay={400} />
                  </p>
                  <p className="text-sm sm:text-base text-emerald-100 font-semibold">Prestasi</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
