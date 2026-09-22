'use client';

import Link from 'next/link';
import { Home, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-[75vh] bg-background text-foreground flex items-center justify-center px-4 py-16 transition-colors">
      <div className="max-w-lg w-full text-center">
        {/* 404 badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary mb-6 shadow-xs">
          <span className="text-3xl font-black tracking-tighter">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3">
          {lang === 'ru' ? 'Страница не найдена' : 'Sahifa topilmadi'}
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">
          {lang === 'ru'
            ? 'К сожалению, запрашиваемое объявление или страница были перемещены или удалены с сайта.'
            : "Kechirasiz, siz qidirayotgan e'lon yoki sahifa manzili o'zgargan yoki saytdan olib tashlangan bo'lishi mumkin."}
        </p>

        {/* Tezkor tugmalar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95 shrink-0"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>{t.detail.backHome}</span>
          </Link>

          <Link
            href="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-muted text-secondary-foreground font-semibold text-sm border border-border transition-all shrink-0"
          >
            <Layers className="w-4 h-4 text-primary shrink-0" />
            <span>{t.nav.catalog}</span>
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-xs text-muted-foreground">
          {lang === 'ru' ? 'Ищете мастера или услугу по Сырдарьинской области?' : "Sirdaryo viloyati bo'yicha usta yoki xizmat qidiryapsizmi?"}{' '}
          <Link href="/" className="text-primary font-bold hover:underline">
            {lang === 'ru' ? 'Найдите через поиск' : 'Qidiruv orqali toping'}
          </Link>
        </div>
      </div>
    </div>
  );
}
