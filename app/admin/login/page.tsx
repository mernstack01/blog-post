import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Kirish - Sirdaryo Xizmatlari",
};

export default async function AdminLoginPage() {
  const isAdmin = await isUserAdmin();
  if (isAdmin) {
    redirect('/admin');
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#67625d] hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>

      <AdminLoginForm />
    </div>
  );
}
