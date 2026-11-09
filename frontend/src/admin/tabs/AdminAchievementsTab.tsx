import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Achievement } from '../../types';
import { 
  Trophy, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Loader2, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Award,
  Medal,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AdminAchievementsTab: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Achievement> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['Semua', 'Internasional', 'Se-Pulau Jawa', 'Regional', 'Kecamatan'];

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminAchievements();
      setAchievements(res);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setUploadError(null);
    setEditingItem({
      title: '',
      category: 'Kecamatan',
      winner: '',
      winnerRole: 'Santri Berprestasi',
      rank: 'Juara 1',
      event: '',
      year: new Date().getFullYear().toString(),
      date: `Tahun ${new Date().getFullYear()}`,
      description: '',
      imageUrl: '/assets/prestasi-iksc-2025.jpg',
      highlight: '',
      details: ['Piagam & Medali Kejuaraan'],
      isHighlighted: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setUploadError(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data prestasi santri ini?')) return;
    try {
      await api.deleteAchievement(id);
      setToastMessage('Data prestasi berhasil dihapus.');
      setTimeout(() => setToastMessage(null), 3000);
      loadAchievements();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus prestasi.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya file gambar (JPG, PNG, WebP) yang diizinkan.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 5 MB.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await api.uploadMedia(file, 'achievements');
      setEditingItem((prev) => prev ? { ...prev, imageUrl: res.url } : null);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title?.trim() || !editingItem.winner?.trim()) {
      alert('Judul prestasi dan nama pemenang wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);
      await api.saveAchievement(editingItem, editingItem.id);
      setIsModalOpen(false);
      setToastMessage(editingItem.id ? 'Prestasi berhasil diperbarui!' : 'Prestasi baru berhasil ditambahkan!');
      setTimeout(() => setToastMessage(null), 3500);
      loadAchievements();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan prestasi.');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = achievements.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      search.trim() === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.winner.toLowerCase().includes(search.toLowerCase()) ||
      (item.event && item.event.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Manajemen Prestasi Santri</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola rekam jejak capaian, kejuaraan, medali, dan penghargaan santri MI AL-AHMAD.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari prestasi, santri, kejuaraan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-600 mr-2" />
            <span className="text-sm font-medium">Memuat data prestasi santri...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">Tidak ada prestasi ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ada data yang cocok dengan pencarian atau kategori yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Prestasi & Santri</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Peringkat / Medali</th>
                  <th className="px-6 py-4">Tahun / Tanggal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || '/assets/prestasi-iksc-2025.jpg'}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/assets/gedung-mi-al-ahmad.jpg';
                          }}
                        />
                        <div className="min-w-0 max-w-md">
                          <div className="font-semibold text-slate-900 line-clamp-1 hover:text-emerald-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs font-medium text-emerald-700 mt-0.5">
                            {item.winner}
                            {item.winnerRole && <span className="text-slate-400 font-normal"> • {item.winnerRole}</span>}
                          </div>
                          {item.event && (
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.event}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.category === 'Internasional' ? 'bg-purple-100 text-purple-700' :
                        item.category === 'Se-Pulau Jawa' ? 'bg-rose-100 text-rose-700' :
                        item.category === 'Regional' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'Kecamatan' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 text-xs sm:text-sm">
                        {item.rank || 'Penghargaan'}
                      </div>
                      {item.medals && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                          {item.medals.gold > 0 && <span className="text-amber-600 font-bold">🥇 {item.medals.gold}</span>}
                          {item.medals.silver > 0 && <span className="text-slate-500 font-bold">🥈 {item.medals.silver}</span>}
                          {item.medals.bronze > 0 && <span className="text-amber-800 font-bold">🥉 {item.medals.bronze}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date || item.year || '2025'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit Prestasi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Prestasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingItem.id ? 'Perbarui Data Prestasi' : 'Tambah Prestasi Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">Isi detail kejuaraan santri untuk dipublikasikan</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Judul Kejuaraan / Prestasi *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Juara 1 Olimpiade Sains Internasional 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Nama Pemenang / Santri *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.winner || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, winner: e.target.value })}
                    placeholder="Contoh: Arkadewi Laras Maulida"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Peran / Delegasi
                  </label>
                  <input
                    type="text"
                    value={editingItem.winnerRole || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, winnerRole: e.target.value })}
                    placeholder="Contoh: Atlet Karate Pelajar Putri"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Tingkat / Kategori
                  </label>
                  <select
                    value={editingItem.category || 'Kecamatan'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Internasional">Internasional</option>
                    <option value="Se-Pulau Jawa">Se-Pulau Jawa</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Regional">Regional</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Kabupaten">Kabupaten</option>
                    <option value="Kecamatan">Kecamatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Peringkat / Capaian
                  </label>
                  <input
                    type="text"
                    value={editingItem.rank || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, rank: e.target.value })}
                    placeholder="Contoh: Juara 1 Medali Emas"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={editingItem.year || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Nama Ajang / Event Lengkap
                </label>
                <input
                  type="text"
                  value={editingItem.event || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, event: e.target.value })}
                  placeholder="Contoh: International Karate Championship Yogyakarta Open Tournament VI"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Deskripsi Singkat / Ulasan Prestasi
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Jelaskan ringkasan prestasi, kejuaraan, dan apresiasi madrasah..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Foto Dokumentasi Prestasi
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editingItem.imageUrl || '/assets/prestasi-iksc-2025.jpg'}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/gedung-mi-al-ahmad.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editingItem.imageUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                      placeholder="/assets/prestasi-iksc-2025.jpg"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white mb-2"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors">
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih File Gambar'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
                {uploadError && <p className="text-xs text-rose-500 mt-1">{uploadError}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Prestasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
