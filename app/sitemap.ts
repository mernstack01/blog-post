import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { ListingStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blog-post-iota-three.vercel.app';
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // 1. Statik asosiy sahifalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${cleanBaseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${cleanBaseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${cleanBaseUrl}/new-listing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // 2. Kategoriyalar bo'yicha marshrutlar
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${cleanBaseUrl}/?category=${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 3. Faol va tasdiqlangan e'lonlar bo'yicha marshrutlar
    const listings = await prisma.listing.findMany({
      where: { status: ListingStatus.APPROVED },
      select: { id: true, updatedAt: true },
    });

    const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
      url: `${cleanBaseUrl}/listing/${l.id}`,
      lastModified: l.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
  } catch (error) {
    console.error('sitemap generation error:', error);
    return staticRoutes;
  }
}
