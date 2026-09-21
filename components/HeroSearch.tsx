'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Search, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { SIRDARYO_LOCATIONS, POPULAR_SEARCH_TAGS_MAP } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSearchProps {
  initialQuery?: string;
  initialLocation?: string;
}

export default function HeroSearch({ initialQuery = '', initialLocation = '' }: HeroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  
  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '');
  const [location, setLocation] = useState(initialLocation || searchParams.get('location') || 'Barcha hududlar');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }

    if (location && location !== 'Barcha hududlar') {
      params.set('location', location);
    } else {
      params.delete('location');
    }

    router.push(`/?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', tag);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-background to-background dark:from-slate-900/50 dark:via-background dark:to-background py-8 sm:py-14 border-b border-border dark:border-white/10 transition-colors">
      {/* Orqa fon dekoratsiyasi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 left-1/4 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-12 right-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Nishon */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border dark:border-white/10 text-foreground text-xs font-semibold mb-4 shadow-2xs">
          <span className="live-indicator" />
          <span>{t.hero.title1} {t.hero.titleHighlight}</span>
        </div>

        {/* H1 Sarlavha */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-3">
          {t.hero.title1} <br className="hidden sm:block" />
          <span className="text-blue-600 dark:text-blue-400">
            {t.hero.titleHighlight}
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* Qidiruv Paneli */}
        <form
          onSubmit={handleSubmit}
          className="bg-card text-card-foreground p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-lg shadow-slate-900/5 border border-border dark:border-white/15 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
          {/* Kalit so'z inputi */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2.5 sm:py-2 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="hidden sm:block w-px h-6 bg-border dark:bg-white/10" />

          {/* Hududni tanlash */}
          <div className="relative w-full sm:w-52 flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-blue-600 dark:text-blue-400 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-6 py-2.5 sm:py-2 bg-secondary sm:bg-transparent rounded-xl sm:rounded-none text-xs sm:text-sm font-semibold text-foreground focus:outline-none cursor-pointer appearance-none"
            >
              <option value="Barcha hududlar">{t.locations.all}</option>
              {SIRDARYO_LOCATIONS.filter(l => l !== 'Barcha hududlar').map((loc) => (
                <option key={loc} value={loc}>
                  {(t.locations as any)[loc] || loc}
                </option>
              ))}
            </select>
          </div>

          {/* Qidirish tugmasi */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{t.hero.searchBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Ommabop qidiruv teglari */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-foreground font-bold">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {t.hero.popularSearch}
          </span>
          {POPULAR_SEARCH_TAGS_MAP.map((tagItem) => {
            const tagLabel = tagItem[lang] || tagItem.uz;
            return (
              <button
                key={tagItem.uz}
                onClick={() => handleTagClick(tagLabel)}
                type="button"
                className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border dark:border-white/10 hover:bg-muted hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 text-xs font-medium transition-colors cursor-pointer"
              >
                {tagLabel}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
