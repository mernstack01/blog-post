import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { getCategoriesAction } from '@/actions/listing-actions';
import NewListingForm from '@/components/NewListingForm';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

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
    <div className="min-h-screen bg-[#fffdfa] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Orqaga qaytish */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67625d] hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin panelga qaytish</span>
          </Link>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Admin Rejimi (Avto-tasdiqlash faol)
          </span>
        </div>

        {/* Sarlavha */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-orange-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin Tezkor Post Yaratish</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Yangi Usta yoki Xizmat Postini Qo'shish
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            Siz admin sifatida yaratgan ushbu post darhol tasdiqlanadi va Sirdaryo ahli uchun asosiy sahifada eng yuqori o'rinda ko'rinadi.
          </p>
        </div>

        {/* Forma */}
        <NewListingForm categories={categories} />

      </div>
    </div>
  );
}
