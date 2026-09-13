'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Search, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { SIRDARYO_LOCATIONS, POPULAR_SEARCH_TAGS } from '@/lib/constants';

interface HeroSearchProps {
  initialQuery?: string;
  initialLocation?: string;
}

export default function HeroSearch({ initialQuery = '', initialLocation = '' }: HeroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '');
  const [location, setLocation] = useState(initialLocation || searchParams.get('location') || 'Barcha hududlar');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (query.trim()) params.set('q', query.trim());
    if (location && location !== 'Barcha hududlar') params.set('location', location);
    
    // Agar oldingi category tanlangan bo'lsa, uni saqlab qolish
    const cat = searchParams.get('category');
    if (cat && cat !== 'all') params.set('category', cat);

    router.push(`/?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', tag);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-50 to-white py-12 sm:py-16 lg:py-20 border-b border-slate-200/60">
      {/* Orqa fon dekoratsiyasi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute top-12 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Nishon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-medium mb-6 shadow-xs animate-in fade-in zoom-in duration-500">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Sirdaryo viloyati bo'yicha #1 xizmatlar va ustalar bazasi</span>
        </div>

        {/* H1 Sarlavha */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4">
          Guliston va butun Sirdaryo bo'ylab <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            eng yaxshi ustalarni
          </span>{' '}
          oson toping
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed">
          Santexnika, elektr montaj, yuk tashish, avto sozlash va o'nlab maishiy xizmatlar. Vositachilarsiz, to'g'ridan-to'g'ri mutaxassis bilan bog'laning!
        </p>

        {/* Qidiruv Paneli */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2.5 max-w-4xl mx-auto transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
        >
          {/* Kalit so'z inputi */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qanday usta yoki xizmat qidiryapsiz? (masalan, Santexnik)"
              className="w-full pl-11 pr-4 py-3 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* Hududni tanlash */}
          <div className="relative w-full sm:w-60 flex items-center">
            <MapPin className="absolute left-3.5 w-5 h-5 text-blue-500 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none text-sm font-medium text-slate-800 focus:outline-none cursor-pointer appearance-none"
            >
              {SIRDARYO_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Qidirish tugmasi */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Qidirish</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Tezkor teglar */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Mashhur:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
