'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Layers, Plus, Sparkles, User } from 'lucide-react';
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
    {
      label: t.bottomNav.profile || (lang === 'ru' ? 'Профиль' : 'Profil'),
      href: '/profile',
      icon: User,
      isActive: pathname === '/profile',
    },
  ];

  return (
    <nav
      key={lang}
      aria-label="Mobil pastki navigatsiya"
      className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border dark:border-white/15 shadow-[0_-4px_25px_rgba(15,23,42,0.08)] transition-colors"
    >
      <div className="grid h-full grid-cols-5 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={item.isActive ? 'page' : undefined}
                className="flex min-w-0 min-h-11 flex-col items-center justify-center group"
                title={item.label}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-90 transition-transform border-2 border-background shrink-0">
                  <Icon className="w-5 h-5 stroke-[2.5] shrink-0" />
                </div>
                <span suppressHydrationWarning className="text-[10px] font-extrabold text-primary mt-0.5 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
                aria-label={item.label}
                aria-current={item.isActive ? 'page' : undefined}
              className={`flex flex-col items-center min-w-0 min-h-11 justify-center py-1 px-1 rounded-xl transition-all active:scale-95 shrink-0 ${
                item.isActive
                  ? item.isTop10
                    ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                    : 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground'
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
              <span suppressHydrationWarning className="text-[10px] tracking-tight mt-0.5 font-medium truncate max-w-full">
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
