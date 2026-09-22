'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminNewHeader() {
  const { t } = useLanguage();

  return (
    <>
      {/* Orqaga qaytish */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{t.admin.backToAdmin}</span>
        </Link>

        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.admin.adminMode}</span>
        </span>
      </div>

      {/* Sarlavha */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.admin.quickPostBadge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t.admin.addNewPostTitle}
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
          {t.admin.addNewPostSubtitle}
        </p>
      </div>
    </>
  );
}
