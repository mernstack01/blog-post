import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getAdminRegionsAction, RegionAdminItem } from '@/actions/region-actions';
import AdminRegionsClient from '@/components/AdminRegionsClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Hududlar Boshqaruvi (Viloyat va Tumanlar) - Admin Panel",
};

export default async function AdminRegionsPage() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  let regions: RegionAdminItem[] = [];
  try {
    regions = await getAdminRegionsAction();
  } catch (error) {
    console.error('AdminRegionsPage fetch error:', error);
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-zinc-950 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminRegionsClient initialRegions={regions} />
      </div>
    </div>
  );
}
