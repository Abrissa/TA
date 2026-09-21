import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Trophy,
  Award,
  HeartHandshake,
  Laptop,
} from 'lucide-react';

export const MarqueeBanner: React.FC = () => {
  const tickerItems = [
    { text: "Generasi Qur'ani & Berakhlak Mulia", icon: <BookOpen className="w-4 h-4 text-amber-300" /> },
    { text: '#JAWARA – 301 Medali IKSC 2025 Internasional', icon: <Trophy className="w-4 h-4 text-amber-300" /> },
    { text: 'Juara LKBB SANCAKA S3 Se-Pulau Jawa', icon: <Award className="w-4 h-4 text-emerald-300" /> },
    { text: 'Program Tahfidz Al-Qur\'an Terpadu', icon: <Sparkles className="w-4 h-4 text-amber-300" /> },
    { text: 'Pendidikan Karakter & Adab Islami', icon: <HeartHandshake className="w-4 h-4 text-rose-300" /> },
    { text: 'Literasi Digital & Pembelajaran Modern', icon: <Laptop className="w-4 h-4 text-teal-300" /> },
    { text: 'Akreditasi A – Mutu Terjamin', icon: <Award className="w-4 h-4 text-amber-300" /> },
    { text: 'Mendidik dengan Keikhlasan & Kasih Sayang', icon: <GraduationCap className="w-4 h-4 text-emerald-300" /> },
  ];

  // Duplicate items for seamless continuous looping
  const allItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#047857] via-[#059669] to-[#0d9488] text-white py-4 shadow-md border-y border-emerald-600">
      {/* Subtle Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/10" />

      {/* Infinite Horizontal Running Marquee */}
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 28,
          ease: 'linear',
        }}
      >
        {allItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm sm:text-base font-bold tracking-wide">
            <span className="p-1.5 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shadow-xs">
              {item.icon}
            </span>
            <span className="font-heading uppercase tracking-wider text-emerald-50">
              {item.text}
            </span>
            <span className="text-emerald-300/60 text-lg px-2 font-black">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
