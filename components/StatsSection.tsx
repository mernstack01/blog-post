import { prisma } from '@/lib/prisma';
import { ListingStatus } from '@prisma/client';
import StatsSectionClient from '@/components/StatsSectionClient';

export default async function StatsSection() {
  let districtsCount: number | null = null;
  let approvedListingsCount: number | null = null;
  let verifiedCount: number | null = null;

  try {
    const [districts, listings, verified] = await Promise.all([
      prisma.district.count(),
      prisma.listing.count({ where: { status: ListingStatus.APPROVED } }),
      prisma.listing.count({
        where: {
          status: ListingStatus.APPROVED,
          isVerified: true,
        },
      }),
    ]);
    districtsCount = districts;
    approvedListingsCount = listings;
    verifiedCount = verified;
  } catch (error) {
    console.error('StatsSection count error:', error);
  }

  return (
    <StatsSectionClient
      districtsCount={districtsCount}
      approvedListingsCount={approvedListingsCount}
      verifiedCount={verifiedCount}
    />
  );
}
