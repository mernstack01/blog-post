'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#fffdfa] dark:bg-[#0f172a] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {lang === 'ru' ? 'Произошла непредвиденная ошибка' : 'Kutilmagan xatolik yuz berdi'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {lang === 'ru'
            ? 'При загрузке страницы произошла ошибка. Пожалуйста, обновите страницу или повторите попытку через несколько секунд.'
            : "Sahifani yuklashda xatolik ro'y berdi. Iltimos, sahifani yangilang yoki bir necha soniyadan so'ng qayta urinib ko'ring."}
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg mb-6 break-all">
            {lang === 'ru' ? 'Код ошибки' : 'Xatolik kodi'}: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Обновить страницу' : 'Sahifani yangilash'}</span>
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>{t.detail.backHome}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
