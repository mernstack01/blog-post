import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getAdminStatsAction, getAdminListingsAction } from '@/actions/admin-actions';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Boshqaruv Paneli - Sirdaryo Xizmatlari",
};

export default async function AdminPage() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  const [stats, rawListings] = await Promise.all([
    getAdminStatsAction(),
    getAdminListingsAction(),
  ]);

  const listings = JSON.parse(JSON.stringify(rawListings));

  return (
    <div className="min-h-screen bg-[#fffdfa] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminDashboardClient stats={stats} initialListings={listings} />
      </div>
    </div>
  );
}
