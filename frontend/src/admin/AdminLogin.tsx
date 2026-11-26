import React, { useState, useEffect, useRef } from 'react';
import { api, AdminUser, resolveImageUrl } from '../services/api';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, RefreshCw, KeyRound, Clock } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onCancel?: () => void;
}

const ROTATION_SECONDS = 60;

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaKey, setCaptchaKey] = useState<string>('');
  const [captchaSvg, setCaptchaSvg] = useState<string>('');
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(ROTATION_SECONDS);
  const captchaInputRef = useRef<HTMLInputElement>(null);

  const fetchCaptcha = async (isAutoRotate = false) => {
    try {
      setIsLoadingCaptcha(true);
      const res = await api.getCaptcha();
      setCaptchaKey(res.key);
      setCaptchaSvg(res.svg);
      setCaptchaCode('');
      setTimeLeft(ROTATION_SECONDS);
      if (isAutoRotate) {
        setError('Kode captcha telah diperbarui otomatis demi keamanan.');
      }
    } catch {
      setError('Gagal memuat kode keamanan captcha. Silakan muat ulang halaman.');
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // Auto-rotate countdown timer
  useEffect(() => {
    if (isLoadingCaptcha || !captchaKey) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchCaptcha(true);
          return ROTATION_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [captchaKey, isLoadingCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = captchaCode.trim().toUpperCase();

    if (!cleanCode || cleanCode.length !== 5) {
      setError('Masukkan 5 karakter kode captcha yang terlihat pada gambar.');
      captchaInputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.login(email.trim(), password, captchaKey, cleanCode);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa email, kata sandi, dan kode captcha.');
      // Always rotate captcha immediately on failure to prevent stale submissions
      fetchCaptcha(false);
      captchaInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
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
              src={resolveImageUrl('/storage/school/logo-mi-al-ahmad.png')}
              alt="Logo MI AL-AHMAD"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Portal Administrator</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">MI AL-AHMAD Krian Sidoarjo</p>
          </div>
        </div>

        {/* Error / Alert notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="admin@mialahmad.sch.id"
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

          {/* Captcha Security Field with auto-rotation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Kode Keamanan
                </label>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{timeLeft}s</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => fetchCaptcha(false)}
                disabled={isLoadingCaptcha}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Ganti kode captcha secara manual"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingCaptcha ? 'animate-spin' : ''}`} />
                <span>Ganti Gambar</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-1">
              <div className="h-12 w-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {isLoadingCaptcha ? (
                  <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                ) : captchaSvg ? (
                  <img src={captchaSvg} alt="Kode Captcha" className="h-full w-full object-contain select-none" />
                ) : (
                  <span className="text-xs text-slate-500">Captcha tidak tersedia</span>
                )}
              </div>
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={captchaInputRef}
                  type="text"
                  required
                  maxLength={5}
                  value={captchaCode}
                  onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
                  placeholder="5 Karakter"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase transition-colors"
                />
              </div>
            </div>

            {/* Rotation countdown progress bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden mt-1.5">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(timeLeft / ROTATION_SECONDS) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Masukkan huruf & angka sesuai gambar di samping</span>
              <span>Rotasi otomatis {timeLeft}d</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !captchaKey}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer mt-2"
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

        {onCancel && (
          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              &larr; Kembali ke Beranda Sekolah
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
