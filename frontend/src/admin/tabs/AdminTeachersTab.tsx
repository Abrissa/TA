import React, { useEffect, useState, useRef } from 'react';
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
  GraduationCap,
  BookOpen,
  Briefcase,
  Eye,
  Check,
  Camera,
  Link2,
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
  const [photoSourceType, setPhotoSourceType] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drag and Drop & Upload Details
  const [isDragging, setIsDragging] = useState(false);
  const [previewFileInfo, setPreviewFileInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setPhotoSourceType('upload');
    setPreviewFileInfo(null);
    setEditingItem({
      name: '',
      degree: 'S.Pd.I',
      role: 'Wali Kelas & Guru Tematik',
      subjects: "Al-Qur'an Hadits, Fiqih, Tahfidz",
      imageUrl: '',
      order: teachers.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Teacher) => {
    setUploadError(null);
    setPreviewFileInfo(null);
    const isPreset = PRESET_AVATARS.includes(item.imageUrl || '');
    const isHttpUrl = item.imageUrl?.startsWith('http://') || item.imageUrl?.startsWith('https://');
    setPhotoSourceType(isPreset ? 'preset' : isHttpUrl ? 'url' : 'upload');
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

  const processImageFile = async (file: File) => {
    if (!file) return;

    // Validate type (JPG, JPEG, PNG, WebP)
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isImageByExt = Boolean(file.name.match(/\.(jpe?g|png|webp)$/i));
    if (!validMimes.includes(file.type) && !isImageByExt) {
      setUploadError('Hanya file foto gambar (JPG, JPEG, PNG, WebP) yang diizinkan.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 5 MB. Silakan pilih foto dengan resolusi yang lebih kecil.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const sizeFormatted =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    setPreviewFileInfo({
      name: file.name,
      size: sizeFormatted,
    });

    try {
      const res = await api.uploadMedia(file, 'teachers');
      setEditingItem((prev) => (prev ? { ...prev, imageUrl: res.url } : null));
      setPhotoSourceType('upload');
    } catch (err: any) {
      setUploadError(err.message || 'Gagal memproses foto guru.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
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

    // Default to preset avatar 1 if no image was provided
    const finalImageUrl = editingItem.imageUrl?.trim() || '/assets/teachers/guru-1.svg';

    setIsSaving(true);
    try {
      const isEdit = !!editingItem.id && !editingItem.id.toString().startsWith('t-new-');
      await api.saveTeacher(
        {
          ...editingItem,
          imageUrl: finalImageUrl,
        },
        isEdit ? editingItem.id : undefined
      );
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
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-slate-900 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slide-up max-w-[calc(100vw-2rem)]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Manajemen Tenaga Pendidik</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 font-heading">
            Dewan Guru & Staf
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
            Kelola profil pendidik, mata pelajaran, foto asli (JPG/PNG), dan status tampil di website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Quick Statistics Bar - Compact 3-col on Mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Total Guru</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900 font-heading mt-0.5 sm:mt-1">{teachers.length}</p>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center self-end sm:self-auto shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Aktif</p>
            <p className="text-lg sm:text-2xl font-black text-emerald-600 font-heading mt-0.5 sm:mt-1">{totalActive}</p>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center self-end sm:self-auto shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Non-Aktif</p>
            <p className="text-lg sm:text-2xl font-black text-slate-600 font-heading mt-0.5 sm:mt-1">{totalInactive}</p>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center self-end sm:self-auto shrink-0">
            <Eye className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari guru, jabatan, atau mapel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="all">Semua Status ({teachers.length})</option>
            <option value="active">Aktif ({totalActive})</option>
            <option value="inactive">Non-Aktif ({totalInactive})</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 sm:py-20 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs sm:text-sm font-medium">Memuat data dewan guru...</span>
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-3">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-semibold text-xs sm:text-sm">Tidak ada data dewan guru yang sesuai.</p>
          <p className="text-xs text-slate-400">
            {search
              ? 'Coba ubah kata kunci pencarian Anda.'
              : 'Klik tombol "+ Tambah Guru Baru" untuk menambahkan profil pendidik.'}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredTeachers.map((t, idx) => {
            const fallbackAvatar = `/assets/teachers/guru-${(idx % 7) + 1}.svg`;
            const imageSrc = resolveImageUrl(t.imageUrl) || fallbackAvatar;
            const isSvgAvatar =
              typeof imageSrc === 'string' &&
              (imageSrc.includes('.svg') || imageSrc.includes('/assets/teachers/guru-'));

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[16/10] sm:aspect-4/3 w-full bg-gradient-to-b from-slate-100 to-slate-200/80 overflow-hidden flex items-center justify-center">
                    <img
                      src={imageSrc}
                      alt={t.name}
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                        isSvgAvatar ? 'object-contain p-3' : 'object-cover'
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = fallbackAvatar;
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          t.isActive !== false
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.isActive !== false ? 'bg-emerald-200 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <span>{t.isActive !== false ? 'Aktif' : 'Draft'}</span>
                      </span>

                      {!isSvgAvatar && (
                        <span className="bg-emerald-950/75 backdrop-blur-xs text-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Foto Asli
                        </span>
                      )}
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
                  <div className="p-3.5 sm:p-4 space-y-1.5 sm:space-y-2">
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

                    <div className="pt-0.5 text-xs text-slate-600 space-y-1">
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
                <div className="p-2.5 sm:p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="flex-1 py-2 sm:py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs min-h-[36px]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="py-2 sm:py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-slate-400 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer shadow-2xs min-h-[36px]"
                    title="Hapus data guru"
                    aria-label={`Hapus ${t.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog: Tambah / Edit Guru (Mobile Bottom Sheet & Desktop Dialog) */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[94vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slide-up sm:animate-none">
            
            {/* Mobile Sheet Handle */}
            <div className="bg-emerald-900 pt-2 pb-0 sm:hidden flex justify-center">
              <div className="w-12 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-4 py-3 sm:p-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading">
                    {editingItem.id && !editingItem.id.toString().startsWith('t-new-')
                      ? 'Edit Data Dewan Guru'
                      : 'Tambah Guru Baru'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-emerald-200">
                    Biodata pendidik dan unggah foto profil (JPG/PNG)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* FOTO PROFIL GURU (JPG / PNG / WebP) */}
              <div className="space-y-3 bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Foto Profil Guru <span className="text-emerald-700 font-semibold">(JPG / PNG / WebP)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Pilih foto resmi guru atau gunakan opsi avatar ilustrasi
                    </p>
                  </div>

                  {/* Mode Selector Segmented Tabs - Mobile-optimized Grid */}
                  <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('upload')}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        photoSourceType === 'upload'
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Upload</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('preset')}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        photoSourceType === 'preset'
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Avatar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('url')}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        photoSourceType === 'url'
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Link URL</span>
                    </button>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="teacher-photo-file-input"
                />

                {/* TAB 1: Upload File Foto (JPG / PNG / WebP) */}
                {photoSourceType === 'upload' && (
                  <div className="space-y-3">
                    {editingItem.imageUrl &&
                    !editingItem.imageUrl.includes('.svg') &&
                    !PRESET_AVATARS.includes(editingItem.imageUrl) ? (
                      /* Preview Box with Change/Remove Actions */
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <div className="relative w-24 h-32 sm:w-28 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-white shadow-md border-2 border-emerald-500/40 group">
                          <img
                            src={resolveImageUrl(editingItem.imageUrl) || editingItem.imageUrl}
                            alt="Foto Guru"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2 py-1 bg-white text-emerald-800 text-[11px] font-bold rounded-md shadow-xs cursor-pointer"
                            >
                              Ganti
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2 text-center sm:text-left min-w-0 w-full sm:w-auto">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Foto Berhasil Dipilih</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                              JPG/PNG/WebP
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 font-medium truncate max-w-full">
                            {previewFileInfo?.name ||
                              (editingItem.imageUrl.startsWith('data:')
                                ? 'Foto Gambar Tersimpan (Base64)'
                                : editingItem.imageUrl.split('/').pop())}
                          </p>
                          {previewFileInfo?.size && (
                            <p className="text-[11px] text-slate-400">Ukuran file: {previewFileInfo.size}</p>
                          )}

                          <div className="flex flex-col xs:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2 pt-1 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="px-3 py-2 sm:py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Camera className="w-3.5 h-3.5 shrink-0" />
                              <span>Ganti Foto</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem({ ...editingItem, imageUrl: '' });
                                setPreviewFileInfo(null);
                              }}
                              className="px-3 py-2 sm:py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Hapus Foto</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop Upload Zone */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-5 sm:p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-white ${
                          isDragging
                            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01] shadow-md ring-4 ring-emerald-200/50'
                            : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                          {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                          ) : (
                            <Camera className="w-6 h-6" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            {isUploading ? 'Sedang Memproses Foto...' : 'Ketuk untuk Pilih Foto Guru'}
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-500">
                            Format didukung: <span className="font-bold text-emerald-700">JPG, JPEG, PNG, WebP</span> (Maks. 5 MB)
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400">
                            Bisa ambil langsung dari kamera HP atau galeri foto
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            JPG
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            PNG
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            WEBP
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Pilihan Avatar Ilustrasi */}
                {photoSourceType === 'preset' && (
                  <div className="space-y-2.5 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700">Pilih karakter ilustrasi:</p>
                      <span className="text-[10px] sm:text-[11px] text-slate-400">7 Pilihan</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {PRESET_AVATARS.map((path, idx) => {
                        const isSelected = editingItem.imageUrl === path;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setEditingItem({ ...editingItem, imageUrl: path });
                              setPreviewFileInfo(null);
                            }}
                            className={`relative aspect-square rounded-xl p-1.5 border-2 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50 ${
                              isSelected
                                ? 'border-emerald-600 ring-2 ring-emerald-300 bg-emerald-50 shadow-xs'
                                : 'border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <img src={path} alt={`Guru ${idx + 1}`} className="w-full h-full object-contain" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: Input URL Gambar */}
                {photoSourceType === 'url' && (
                  <div className="space-y-2 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">
                      Tautan Langsung Gambar (URL):
                    </label>
                    <input
                      type="url"
                      value={editingItem.imageUrl || ''}
                      onChange={(e) => {
                        setEditingItem({ ...editingItem, imageUrl: e.target.value });
                        setPreviewFileInfo(null);
                      }}
                      placeholder="https://... atau /assets/teachers/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 bg-white"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-400">
                      Pastikan URL berakhiran .jpg, .jpeg, .png, atau .webp.
                    </p>
                  </div>
                )}

                {/* Pratinjau Terpilih (Preset or URL) */}
                {editingItem.imageUrl && (photoSourceType === 'preset' || photoSourceType === 'url') && (
                  <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0">
                      <img
                        src={resolveImageUrl(editingItem.imageUrl) || '/assets/teachers/guru-1.svg'}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/teachers/guru-1.svg';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        {photoSourceType === 'preset' ? 'Avatar Ilustrasi Terpilih' : 'URL Gambar Terpilih'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{editingItem.imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Biodata: Nama & Gelar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap Guru / Staf <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="Contoh: Ustadzah Fatimah Azzahra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gelar Akademik
                  </label>
                  <input
                    type="text"
                    value={editingItem.degree || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="Contoh: S.Pd.I / M.Pd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Jabatan & Mata Pelajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jabatan / Peran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="Contoh: Wali Kelas 3A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mata Pelajaran yang Diampu
                  </label>
                  <input
                    type="text"
                    value={editingItem.subjects || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, subjects: e.target.value })}
                    placeholder="Contoh: Al-Qur'an Hadits, Fiqih"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Urutan & Status Tampil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-0.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urutan Tampil (Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.order ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">Urutan nomor urut tampil guru di website.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Publikasi
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">Tampilkan di Website</span>
                      <p className="text-slate-500 text-[10px] sm:text-[11px]">Centang agar profil guru tampil di web publik.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Sticky Actions */}
              <div className="pt-3 sm:pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5 sm:gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
