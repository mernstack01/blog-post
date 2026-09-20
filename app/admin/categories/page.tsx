import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getCategoriesAdminAction, CategoryAdminItem } from '@/actions/category-actions';
import AdminCategoriesClient from '@/components/AdminCategoriesClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Kategoriyalar Boshqaruvi - Admin Panel",
};

export default async function AdminCategoriesPage() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  let categories: CategoryAdminItem[] = [];
  try {
    categories = await getCategoriesAdminAction();
  } catch (error) {
    console.error('AdminCategoriesPage fetch error:', error);
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-zinc-950 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminCategoriesClient initialCategories={categories} />
      </div>
    </div>
  );
}
