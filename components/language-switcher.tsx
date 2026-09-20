'use client';

import * as React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { UzbekFlagIcon, RussianFlagIcon } from '@/components/icons/FlagIcons';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-2xl bg-[#f6f3ef] dark:bg-[#2a2724] border border-[#e6e0da] dark:border-[#3d3835] shadow-2xs ${className}`}
      role="group"
      aria-label="Tilni tanlash / Выбор языка"
    >
      <button
        type="button"
        onClick={() => setLanguage('uz')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation ${
          lang === 'uz'
            ? 'bg-white dark:bg-[#383430] text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
            : 'text-[#67625d] dark:text-[#a8a29e] hover:text-[#282624] dark:hover:text-white'
        }`}
        title="O'zbek tili"
      >
        <UzbekFlagIcon className="w-3.5 h-3.5 rounded-full shadow-2xs shrink-0" />
        <span>UZ</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ru')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation ${
          lang === 'ru'
            ? 'bg-white dark:bg-[#383430] text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
            : 'text-[#67625d] dark:text-[#a8a29e] hover:text-[#282624] dark:hover:text-white'
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
