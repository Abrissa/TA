import React from 'react';
import { PageTab } from '../../types';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ContactModal } from '../modals/ContactModal';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  onOpenAdmin?: () => void;
  settings?: Record<string, string>;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isContactOpen,
  setIsContactOpen,
  onOpenAdmin,
  settings,
}) => {
  const handleOpenPPDB = () => {
    setActiveTab('ppdb');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-body selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden w-full">
      {/* Top Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPPDB={handleOpenPPDB}
        onOpenAdmin={onOpenAdmin}
        settings={settings}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={onOpenAdmin}
        settings={settings}
      />

      {/* Contact & Service Info Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} settings={settings} />
    </div>
  );
};
