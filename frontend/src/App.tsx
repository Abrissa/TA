import React, { useState, useEffect } from 'react';
import { PageTab, Article } from './types';
import { MainLayout } from './components/layouts/MainLayout';
import { api, AdminUser } from './services/api';

import { HomeView } from './views/HomeView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { VisiMisiView } from './views/VisiMisiView';
import { TeachersView } from './views/TeachersView';
import { AchievementView } from './views/AchievementView';
import { NewsView } from './views/NewsView';
import { AlumniView } from './views/AlumniView';
import { AlumniFormView } from './views/AlumniFormView';
import { PPDBView } from './views/PPDBView';

import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';

export default function App() {
  const checkIsAdmin = (): boolean => {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.startsWith('/portal-admin') || pathname.startsWith('/admin')) {
      return true;
    }
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', '/portal-admin');
      return true;
    }
    return false;
  };

  const getInitialTab = (): PageTab => {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname === '/ppdb') return 'ppdb';
    if (pathname === '/alumni') return 'alumni';
    if (pathname === '/guru') return 'guru';
    if (pathname === '/prestasi') return 'prestasi';
    if (pathname === '/artikel') return 'artikel';
    if (pathname === '/visi-misi') return 'visi-misi';
    if (pathname === '/profil') return 'profil';
    return 'beranda';
  };

  const [activeTab, setActiveTab] = useState<PageTab>(getInitialTab);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdmin);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    return api.getStoredUser();
  });

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res) setSettings(res);
    }).catch(() => {});
  }, [isAdminRoute]);

  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = checkIsAdmin();
      setIsAdminRoute(isAdmin);

      if (!isAdmin) {
        const path = window.location.pathname.toLowerCase();
        if (path === '/ppdb') setActiveTab('ppdb');
        else if (path === '/alumni') setActiveTab('alumni');
        else if (path === '/guru') setActiveTab('guru');
        else if (path === '/prestasi') setActiveTab('prestasi');
        else if (path === '/artikel') setActiveTab('artikel');
        else if (path === '/visi-misi') setActiveTab('visi-misi');
        else if (path === '/profil') setActiveTab('profil');
        else if (path === '/' || path === '/beranda') setActiveTab('beranda');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (isAdminRoute) {
      document.title = 'Dashboard Admin | MI AL-AHMAD Krian Sidoarjo';
      return;
    }

    const titles: Record<PageTab, string> = {
      beranda: "MI AL-AHMAD | Membentuk Generasi Qur'ani & Berprestasi",
      profil: "Profil Sekolah | MI AL-AHMAD",
      'visi-misi': "Visi, Misi & Landasan | MI AL-AHMAD",
      guru: "Dewan Guru & Staf | MI AL-AHMAD",
      prestasi: "Prestasi Siswa | MI AL-AHMAD",
      artikel: "Berita & Pengumuman | MI AL-AHMAD",
      alumni: "Jejak Alumni | MI AL-AHMAD",
      'form-alumni': "Pendataan Alumni | MI AL-AHMAD",
      ppdb: "Penerimaan Peserta Didik Baru (PPDB) | MI AL-AHMAD",
    };
    document.title =
      selectedArticle && activeTab === 'artikel'
        ? `${selectedArticle.title} | MI AL-AHMAD`
        : titles[activeTab] || 'MI AL-AHMAD';
  }, [activeTab, selectedArticle, isAdminRoute]);

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

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
  };

  const handleOpenAdmin = () => {
    window.history.pushState(null, '', '/portal-admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If visiting /portal-admin route
  if (isAdminRoute) {
    if (currentUser && api.hasToken()) {
      return (
        <AdminLayout
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            handleExitAdmin();
          }}
          onBackToPublicSite={handleExitAdmin}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
        onCancel={handleExitAdmin}
      />
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isContactOpen={isContactOpen}
      setIsContactOpen={setIsContactOpen}
      onOpenAdmin={handleOpenAdmin}
      settings={settings}
    >
      {activeTab === 'beranda' && (
        <HomeView
          setActiveTab={setActiveTab}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenPPDB={() => {
            setActiveTab('ppdb');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectArticle={handleSelectArticle}
        />
      )}

      {activeTab === 'ppdb' && (
        <PPDBView onOpenContact={() => setIsContactOpen(true)} settings={settings} />
      )}

      {(activeTab === 'visi-misi' || activeTab === 'profil') && (
        <VisiMisiView
          onOpenContact={() => setIsContactOpen(true)}
          setActiveTab={setActiveTab}
          settings={settings}
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
