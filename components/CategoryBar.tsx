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
    const className = `w-4 h-4 ${isSelected ? 'text-white' : 'text-[#67625d]'}`;
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

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="w-full bg-[#fffdfa] border-b border-[#e6e0da] py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asosiy kategoriyalar (Pills - sindr.uz style) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Barchasi */}
          <button
            onClick={() => handleCategorySelect('all')}
            type="button"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentCategory === 'all'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25'
                : 'bg-[#f6f3ef] text-[#67625d] hover:bg-[#ede9e3] hover:text-[#282624]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Barchasi</span>
          </button>

          {/* Dinamik kategoriyalar */}
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/25'
                    : 'bg-[#f6f3ef] text-[#67625d] hover:bg-[#ede9e3] hover:text-[#282624]'
                }`}
              >
                {getIcon(cat.icon, isSelected)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Ichki sub-kategoriyalar */}
        {activeCategoryObj && activeCategoryObj.subCategories && activeCategoryObj.subCategories.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-[#e6e0da] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-[#67625d] uppercase tracking-wider shrink-0 flex items-center gap-0.5">
              <span>Yo'nalish:</span>
              <ChevronRight className="w-3 h-3 text-[#67625d]" />
            </span>

            <button
              onClick={() => handleSubCategorySelect('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentSubCategory === 'all'
                  ? 'bg-[#282624] text-white font-bold'
                  : 'bg-[#f6f3ef] text-[#67625d] hover:bg-[#ede9e3]'
              }`}
            >
              Barcha yo'nalishlar
            </button>

            {activeCategoryObj.subCategories.map((sub) => {
              const isSubSelected = currentSubCategory === sub.slug;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubCategorySelect(sub.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSubSelected
                      ? 'bg-[#282624] text-white font-bold shadow-2xs'
                      : 'bg-[#f6f3ef] text-[#67625d] hover:bg-[#ede9e3]'
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
