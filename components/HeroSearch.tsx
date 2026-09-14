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
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-[#fffdfa] to-[#fffdfa] py-8 sm:py-14 border-b border-[#e6e0da]">
      {/* Orqa fon dekoratsiyasi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-12 right-1/4 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Nishon - sindr.uz uslubi */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f3ef] border border-[#e6e0da] text-[#282624] text-xs font-semibold mb-4 shadow-2xs">
          <span className="live-indicator" />
          <span>Sirdaryo viloyati #1 xizmatlar va ustalar bazasi</span>
        </div>

        {/* H1 Sarlavha */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#282624] tracking-tight leading-tight mb-3">
          Guliston va butun Sirdaryo bo'ylab <br className="hidden sm:block" />
          <span className="text-orange-600">
            eng yaxshi ustalarni
          </span>{' '}
          oson toping
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-base text-[#67625d] mb-6 sm:mb-8 leading-relaxed">
          Santexnik, elektrik, yuk tashish, konditsioner va o'nlab boshqa xizmatlar. Vositachisiz to'g'ridan-to'g'ri bog'laning!
        </p>

        {/* Qidiruv Paneli */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-lg shadow-[#282624]/5 border border-[#e6e0da] flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto focus-within:border-orange-500 transition-all"
        >
          {/* Kalit so'z inputi */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#67625d] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qanday xizmat kerak? (masalan, Santexnik)"
              className="w-full pl-10 pr-3 py-2.5 sm:py-2 bg-transparent text-xs sm:text-sm text-[#282624] placeholder:text-[#67625d]/70 focus:outline-none"
            />
          </div>

          <div className="hidden sm:block w-px h-6 bg-[#e6e0da]" />

          {/* Hududni tanlash */}
          <div className="relative w-full sm:w-52 flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-orange-600 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-6 py-2.5 sm:py-2 bg-[#f6f3ef] sm:bg-transparent rounded-xl sm:rounded-none text-xs sm:text-sm font-semibold text-[#282624] focus:outline-none cursor-pointer appearance-none"
            >
              {SIRDARYO_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-[#67625d] text-[10px]">
              ▼
            </div>
          </div>

          {/* Qidirish tugmasi */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2.5 rounded-xl sm:rounded-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Qidirish</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Tezkor teglar */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[11px] font-bold text-[#67625d] uppercase tracking-wider mr-1">
            Mashhur:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-orange-50 text-[#67625d] hover:text-orange-600 border border-[#e6e0da] transition-colors shadow-2xs cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
