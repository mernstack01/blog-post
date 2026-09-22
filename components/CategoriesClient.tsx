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
    const className = "w-7 h-7 text-primary shrink-0";
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
    <div key={lang} className="min-h-screen bg-background text-foreground pt-6 pb-28 sm:py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Orqaga havola */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{t.catalogPage.backHome}</span>
          </Link>
        </div>

        {/* Sahifa sarlavhasi */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {t.catalogPage.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
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
                className="bg-card text-card-foreground rounded-3xl border border-border hover:border-primary/50 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Kategoriya sarlavhasi va Ikonka */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      {getIcon(cat.icon)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0">
                      {cat._count?.listings ?? 0} {t.catalogPage.listingsCount}
                    </span>
                  </div>

                  <Link
                    href={`/?category=${cat.slug}`}
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors block mb-1.5"
                  >
                    {catName}
                  </Link>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                    {catDesc}
                  </p>

                  {/* Sub-kategoriyalar */}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="pt-3 border-t border-border/60 space-y-1.5">
                      {cat.subCategories.map((sub) => {
                        const subName = getSubName(sub);
                        return (
                          <Link
                            key={sub.id}
                            href={`/?category=${cat.slug}&subCategory=${sub.slug}`}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary/80 text-xs sm:text-sm font-medium text-foreground transition-colors group"
                          >
                            <span className="group-hover:text-primary flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors shrink-0" />
                              <span className="truncate">{subName}</span>
                            </span>
                            <span className="text-[11px] text-muted-foreground group-hover:text-primary shrink-0 ml-2">
                              {sub._count?.listings ?? 0} {t.catalogPage.subCount}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Barchasini ko'rish havolasi */}
                <div className="pt-4 mt-4 border-t border-border/60">
                  <Link
                    href={`/?category=${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline transition-colors shrink-0"
                  >
                    <span>{t.catalogPage.viewAllInSection}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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
