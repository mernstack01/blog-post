import { getCategoriesAction } from '@/actions/listing-actions';
import Link from 'next/link';
import {
  Wrench,
  Car,
  Tv,
  Hammer,
  Sparkles,
  GraduationCap,
  LayoutGrid,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Xizmatlar katalogi - Sirdaryo Xizmatlari",
  description: "Sirdaryo viloyati bo'yicha barcha xizmatlar, sohalar va ustalar toifalari ro'yxati.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesAction();

  const getIcon = (iconName: string | null) => {
    const className = "w-7 h-7 text-blue-600";
    switch (iconName) {
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Tv':
        return <Tv className={className} />;
      case 'Hammer':
        return <Hammer className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      default:
        return <LayoutGrid className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Orqaga havola */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>

        {/* Sahifa sarlavhasi */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Barcha xizmatlar va yo'nalishlar
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            O'zingizga kerakli sohani tanlang va Sirdaryo hamda Gulistonning eng yaxshi mutaxassislari bilan bog'laning
          </p>
        </div>

        {/* Kategoriyalar Gridi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 p-6 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Kategoriya sarlavhasi va Ikonka */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    {getIcon(cat.icon)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {cat._count.listings} ta e'lon
                  </span>
                </div>

                <Link
                  href={`/?category=${cat.slug}`}
                  className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors block mb-1.5"
                >
                  {cat.name}
                </Link>

                <p className="text-xs sm:text-sm text-slate-500 mb-4 line-clamp-2">
                  {cat.description || "Ushbu yo'nalish bo'yicha barcha ustalar va xizmatlar"}
                </p>

                {/* Sub-kategoriyalar */}
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    {cat.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/?category=${cat.slug}&subCategory=${sub.slug}`}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-colors group"
                      >
                        <span className="group-hover:text-blue-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors" />
                          {sub.name}
                        </span>
                        <span className="text-[11px] text-slate-400 group-hover:text-blue-500">
                          {sub._count.listings} ta
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Barchasini ko'rish havolasi */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={`/?category=${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Bo'limdagi barcha ustalarni ko'rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
