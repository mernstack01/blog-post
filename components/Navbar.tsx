'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Wrench,
  PlusCircle,
  MapPin,
  Search,
  Menu,
  X,
  Layers,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get('location') || 'Barcha hududlar';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Sirdaryo<span className="text-blue-600 font-extrabold">Xizmat</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 tracking-wide">
                  Guliston
                </span>
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline-block">
                Ustalar va xizmatlar portali
              </span>
            </div>
          </Link>

          {/* Markaziy tezkor havolalar (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              Bosh sahifa
            </Link>
            <Link
              href="/categories"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              Katalog
            </Link>
            <Link
              href="/?location=Guliston+shahri"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-blue-500" />
              Guliston
            </Link>
            <Link
              href="/?location=Yangiyer+shahri"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              Yangiyer
            </Link>
          </nav>

          {/* O'ng taraf tugmalar */}
          <div className="flex items-center gap-3">
            {/* E'lon berish tugmasi */}
            <Link
              href="/new-listing"
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              <span>E'lon berish</span>
            </Link>

            {/* Mobil menyu tugmasi */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            <Search className="w-5 h-5 text-slate-400" />
            Bosh sahifa
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            <Layers className="w-5 h-5 text-slate-400" />
            Barcha kategoriyalar
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">
              Tezkor tumanlar
            </span>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {['Guliston shahri', 'Yangiyer shahri', 'Shirin shahri', 'Boyovut tumani'].map(
                (loc) => (
                  <Link
                    key={loc}
                    href={`/?location=${encodeURIComponent(loc)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {loc.replace(' shahri', '').replace(' tumani', '')}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
