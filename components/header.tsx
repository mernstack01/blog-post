'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Wrench,
  PlusCircle,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentMode = searchParams.get('mode');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fffdfa]/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#1e293b] dark:text-white flex items-center">
                  XayrliIsh<span className="text-blue-600 dark:text-blue-400">.uz</span>
                </span>
              </div>
            </Link>

            {/* Jonli hudud nishoni (Desktop) */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-medium text-[#64748b] dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span suppressHydrationWarning>{t.nav.regions}</span>
            </div>
          </div>

          {/* Markaziy navigatsiya (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                pathname === '/' && currentMode !== 'top10'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-900/50'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800'
              }`}
            >
              <span suppressHydrationWarning>{t.nav.general}</span>
            </Link>
            <Link
              href="/?mode=top10"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentMode === 'top10'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold shadow-2xs border border-amber-200 dark:border-amber-800/60'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span suppressHydrationWarning>{t.nav.top10}</span>
            </Link>
            <Link
              href="/categories"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/categories')
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-900/50'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span suppressHydrationWarning>{t.nav.catalog}</span>
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-900/50'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span suppressHydrationWarning>{t.nav.admin}</span>
            </Link>
          </nav>

          {/* O'ng taraf: Language Switcher, Theme Toggle, CTA va Mobil Menyu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Til almashtirgich (Uz / Ru) */}
            <LanguageSwitcher />

            {/* Tungi / Yorug' rejim (Theme Toggle) */}
            <ThemeToggle />

            {/* E'lon berish tugmasi (Desktop) */}
            <Link
              href="/new-listing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all touch-manipulation"
            >
              <PlusCircle className="w-4 h-4" />
              <span suppressHydrationWarning>{t.nav.newListing}</span>
            </Link>

            {/* Mobil menyu ochish tugmasi */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-2xl bg-[#f1f5f9] dark:bg-slate-800 text-[#1e293b] dark:text-white border border-[#e2e8f0] dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
              aria-label="Menyuni ochish"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobil ochiluvchi menyu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#e2e8f0] dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#1e293b] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
            >
              <span suppressHydrationWarning>{t.nav.home}</span>
              <span suppressHydrationWarning className="text-xs text-blue-600 dark:text-blue-400 font-bold">{t.nav.general}</span>
            </Link>
            <Link
              href="/?mode=top10"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-amber-900 dark:text-amber-200 bg-amber-50/60 dark:bg-amber-950/30"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span suppressHydrationWarning>{t.nav.top10}</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-white">TOP 10</span>
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1e293b] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span suppressHydrationWarning>{t.nav.catalog}</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1e293b] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span suppressHydrationWarning>{t.nav.admin}</span>
            </Link>
            <Link
              href="/new-listing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span suppressHydrationWarning>{t.nav.newListing}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
