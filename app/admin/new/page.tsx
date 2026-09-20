import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getCategoriesAction } from '@/actions/listing-actions';
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

  const categories = await getCategoriesAction();

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-[#0f172a] py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNewHeader />
        <NewListingForm categories={categories} />
      </div>
    </div>
  );
}
