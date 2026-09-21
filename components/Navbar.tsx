'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Wrench,
  PlusCircle,
  MapPin,
  Search,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Sparkles,
  FileText,
} from 'lucide-react';
import { UzbekFlagIcon, RussianFlagIcon } from '@/components/icons/FlagIcons';
import { useLanguage } from '@/context/LanguageContext';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentMode = searchParams.get('mode');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#e6e0da] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo va Jonli nishon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#1e293b] flex items-center gap-1">
                  TopBaza<span className="text-blue-600 font-black">.uz</span>
                </span>
                <span className="text-[10px] text-[#64748b] font-medium hidden sm:block -mt-1">
                  {t.hero.titleHighlight}
                </span>
              </div>
            </Link>

            {/* Jonli hudud nishoni */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-xs font-medium text-[#64748b]">
              <span className="live-indicator" />
              <span>{t.nav.regions}</span>
            </div>
          </div>

          {/* Markaziy havolalar (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                pathname === '/' && currentMode !== 'top10'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                  : 'text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9]'
              }`}
            >
              {t.nav.general}
            </Link>
            <Link
              href="/?mode=top10"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentMode === 'top10'
                  ? 'bg-amber-50 text-amber-800 font-extrabold shadow-2xs border border-amber-200'
                  : 'text-[#64748b] hover:text-amber-700 hover:bg-amber-50/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{t.nav.top10}</span>
            </Link>
            <Link
              href="/categories"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/categories')
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                  : 'text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.nav.catalog}</span>
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                  : 'text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.nav.admin}</span>
            </Link>
          </nav>

          {/* O'ng taraf: Bayroqli Til Tanlagich va E'lon berish */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bayroq iconli real til almashtirgich (Uz / Ru) */}
            <div className="flex items-center bg-[#f1f5f9] p-0.5 sm:p-1 rounded-full border border-[#e2e8f0] text-xs font-semibold shadow-2xs">
              {/* O'zbek tili */}
              <button
                onClick={() => setLang('uz')}
                type="button"
                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'uz'
                    ? 'bg-white text-blue-600 font-extrabold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
                title="O'zbek tili"
              >
                <UzbekFlagIcon className="w-4 h-2.5 sm:w-4.5 sm:h-3" />
                <span className="text-[11px] font-bold">O'z</span>
              </button>

              {/* Rus tili */}
              <button
                onClick={() => setLang('ru')}
                type="button"
                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-white text-blue-600 font-extrabold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
                title="Русский язык"
              >
                <RussianFlagIcon className="w-4 h-2.5 sm:w-4.5 sm:h-3" />
                <span className="text-[11px] font-bold">Ру</span>
              </button>
            </div>

            {/* E'lon berish tugmasi */}
            <Link
              href="/new-listing"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.nav.newListing}</span>
              <span className="sm:hidden">{t.bottomNav.post}</span>
            </Link>

            {/* Mobil menyu tugmasi */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#282624] hover:bg-[#f6f3ef] md:hidden focus:outline-none cursor-pointer"
              aria-label="Menyuni ochish"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e6e0da] bg-[#fffdfa]/98 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {/* Mobil til almashtirish paneli */}
          <div className="flex items-center justify-between p-2.5 mb-2 bg-[#f6f3ef] rounded-2xl border border-[#e6e0da]">
            <span className="text-xs font-semibold text-[#67625d]">
              {t.nav.selectLanguage}:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLang('uz')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  lang === 'uz' ? 'bg-white text-blue-600 shadow-xs' : 'text-[#67625d]'
                }`}
              >
                <UzbekFlagIcon className="w-4 h-2.5" />
                <span>O'zbek</span>
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  lang === 'ru' ? 'bg-white text-blue-600 shadow-xs' : 'text-[#67625d]'
                }`}
              >
                <RussianFlagIcon className="w-4 h-2.5" />
                <span>Русский</span>
              </button>
            </div>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#282624] hover:bg-blue-50 hover:text-blue-600"
          >
            <Search className="w-4 h-4 text-[#67625d]" />
            <span>{t.nav.general}</span>
          </Link>

          <Link
            href="/?mode=top10"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-50/70 border border-amber-200/60"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{t.nav.top10}</span>
          </Link>

          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#282624] hover:bg-blue-50 hover:text-blue-600"
          >
            <Layers className="w-4 h-4 text-[#67625d]" />
            <span>{t.nav.catalog}</span>
          </Link>

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#282624] hover:bg-blue-50 hover:text-blue-600"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{t.nav.admin}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
