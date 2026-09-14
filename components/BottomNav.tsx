'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Plus, ShieldCheck } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Bosh sahifa',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Katalog',
      href: '/categories',
      icon: Layers,
      isActive: pathname.startsWith('/categories'),
    },
    {
      label: "E'lon berish",
      href: '/new-listing',
      icon: Plus,
      isAction: true,
      isActive: pathname === '/new-listing',
    },
    {
      label: 'Admin',
      href: '/admin',
      icon: ShieldCheck,
      isActive: pathname.startsWith('/admin'),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fffdfa]/95 backdrop-blur-lg border-t border-[#e6e0da] shadow-[0_-4px_25px_rgba(40,38,36,0.06)] px-4 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center group -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 group-active:scale-95 transition-transform border-2 border-[#fffdfa]">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-orange-600 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                item.isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-[#67625d] hover:text-[#282624]'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
