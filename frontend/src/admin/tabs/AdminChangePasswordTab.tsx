import React, { useState, useEffect } from 'react';
import { api, AdminUser } from '../../services/api';
import {
  KeyRound,
  ShieldAlert,
  Users,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface AdminChangePasswordTabProps {
  currentUser: AdminUser;
  onForceLogout: () => void;
}

interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string | null;
  last_login_at: string | null;
  created_at: string;
}

export const AdminChangePasswordTab: React.FC<AdminChangePasswordTabProps> = ({
  currentUser,
  onForceLogout,
}) => {
  const isSuperAdmin = currentUser.role === 'superadmin';

  // State: Self Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [selfEmail, setSelfEmail] = useState(currentUser.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmittingSelf, setIsSubmittingSelf] = useState(false);
  const [selfFeedback, setSelfFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // State: Superadmin Managing Other Users
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);
  const [isSubmittingAdminReset, setIsSubmittingAdminReset] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isForceLoggingOutId, setIsForceLoggingOutId] = useState<number | null>(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('admin_humas');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPasswordConfirmation, setNewUserPasswordConfirmation] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('admin_humas');
  const [editPhone, setEditPhone] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchUsers = async () => {
    if (!isSuperAdmin) return;
    setIsLoadingUsers(true);
    try {
      const data = await api.getAdminUsers();
      setUsersList(data);
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Gagal memuat daftar admin.',
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  const handleSelfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelfFeedback(null);

    if (newPassword && newPassword.length < 8) {
      setSelfFeedback({ type: 'error', message: 'Kata sandi baru minimal 8 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSelfFeedback({ type: 'error', message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    setIsSubmittingSelf(true);
    try {
      const msg = await api.updatePassword(currentPassword, newPassword, confirmPassword, selfEmail.trim());
      setSelfFeedback({
        type: 'success',
        message: `${msg} Anda akan dialihkan ke halaman masuk...`,
      });
      // ponytail: 1.5-second delay lets user read confirmation; replace with toast lifecycle if app gets global notifications.
      setTimeout(() => {
        onForceLogout();
      }, 1500);
    } catch (err: any) {
      setSelfFeedback({
        type: 'error',
        message: err.message || 'Gagal memperbarui kata sandi.',
      });
    } finally {
      setIsSubmittingSelf(false);
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionFeedback(null);

    if (adminNewPassword.length < 8) {
      setActionFeedback({ type: 'error', message: 'Kata sandi baru minimal 8 karakter.' });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setActionFeedback({ type: 'error', message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    setIsSubmittingAdminReset(true);
    try {
      const msg = await api.resetUserPassword(selectedUser.id, adminNewPassword, adminConfirmPassword);
      setActionFeedback({ type: 'success', message: msg });
      setSelectedUser(null);
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      // Jika superadmin mereset password akunnya sendiri melalui panel ini, keluarkan
      if (selectedUser.id === currentUser.id) {
        setTimeout(() => onForceLogout(), 1500);
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Gagal mereset kata sandi admin.',
      });
    } finally {
      setIsSubmittingAdminReset(false);
    }
  };

  const handleForceLogout = async (user: ManagedUser) => {
    if (!window.confirm(`Yakin ingin mengeluarkan (force logout) sesi login "${user.name}"?`)) {
      return;
    }
    setActionFeedback(null);
    setIsForceLoggingOutId(user.id);
    try {
      const msg = await api.forceLogoutUser(user.id);
      setActionFeedback({ type: 'success', message: msg });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Gagal menghentikan sesi admin.',
      });
    } finally {
      setIsForceLoggingOutId(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionFeedback(null);
    setIsSavingEdit(true);
    try {
      const message = await api.updateAdminUser(editingUser.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        phone: editPhone.trim() || undefined,
      });
      setActionFeedback({ type: 'success', message });
      setEditingUser(null);
      await fetchUsers();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Gagal memperbarui akun admin.' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    if (!window.confirm(`Yakin ingin menghapus akun admin "${user.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setActionFeedback(null);
    try {
      const msg = await api.deleteAdminUser(user.id);
      setActionFeedback({ type: 'success', message: msg });
      await fetchUsers();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Gagal menghapus akun admin.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionFeedback(null);
    if (newUserPassword !== newUserPasswordConfirmation) {
      setActionFeedback({ type: 'error', message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    setIsCreatingUser(true);
    try {
      const message = await api.createAdminUser({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        phone: newUserPhone.trim() || undefined,
        password: newUserPassword,
        passwordConfirmation: newUserPasswordConfirmation,
      });
      setActionFeedback({ type: 'success', message });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
      setNewUserPasswordConfirmation('');
      setShowCreateUserForm(false);
      await fetchUsers();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Gagal membuat akun admin.' });
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-emerald-600" />
          Keamanan & Manajemen Kata Sandi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perbarui kata sandi akun Anda atau kelola akses keamanan seluruh staf administrator madrasah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Ganti Password Akun Sendiri */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Kata Sandi Akun Saya</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl flex gap-2.5 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Mengubah kata sandi akan langsung <strong>mengakhiri seluruh sesi login aktif</strong> akun ini demi keamanan. Anda akan diminta login ulang.
            </span>
          </div>

          {selfFeedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                selfFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {selfFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{selfFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSelfSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Akun <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={selfEmail}
                onChange={(e) => setSelfEmail(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Saat Ini <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingSelf}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingSelf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memperbarui...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simpan & Logout Otomatis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Panel Manajemen Admin untuk Superadmin */}
        <div className="lg:col-span-7 space-y-6">
          {isSuperAdmin ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">Manajemen Akses Admin</h2>
                    <p className="text-xs text-slate-500">Superadmin Privilege</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateUserForm((visible) => !visible)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    {showCreateUserForm ? 'Tutup Form' : 'Tambah Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={fetchUsers}
                    disabled={isLoadingUsers}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Segarkan daftar"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {actionFeedback && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    actionFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {actionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium">{actionFeedback.message}</span>
                </div>
              )}

              {showCreateUserForm && (
                <form onSubmit={handleCreateUser} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Buat Akun Admin</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-slate-700">
                      Nama lengkap
                      <input required maxLength={255} value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="text-xs font-semibold text-slate-700">
                      Email
                      <input required type="email" maxLength={255} value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="text-xs font-semibold text-slate-700">
                      Peran
                      <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
                        <option value="admin_humas">Admin Humas & Publikasi</option>
                        <option value="operator_ppdb">Operator PPDB</option>
                        <option value="admin_kesiswaan">Admin Kesiswaan</option>
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-700">
                      Nomor telepon (opsional)
                      <input type="tel" maxLength={30} value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="text-xs font-semibold text-slate-700">
                      Kata sandi sementara
                      <input required type="password" minLength={8} autoComplete="new-password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="text-xs font-semibold text-slate-700">
                      Konfirmasi kata sandi
                      <input required type="password" minLength={8} autoComplete="new-password" value={newUserPasswordConfirmation} onChange={(e) => setNewUserPasswordConfirmation(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isCreatingUser} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                      {isCreatingUser && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isCreatingUser ? 'Membuat akun...' : 'Buat Akun Admin'}
                    </button>
                  </div>
                </form>
              )}

              {/* Tabel / List Pengguna Admin */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Nama & Email</th>
                      <th className="py-2.5 px-3">Peran</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                          Memuat data pengguna...
                        </td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          Tidak ada admin terdaftar.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((user) => {
                        const isSelf = user.id === currentUser.id;
                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                {user.name}
                                {isSelf && (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                                    Anda
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  user.role === 'superadmin'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                  user.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                                />
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isSelf && (
                                  <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingUser(user);
                                      setEditName(user.name);
                                      setEditEmail(user.email);
                                      setEditRole(user.role);
                                      setEditPhone(user.phone || '');
                                      setActionFeedback(null);
                                    }}
                                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                                    title="Ubah profil, email, dan peran"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(user)}
                                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                                    title="Hapus akun admin"
                                  >
                                    Hapus
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setAdminNewPassword('');
                                      setAdminConfirmPassword('');
                                      setActionFeedback(null);
                                    }}
                                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                                    title="Ganti kata sandi admin ini"
                                  >
                                    Ganti Sandi
                                  </button>
                                  </>
                                )}

                                {!isSelf && (
                                  <button
                                    type="button"
                                    onClick={() => handleForceLogout(user)}
                                    disabled={isForceLoggingOutId === user.id}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                                    title="Force logout sesi admin ini"
                                  >
                                    {isForceLoggingOutId === user.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <LogOut className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {editingUser && (
                <form onSubmit={handleSaveEdit} className="mt-6 p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Edit akun admin: {editingUser.name}</h3>
                    <button type="button" onClick={() => setEditingUser(null)} className="text-xs text-slate-500 hover:text-slate-800">Batal</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-slate-700">Nama
                      <input required maxLength={255} value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="text-xs font-semibold text-slate-700">Email
                      <input required type="email" maxLength={255} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="text-xs font-semibold text-slate-700">Peran
                      <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
                        <option value="admin_humas">Admin Humas & Publikasi</option>
                        <option value="operator_ppdb">Operator PPDB</option>
                        <option value="admin_kesiswaan">Admin Kesiswaan</option>
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-700">Telepon (opsional)
                      <input type="tel" maxLength={30} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isSavingEdit} className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50">
                      {isSavingEdit ? 'Menyimpan...' : 'Simpan perubahan'}
                    </button>
                  </div>
                </form>
              )}

              {/* Modal / Panel Ubah Sandi Pengguna Lain */}
              {selectedUser && (
                <div className="mt-6 p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        Setel Ulang Sandi: {selectedUser.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">{selectedUser.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleAdminResetPassword} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Kata Sandi Baru <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showAdminNewPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            value={adminNewPassword}
                            onChange={(e) => setAdminNewPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="w-full text-xs px-3 py-2 pr-8 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-1 focus:ring-purple-500 focus:border-purple-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminNewPassword(!showAdminNewPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showAdminNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Konfirmasi Sandi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type={showAdminNewPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          value={adminConfirmPassword}
                          onChange={(e) => setAdminConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-1 focus:ring-purple-500 focus:border-purple-600"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingAdminReset}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingAdminReset ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terapkan & Logout Sesi Admin
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-xs space-y-2">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                Informasi Hak Akses
              </h3>
              <p>
                Akun Anda memiliki peran <strong>{currentUser.role}</strong>. Untuk mengelola akun administrator lain atau meminta reset kata sandi, silakan hubungi <strong>Super Administrator</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
