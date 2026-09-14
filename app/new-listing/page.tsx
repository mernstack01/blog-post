import { getCategoriesAction } from '@/actions/listing-actions';
import NewListingForm from '@/components/NewListingForm';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Yangi e'lon berish - Sirdaryo Xizmatlari",
  description: "Sirdaryo viloyati va Guliston shahrida o'z xizmatlaringiz, mutaxassisligingiz yoki ustaxonangiz haqida bepul e'lon bering.",
};

export default async function NewListingPage() {
  const categories = await getCategoriesAction();

  return (
    <div className="min-h-screen bg-[#fffdfa] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Orqaga qaytish havolasi */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67625d] hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>

        {/* Sarlavha va kirish */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/15 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-orange-100 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Bepul va Cheklovlarsiz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            O'z xizmat yoki e'loningizni joylashtiring
          </h1>
          <p className="text-sm sm:text-base text-orange-100 max-w-2xl leading-relaxed">
            Guliston, Yangiyer, Shirin va Sirdaryoning barcha tumanlaridan minglab mijozlar sizning xizmatingizdan foydalanishi uchun quyidagi formani to'ldiring.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 pt-5 border-t border-white/15 text-xs sm:text-sm text-orange-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Darhol qidiruvda ko'rinadi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Mijozlar to'g'ridan-to'g'ri bog'lanadi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Vositachisiz va komissiyasiz</span>
            </div>
          </div>
        </div>

        {/* Forma */}
        <NewListingForm categories={categories} />

      </div>
    </div>
  );
}
