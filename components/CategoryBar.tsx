'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Wrench,
  Car,
  Tv,
  Hammer,
  Sparkles,
  GraduationCap,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { getCategoryLocalizedName, getSubCategoryLocalizedName } from '@/lib/translations';

interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  subCategories?: SubCategoryItem[];
}

interface CategoryBarProps {
  categories: CategoryItem[];
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSubCategory = searchParams.get('subCategory') || 'all';

  const handleCategorySelect = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === 'all') {
      params.delete('category');
      params.delete('subCategory');
    } else {
      params.set('category', categorySlug);
      params.delete('subCategory');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSubCategorySelect = (subCategorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (subCategorySlug === 'all') {
      params.delete('subCategory');
    } else {
      params.set('subCategory', subCategorySlug);
    }
    router.push(`/?${params.toString()}`);
  };

  const getIcon = (iconName: string | null, isSelected: boolean) => {
    const className = `w-4 h-4 shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`;
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

  const getCatName = (cat: CategoryItem) => {
    return getCategoryLocalizedName(cat.slug, lang) || cat.name;
  };

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="w-full bg-background border-b border-border py-3 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid gap-3 sm:hidden">
          <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
            {t.nav.catalog}
            <select value={currentCategory} onChange={(e) => handleCategorySelect(e.target.value)} className="w-full min-h-11 rounded-xl border border-border bg-card px-3 text-foreground">
              <option value="all">{lang === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}</option>
              {categories.map((cat) => <option key={cat.id} value={cat.slug}>{getCatName(cat)}</option>)}
            </select>
          </label>
          {!!activeCategoryObj?.subCategories?.length && (
            <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
              {lang === 'ru' ? 'Направление' : "Yo'nalish"}
              <select value={currentSubCategory} onChange={(e) => handleSubCategorySelect(e.target.value)} className="w-full min-h-11 rounded-xl border border-border bg-card px-3 text-foreground">
                <option value="all">{lang === 'ru' ? 'Все направления' : "Barcha yo'nalishlar"}</option>
                {activeCategoryObj.subCategories.map((sub) => <option key={sub.id} value={sub.slug}>{getSubCategoryLocalizedName(sub.slug, lang) || sub.name}</option>)}
              </select>
            </label>
          )}
        </div>
        {/* Asosiy kategoriyalar (Pills) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 flex-wrap py-1">
          {/* Barchasi */}
          <button
            onClick={() => handleCategorySelect('all')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 min-h-11 rounded-full text-xs sm:text-sm font-semibold whitespace-normal transition-all cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
              currentCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold'
                : 'bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>{t.categories.all}</span>
          </button>

          {/* Dinamik kategoriyalar */}
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 min-h-11 rounded-full text-xs sm:text-sm font-semibold whitespace-normal transition-all cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold'
                    : 'bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                {getIcon(cat.icon, isSelected)}
                <span>{getCatName(cat)}</span>
              </button>
            );
          })}
        </div>

        {/* Ichki sub-kategoriyalar */}
        {activeCategoryObj && activeCategoryObj.subCategories && activeCategoryObj.subCategories.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border hidden sm:flex items-center gap-2 sm:gap-2.5 flex-wrap py-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-0.5">
              <span>{lang === 'ru' ? 'Направление:' : "Yo'nalish:"}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
            </span>

            <button
              onClick={() => handleSubCategorySelect('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-normal transition-colors cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
                currentSubCategory === 'all'
                  ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                  : 'bg-secondary text-secondary-foreground border border-border hover:bg-muted'
              }`}
            >
              {lang === 'ru' ? 'Все направления' : "Barcha yo'nalishlar"}
            </button>

            {activeCategoryObj.subCategories.map((sub) => {
              const isSubSelected = currentSubCategory === sub.slug;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubCategorySelect(sub.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-normal transition-colors cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
                    isSubSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                      : 'bg-secondary text-secondary-foreground border border-border hover:bg-muted'
                  }`}
                >
                  {getSubCategoryLocalizedName(sub.slug, lang) || sub.name}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
