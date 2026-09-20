import { prisma } from '@/lib/prisma';
import { ListingStatus } from '@prisma/client';
import StatsSectionClient from '@/components/StatsSectionClient';

export default async function StatsSection() {
  let districtsCount = 10;
  let approvedListingsCount = 0;
  let verifiedCount = 0;

  try {
    const [districts, listings, verified] = await Promise.all([
      (prisma as any).district?.count ? (prisma as any).district.count() : Promise.resolve(10),
      prisma.listing.count({ where: { status: ListingStatus.APPROVED } }),
      prisma.listing.count({
        where: {
          status: ListingStatus.APPROVED,
          isVerified: true,
        },
      }),
    ]);
    districtsCount = districts || 10;
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
