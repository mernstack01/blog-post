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
} from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fffdfa]/90 backdrop-blur-md border-b border-[#e6e0da] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo va Jonli nishon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#282624] flex items-center gap-1.5">
                  Sirdaryo<span className="text-orange-600 font-extrabold">Xizmat</span>
                </span>
              </div>
            </Link>

            {/* Sindr.uz uslubidagi jonli pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f6f3ef] border border-[#e6e0da] text-xs font-medium text-[#67625d]">
              <span className="live-indicator" />
              <span>Guliston & Tumanlar</span>
            </div>
          </div>

          {/* Markaziy havolalar (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                pathname === '/'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-[#67625d] hover:text-[#282624] hover:bg-[#f6f3ef]'
              }`}
            >
              Bosh sahifa
            </Link>
            <Link
              href="/categories"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/categories')
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-[#67625d] hover:text-[#282624] hover:bg-[#f6f3ef]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Katalog
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-[#67625d] hover:text-[#282624] hover:bg-[#f6f3ef]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              Admin
            </Link>
          </nav>

          {/* O'ng taraf tugmalar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* E'lon berish tugmasi */}
            <Link
              href="/new-listing"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ E'lon berish</span>
            </Link>

            {/* Mobil menyu tugmasi */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-1.5 rounded-xl text-[#67625d] hover:text-[#282624] hover:bg-[#f6f3ef] transition-colors"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e6e0da] bg-[#fffdfa]/98 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#282624] hover:bg-orange-50 hover:text-orange-600"
          >
            <Search className="w-4 h-4 text-[#67625d]" />
            Bosh sahifa
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#282624] hover:bg-orange-50 hover:text-orange-600"
          >
            <Layers className="w-4 h-4 text-[#67625d]" />
            Katalog
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#282624] hover:bg-orange-50 hover:text-orange-600"
          >
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            Admin Boshqaruv
          </Link>

          <div className="pt-2 border-t border-[#e6e0da]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#67625d] px-3 block mb-1.5">
              Tezkor tumanlar
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {['Guliston shahri', 'Yangiyer shahri', 'Shirin shahri', 'Boyovut tumani'].map(
                (loc) => (
                  <Link
                    key={loc}
                    href={`/?location=${encodeURIComponent(loc)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#67625d] bg-[#f6f3ef] hover:bg-orange-50 hover:text-orange-600"
                  >
                    <MapPin className="w-3 h-3 text-orange-500" />
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
