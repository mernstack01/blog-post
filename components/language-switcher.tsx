'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { UzbekFlagIcon, RussianFlagIcon } from '@/components/icons/FlagIcons';
import { Language } from '@/lib/translations';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const handleSelectLanguage = (newLang: Language) => {
    if (newLang === lang) return;
    setLanguage(newLang);
    startTransition(() => {
      try {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('lang', newLang);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        router.refresh();
      } catch (err) {
        console.error('LanguageSwitcher error:', err);
      }
    });
  };

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-2xl bg-secondary border border-border shadow-2xs shrink-0 transition-opacity ${className} ${
        isPending ? 'opacity-70 pointer-events-none' : ''
      }`}
      role="group"
      aria-label="Tilni tanlash / Выбор языка"
    >
      <button
        type="button"
        onClick={() => handleSelectLanguage('uz')}
        disabled={isPending}
        className={`flex items-center justify-center min-h-10 min-w-11 gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
          lang === 'uz'
            ? 'bg-card text-primary shadow-xs ring-1 ring-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="O'zbek tili"
      >
        <UzbekFlagIcon className="w-3.5 h-3.5 rounded-full shadow-2xs shrink-0" />
        <span>UZ</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelectLanguage('ru')}
        disabled={isPending}
        className={`flex items-center justify-center min-h-10 min-w-11 gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
          lang === 'ru'
            ? 'bg-card text-primary shadow-xs ring-1 ring-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Русский язык"
      >
        <RussianFlagIcon className="w-3.5 h-3.5 rounded-full shadow-2xs shrink-0" />
        <span>RU</span>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
