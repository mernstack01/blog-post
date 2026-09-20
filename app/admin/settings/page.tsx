import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getSystemSettingsAction } from '@/actions/settings-actions';
import AdminSettingsClient from '@/components/AdminSettingsClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Tizim Sozlamalari - Admin Panel",
};

export default async function AdminSettingsPage() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  const settings = await getSystemSettingsAction();

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-zinc-950 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminSettingsClient initialSettings={settings} />
      </div>
    </div>
  );
}
