import React, { useState, useEffect } from 'react';
import { PageTab, Article } from './types';
import { MainLayout } from './components/layouts/MainLayout';

import { HomeView } from './views/HomeView';
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

  // Dynamic Document Title based on Active Tab
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
    document.title = titles[activeTab] || "MI AL-AHMAD";
  }, [activeTab]);

  const handleSelectArticle = (art: Article) => {
    setSelectedArticle(art);
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isContactOpen={isContactOpen}
      setIsContactOpen={setIsContactOpen}
      selectedArticle={selectedArticle}
      setSelectedArticle={setSelectedArticle}
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
        <AchievementView onOpenContact={() => setIsContactOpen(true)} />
      )}

      {activeTab === 'artikel' && <NewsView onSelectArticle={handleSelectArticle} />}

      {activeTab === 'alumni' && <AlumniView setActiveTab={setActiveTab} />}

      {activeTab === 'form-alumni' && <AlumniFormView />}
    </MainLayout>
  );
}
