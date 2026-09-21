import { isUserAdmin } from '@/lib/admin-auth';
import { getUserAuthSession } from '@/lib/user-auth';
import { redirect } from 'next/navigation';
import { getAdminStatsAction, getAdminListingsAction } from '@/actions/admin-actions';
import { getCategoriesAction } from '@/actions/listing-actions';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Boshqaruv Paneli - Sirdaryo Xizmatlari",
};

export default async function AdminPage() {
  const userSession = await getUserAuthSession();
  if (userSession && userSession.role !== 'ADMIN') {
    redirect('/');
  }

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
  let categories: any[] = [];

  try {
    const [fetchedStats, rawListings, rawCategories] = await Promise.all([
      getAdminStatsAction(),
      getAdminListingsAction(),
      getCategoriesAction(),
    ]);
    stats = fetchedStats;
    listings = JSON.parse(JSON.stringify(rawListings));
    categories = JSON.parse(JSON.stringify(rawCategories));
  } catch (err) {
    console.error('AdminPage error fetching data:', err);
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-zinc-950 pt-6 pb-28 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminDashboardClient stats={stats} initialListings={listings} categories={categories} />
      </div>
    </div>
  );
}
