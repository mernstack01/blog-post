'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NewListingHeader() {
  const { lang, t } = useLanguage();

  return (
    <div key={lang}>
      {/* Orqaga qaytish havolasi */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{t.detail.backHome}</span>
        </Link>
      </div>

      {/* Sarlavha va kirish */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/20 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'ru' ? "100% Бесплатно и Без ограничений" : "100% Bepul va Cheklovlarsiz"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {lang === 'ru' ? "Разместите свою услугу или объявление" : "O'z xizmat yoki e'loningizni joylashtiring"}
        </h1>
        <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
          {lang === 'ru'
            ? "Заполните форму ниже, чтобы тысячи клиентов из Гулистана, Янгиера, Ширина и всех районов Сырдарьи смогли найти ваши услуги."
            : "Guliston, Yangiyer, Shirin va Sirdaryoning barcha tumanlaridan minglab mijozlar sizning xizmatingizdan foydalanishi uchun quyidagi formani to'ldiring."}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 pt-5 border-t border-white/15 text-xs sm:text-sm text-blue-100">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ru' ? "Мгновенно появляется в поиске" : "Darhol qidiruvda ko'rinadi"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ru' ? "Клиенты связываются напрямую" : "Mijozlar to'g'ridan-to'g'ri bog'lanadi"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ru' ? "Без посредников и комиссий" : "Vositachisiz va komissiyasiz"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
