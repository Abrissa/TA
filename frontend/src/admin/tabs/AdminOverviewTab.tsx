import React, { useEffect, useState } from 'react';
import { api, AdminStats, PpdbRecord, AlumniSubmissionRecord } from '../../services/api';
import { 
  Users, 
  FileText, 
  Trophy, 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentPpdb, setRecentPpdb] = useState<PpdbRecord[]>([]);
  const [recentAlumni, setRecentAlumni] = useState<AlumniSubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getDashboardStats();
      setStats(res.stats);
      setRecentPpdb(res.recent_ppdb);
      setRecentAlumni(res.recent_alumni);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Memuat data ringkasan dashboard...</span>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Pendaftar PPDB',
      value: stats?.total_ppdb ?? 0,
      sublabel: `${stats?.pending_ppdb ?? 0} menunggu verifikasi`,
      badgeColor: 'amber',
      icon: Users,
      actionTab: 'ppdb',
    },
    {
      title: 'Formulir Alumni',
      value: (stats?.pending_alumni ?? 0) > 0 ? `${stats?.pending_alumni} Baru` : 'Tuntas',
      sublabel: `${stats?.pending_alumni ?? 0} perlu ditinjau`,
      badgeColor: 'emerald',
      icon: GraduationCap,
      actionTab: 'alumni',
    },
    {
      title: 'Artikel & Berita',
      value: stats?.total_articles ?? 0,
      sublabel: 'Publikasi aktif di portal',
      badgeColor: 'blue',
      icon: FileText,
      actionTab: 'articles',
    },
    {
      title: 'Prestasi Santri',
      value: stats?.total_achievements ?? 0,
      sublabel: 'Tercatat dalam rekam jejak',
      badgeColor: 'purple',
      icon: Trophy,
      actionTab: 'page-control',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Pusat Kendali MI AL-AHMAD</h2>
          <p className="text-sm text-emerald-200/80 mt-1">
            Pantau arus pendaftaran santri baru, moderasi formulir alumni, dan kendalikan visibilitas halaman secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('page-control')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            Kendali Tampilan Web →
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(kpi.actionTab)}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {kpi.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                {kpi.title}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {kpi.sublabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables Row: Recent PPDB & Recent Alumni */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Recent PPDB Registrations */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pendaftaran PPDB Terbaru</h3>
              <p className="text-xs text-slate-500 mt-0.5">Calon santri yang baru mendaftar melalui web</p>
            </div>
            <button
              onClick={() => onNavigateTab('ppdb')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentPpdb.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">Belum ada pendaftaran PPDB.</div>
            ) : (
              recentPpdb.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {item.child_full_name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-emerald-700 font-medium">{item.registration_number}</span>
                      <span>•</span>
                      <span>Wali: {item.parent_name}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'diterima' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      item.status === 'terverifikasi' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      item.status === 'ditolak' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Alumni Submissions */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pengajuan Alumni Terbaru</h3>
              <p className="text-xs text-slate-500 mt-0.5">Menunggu konfirmasi sebelum tampil ke publik</p>
            </div>
            <button
              onClick={() => onNavigateTab('alumni')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentAlumni.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">Belum ada pengajuan formulir alumni.</div>
            ) : (
              recentAlumni.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {item.full_name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-slate-700">{item.job_role}</span>
                      <span>•</span>
                      <span>Lulusan {item.graduation_year}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      item.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
