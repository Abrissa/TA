import React, { useEffect, useState } from 'react';
import { api, PpdbRecord } from '../../services/api';
import { SCHOOL_INFO } from '../../data/mockData';
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
  Phone,
  Trash2,
  Printer,
  Download,
  FileSpreadsheet,
  FileText
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

  // Cetak Dokumen State
  const [printRecord, setPrintRecord] = useState<PpdbRecord | null>(null);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState(false);

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

  const handleDelete = async (rec: PpdbRecord) => {
    if (!window.confirm(`Yakin ingin menghapus data pendaftaran calon santri "${rec.child_full_name}" (${rec.registration_number})? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    try {
      await api.deletePpdbRecord(rec.id);
      if (selectedRecord?.id === rec.id) {
        setSelectedRecord(null);
      }
      setUpdateFeedback(`Data pendaftaran "${rec.child_full_name}" berhasil dihapus.`);
      setTimeout(() => setUpdateFeedback(null), 3500);
      loadPpdb();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data pendaftar PPDB.');
    }
  };

  // Helper Label Status
  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'diterima': return 'Diterima';
      case 'terverifikasi': return 'Terverifikasi (Berkas Valid)';
      case 'ditolak': return 'Ditolak';
      default: return 'Menunggu Verifikasi';
    }
  };

  // Helper Nama Filter Aktif
  const getFilterStatusName = () => {
    switch (selectedStatus) {
      case 'menunggu_verifikasi': return 'Menunggu Verifikasi';
      case 'terverifikasi': return 'Berkas Valid';
      case 'diterima': return 'Diterima Sebagai Santri Baru';
      case 'ditolak': return 'Ditolak';
      default: return 'Semua Status';
    }
  };

  // 1. Fitur Ekspor CSV (Universal Spreadsheet UTF-8 BOM)
  const handleExportCsv = () => {
    if (records.length === 0) {
      alert('Tidak ada data pendaftar untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'No. Registrasi',
      'Nama Lengkap Calon Santri',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Sekolah Asal',
      'Nama Orang Tua / Wali',
      'No. WhatsApp',
      'Alamat Lengkap',
      'Status Pendaftaran',
      'Catatan Panitia',
      'Tanggal Mendaftar'
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = records.map((rec, index) => [
      index + 1,
      `="${rec.registration_number}"`, // Awalan ="..." menjaga formatting text di Microsoft Excel
      escapeCsv(rec.child_full_name),
      escapeCsv(rec.gender),
      escapeCsv(rec.birth_place),
      escapeCsv(rec.birth_date),
      escapeCsv(rec.previous_school || '-'),
      escapeCsv(rec.parent_name),
      `="${rec.whatsapp}"`, // Menjaga angka 0 di depan nomor handphone
      escapeCsv(rec.address),
      escapeCsv(getStatusLabel(rec.status)),
      escapeCsv(rec.admin_notes || '-'),
      escapeCsv(rec.registered_at ? new Date(rec.registered_at).toLocaleString('id-ID') : '-')
    ]);

    // UTF-8 BOM (\uFEFF) memastikan Microsoft Excel membaca karakter & aksen tanpa cacat
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `PPDB_MI_AL_AHMAD_${selectedStatus.toUpperCase()}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Fitur Ekspor Excel (.xls / .xlsx XML Format dengan Styling Rapi)
  const handleExportExcel = () => {
    if (records.length === 0) {
      alert('Tidak ada data pendaftar untuk diekspor.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const tableRows = records.map((rec, idx) => `
      <tr>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${idx + 1}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; font-family: monospace; font-weight: bold; mso-number-format:'\\@';">${rec.registration_number}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">${rec.child_full_name}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${rec.gender}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${rec.birth_place}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${rec.birth_date}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${rec.previous_school || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${rec.parent_name}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; mso-number-format:'\\@';">${rec.whatsapp}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${rec.address}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">${getStatusLabel(rec.status)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${rec.admin_notes || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${rec.registered_at ? new Date(rec.registered_at).toLocaleDateString('id-ID') : '-'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Data PPDB Santri Baru</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      </head>
      <body>
        <h2 style="font-family: Arial, sans-serif; color: #047857; margin-bottom: 4px;">DATA PENDAFTARAN SANTRI BARU (PPDB) - ${SCHOOL_INFO.name}</h2>
        <p style="font-family: Arial, sans-serif; font-size: 12px; color: #64748b; margin-top: 0;">Diekspor pada: ${dateStr} | Filter Status: ${getFilterStatusName()} | Total: ${records.length} Santri</p>
        <table style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; width: 100%;">
          <thead>
            <tr style="background-color: #059669; color: #ffffff; font-weight: bold; text-align: center;">
              <th style="border: 1px solid #047857; padding: 8px;">No</th>
              <th style="border: 1px solid #047857; padding: 8px;">No. Registrasi</th>
              <th style="border: 1px solid #047857; padding: 8px;">Nama Calon Santri</th>
              <th style="border: 1px solid #047857; padding: 8px;">L/P</th>
              <th style="border: 1px solid #047857; padding: 8px;">Tempat Lahir</th>
              <th style="border: 1px solid #047857; padding: 8px;">Tanggal Lahir</th>
              <th style="border: 1px solid #047857; padding: 8px;">Sekolah Asal</th>
              <th style="border: 1px solid #047857; padding: 8px;">Orang Tua / Wali</th>
              <th style="border: 1px solid #047857; padding: 8px;">No. WhatsApp</th>
              <th style="border: 1px solid #047857; padding: 8px;">Alamat Rumah</th>
              <th style="border: 1px solid #047857; padding: 8px;">Status Seleksi</th>
              <th style="border: 1px solid #047857; padding: 8px;">Catatan Panitia</th>
              <th style="border: 1px solid #047857; padding: 8px;">Tgl Mendaftar</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PPDB_MI_AL_AHMAD_${selectedStatus.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. Trigger Cetak Dokumen Browser
  const triggerPrint = () => {
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Print Stylesheet Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-document, #printable-document * {
            visibility: visible !important;
          }
          #printable-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 16px !important;
            background: white !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Verifikasi & Seleksi Pendaftar PPDB
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data masuk dari formulir pendaftaran santri baru portal web {SCHOOL_INFO.name}.
          </p>
        </div>

        {/* Toolbar Tombol Ekspor & Cetak Dokumen */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Cetak Rekap */}
          <button
            type="button"
            onClick={() => setIsPrintRekapOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Cetak format cetak tabel PDF / Kertas"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Rekap (PDF)</span>
          </button>

          {/* Tombol Ekspor CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 active:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Unduh file format CSV (Comma Separated Values)"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          {/* Tombol Ekspor Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Unduh file format Microsoft Excel (.xls / .xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Ekspor Excel (.xls)</span>
          </button>
        </div>
      </div>

      {updateFeedback && !selectedRecord && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{updateFeedback}</span>
        </div>
      )}

      {/* Status Badges Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'all', label: 'Semua Santri', count: statusCounts['total'] ?? statusCounts['all'] ?? 0, color: 'slate' },
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

      {/* Search Input & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama calon santri, no registrasi, wali..."
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

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <span className="font-bold text-slate-800">{records.length}</span> pendaftar ({getFilterStatusName()})
        </div>
      </div>

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
                  <th className="py-3 px-4 text-center">Aksi & Dokumen</th>
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
                        {/* Tombol Cetak Formulir Individual */}
                        <button
                          type="button"
                          onClick={() => setPrintRecord(rec)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          title="Cetak Formulir Bukti Pendaftaran Santri"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

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

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(rec)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Data Pendaftaran"
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

      {/* ============================================================== */}
      {/* MODAL 1: Detail & Status Modal                                 */}
      {/* ============================================================== */}
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedRecord)}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>

                  {/* Tombol Cetak dari Modal Detail */}
                  <button
                    type="button"
                    onClick={() => setPrintRecord(selectedRecord)}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-600" />
                    <span>Cetak Formulir</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
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
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CETAK FORMULIR BUKTI PENDAFTARAN SANTRI BARU (INDIVIDU)*/}
      {/* ============================================================== */}
      {printRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
            {/* Action Bar (No-Print) */}
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Pratinjau Cetak Lembar Pendaftaran Santri</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintRecord(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dokumen Fisik Resmi Siap Cetak (#printable-document) */}
            <div id="printable-document" className="bg-white p-2 sm:p-4 text-slate-900 font-sans text-xs sm:text-sm leading-relaxed">
              {/* Kop Surat Madrasah */}
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <div className="text-xs uppercase tracking-widest text-emerald-800 font-bold mb-0.5">
                  LEMBAGA PENDIDIKAN MA'ARIF NU
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-wide uppercase font-serif">
                  {SCHOOL_INFO.fullName}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  NSM: <span className="font-mono font-semibold">{SCHOOL_INFO.nsm}</span> | NPSN: <span className="font-mono font-semibold">{SCHOOL_INFO.npsn}</span> | Akreditasi: <span className="font-bold">{SCHOOL_INFO.accreditation}</span>
                </p>
                <p className="text-xs text-slate-600">
                  {SCHOOL_INFO.address}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Telp: {SCHOOL_INFO.phone} | WA: {SCHOOL_INFO.whatsapp} | Website: {SCHOOL_INFO.website}
                </p>
              </div>

              {/* Garis Ganda Kop Surat */}
              <div className="border-t border-slate-900 -mt-2 mb-4" />

              {/* Judul Formulir */}
              <div className="text-center mb-6">
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider underline decoration-slate-900 underline-offset-4">
                  FORMULIR BUKTI PENDAFTARAN SANTRI BARU
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  TAHUN AJARAN 2026/2027
                </p>
              </div>

              {/* Header Info Nomor Registrasi & Foto */}
              <div className="flex items-start justify-between gap-4 mb-5 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Nomor Registrasi:</span>
                  <div className="text-lg font-mono font-extrabold text-emerald-800 tracking-wider">
                    {printRecord.registration_number}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Tanggal Mendaftar: {printRecord.registered_at ? new Date(printRecord.registered_at).toLocaleString('id-ID') : '-'}
                  </div>
                </div>

                {/* Pas Foto Box */}
                <div className="w-20 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-center p-1 text-slate-400 bg-white shrink-0">
                  <span className="text-[10px] font-bold">PAS FOTO</span>
                  <span className="text-[9px]">3 x 4 cm</span>
                </div>
              </div>

              {/* Data Calon Siswa */}
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border-l-4 border-emerald-600 mb-2.5">
                  A. DATA PRIBADI CALON SANTRI
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600 w-44">Nama Lengkap Santri</td>
                      <td className="py-1.5 font-bold text-slate-900">: {printRecord.child_full_name}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600">Jenis Kelamin</td>
                      <td className="py-1.5 text-slate-900">: {printRecord.gender}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600">Tempat, Tanggal Lahir</td>
                      <td className="py-1.5 text-slate-900">: {printRecord.birth_place}, {printRecord.birth_date}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600">Sekolah Asal (TK / RA)</td>
                      <td className="py-1.5 text-slate-900">: {printRecord.previous_school || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Data Orang Tua / Wali */}
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border-l-4 border-emerald-600 mb-2.5">
                  B. DATA ORANG TUA / WALI SANTRI
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600 w-44">Nama Orang Tua / Wali</td>
                      <td className="py-1.5 font-bold text-slate-900">: {printRecord.parent_name}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600">Nomor WhatsApp Aktif</td>
                      <td className="py-1.5 font-mono text-slate-900">: {printRecord.whatsapp}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600">Alamat Tempat Tinggal</td>
                      <td className="py-1.5 text-slate-900">: {printRecord.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status Seleksi */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border-l-4 border-emerald-600 mb-2.5">
                  C. STATUS SELEKSI PENERIMAAN
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600 w-44">Status Saat Ini</td>
                      <td className="py-1.5 font-bold text-slate-900">
                        : <span className="uppercase text-emerald-800">{getStatusLabel(printRecord.status)}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-medium text-slate-600">Catatan Panitia</td>
                      <td className="py-1.5 text-slate-900 italic">: {printRecord.admin_notes || 'Tidak ada catatan verifikasi khusus.'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Area Tanda Tangan */}
              <div className="grid grid-cols-2 gap-8 text-center pt-6 mt-4 border-t border-slate-200 text-xs">
                <div>
                  <p className="text-slate-600 mb-16">Orang Tua / Wali Santri,</p>
                  <p className="font-bold underline decoration-slate-900 text-slate-900 uppercase">
                    ( {printRecord.parent_name} )
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 mb-1">
                    Sidoarjo, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-slate-600 mb-14">Panitia PPDB {SCHOOL_INFO.name},</p>
                  <p className="font-bold underline decoration-slate-900 text-slate-900 uppercase">
                    ( {SCHOOL_INFO.principalName} )
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">Kepala Madrasah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CETAK REKAPITULASI LAPORAN DATA SANTRI PPDB (TABEL)   */}
      {/* ============================================================== */}
      {isPrintRekapOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
            {/* Action Bar (No-Print) */}
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Pratinjau Cetak Rekapitulasi PPDB</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintRekapOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dokumen Rekap Cetak Siap Print (#printable-document) */}
            <div id="printable-document" className="bg-white p-2 text-slate-900 font-sans text-xs leading-normal">
              {/* Kop Surat Madrasah */}
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <div className="text-xs uppercase tracking-widest text-emerald-800 font-bold mb-0.5">
                  LEMBAGA PENDIDIKAN MA'ARIF NU
                </div>
                <h1 className="text-xl font-black text-slate-950 tracking-wide uppercase font-serif">
                  {SCHOOL_INFO.fullName}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  NSM: {SCHOOL_INFO.nsm} | NPSN: {SCHOOL_INFO.npsn} | Akreditasi: {SCHOOL_INFO.accreditation}
                </p>
                <p className="text-[11px] text-slate-600">
                  {SCHOOL_INFO.address} | Telp: {SCHOOL_INFO.phone} | Website: {SCHOOL_INFO.website}
                </p>
              </div>

              {/* Judul Dokumen */}
              <div className="text-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider underline decoration-slate-900 underline-offset-4">
                  DAFTAR REKAPITULASI PENDAFTARAN SANTRI BARU (PPDB)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Kriteria: <span className="font-bold text-slate-900">{getFilterStatusName()}</span> | Total Pendaftar: <span className="font-bold text-slate-900">{records.length} Santri</span>
                </p>
              </div>

              {/* Tabel Data Rekapitulasi */}
              <table className="w-full text-left border-collapse border border-slate-400 text-[10px] mb-6">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold text-center">
                    <th className="border border-slate-400 p-1.5 w-8">No</th>
                    <th className="border border-slate-400 p-1.5 w-24">No. Registrasi</th>
                    <th className="border border-slate-400 p-1.5">Nama Calon Santri</th>
                    <th className="border border-slate-400 p-1.5 w-10">L/P</th>
                    <th className="border border-slate-400 p-1.5">Tempat, Tgl Lahir</th>
                    <th className="border border-slate-400 p-1.5">Sekolah Asal</th>
                    <th className="border border-slate-400 p-1.5">Orang Tua / Wali</th>
                    <th className="border border-slate-400 p-1.5 w-24">WhatsApp</th>
                    <th className="border border-slate-400 p-1.5 w-24">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, index) => (
                    <tr key={rec.id} className="even:bg-slate-50/50">
                      <td className="border border-slate-400 p-1.5 text-center">{index + 1}</td>
                      <td className="border border-slate-400 p-1.5 font-mono font-semibold">{rec.registration_number}</td>
                      <td className="border border-slate-400 p-1.5 font-semibold text-slate-900">{rec.child_full_name}</td>
                      <td className="border border-slate-400 p-1.5 text-center">{rec.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                      <td className="border border-slate-400 p-1.5">{rec.birth_place}, {rec.birth_date}</td>
                      <td className="border border-slate-400 p-1.5">{rec.previous_school || '-'}</td>
                      <td className="border border-slate-400 p-1.5">{rec.parent_name}</td>
                      <td className="border border-slate-400 p-1.5 font-mono">{rec.whatsapp}</td>
                      <td className="border border-slate-400 p-1.5 font-bold text-center uppercase">
                        {rec.status === 'diterima' ? 'Diterima' :
                         rec.status === 'terverifikasi' ? 'Terverifikasi' :
                         rec.status === 'ditolak' ? 'Ditolak' : 'Menunggu'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Area Pengesahan */}
              <div className="flex justify-end pt-4 text-xs">
                <div className="text-center w-64">
                  <p className="text-slate-600 mb-1">
                    Sidoarjo, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-slate-600 mb-16">Kepala Madrasah {SCHOOL_INFO.name},</p>
                  <p className="font-bold underline decoration-slate-900 text-slate-900 uppercase">
                    {SCHOOL_INFO.principalName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">NIP: 197508122003122001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
