import React, { useState, useEffect } from 'react';
import { PageTab, Article } from './types';
import { MainLayout } from './components/layouts/MainLayout';

import { HomeView } from './views/HomeView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { VisiMisiView } from './views/VisiMisiView';
import { TeachersView } from './views/TeachersView';
import { AchievementView } from './views/AchievementView';
import { NewsView } from './views/NewsView';
import { AlumniView } from './views/AlumniView';
import { AlumniFormView } from './views/AlumniFormView';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('beranda');
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const titles: Record<PageTab, string> = {
      beranda: "MI AL-AHMAD | Membentuk Generasi Qur'ani & Berprestasi",
      profil: "Profil Sekolah | MI AL-AHMAD",
      'visi-misi': "Visi, Misi & Landasan | MI AL-AHMAD",
      guru: "Dewan Guru & Staf | MI AL-AHMAD",
      prestasi: "Prestasi Siswa | MI AL-AHMAD",
      artikel: "Berita & Pengumuman | MI AL-AHMAD",
      alumni: "Jejak Alumni | MI AL-AHMAD",
      'form-alumni': "Pendataan Alumni | MI AL-AHMAD",
    };
    document.title =
      selectedArticle && activeTab === 'artikel'
        ? `${selectedArticle.title} | MI AL-AHMAD`
        : titles[activeTab] || 'MI AL-AHMAD';
  }, [activeTab, selectedArticle]);

  useEffect(() => {
    if (activeTab !== 'artikel' && selectedArticle) {
      setSelectedArticle(null);
    }
  }, [activeTab, selectedArticle]);

  const handleSelectArticle = (art: Article) => {
    setActiveTab('artikel');
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isContactOpen={isContactOpen}
      setIsContactOpen={setIsContactOpen}
    >
      {activeTab === 'beranda' && (
        <HomeView
          setActiveTab={setActiveTab}
          onOpenContact={() => setIsContactOpen(true)}
          onSelectArticle={handleSelectArticle}
        />
      )}

      {(activeTab === 'visi-misi' || activeTab === 'profil') && (
        <VisiMisiView
          onOpenContact={() => setIsContactOpen(true)}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'guru' && (
        <TeachersView
          onOpenContact={() => setIsContactOpen(true)}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'prestasi' && (
        <AchievementView
          onOpenContact={() => setIsContactOpen(true)}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'artikel' && !selectedArticle && (
        <NewsView
          onSelectArticle={handleSelectArticle}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'artikel' && selectedArticle && (
        <ArticleDetailView
          article={selectedArticle}
          onBack={() => {
            setSelectedArticle(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectArticle={handleSelectArticle}
        />
      )}

      {activeTab === 'alumni' && <AlumniView setActiveTab={setActiveTab} />}

      {activeTab === 'form-alumni' && <AlumniFormView setActiveTab={setActiveTab} />}
    </MainLayout>
  );
}
