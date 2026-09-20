import { getUserListingsAction } from '@/actions/listing-actions';
import MyListingsClient from '@/components/MyListingsClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Mening e'lonlarim - Sirdaryo Xizmatlari",
  description: "Siz joylashtirgan e'lonlar, ularning tasdiqlanish holati va statistikasi.",
};

export default async function MyListingsPage() {
  const result = await getUserListingsAction();

  const listings = result.success && result.listings ? JSON.parse(JSON.stringify(result.listings)) : [];
  const userStats = result.success && result.user ? result.user : null;
  const isAuthenticated = Boolean(userStats);

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-[#0f172a] transition-colors">
      <MyListingsClient
        initialListings={listings}
        userStats={userStats}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
