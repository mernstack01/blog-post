import { Suspense } from 'react';
import { getListingById, getListings } from '@/actions/listing-actions';
import ListingDetailClient from '@/components/ListingDetailClient';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return {
      title: "E'lon topilmadi - Sirdaryo Xizmatlari",
    };
  }

  return {
    title: `${listing.title} - ${listing.name} (${listing.location})`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.images.length > 0 ? [listing.images[0]] : [],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // O'xshash e'lonlar (shu kategoriya bo'yicha boshqa e'lonlar)
  const relatedListings = (
    await getListings({
      category: listing.category.slug,
    })
  )
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigatsiya va Orqaga */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Barcha xizmatlarga qaytish</span>
          </Link>

          <span className="text-xs text-slate-400">
            {listing.category.name} / {listing.location}
          </span>
        </div>

        {/* E'lon tafsilotlari (Client komponent) */}
        <Suspense fallback={<div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />}>
          <ListingDetailClient listing={listing} />
        </Suspense>

        {/* O'xshash xizmatlar tavsiyasi */}
        {relatedListings.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>O'xshash boshqa xizmatlar</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  "{listing.category.name}" toifasidagi boshqa takliflar
                </p>
              </div>

              <Link
                href={`/?category=${listing.category.slug}`}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
              >
                Barchasini ko'rish →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedListings.map((rel) => (
                <ListingCard key={rel.id} listing={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
