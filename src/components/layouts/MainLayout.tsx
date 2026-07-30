import React from 'react';
import { PageTab, Article } from '../../types';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ContactModal } from '../modals/ContactModal';
import { ArticleDetailModal } from '../modals/ArticleDetailModal';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isContactOpen,
  setIsContactOpen,
  selectedArticle,
  setSelectedArticle,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-body selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenContact={() => setIsContactOpen(true)} />

      {/* Contact & Registration Info Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Article Detail Modal Reader */}
      <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
};
