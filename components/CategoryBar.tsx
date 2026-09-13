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

  const currentCategory = searchParams.get('category') || 'all';
  const currentSubCategory = searchParams.get('subCategory') || 'all';

  const handleCategorySelect = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === 'all') {
      params.delete('category');
      params.delete('subCategory');
    } else {
      params.set('category', categorySlug);
      params.delete('subCategory'); // Kategoriya o'zgarganda subcategoryni tozalash
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

  // Dinamik ikonka olish
  const getIcon = (iconName: string | null, isSelected: boolean) => {
    const className = `w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`;
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

  // Faol kategoriyaning sub-kategoriyalarini topish
  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="w-full bg-white border-b border-slate-200/70 py-4 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asosiy kategoriyalar (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Barchasi */}
          <button
            onClick={() => handleCategorySelect('all')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Barcha xizmatlar</span>
          </button>

          {/* Dinamik kategoriyalar */}
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {getIcon(cat.icon, isSelected)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Ichki sub-kategoriyalar (agar kategoriya tanlangan bo'lsa) */}
        {activeCategoryObj && activeCategoryObj.subCategories && activeCategoryObj.subCategories.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span>Yo'nalishlar:</span>
              <ChevronRight className="w-3 h-3" />
            </span>

            <button
              onClick={() => handleSubCategorySelect('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentSubCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hammasi
            </button>

            {activeCategoryObj.subCategories.map((sub) => {
              const isSubSelected = currentSubCategory === sub.slug;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubCategorySelect(sub.slug)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSubSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
