'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Layers, Plus, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentMode = searchParams.get('mode');
  const { t, lang } = useLanguage();

  const isHomeActive = pathname === '/' && currentMode !== 'top10';
  const isTop10Active = pathname === '/' && currentMode === 'top10';

  const navItems = [
    {
      label: t.bottomNav.home,
      href: '/',
      icon: Home,
      isActive: isHomeActive,
    },
    {
      label: t.bottomNav.top10,
      href: '/?mode=top10',
      icon: Sparkles,
      isActive: isTop10Active,
      isTop10: true,
    },
    {
      label: t.bottomNav.post,
      href: '/new-listing',
      icon: Plus,
      isAction: true,
      isActive: pathname === '/new-listing',
    },
    {
      label: t.bottomNav.catalog,
      href: '/categories',
      icon: Layers,
      isActive: pathname.startsWith('/categories'),
    },
  ];

  return (
    <nav
      key={lang}
      aria-label="Mobil pastki navigatsiya"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#fffdfa]/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-[#e2e8f0] dark:border-slate-800 shadow-[0_-4px_25px_rgba(15,23,42,0.08)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center group -mt-5"
                title={item.label}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/35 active:scale-90 transition-transform border-2 border-[#fffdfa] dark:border-slate-900">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span suppressHydrationWarning className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
                item.isActive
                  ? item.isTop10
                    ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                    : 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    item.isActive
                      ? item.isTop10
                        ? 'fill-amber-400 text-amber-500 stroke-[2.5]'
                        : 'stroke-[2.5]'
                      : 'stroke-2'
                  }`}
                />
                {item.isTop10 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                )}
              </div>
              <span suppressHydrationWarning className="text-[10px] tracking-tight mt-0.5 font-medium truncate max-w-[70px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
