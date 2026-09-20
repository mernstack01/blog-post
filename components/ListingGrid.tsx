'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ListingWithRelations } from '@/actions/listing-actions';
import ListingCard from '@/components/ListingCard';
import { SlidersHorizontal, SearchX, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ListingGridProps {
  listings: ListingWithRelations[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const currentSort = searchParams.get('sortBy') || 'popular';
  const isTop10 = searchParams.get('mode') === 'top10';

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 pb-12">
      
      {/* Sarlavha va Saralash Paneli */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#282624] dark:text-white tracking-tight flex items-center gap-2">
              {isTop10 ? (
                <>
                  <span>{t.grid.titleTop10}</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                    TOP 10
                  </span>
                </>
              ) : (
                <>
                  <span>{t.grid.titleAll}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                    {listings.length} {t.grid.countUnit}
                  </span>
                </>
              )}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isTop10 ? t.grid.descTop10 : t.grid.descAll}
          </p>
        </div>

        {/* Saralash (Top 10 rejimida avtomatik reyting bo'yicha) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isTop10 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>{t.grid.sortedByScore}</span>
            </div>
          ) : (
            <>
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                {t.grid.sortLabel}
              </span>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="popular">{t.grid.sortPopular}</option>
                <option value="rating">{t.grid.sortRating}</option>
                <option value="newest">{t.grid.sortNewest}</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Agar e'lonlar bo'lsa Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        /* Topilmadi holati */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t.grid.notFoundTitle}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {t.grid.notFoundDesc}
          </p>
          <button
            onClick={handleResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.grid.resetFilters}</span>
          </button>
        </div>
      )}

    </section>
  );
}

