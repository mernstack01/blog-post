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
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground sm:hidden">
        {t.nav.regions}
        <select value={currentLocation} onChange={(e) => handleLocationClick(e.target.value)} className="w-full min-h-11 rounded-xl border border-border bg-card px-3 text-foreground">
          {SIRDARYO_LOCATIONS.map((loc) => <option key={loc} value={loc}>{getLocationLabel(loc)}</option>)}
        </select>
      </label>
      <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 flex-wrap py-1">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-normal transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm font-bold ring-2 ring-primary/20 shadow-primary/20'
                  : 'bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:text-foreground'
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
