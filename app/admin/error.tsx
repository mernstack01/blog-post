'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#fffdfa] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Admin panelda xatolik yuz berdi
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Ma'lumotlar bazasiga ulanishda yoki sahifani yuklashda vaqtinchalik muammo bo'ldi. Iltimos, qayta urinib ko'ring yoki server sozlamalarini tekshiring.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-slate-400 bg-slate-50 p-2 rounded-lg mb-6 break-all">
            Xatolik kodi: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <RefreshCw className="w-4 h-4" />
            Qayta urinish
          </button>
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
          >
            Kirish sahifasi
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  );
}
