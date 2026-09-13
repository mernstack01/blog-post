'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ListingWithRelations } from '@/actions/listing-actions';
import ListingCard from '@/components/ListingCard';
import { SlidersHorizontal, SearchX, RotateCcw } from 'lucide-react';

interface ListingGridProps {
  listings: ListingWithRelations[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sortBy') || 'popular';

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Sarlavha va Saralash Paneli */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sirdaryo ustalari va xizmatlari</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {listings.length} ta
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Reytingi yuqori va tekshirilgan mahalliy mutaxassislar ro'yxati
          </p>
        </div>

        {/* Saralash */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Saralash:
          </span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          >
            <option value="popular">Eng ommabop (Ko'rishlar)</option>
            <option value="rating">Yuqori reyting (5.0 ★)</option>
            <option value="newest">Eng yangi e'lonlar</option>
          </select>
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
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Hech qanday e'lon topilmadi
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Tanlangan mezonlar yoki qidiruv so'zi bo'yicha hech qanday xizmat topilmadi. Qidiruvni o'zgartirib ko'ring yoki barcha e'lonlarni ko'ring.
          </p>
          <button
            onClick={handleResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Filtrlarni tozalash</span>
          </button>
        </div>
      )}

    </section>
  );
}
