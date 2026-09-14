'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';

export default function LocationPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-bold text-[#67625d] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Hudud:</span>
        </span>

        {SIRDARYO_LOCATIONS.map((loc) => {
          const isSelected = currentLocation === loc;
          return (
            <button
              key={loc}
              onClick={() => handleLocationClick(loc)}
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-xs font-bold'
                  : 'bg-[#f6f3ef] text-[#67625d] hover:bg-[#ede9e3] hover:text-[#282624]'
              }`}
            >
              {loc}
            </button>
          );
        })}
      </div>
    </div>
  );
}
