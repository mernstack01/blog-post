'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Globe } from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

export interface LocationPillsProps {
  regions?: {
    id: string;
    nameUz: string;
    nameRu: string;
    slug: string;
    order: number;
    districts: {
      id: string;
      nameUz: string;
      nameRu: string;
      slug: string;
      order: number;
      regionId: string;
    }[];
  }[];
}

export default function LocationPills({ regions }: LocationPillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const currentLocation = searchParams.get('location') || 'Barcha hududlar';

  // Aniq viloyatni aniqlash
  const findRegionForLocation = (loc: string) => {
    if (!regions || regions.length === 0) return null;
    for (const r of regions) {
      if (r.nameUz === loc || r.nameRu === loc) return r;
      if (r.districts.some((d) => d.nameUz === loc || d.nameRu === loc)) return r;
    }
    return regions[0];
  };

  const detectedRegion = findRegionForLocation(currentLocation);
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    detectedRegion?.id || (regions && regions[0]?.id) || ''
  );

  const activeRegion = regions?.find((r) => r.id === selectedRegionId) || regions?.[0];

  const handleLocationClick = (loc: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (loc === 'Barcha hududlar') {
      params.delete('location');
    } else {
      params.set('location', loc);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleRegionClick = (reg: NonNullable<typeof regions>[number]) => {
    setSelectedRegionId(reg.id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('location', reg.nameUz);
    router.push(`/?${params.toString()}`);
  };

  const getLocationLabel = (loc: string) => {
    if (loc === 'Barcha hududlar') return t.locations.all;
    return (t.locations as Record<string, string>)[loc] || loc;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 space-y-2.5">
      {/* Mobil Ko'rinish (Select) */}
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground sm:hidden">
        {t.nav.regions}
        <select
          value={currentLocation}
          onChange={(e) => handleLocationClick(e.target.value)}
          className="w-full min-h-11 rounded-xl border border-border bg-card px-3 text-foreground font-semibold"
        >
          <option value="Barcha hududlar">{t.locations.all}</option>
          {regions && regions.length > 0 ? (
            regions.map((reg) => (
              <optgroup key={reg.id} label={lang === 'ru' ? reg.nameRu : reg.nameUz}>
                <option value={reg.nameUz}>
                  {lang === 'ru' ? `Вся ${reg.nameRu}` : `Butun ${reg.nameUz}`}
                </option>
                {reg.districts.map((d) => (
                  <option key={d.id} value={d.nameUz}>
                    {lang === 'ru' ? d.nameRu : d.nameUz}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
              <option key={loc} value={loc}>
                {getLocationLabel(loc)}
              </option>
            ))
          )}
        </select>
      </label>

      {/* Desktop Ko'rinish */}
      <div className="hidden sm:block space-y-2">
        {/* 1. Agar bir nechta viloyat bo'lsa, Viloyat pillari */}
        {regions && regions.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap py-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Viloyat:</span>
            </span>

            <button
              onClick={() => handleLocationClick('Barcha hududlar')}
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
                currentLocation === 'Barcha hududlar'
                  ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
                  : 'bg-secondary/70 text-secondary-foreground hover:bg-muted'
              }`}
            >
              {t.locations.all}
            </button>

            {regions.map((reg) => {
              const isRegActive =
                selectedRegionId === reg.id ||
                currentLocation === reg.nameUz ||
                currentLocation === reg.nameRu;
              return (
                <button
                  key={reg.id}
                  onClick={() => handleRegionClick(reg)}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
                    isRegActive
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-xs'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted border border-transparent'
                  }`}
                >
                  {lang === 'ru' ? reg.nameRu : reg.nameUz} ({reg.districts.length})
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Shahar va Tumanlar pillari */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap py-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {regions && regions.length > 1 && activeRegion
                ? `${lang === 'ru' ? activeRegion.nameRu : activeRegion.nameUz} tumanlari:`
                : `${t.nav.regions}:`}
            </span>
          </span>

          {/* Barcha hududlar tugmasi (faqat 1 ta viloyat bo'lganda bu qatorda ko'rsatiladi) */}
          {(!regions || regions.length <= 1) && (
            <button
              onClick={() => handleLocationClick('Barcha hududlar')}
              type="button"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-normal transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shrink-0 ${
                currentLocation === 'Barcha hududlar'
                  ? 'bg-primary text-primary-foreground shadow-sm font-bold ring-2 ring-primary/20 shadow-primary/20'
                  : 'bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {t.locations.all}
            </button>
          )}

          {regions && regions.length > 0 ? (
            (activeRegion?.districts || []).map((district) => {
              const isSelected =
                currentLocation === district.nameUz || currentLocation === district.nameRu;
              const label = lang === 'ru' ? district.nameRu : district.nameUz;
              return (
                <button
                  key={district.id}
                  onClick={() => handleLocationClick(district.nameUz)}
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
            })
          ) : (
            SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => {
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
