'use client';

import Link from 'next/link';
import { Home, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-[75vh] bg-[#fffdfa] dark:bg-[#0f172a] flex items-center justify-center px-4 py-16 transition-colors">
      <div className="max-w-lg w-full text-center">
        {/* 404 badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 mb-6 shadow-xs">
          <span className="text-3xl font-black tracking-tighter">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#282624] dark:text-white tracking-tight mb-3">
          {lang === 'ru' ? 'Страница не найдена' : 'Sahifa topilmadi'}
        </h1>

        <p className="text-sm sm:text-base text-[#67625d] dark:text-slate-400 mb-8 leading-relaxed">
          {lang === 'ru'
            ? 'К сожалению, запрашиваемое объявление или страница были перемещены или удалены с сайта.'
            : "Kechirasiz, siz qidirayotgan e'lon yoki sahifa manzili o'zgargan yoki saytdan olib tashlangan bo'lishi mumkin."}
        </p>

        {/* Tezkor tugmalar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>{t.detail.backHome}</span>
          </Link>

          <Link
            href="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#f6f3ef] dark:bg-slate-800 hover:bg-[#ede9e3] dark:hover:bg-slate-700 text-[#282624] dark:text-slate-200 font-semibold text-sm transition-all"
          >
            <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>{t.nav.catalog}</span>
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-[#e6e0da] dark:border-slate-800 text-xs text-[#67625d] dark:text-slate-400">
          {lang === 'ru' ? 'Ищете мастера или услугу по Сырдарьинской области?' : "Sirdaryo viloyati bo'yicha usta yoki xizmat qidiryapsizmi?"}{' '}
          <Link href="/" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
            {lang === 'ru' ? 'Найдите через поиск' : 'Qidiruv orqali toping'}
          </Link>
        </div>
      </div>
    </div>
  );
}
