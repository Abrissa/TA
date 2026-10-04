import React, { useEffect, useState } from 'react';
import { api, PpdbRecord } from '../../services/api';
import { 
  Users, 
  Search, 
  MessageCircle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  Filter, 
  X,
  FileCheck,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';

export const AdminPpdbTab: React.FC = () => {
  const [records, setRecords] = useState<PpdbRecord[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Detail Modal
  const [selectedRecord, setSelectedRecord] = useState<PpdbRecord | null>(null);
  const [newStatus, setNewStatus] = useState<string>('menunggu_verifikasi');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadPpdb();
  }, [selectedStatus]);

  const loadPpdb = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminPpdb(selectedStatus, search);
      setRecords(res.data);
      setStatusCounts(res.status_counts);
    } catch (err) {
      console.error('Failed to load PPDB records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPpdb();
  };

  const handleOpenDetail = (rec: PpdbRecord) => {
    setSelectedRecord(rec);
    setNewStatus(rec.status);
    setAdminNotes(rec.admin_notes || '');
    setUpdateFeedback(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRecord) return;
    setIsUpdating(true);
    setUpdateFeedback(null);

    try {
      const updated = await api.updatePpdbStatus(selectedRecord.id, newStatus, adminNotes);
      setRecords(records.map(r => r.id === updated.id ? updated : r));
      setSelectedRecord(updated);
      setUpdateFeedback('Status pendaftaran berhasil diperbarui.');
      setTimeout(() => setUpdateFeedback(null), 3000);
      loadPpdb();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status PPDB.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Verifikasi & Seleksi Pendaftar PPDB
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data masuk dari formulir pendaftaran santri baru portal web MI AL-AHMAD.
          </p>
        </div>
      </div>

      {/* Status Badges Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'all', label: 'Semua', count: statusCounts['total'] ?? 0, color: 'slate' },
          { key: 'menunggu_verifikasi', label: 'Menunggu', count: statusCounts['menunggu_verifikasi'] ?? 0, color: 'amber' },
          { key: 'terverifikasi', label: 'Terverifikasi', count: statusCounts['terverifikasi'] ?? 0, color: 'blue' },
          { key: 'diterima', label: 'Diterima', count: statusCounts['diterima'] ?? 0, color: 'emerald' },
          { key: 'ditolak', label: 'Ditolak', count: statusCounts['ditolak'] ?? 0, color: 'rose' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedStatus(tab.key)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === tab.key
                ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-semibold text-slate-500">{tab.label}</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{tab.count}</div>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama calon siswa, no pendaftaran, wali..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold cursor-pointer"
        >
          Cari
        </button>
      </form>

      {/* Records Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            <p className="text-sm">Memuat data pendaftar PPDB...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Tidak ada pendaftar yang cocok dengan kriteria filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">No. Registrasi</th>
                  <th className="py-3 px-4">Calon Santri</th>
                  <th className="py-3 px-4">Nama Orang Tua / Wali</th>
                  <th className="py-3 px-4">Status Seleksi</th>
                  <th className="py-3 px-4">Tanggal Daftar</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800 text-xs whitespace-nowrap">
                      {rec.registration_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{rec.child_full_name}</div>
                      <div className="text-xs text-slate-400">{rec.gender} • Asal: {rec.previous_school || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs">
                      <div>{rec.parent_name}</div>
                      <div className="text-slate-400 font-mono mt-0.5">{rec.whatsapp}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        rec.status === 'diterima' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        rec.status === 'terverifikasi' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        rec.status === 'ditolak' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {rec.status === 'menunggu_verifikasi' ? 'Menunggu Verifikasi' :
                         rec.status === 'terverifikasi' ? 'Berkas Valid' :
                         rec.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs font-mono whitespace-nowrap">
                      {rec.registered_at ? new Date(rec.registered_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(rec)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>

                        {/* Direct WhatsApp parent contact */}
                        <a
                          href={`https://wa.me/${rec.whatsapp.replace(/\D/g, '')}?text=Assalamu'alaikum%20Bapak/Ibu%20${encodeURIComponent(rec.parent_name)},%20kami%20dari%20Panitia%20PPDB%20MI%20AL-AHMAD%20terkait%20pendaftaran%20ananda%20${encodeURIComponent(rec.child_full_name)}%20(${rec.registration_number}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Hubungi Wali Santri via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Status Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-mono text-emerald-700 font-semibold">{selectedRecord.registration_number}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedRecord.child_full_name}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{updateFeedback}</span>
              </div>
            )}

            {/* Applicant Details */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs text-slate-700 mb-6">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold text-slate-500">Jenis Kelamin:</span> {selectedRecord.gender}</div>
                <div><span className="font-semibold text-slate-500">Tempat Lahir:</span> {selectedRecord.birth_place}</div>
                <div><span className="font-semibold text-slate-500">Tanggal Lahir:</span> {selectedRecord.birth_date}</div>
                <div><span className="font-semibold text-slate-500">Sekolah Asal:</span> {selectedRecord.previous_school || '-'}</div>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <div><span className="font-semibold text-slate-500">Orang Tua / Wali:</span> {selectedRecord.parent_name}</div>
                <div><span className="font-semibold text-slate-500">WhatsApp:</span> {selectedRecord.whatsapp}</div>
                <div><span className="font-semibold text-slate-500">Alamat Rumah:</span> {selectedRecord.address}</div>
              </div>
            </div>

            {/* Form Update Status */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ubah Status Pendaftaran *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value="menunggu_verifikasi">Menunggu Verifikasi (Berkas Baru)</option>
                  <option value="terverifikasi">Terverifikasi (Berkas Lengkap & Valid)</option>
                  <option value="diterima">Diterima Sebagai Santri Baru</option>
                  <option value="ditolak">Ditolak / Berkas Tidak Memenuhi Syarat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Catatan Panitia / Alasan Verifikasi
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Contoh: Berkas akta dan KK sudah lengkap, observasi dijadwalkan tanggal..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>Simpan Perubahan Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
