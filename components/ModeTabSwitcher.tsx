'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, Award, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ModeTabSwitcherProps {
  currentMode: 'all' | 'top10';
  totalCount: number;
}

export default function ModeTabSwitcher({ currentMode, totalCount }: ModeTabSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const handleSwitchMode = (mode: 'all' | 'top10') => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'top10') {
      params.set('mode', 'top10');
    } else {
      params.delete('mode');
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="bg-secondary/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-border dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        
        {/* Asosiy Ikkita Katta Tab (Segmented Control) */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* 1. Umumiy rejimi */}
          <button
            onClick={() => handleSwitchMode('all')}
            type="button"
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation ${
              currentMode === 'all'
                ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-sm shadow-blue-500/25 border border-blue-600 dark:border-blue-500'
                : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent'
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>{t.mode.allTab}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                currentMode === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-background/80 text-foreground border border-border/40'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* 2. Top 10 rejimi */}
          <button
            onClick={() => handleSwitchMode('top10')}
            type="button"
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation ${
              currentMode === 'top10'
                ? 'bg-amber-500 dark:bg-amber-500 text-white shadow-sm shadow-amber-500/25 border border-amber-500 dark:border-amber-400'
                : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent'
            }`}
          >
            <Award className={`w-4 h-4 shrink-0 ${currentMode === 'top10' ? 'text-white fill-white' : 'text-amber-500'}`} />
            <span>{t.mode.top10Tab}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-colors ${
                currentMode === 'top10'
                  ? 'bg-white/25 text-white'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
              }`}
            >
              TOP 10
            </span>
          </button>
        </div>

        {/* Mantiqiy izoh banneri */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl sm:rounded-2xl bg-card border border-border dark:border-white/10 text-muted-foreground text-xs leading-relaxed shadow-2xs">
          {currentMode === 'top10' ? (
            <>
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-foreground">{t.mode.top10Desc}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-foreground">{t.mode.allDesc}</span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

