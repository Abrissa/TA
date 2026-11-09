import React, { useState } from 'react';
import { AdminUser, api } from '../services/api';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminPageControlTab } from './tabs/AdminPageControlTab';
import { AdminArticlesTab } from './tabs/AdminArticlesTab';
import { AdminAchievementsTab } from './tabs/AdminAchievementsTab';
import { AdminPpdbTab } from './tabs/AdminPpdbTab';
import { AdminAlumniTab } from './tabs/AdminAlumniTab';
import { AdminMasterDataTab } from './tabs/AdminMasterDataTab';
import { 
  LayoutDashboard, 
  Sliders, 
  FileText, 
  Trophy,
  Users, 
  GraduationCap, 
  Database, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

interface AdminLayoutProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onBackToPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onLogout,
  onBackToPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  const menuItems = [
    { id: 'overview', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'page-control', label: 'Konten Website & CMS', icon: Sliders },
    { id: 'achievements', label: 'Prestasi Santri & Kejuaraan', icon: Trophy },
    { id: 'articles', label: 'Berita & Pengumuman', icon: FileText },
    { id: 'ppdb', label: 'Pendaftar PPDB (Santri Baru)', icon: Users },
    { id: 'alumni', label: 'Form & Direktori Alumni', icon: GraduationCap },
    { id: 'master-data', label: 'Master Database & Referensi', icon: Database },
  ];

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sesi administrator?')) {
      await api.logout();
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/assets/logo-mi-al-ahmad.png"
                  alt="Logo MI AL-AHMAD"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm tracking-tight text-white truncate">MI AL-AHMAD</div>
                <div className="text-[11px] text-emerald-400 font-medium">Dashboard Admin</div>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpenMobile(false)}
              className="p-1 text-slate-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & User Profile */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{currentUser.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToPublicSite}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Publik</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold capitalize">
                {menuItems.find(m => m.id === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPublicSite}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Kunjungi Website</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <AdminOverviewTab onNavigateTab={setActiveTab} />}
          {activeTab === 'page-control' && <AdminPageControlTab />}
          {activeTab === 'achievements' && <AdminAchievementsTab />}
          {activeTab === 'articles' && <AdminArticlesTab />}
          {activeTab === 'ppdb' && <AdminPpdbTab />}
          {activeTab === 'alumni' && <AdminAlumniTab />}
          {activeTab === 'master-data' && <AdminMasterDataTab />}
        </main>
      </div>
    </div>
  );
};
