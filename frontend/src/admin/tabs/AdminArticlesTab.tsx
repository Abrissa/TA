import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Article } from '../../types';
import { 
  FileText, 
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
  Image as ImageIcon
} from 'lucide-react';

export const AdminArticlesTab: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminArticles();
      setArticles(res);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setUploadError(null);
    setEditingArticle({
      title: '',
      category: 'Kegiatan',
      excerpt: '',
      content: '',
      author: 'Tim Humas MI Al-Ahmad',
      authorRole: 'Redaksi',
      imageUrl: '',
      readTime: '3 menit',
      isFeatured: false,
      status: 'published',
      tags: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setUploadError(null);
    setEditingArticle({ ...art });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya file gambar (JPEG, PNG, WebP) yang diizinkan.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 4 MB.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await api.uploadMedia(file, 'articles');
      setEditingArticle((prev) => (prev ? { ...prev, imageUrl: res.url } : null));
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah gambar ke penyimpanan server.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      await api.deleteArticle(id);
      setArticles(articles.filter(a => Number(a.id) !== id));
      setToastMessage('Artikel berhasil dihapus.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus artikel.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.content) return;

    setIsSaving(true);
    try {
      const saved = await api.saveArticle(
        editingArticle, 
        editingArticle.id ? Number(editingArticle.id) : undefined
      );

      if (editingArticle.id) {
        setArticles(articles.map(a => a.id === saved.id ? saved : a));
        setToastMessage('Artikel berhasil diperbarui.');
      } else {
        setArticles([saved, ...articles]);
        setToastMessage('Artikel baru berhasil diterbitkan.');
      }

      setIsModalOpen(false);
      setEditingArticle(null);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan artikel.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchCat = selectedCategory === 'Semua' || a.category === selectedCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                        a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Manajemen Berita & Artikel
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola publikasi warta madrasah, prestasi, dan agenda edukasi.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel atau kata kunci..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Semua', 'Prestasi', 'Kegiatan', 'Informasi', 'Edukasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            <p className="text-sm">Memuat data artikel...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Tidak ada artikel yang cocok dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Judul Artikel</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={art.imageUrl || '/assets/berita-maulana-ksm.jpg'}
                            alt={art.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/berita-maulana-ksm.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{art.title}</div>
                          <div className="text-xs text-slate-400 truncate mt-0.5">{art.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        art.category === 'Prestasi' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        art.category === 'Kegiatan' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {art.author}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">
                      {art.date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(Number(art.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Artikel"
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

      {/* Create / Edit Modal */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingArticle.id ? 'Edit Artikel' : 'Tulis Berita Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Judul Berita / Artikel *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Contoh: Siswa MI Al-Ahmad Meraih Juara 1..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={editingArticle.category || 'Kegiatan'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Informasi">Informasi</option>
                    <option value="Edukasi">Edukasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Penulis
                  </label>
                  <input
                    type="text"
                    value={editingArticle.author || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    placeholder="Tim Humas Madrasah"
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Upload Gambar Artikel (Stored on disk storage, not DB) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Gambar Utama Berita</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Disimpan ke disk storage (Maks 4 MB)
                  </span>
                </div>

                {uploadError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {editingArticle.imageUrl ? (
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-slate-300 shrink-0 group bg-slate-100">
                      <img
                        src={editingArticle.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/berita-maulana-ksm.jpg';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingArticle({ ...editingArticle, imageUrl: '' })}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs shrink-0">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                      <span>Belum ada</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-semibold cursor-pointer shadow-xs transition-all">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Mengunggah Berkas...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Pilih & Unggah File Gambar</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      value={editingArticle.imageUrl || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                      placeholder="Atau tautkan URL gambar (/storage/... atau https://...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-slate-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ringkasan Singkat (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Konten Lengkap Berita *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Tulis narasi berita lengkap..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
