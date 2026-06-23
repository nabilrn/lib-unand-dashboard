import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AtSign, LogIn, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { demoAdminUser } from '../../data/demoData';

export interface Credentials {
  email: string;
  password: string;
}

interface AdminLoginFormProps {
  onSuccess?: (creds: Credentials) => void;
  className?: string;
}

const STORAGE_KEY = 'admin_login_creds';
const TOKEN_STORAGE_KEY = 'admin_token_data';

const createLocalSession = (username: string, keepLoggedIn: boolean) => {
  const token = `local-admin-${Date.now()}`;
  const expiry = Date.now() + (keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000);

  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_username', username || demoAdminUser.username);
  localStorage.setItem('admin_user', JSON.stringify({ ...demoAdminUser, username: username || demoAdminUser.username }));
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({ token, expiry, keepLoggedIn }));
};

const restoreLocalSession = () => {
  try {
    const tokenData = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!tokenData) return false;
    const parsed = JSON.parse(tokenData);
    if (parsed?.token && parsed?.expiry > Date.now()) {
      localStorage.setItem('admin_token', parsed.token);
      return true;
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  return false;
};

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess, className }) => {
  const navigate = useNavigate();
  const [creds, setCreds] = useState<Credentials>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.email) setCreds(c => ({ ...c, email: parsed.email }));
      }
    } catch {}

    if (restoreLocalSession()) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 700);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreds(c => ({ ...c, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const username = creds.email.trim();
      if (!username || creds.password.length < 4) {
        throw new Error('Username dan password wajib diisi.');
      }

      createLocalSession(username, keepLoggedIn);
      setSuccess(true);

      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: username }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      toast.success('Login berhasil. Mengarahkan ke dashboard...');
      onSuccess?.(creds);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 700);
    } catch (err: any) {
      const errorMsg = err.message || 'Login gagal. Periksa username dan password Anda.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className={"flex flex-col gap-7 " + (className || '')}>
        <div className="space-y-1">
          <h2 className="text-[26px] font-black text-emerald-800 tracking-tight leading-tight">Masuk Admin</h2>
          <p className="text-[13px] font-medium text-emerald-700/80">Panel kontrol internal perpustakaan</p>
        </div>

      <div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 flex items-center gap-1"><AtSign className="w-3.5 h-3.5" /> Username</label>
        <div className="relative group">
          <input
            type="text"
            name="email"
            required
            autoComplete="username"
            value={creds.email}
            onChange={handleChange}
            className="peer w-full text-sm font-semibold rounded-xl border border-emerald-600/30 focus:border-emerald-600 px-3.5 py-3 bg-white/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/30 placeholder-emerald-400/70 transition"
            placeholder="administrator"
          />
          <span className="pointer-events-none absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold tracking-wide text-emerald-500 peer-focus:text-emerald-600 transition">Username</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            autoComplete="current-password"
            value={creds.password}
            onChange={handleChange}
            className="peer w-full text-sm font-semibold rounded-xl border border-emerald-600/30 focus:border-emerald-600 px-3.5 py-3 pr-11 bg-white/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/30 placeholder-emerald-400/70 transition"
            placeholder="••••••••"
            minLength={4}
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <span className="pointer-events-none absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold tracking-wide text-emerald-500 peer-focus:text-emerald-600 transition">Password</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-green-600" />
            <span className="text-[11px] font-medium text-gray-700">Ingat username</span>
          </label>
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={keepLoggedIn} onChange={e => setKeepLoggedIn(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          <span className="text-[11px] font-medium text-gray-700">Tetap masuk 30 hari</span>
        </label>
      </div>
      {error && (
  <div className="flex items-start gap-2 text-[11px] font-semibold text-red-600/90 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
  <div className="flex items-start gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
          <CheckCircle2 className="w-4 h-4 mt-0.5" />
          <span>Login berhasil.</span>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
  className="group mt-1 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-emerald-600/30 hover:shadow-lg hover:shadow-emerald-700/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {loading ? 'Memproses…' : 'Masuk'}
      </button>
    </form>
    </>
  );
};

export default AdminLoginForm;
