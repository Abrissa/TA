import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageTab } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';

interface HeroSectionProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setActiveTab,
  onOpenContact,
}) => {
  return (
    <section className="relative pb-16 lg:pb-32 overflow-hidden min-h-[500px] lg:min-h-[700px]">
      {/* Full-size background image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Gedung MI AL-AHMAD"
          className="hidden lg:block w-full h-full object-cover"
          src="/assets/gedung-mi-al-ahmad.jpg"
          style={{ objectPosition: 'center 40%' }}
        />
        <img
          alt="Gedung MI AL-AHMAD"
          className="lg:hidden w-full h-full object-cover"
          src="/assets/gedung-mi-al-ahmad.jpg"
          style={{ objectPosition: 'center center' }}
        />
      </div>

      {/* Transparent light overlay transitioning to solid #EEFBF4 at bottom */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#EEFBF4]/75 via-[#EEFBF4]/85 to-[#EEFBF4]" />

      {/* Hero Content */}
      <div className="flex justify-center px-4 relative z-10 pt-8 lg:pt-12">
        <div className="w-full max-w-[1300px]">
          <div className="relative w-full">
            {/* Desktop: Content area */}
            <div className="hidden lg:block relative w-full min-h-[580px]">
              <p className="absolute left-[55%] top-[100px] font-normal italic text-[18px] leading-[1.5] tracking-[-0.18px] text-slate-700 whitespace-nowrap">
                Selamat Datang di MI AL-AHMAD
              </p>
              <h1 className="absolute left-[55%] top-[135px] font-semibold text-[48px] leading-none tracking-[-2.4px] text-slate-900 w-[500px] font-heading">
                Berkarakter, Peduli <br />
                &{' '}
                <span className="font-serif-italic font-normal text-[68px] text-emerald-700">
                  Berprestasi
                </span>
                &nbsp;&nbsp;di Era Teknologi & Qur'ani
              </h1>

              {/* CTA Buttons */}
              <div className="absolute left-[55%] top-[360px]">
                <button
                  onClick={() => setActiveTab('visi-misi')}
                  className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 group"
                >
                  <div className="bg-gradient-to-r from-[#059669] to-[#047857] flex items-center justify-center px-10 py-4 rounded-full shadow-lg min-w-[140px] h-14">
                    <span className="font-semibold text-lg leading-[1.5] tracking-[-0.18px] whitespace-nowrap text-white">
                      Jelajahi
                    </span>
                  </div>
                  <div
                    className="bg-white flex items-center justify-center rounded-full w-12 h-12 shadow-lg group-hover:shadow-xl transition-shadow duration-200 cursor-pointer border border-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenContact();
                    }}
                  >
                    <ArrowUpRight className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
                  </div>
                </button>
              </div>

              {/* Stats */}
              <div className="absolute left-[55%] top-[460px] flex items-center gap-[30px]">
                <div className="flex flex-col gap-[5px]">
                  <p className="font-semibold text-[44px] leading-none tracking-[-4.4px] text-slate-900">
                    {SCHOOL_INFO.stats.students}+
                  </p>
                  <p className="font-normal text-[16px] leading-[1.5] tracking-[-0.16px] text-slate-600">
                    Siswa Aktif
                  </p>
                </div>
                <div className="w-px h-[36px] bg-slate-400" />
                <div className="flex flex-col gap-[5px]">
                  <p className="font-semibold text-[44px] leading-none tracking-[-4.4px] text-slate-900">
                    1000+
                  </p>
                  <p className="font-normal text-[16px] leading-[1.5] tracking-[-0.16px] text-slate-600">
                    Alumni
                  </p>
                </div>
                <div className="w-px h-[36px] bg-slate-400" />
                <div className="flex flex-col gap-[5px]">
                  <p className="font-semibold text-[44px] leading-none tracking-[-4.4px] text-emerald-700">
                    500+
                  </p>
                  <p className="font-normal text-[16px] leading-[1.5] tracking-[-0.16px] text-slate-600">
                    Prestasi
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: Text */}
            <div className="lg:hidden flex flex-col items-center text-center px-6 pt-12">
              <p className="font-normal italic text-[14px] leading-[1.5] text-slate-700 mb-2">
                Selamat Datang di MI AL-AHMAD
              </p>
              <h1 className="font-semibold text-[28px] leading-tight text-slate-900 mb-6 font-heading">
                Berkarakter,{' '}
                <span className="font-serif-italic font-normal text-[36px] text-emerald-700">
                  Peduli
                </span>
                ,<br />&{' '}
                <span className="underline decoration-emerald-500 decoration-2 underline-offset-4">
                  Berprestasi
                </span>
              </h1>
              <button
                onClick={() => setActiveTab('visi-misi')}
                className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 group"
              >
                <div className="bg-gradient-to-r from-[#059669] to-[#047857] flex items-center justify-center px-8 py-3 rounded-full shadow-sm">
                  <span className="font-semibold text-base text-white">Jelajahi</span>
                </div>
                <div
                  className="bg-gradient-to-r from-[#059669] to-[#047857] flex items-center justify-center rounded-full w-10 h-10 shadow-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenContact();
                  }}
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>

            {/* Mobile: Stats card */}
            <div className="lg:hidden flex justify-center mt-8">
              <div className="bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-[24px] leading-none text-emerald-700">
                    {SCHOOL_INFO.stats.students}+
                  </p>
                  <p className="font-normal text-[12px] text-slate-500">Siswa</p>
                </div>
                <div className="w-px h-[30px] bg-slate-200" />
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-[24px] leading-none text-emerald-700">1000+</p>
                  <p className="font-normal text-[12px] text-slate-500">Alumni</p>
                </div>
                <div className="w-px h-[30px] bg-slate-200" />
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-[24px] leading-none text-amber-600">500+</p>
                  <p className="font-normal text-[12px] text-slate-500">Prestasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
