import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getAdminStatsAction, getAdminListingsAction } from '@/actions/admin-actions';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Boshqaruv Paneli - Sirdaryo Xizmatlari",
};

export default async function AdminPage() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  let stats = {
    totalListings: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    totalViews: 0,
  };
  let listings: any[] = [];

  try {
    const [fetchedStats, rawListings] = await Promise.all([
      getAdminStatsAction(),
      getAdminListingsAction(),
    ]);
    stats = fetchedStats;
    listings = JSON.parse(JSON.stringify(rawListings));
  } catch (err) {
    console.error('AdminPage error fetching data:', err);
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-zinc-950 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminDashboardClient stats={stats} initialListings={listings} />
      </div>
    </div>
  );
}
