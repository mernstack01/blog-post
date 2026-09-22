'use client';

import { MapPin, Users, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StatsSectionClientProps {
  districtsCount: number;
  approvedListingsCount: number;
  verifiedCount: number;
}

export default function StatsSectionClient({
  districtsCount,
  approvedListingsCount,
  verifiedCount,
}: StatsSectionClientProps) {
  const { t, lang } = useLanguage();

  const stats = [
    {
      icon: MapPin,
      value: `${districtsCount} ${t.stats.countUnit}`,
      label: t.stats.districtsLabel,
      desc: t.stats.districtsDesc,
    },
    {
      icon: Users,
      value: `${approvedListingsCount} ${t.stats.countUnit}`,
      label: t.stats.specialistsLabel,
      desc: t.stats.specialistsDesc,
    },
    {
      icon: Zap,
      value: t.stats.commissionVal,
      label: t.stats.commissionLabel,
      desc: t.stats.commissionDesc,
    },
    {
      icon: ShieldCheck,
      value: verifiedCount > 0 ? `${verifiedCount} ${t.stats.countUnit}` : t.stats.verifiedVal,
      label: t.stats.verifiedLabel,
      desc: t.stats.verifiedDesc,
    },
  ];

  return (
    <section key={lang} className="bg-gradient-to-br from-card via-card/95 to-card text-foreground py-14 sm:py-16 my-12 relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl border border-border">
      {/* Fon elementlari */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            {t.stats.whyTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t.stats.whySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-secondary/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/50 transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-6 h-6 shrink-0" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-1 truncate max-w-full">
                  {item.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1 truncate max-w-full">
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
