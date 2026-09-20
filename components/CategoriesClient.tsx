'use client';

import Link from 'next/link';
import {
  Wrench,
  Car,
  Tv,
  Hammer,
  Sparkles,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Scissors,
  Heart,
  ShoppingBag,
  Utensils,
  Laptop,
  Camera,
  Home,
  Layers,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  getCategoryLocalizedName,
  getCategoryLocalizedDesc,
  getSubCategoryLocalizedName,
} from '@/lib/translations';

interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
  _count: {
    listings: number;
  };
}

export interface CategoryWithSubs {
  id: string;
  name: string;
  nameUz?: string | null;
  nameRu?: string | null;
  slug: string;
  icon: string | null;
  description?: string | null;
  _count: {
    listings: number;
  };
  subCategories?: SubCategoryItem[];
}

interface CategoriesClientProps {
  categories: CategoryWithSubs[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const { lang, t } = useLanguage();

  const getIcon = (iconName: string | null) => {
    const className = "w-7 h-7 text-blue-600 dark:text-blue-400";
    switch (iconName?.toLowerCase()) {
      case 'wrench':
        return <Wrench className={className} />;
      case 'car':
        return <Car className={className} />;
      case 'tv':
        return <Tv className={className} />;
      case 'hammer':
        return <Hammer className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'graduationcap':
        return <GraduationCap className={className} />;
      case 'scissors':
        return <Scissors className={className} />;
      case 'heart':
        return <Heart className={className} />;
      case 'shoppingbag':
        return <ShoppingBag className={className} />;
      case 'utensils':
        return <Utensils className={className} />;
      case 'laptop':
        return <Laptop className={className} />;
      case 'camera':
        return <Camera className={className} />;
      case 'home':
        return <Home className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const getCatName = (cat: CategoryWithSubs) => {
    if (lang === 'ru') {
      return cat.nameRu || getCategoryLocalizedName(cat.slug, 'ru') || cat.name;
    }
    return cat.nameUz || getCategoryLocalizedName(cat.slug, 'uz') || cat.name;
  };

  const getCatDesc = (cat: CategoryWithSubs) => {
    return getCategoryLocalizedDesc(cat.slug, cat.description, lang);
  };

  const getSubName = (sub: SubCategoryItem) => {
    return getSubCategoryLocalizedName(sub.slug, lang) || sub.name;
  };

  return (
    <div key={lang} className="min-h-screen bg-[#fffdfa] dark:bg-[#0f172a] py-10 sm:py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Orqaga havola */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67625d] dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.catalogPage.backHome}</span>
          </Link>
        </div>

        {/* Sahifa sarlavhasi */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#282624] dark:text-white tracking-tight mb-3">
            {t.catalogPage.title}
          </h1>
          <p className="text-sm sm:text-base text-[#67625d] dark:text-slate-400">
            {t.catalogPage.subtitle}
          </p>
        </div>

        {/* Kategoriyalar Gridi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catName = getCatName(cat);
            const catDesc = getCatDesc(cat);

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#1e293b] rounded-3xl border border-[#e6e0da] dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 p-6 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Kategoriya sarlavhasi va Ikonka */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                      {getIcon(cat.icon)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f6f3ef] dark:bg-slate-800 text-[#67625d] dark:text-slate-300">
                      {cat._count?.listings ?? 0} {t.catalogPage.listingsCount}
                    </span>
                  </div>

                  <Link
                    href={`/?category=${cat.slug}`}
                    className="text-lg font-bold text-[#282624] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mb-1.5"
                  >
                    {catName}
                  </Link>

                  <p className="text-xs sm:text-sm text-[#67625d] dark:text-slate-400 mb-4 line-clamp-2">
                    {catDesc}
                  </p>

                  {/* Sub-kategoriyalar */}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="pt-3 border-t border-[#f6f3ef] dark:border-slate-800 space-y-1.5">
                      {cat.subCategories.map((sub) => {
                        const subName = getSubName(sub);
                        return (
                          <Link
                            key={sub.id}
                            href={`/?category=${cat.slug}&subCategory=${sub.slug}`}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 dark:hover:bg-slate-800/60 text-xs sm:text-sm font-medium text-[#282624] dark:text-slate-200 transition-colors group"
                          >
                            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-600 transition-colors" />
                              {subName}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-blue-500">
                              {sub._count?.listings ?? 0} {t.catalogPage.subCount}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Barchasini ko'rish havolasi */}
                <div className="pt-4 mt-4 border-t border-[#f6f3ef] dark:border-slate-800">
                  <Link
                    href={`/?category=${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                  >
                    <span>{t.catalogPage.viewAllInSection}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
