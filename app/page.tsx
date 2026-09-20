import { Suspense } from 'react';
import { getListings, getCategoriesAction } from '@/actions/listing-actions';
import HeroSearch from '@/components/HeroSearch';
import CategoryBar from '@/components/CategoryBar';
import LocationPills from '@/components/LocationPills';
import ListingGrid from '@/components/ListingGrid';
import StatsSection from '@/components/StatsSection';

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
    subCategory?: string;
    sortBy?: 'popular' | 'newest' | 'rating';
    mode?: 'all' | 'top10';
  }>;
}

import ModeTabSwitcher from '@/components/ModeTabSwitcher';

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const currentMode = resolvedSearchParams.mode === 'top10' ? 'top10' : 'all';

  // Parallel data fetching
  const [listings, categories] = await Promise.all([
    getListings(resolvedSearchParams),
    getCategoriesAction(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Qidiruv Bloki */}
      <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse" />}>
        <HeroSearch
          initialQuery={resolvedSearchParams.q}
          initialLocation={resolvedSearchParams.location}
        />
      </Suspense>

      {/* 2. Gorizontal Kategoriyalar va Sub-kategoriyalar */}
      <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
        <CategoryBar categories={categories} />
      </Suspense>

      {/* 3. Sirdaryo Tumanlari Filtr Piltalari */}
      <Suspense fallback={<div className="h-12 bg-slate-50" />}>
        <LocationPills />
      </Suspense>

      {/* 4. Rejim Tanlash: Umumiy vs Top 10 Reyting */}
      <Suspense fallback={<div className="h-14 bg-white" />}>
        <ModeTabSwitcher currentMode={currentMode} totalCount={listings.length} />
      </Suspense>

      {/* 5. Asosiy E'lonlar Gridi */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-96 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl animate-pulse my-6" />}>
        <ListingGrid listings={listings} />
      </Suspense>

      {/* 6. Ishonch va Statistika Bo'limi */}
      <Suspense fallback={null}>
        <StatsSection />
      </Suspense>
    </div>
  );
}
