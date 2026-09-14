'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#fffdfa] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Kutilmagan xatolik yuz berdi
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Sahifani yuklashda xatolik ro'y berdi. Iltimos, sahifani yangilang yoki bir necha soniyadan so'ng qayta urinib ko'ring.
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
            Sahifani yangilash
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  );
}
