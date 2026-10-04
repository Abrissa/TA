import React from 'react';
import { Trophy, BookOpen, Users, Building2, GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTab } from '../../types';
import { ScrollFadeUp, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

interface AdvantagesSectionProps {
  setActiveTab: (tab: PageTab) => void;
}

export const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({ setActiveTab }) => {
  const advantages = [
    {
      id: 'adv-1',
      title: 'Prestasi Gemilang',
      description:
        'Terbukti juara di ajang internasional (301 medali IKSC 2025), juara LKBB se-Pulau Jawa, serta prestasi kejuaraan renang pelajar.',
      icon: <Trophy className="w-6 h-6" />,
      actionText: 'Lihat Prestasi',
      onClick: () => setActiveTab('prestasi'),
    },
    {
      id: 'adv-2',
      title: 'Program Unggulan',
      description:
        'Program tahfidz Al-Qur\'an Juz 30 dan kurikulum terpadu yang dirancang untuk mengembangkan potensi akademik dan karakter Qur\'ani secara optimal.',
      icon: <BookOpen className="w-6 h-6" />,
      actionText: 'Program Madrasah',
      onClick: () => setActiveTab('visi-misi'),
    },
    {
      id: 'adv-3',
      title: 'Tenaga Pendidik',
      description:
        'Guru profesional, berijazah sarjana & magister yang siap membimbing dan mendidik siswa dengan keikhlasan, keteladanan, dan keilmuan.',
      icon: <Users className="w-6 h-6" />,
      actionText: 'Profil Dewan Guru',
      onClick: () => setActiveTab('guru'),
    },
    {
      id: 'adv-4',
      title: 'Sarana Prasarana',
      description:
        'Fasilitas lengkap dan modern, mulai dari ruang kelas digital, lab komputer, perpustakaan nyaman, hingga masjid sekolah yang asri.',
      icon: <Building2 className="w-6 h-6" />,
      actionText: 'Sarana Belajar',
      onClick: () => {
        const facElem = document.getElementById('fasilitas-section');
        if (facElem) {
          facElem.scrollIntoView({ behavior: 'smooth' });
        } else {
          setActiveTab('beranda');
        }
      },
    },
    {
      id: 'adv-5',
      title: 'Alumni Sukses',
      description:
        'Jejak kesuksesan para lulusan MI AL-AHMAD yang kini berprestasi dan berkiprah di berbagai pondok pesantren dan sekolah lanjutan unggulan.',
      icon: <GraduationCap className="w-6 h-6" />,
      actionText: 'Direktori Alumni',
      onClick: () => setActiveTab('alumni'),
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/70 to-white py-16 lg:py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <ScrollFadeUp direction="up" delay={0.1} className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-sm font-bold uppercase tracking-wider shadow-xs">
            ✨ Keunggulan Madrasah
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            Alasan <span className="text-emerald-700">Utama</span> Memilih MI AL-AHMAD sebagai Tempat Belajar{' '}
            <span className="text-emerald-700">Terbaik</span>.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-body">
            Membentuk generasi pembelajar yang berakhlakul karimah, unggul dalam sains dan Al-Qur'an,
            serta siap menghadapi tantangan masa depan.
          </p>
        </ScrollFadeUp>

        {/* 5 Cards Grid (3 on top row, 2 centered on bottom row) */}
        <StaggerContainer
          staggerDelay={0.09}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 pt-6 max-w-6xl mx-auto"
        >
          {advantages.map((item, idx) => {
            // Apply centering span on larger screens for the last 2 items if 5 items in total
            const isBottomRow = idx >= 3;
            return (
              <StaggerItem
                key={item.id}
                className={
                  isBottomRow && idx === 3
                    ? 'lg:col-start-1 lg:translate-x-1/2 md:translate-x-0'
                    : isBottomRow && idx === 4
                      ? 'lg:col-start-2 lg:translate-x-1/2 md:translate-x-0'
                      : ''
                }
              >
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={item.onClick}
                  className="bg-white rounded-2xl border border-slate-200/90 pt-8 pb-5 px-6 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer relative"
                >
                  {/* Floating Circular Icon Badge */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-[#059669] to-[#047857] text-white flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 group-hover:shadow-emerald-200 group-hover:shadow-lg transition-all duration-300">
                    {item.icon}
                  </div>

                  {/* Card Content */}
                  <div className="pt-3 text-center space-y-2.5">
                    <h3 className="font-extrabold text-slate-900 text-xl font-heading group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-body">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                    <span>{item.actionText}</span>
                    <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};
