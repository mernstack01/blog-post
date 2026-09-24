import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getCategoriesAction } from '@/actions/listing-actions';
import { getRegionsWithDistrictsAction } from '@/actions/region-actions';
import NewListingForm from '@/components/NewListingForm';
import AdminNewHeader from '@/components/AdminNewHeader';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin: Yangi Post Yaratish - Sirdaryo Xizmatlari",
};

export default async function AdminNewListingPage() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  const [categories, regions] = await Promise.all([
    getCategoriesAction(),
    getRegionsWithDistrictsAction(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNewHeader />
        <NewListingForm categories={categories as any} regions={regions as any} />
      </div>
    </div>
  );
}
