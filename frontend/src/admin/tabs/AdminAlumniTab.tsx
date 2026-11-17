import React, { useEffect, useState } from 'react';
import { api, resolveImageUrl, AlumniSubmissionRecord } from '../../services/api';
import { AlumniProfile } from '../../types';
import { 
  GraduationCap, 
  Check, 
  X, 
  Eye, 
  Loader2, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  Trash2,
  Search,
  RotateCcw,
  Globe,
  Instagram,
  Linkedin,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const AdminAlumniTab: React.FC = () => {
  const [submissions, setSubmissions] = useState<AlumniSubmissionRecord[]>([]);
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'submissions' | 'directory'>('submissions');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [activeSubTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [subsRes, profRes] = await Promise.all([
        api.getAdminAlumniSubmissions().catch(() => []),
        api.getAlumni().catch(() => []),
      ]);
      setSubmissions(subsRes);
      setProfiles(profRes);
    } catch (err) {
      console.error('Failed to load alumni data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeration = async (id: number, status: 'approved' | 'rejected', publish: boolean) => {
    try {
      await api.updateAlumniSubmissionStatus(id, status, publish);
      setFeedback(`Pengajuan alumni berhasil ${status === 'approved' ? 'disetujui dan dipublikasikan' : 'ditolak'}.`);
      setTimeout(() => setFeedback(null), 3500);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal memproses moderasi alumni.');
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus data pengajuan alumni ini?')) return;
    try {
      await api.deleteAlumniSubmission(id);
      setFeedback('Data pengajuan alumni berhasil dihapus.');
      setTimeout(() => setFeedback(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data pengajuan alumni.');
    }
  };

  const handleDeleteProfile = async (id: string | number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus profil alumni "${name}" dari direktori publik? Data tidak akan ditampilkan lagi di website.`)) return;
    try {
      await api.deleteAlumniProfile(id);
      setFeedback(`Profil alumni "${name}" berhasil dihapus dari direktori publik.`);
      setTimeout(() => setFeedback(null), 3500);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus profil alumni.');
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Yakin ingin mengembalikan seluruh data direktori alumni ke data awal? Data alumni bawaan akan dimunculkan kembali.')) return;
    try {
      await api.resetAlumniDirectory();
      setFeedback('Direktori alumni berhasil dikembalikan ke data awal.');
      setTimeout(() => setFeedback(null), 3500);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mereset direktori alumni.');
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(q);
    const roleMatch = (p.currentRole || p.profession || p.title || '').toLowerCase().includes(q);
    const yearMatch = (p.graduationYear || '').toLowerCase().includes(q);
    return nameMatch || roleMatch || yearMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            Moderasi Formulir & Direktori Alumni
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tinjau data alumni yang masuk melalui form publik dan kelola profil yang ditampilkan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'submissions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Form Masuk ({submissions.filter(s => s.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'directory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Direktori Publik ({profiles.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Submissions Moderation Tab */}
      {activeSubTab === 'submissions' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
              <p className="text-sm">Memuat data formulir masuk...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Belum ada data pengajuan formulir alumni yang masuk.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {sub.photo_url ? (
                      <img 
                        src={resolveImageUrl(sub.photo_url)} 
                        alt={sub.full_name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                        {sub.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.full_name}</span>
                        <span className="text-xs text-slate-400">• Lulusan {sub.graduation_year}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          sub.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 mt-0.5">{sub.job_role}</div>
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                        "{sub.message}"
                      </p>
                      {sub.social_media && (
                        <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-mono">
                          <span>Sosmed:</span>
                          <span className="text-slate-600">{sub.social_media}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0 min-w-[130px]">
                    {sub.status === 'approved' ? (
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                        title="Hapus data alumni yang sudah disetujui"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleModeration(sub.id, 'approved', true)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui & Tampilkan</span>
                        </button>
                        {sub.status !== 'rejected' ? (
                          <button
                            onClick={() => handleModeration(sub.id, 'rejected', false)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Public Directory View */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Top toolbar: search and reset */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama, angkatan, atau profesi alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg">
                {filteredProfiles.length} Alumni Terdaftar
              </span>
              <button
                onClick={handleResetDefaults}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Pulihkan data bawaan direktori"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Awal</span>
              </button>
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
              Tidak ada profil alumni yang cocok dengan pencarian "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={resolveImageUrl(profile.imageUrl) || '/assets/alumni/alumni-1.svg'} 
                        alt={profile.name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" 
                        onError={(e) => {
                          e.currentTarget.src = '/assets/alumni/alumni-1.svg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{profile.name}</h4>
                        <p className="text-xs text-slate-500">
                          {profile.graduationYear ? (profile.graduationYear.includes('Lulusan') ? profile.graduationYear : `Lulusan ${profile.graduationYear}`) : 'Alumni'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mb-2 truncate">
                      {profile.currentRole || profile.profession || profile.title}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{profile.quote || profile.bio || '-'}"
                    </p>
                    {profile.socialUrl && (
                      <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono truncate">
                        <span className="text-slate-400">Sosmed:</span>
                        <span className="text-emerald-700 truncate">{profile.socialUrl}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 truncate">
                      {profile.categoryBadge || 'Alumni Terverifikasi'}
                    </span>
                    <button
                      onClick={() => handleDeleteProfile(profile.id, profile.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                      title="Hapus profil dari direktori publik"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
