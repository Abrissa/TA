import React, { useEffect, useState } from 'react';
import { api, resolveImageUrl } from '../../services/api';
import { Teacher } from '../../types';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  GraduationCap,
  BookOpen,
  Briefcase,
  Eye,
  Check
} from 'lucide-react';

const PRESET_AVATARS = [
  '/assets/teachers/guru-1.svg',
  '/assets/teachers/guru-2.svg',
  '/assets/teachers/guru-3.svg',
  '/assets/teachers/guru-4.svg',
  '/assets/teachers/guru-5.svg',
  '/assets/teachers/guru-6.svg',
  '/assets/teachers/guru-7.svg',
];

export const AdminTeachersTab: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Teacher> | null>(null);
  const [photoSourceType, setPhotoSourceType] = useState<'preset' | 'upload' | 'url'>('preset');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminTeachers();
      setTeachers(res);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setUploadError(null);
    setPhotoSourceType('preset');
    setEditingItem({
      name: '',
      degree: 'S.Pd.I',
      role: 'Wali Kelas & Guru Tematik',
      subjects: "Al-Qur'an Hadits, Fiqih, Tahfidz",
      imageUrl: '/assets/teachers/guru-1.svg',
      order: teachers.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Teacher) => {
    setUploadError(null);
    const isPreset = PRESET_AVATARS.includes(item.imageUrl);
    setPhotoSourceType(isPreset ? 'preset' : item.imageUrl.startsWith('/storage') || item.imageUrl.startsWith('blob:') ? 'upload' : 'url');
    setEditingItem({
      ...item,
      isActive: item.isActive !== false,
      order: item.order ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data dewan guru "${name}"?`)) return;
    try {
      await api.deleteTeacher(id);
      showToast(`Data guru "${name}" berhasil dihapus.`);
      loadTeachers();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data guru.');
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
      setUploadError('Ukuran gambar tidak boleh melebihi 5MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const res = await api.uploadMedia(file, 'teachers');
      setEditingItem((prev) => prev ? ({ ...prev, imageUrl: res.url }) : null);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengupload foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name || !editingItem.name.trim()) {
      alert('Nama guru wajib diisi.');
      return;
    }

    if (!editingItem.role || !editingItem.role.trim()) {
      alert('Jabatan / tugas guru wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const isEdit = !!editingItem.id && !editingItem.id.toString().startsWith('t-new-');
      await api.saveTeacher(editingItem, isEdit ? editingItem.id : undefined);
      setIsModalOpen(false);
      showToast(isEdit ? 'Data dewan guru berhasil diperbarui.' : 'Guru baru berhasil ditambahkan.');
      loadTeachers();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data guru.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.degree && t.degree.toLowerCase().includes(search.toLowerCase())) ||
      t.role.toLowerCase().includes(search.toLowerCase()) ||
      (t.subjects && t.subjects.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && t.isActive !== false) ||
      (statusFilter === 'inactive' && t.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const totalActive = teachers.filter((t) => t.isActive !== false).length;
  const totalInactive = teachers.length - totalActive;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Users className="w-4 h-4" />
            <span>Manajemen Tenaga Pendidik</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            Dewan Guru & Tenaga Kependidikan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola profil pendidik, ustadz/ustadzah, mata pelajaran, dan urutan tampil pada portal madrasah.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Guru & Staf</p>
            <p className="text-2xl font-black text-slate-900 font-heading mt-1">{teachers.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktif Ditampilkan</p>
            <p className="text-2xl font-black text-emerald-600 font-heading mt-1">{totalActive}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Non-Aktif / Draft</p>
            <p className="text-2xl font-black text-slate-600 font-heading mt-1">{totalInactive}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari guru, jabatan, atau mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="all">Semua Status ({teachers.length})</option>
            <option value="active">Aktif ({totalActive})</option>
            <option value="inactive">Non-Aktif ({totalInactive})</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs sm:text-sm font-medium">Memuat data dewan guru...</span>
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Tidak ada data dewan guru yang sesuai.</p>
          <p className="text-xs text-slate-400">
            {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Klik tombol "+ Tambah Guru Baru" untuk menambahkan profil pendidik.'}
          </p>
          {!search && (
            <button
              onClick={handleOpenCreate}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              + Tambah Guru Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTeachers.map((t, idx) => {
            const fallbackAvatar = `/assets/teachers/guru-${(idx % 7) + 1}.svg`;
            const imageSrc = resolveImageUrl(t.imageUrl) || fallbackAvatar;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-4/3 w-full bg-gradient-to-b from-slate-100 to-slate-200/80 overflow-hidden flex items-center justify-center">
                    <img
                      src={imageSrc}
                      alt={t.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = fallbackAvatar;
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          t.isActive !== false
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${t.isActive !== false ? 'bg-emerald-200 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{t.isActive !== false ? 'Aktif' : 'Draft'}</span>
                      </span>
                    </div>

                    {t.order !== undefined && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          #{t.order}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {t.name}
                      </h3>
                      {t.degree && (
                        <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{t.degree}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-1 text-xs text-slate-600 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 font-medium">{t.role}</span>
                      </div>
                      {t.subjects && (
                        <div className="flex items-start gap-1.5 text-slate-500">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 text-[11px]">{t.subjects}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-slate-400 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    title="Hapus data guru"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog: Tambah / Edit Guru */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading">
                    {editingItem.id && !editingItem.id.toString().startsWith('t-new-') ? 'Edit Data Dewan Guru' : 'Tambah Guru Baru'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Isi informasi biodata pendidik dan peran pengajaran di madrasah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
              {uploadError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Nama & Gelar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Guru / Staf <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="Contoh: Ustadzah Fatimah Azzahra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gelar Akademik
                  </label>
                  <input
                    type="text"
                    value={editingItem.degree || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="Contoh: S.Pd.I / M.Pd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Jabatan & Mata Pelajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jabatan / Peran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="Contoh: Wali Kelas 3A & Pembina Pramuka"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mata Pelajaran yang Diampu
                  </label>
                  <input
                    type="text"
                    value={editingItem.subjects || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, subjects: e.target.value })}
                    placeholder="Contoh: Al-Qur'an Hadits, Fiqih, Tahfidz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Urutan & Status Tampil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Urutan Tampil (Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.order ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Urutan posisi tampil guru di website publik.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Publikasi
                  </label>
                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">Tampilkan di Website Publik</span>
                      <p className="text-slate-500 text-[11px]">Centang agar profil guru dapat dilihat pengunjung.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Foto Profil Guru */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Foto / Avatar Guru
                  </label>

                  {/* Source Toggle Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('preset')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        photoSourceType === 'preset' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Pilihan Avatar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('upload')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        photoSourceType === 'upload' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('url')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        photoSourceType === 'url' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      URL Gambar
                    </button>
                  </div>
                </div>

                {/* Preset Avatars Grid */}
                {photoSourceType === 'preset' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Pilih salah satu karakter ilustrasi dewan guru:</p>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                      {PRESET_AVATARS.map((path, idx) => {
                        const isSelected = editingItem.imageUrl === path;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, imageUrl: path })}
                            className={`relative aspect-square rounded-xl p-1.5 border-2 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50 ${
                              isSelected
                                ? 'border-emerald-600 ring-2 ring-emerald-300/60 bg-emerald-50'
                                : 'border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <img src={path} alt={`Guru ${idx + 1}`} className="w-full h-full object-contain" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upload File Input */}
                {photoSourceType === 'upload' && (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                      <input
                        type="file"
                        id="teacher-photo-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="teacher-photo-upload" className="cursor-pointer block space-y-2">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                        <div>
                          <span className="text-xs font-bold text-emerald-700 hover:underline">
                            Klik untuk upload foto guru
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, atau WebP (Maksimal 5MB)</p>
                        </div>
                      </label>
                      {isUploading && (
                        <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold mt-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengunggah foto...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* URL Input */}
                {photoSourceType === 'url' && (
                  <div>
                    <input
                      type="text"
                      value={editingItem.imageUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                      placeholder="https://... atau /assets/teachers/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>
                )}

                {/* Preview Thumbnail */}
                {editingItem.imageUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <img
                      src={resolveImageUrl(editingItem.imageUrl) || '/assets/teachers/guru-1.svg'}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/teachers/guru-1.svg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800">Pratinjau Foto Profil Terpilih</p>
                      <p className="text-[11px] text-slate-500 truncate">{editingItem.imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Data Guru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

