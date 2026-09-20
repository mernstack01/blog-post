'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

export default function LocationPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const currentLocation = searchParams.get('location') || 'Barcha hududlar';

  const handleLocationClick = (loc: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (loc === 'Barcha hududlar') {
      params.delete('location');
    } else {
      params.set('location', loc);
    }
    router.push(`/?${params.toString()}`);
  };

  const getLocationLabel = (loc: string) => {
    if (loc === 'Barcha hududlar') return t.locations.all;
    return (t.locations as Record<string, string>)[loc] || loc;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar touch-pan-x py-1">
        <span className="text-[11px] font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{t.nav.regions}:</span>
        </span>

        {SIRDARYO_LOCATIONS.map((loc) => {
          const isSelected = currentLocation === loc;
          const label = getLocationLabel(loc);
          return (
            <button
              key={loc}
              onClick={() => handleLocationClick(loc)}
              type="button"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm font-bold ring-2 ring-blue-200 dark:ring-blue-900/50 shadow-blue-500/25'
                  : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#64748b] dark:text-slate-300 hover:bg-[#e2e8f0] dark:hover:bg-slate-700 hover:text-[#1e293b] dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

