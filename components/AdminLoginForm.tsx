'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/actions/admin-actions';
import { ShieldCheck, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLoginForm() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError('Iltimos, PIN-kodni kiriting');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLoginAction(pin);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.message || "Noto'g'ri kod");
      }
    } catch (err: any) {
      setError(err?.message || "Kutilmagan xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 p-6 sm:p-8 shadow-xl shadow-black/5">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-900/50 shadow-xs">
        <ShieldCheck className="w-6 h-6" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-extrabold text-[#282624] dark:text-zinc-100 tracking-tight">
          Admin Panelga Kirish
        </h1>
        <p className="text-xs text-[#67625d] dark:text-zinc-400 mt-1.5 leading-relaxed">
          Sirdaryo Xizmat platformasi ma'muriyati uchun xavfsiz boshqaruv tizimi
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#282624] dark:text-zinc-200 mb-1.5">
            Admin Maxfiy PIN-kod
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[#67625d] dark:text-zinc-400 pointer-events-none" />
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 text-sm text-[#282624] dark:text-zinc-100 bg-white dark:bg-zinc-800 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono tracking-wider"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-2.5 text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 p-0.5 rounded-md transition-colors"
              title={showPin ? "Yashirish" : "Ko'rsatish"}
              tabIndex={-1}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Tizimga kirish</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#67625d]">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Shifrlangan himoyalangan sessiya</span>
        </div>
      </form>
    </div>
  );
}
