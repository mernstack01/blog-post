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
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;

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

      {/* 4. Asosiy E'lonlar Gridi */}
      <ListingGrid listings={listings} />

      {/* 5. Ishonch va Statistika Bo'limi */}
      <StatsSection />
    </div>
  );
}
