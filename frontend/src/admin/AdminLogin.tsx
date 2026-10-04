import React, { useState } from 'react';
import { api, AdminUser } from '../services/api';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onCancel?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@mialahmad.sch.id');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.login(email.trim(), password);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle geometric background grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-md bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-2 border-2 border-emerald-500/30 shadow-lg mb-1">
            <img
              src="/assets/logo-mi-al-ahmad.png"
              alt="Logo MI AL-AHMAD"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Portal Administrator</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">MI AL-AHMAD Krian Sidoarjo</p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@mialahmad.sch.id"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi kredensial...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fills for immediate verification */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 mb-3 text-center">Akun Terdaftar Sistem (Kredensial Pengujian):</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@mialahmad.sch.id', 'admin123')}
              className="text-left px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <span className="font-semibold text-emerald-400">Superadmin:</span> admin@mialahmad.sch.id
              </div>
              <span className="text-[10px] text-slate-400 font-mono">admin123</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('humas@mialahmad.sch.id', 'humas123')}
              className="text-left px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <span className="font-semibold text-amber-400">Admin Humas:</span> humas@mialahmad.sch.id
              </div>
              <span className="text-[10px] text-slate-400 font-mono">humas123</span>
            </button>
          </div>
        </div>

        {onCancel && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Kembali ke Portal Publik
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
