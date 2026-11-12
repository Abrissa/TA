import React, { useEffect, useState } from 'react';
import { api, MasterDataResponse, MasterAcademicYear, MasterPpdbPath } from '../../services/api';
import { 
  Database, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Users2, 
  ShieldCheck, 
  Loader2, 
  Plus, 
  Edit2, 
  Save,
  Trash2,
  X
} from 'lucide-react';

export const AdminMasterDataTab: React.FC = () => {
  const [data, setData] = useState<MasterDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Academic Year State
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYearName, setNewYearName] = useState('');
  const [newYearCode, setNewYearCode] = useState('');
  const [newYearStartDate, setNewYearStartDate] = useState('');
  const [newYearEndDate, setNewYearEndDate] = useState('');
  const [newYearIsActive, setNewYearIsActive] = useState(false);
  const [isSavingYear, setIsSavingYear] = useState(false);
  const [isDeletingYearId, setIsDeletingYearId] = useState<number | null>(null);

  // New Category State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'article' | 'achievement'>('article');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMasterData();
      setData(res);
    } catch (err) {
      console.error('Failed to load master data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActiveYear = async (id: number) => {
    try {
      await api.setActiveAcademicYear(id);
      setFeedback('Tahun ajaran aktif berhasil diperbarui.');
      setTimeout(() => setFeedback(null), 3000);
      loadMasterData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah tahun ajaran aktif.');
    }
  };

  const handleYearNameChange = (val: string) => {
    setNewYearName(val);
    const match = val.match(/(\d{4})\s*[\/\-]\s*(\d{4})/);
    if (match) {
      setNewYearCode(`${match[1]}-${match[2]}`);
    }
  };

  const handleCreateAcademicYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;

    let finalName = newYearName.trim();
    if (!finalName.toLowerCase().startsWith('tahun ajaran')) {
      finalName = `Tahun Ajaran ${finalName}`;
    }

    let finalCode = newYearCode.trim();
    if (!finalCode) {
      const match = finalName.match(/(\d{4})\s*[\/\-]\s*(\d{4})/);
      finalCode = match ? `${match[1]}-${match[2]}` : `AY-${Date.now()}`;
    }

    setIsSavingYear(true);
    try {
      await api.createAcademicYear({
        name: finalName,
        code: finalCode,
        start_date: newYearStartDate || undefined,
        end_date: newYearEndDate || undefined,
        is_active: newYearIsActive,
      });

      setNewYearName('');
      setNewYearCode('');
      setNewYearStartDate('');
      setNewYearEndDate('');
      setNewYearIsActive(false);
      setShowAddYear(false);
      setFeedback(`Tahun ajaran "${finalName}" berhasil ditambahkan.`);
      setTimeout(() => setFeedback(null), 3000);
      loadMasterData();
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan tahun ajaran.');
    } finally {
      setIsSavingYear(false);
    }
  };

  const handleDeleteAcademicYear = async (year: MasterAcademicYear) => {
    if (year.is_active) {
      alert('Tahun ajaran yang sedang aktif tidak dapat dihapus.');
      return;
    }

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus data "${year.name}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeletingYearId(year.id);
      await api.deleteAcademicYear(year.id);
      setFeedback(`Tahun ajaran "${year.name}" berhasil dihapus.`);
      setTimeout(() => setFeedback(null), 3000);
      loadMasterData();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus tahun ajaran.');
    } finally {
      setIsDeletingYearId(null);
    }
  };

  const handleUpdatePpdbQuota = async (id: number, quota: number) => {
    try {
      await api.updatePpdbPath(id, { quota });
      setFeedback('Kuota jalur pendaftaran berhasil diperbarui.');
      setTimeout(() => setFeedback(null), 3000);
      loadMasterData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah kuota PPDB.');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSavingCategory(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/master-data/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mi_admin_token')}`,
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          type: newCatType,
          badge_color: 'emerald',
        }),
      });
      if (!res.ok) throw new Error('Gagal menambahkan kategori.');
      setNewCatName('');
      setShowAddCategory(false);
      setFeedback('Master kategori baru berhasil ditambahkan.');
      setTimeout(() => setFeedback(null), 3000);
      loadMasterData();
    } catch (err: any) {
      alert(err.message || 'Gagal membuat kategori.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-600" />
          Master Database & Entitas Referensi
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Struktur data master yang menjadi relasi utama bagi data operasional artikel, prestasi, dan pendaftar PPDB.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Master Tahun Ajaran */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Master Tahun Ajaran (Academic Years)</h3>
          </div>
          <button
            onClick={() => setShowAddYear(!showAddYear)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {showAddYear ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tahun Ajaran</span>
              </>
            )}
          </button>
        </div>

        {/* Form Tambah Tahun Ajaran */}
        {showAddYear && (
          <form onSubmit={handleCreateAcademicYear} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Form Tambah Tahun Ajaran Baru</span>
              <button
                type="button"
                onClick={() => setShowAddYear(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Tahun Ajaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newYearName}
                  onChange={(e) => handleYearNameChange(e.target.value)}
                  placeholder="Contoh: 2027/2028 atau Tahun Ajaran 2027/2028"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Identitas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newYearCode}
                  onChange={(e) => setNewYearCode(e.target.value)}
                  placeholder="Contoh: 2027-2028"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Default
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newYearIsActive}
                    onChange={(e) => setNewYearIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">Langsung Aktif</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Mulai (Opsional)
                </label>
                <input
                  type="date"
                  value={newYearStartDate}
                  onChange={(e) => setNewYearStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Selesai (Opsional)
                </label>
                <input
                  type="date"
                  value={newYearEndDate}
                  onChange={(e) => setNewYearEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200/60">
              <button
                type="button"
                onClick={() => setShowAddYear(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSavingYear}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSavingYear ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simpan Tahun Ajaran</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.academic_years.map((year) => (
            <div 
              key={year.id} 
              className={`p-4 rounded-xl border transition-all ${
                year.is_active 
                  ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' 
                  : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{year.name}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">Kode: {year.code}</div>
                  {(year.start_date || year.end_date) && (
                    <div className="text-[11px] text-slate-400 mt-1">
                      {year.start_date || '-'} s/d {year.end_date || '-'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {year.is_active ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSetActiveYear(year.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer"
                      >
                        Set Sebagai Aktif
                      </button>
                      <button
                        onClick={() => handleDeleteAcademicYear(year)}
                        disabled={isDeletingYearId === year.id}
                        title="Hapus Tahun Ajaran"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Jalur PPDB */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Master Jalur Pendaftaran PPDB & Kuota</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {data.ppdb_paths.map((path) => (
            <div key={path.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{path.name}</span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {path.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{path.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Kuota Penerimaan:</span>
                <input
                  type="number"
                  defaultValue={path.quota}
                  onBlur={(e) => handleUpdatePpdbQuota(path.id, parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono text-center focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">Santri</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Kategori */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Master Kategori Sistem</h3>
          </div>
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </button>
        </div>

        {showAddCategory && (
          <form onSubmit={handleCreateCategory} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kategori</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Contoh: Ekstrakurikuler"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Modul</label>
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="article">Artikel / Berita</option>
                <option value="achievement">Prestasi</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSavingCategory}
              className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 cursor-pointer"
            >
              Simpan
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {data.categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({cat.type})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
