'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/actions/admin-actions';
import { ShieldCheck, KeyRound, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginForm() {
  const [pin, setPin] = useState('');
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
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl border border-[#e6e0da] p-6 sm:p-8 shadow-xl shadow-black/5">
      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100">
        <ShieldCheck className="w-6 h-6" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-extrabold text-[#282624]">
          Admin Panelga Kirish
        </h1>
        <p className="text-xs text-[#67625d] mt-1">
          Sirdaryo Xizmat platformasini boshqarish uchun PIN-kodni kiriting
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#282624] mb-1.5">
            Admin Maxfiy PIN-kod
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[#67625d] pointer-events-none" />
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masalan: sirdaryo2025"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              autoFocus
            />
          </div>
          <span className="text-[11px] text-[#67625d] block mt-1">
            Standart PIN-kod: <strong className="text-orange-600">sirdaryo2025</strong>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Kirish</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
