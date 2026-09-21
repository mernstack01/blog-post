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
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { t, lang } = useLanguage();
  const { user, logout, openAuthModal } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentMode = searchParams.get('mode');

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border dark:border-white/10 transition-colors">
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
                  TopBaza<span className="text-blue-600 dark:text-blue-400">.uz</span>
                </span>
              </div>
            </Link>

            {/* Jonli hudud nishoni (Desktop) */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border dark:border-white/10 text-xs font-medium text-muted-foreground">
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

            {/* Faqat ADMIN roli uchun Admin paneli havolasi */}
            {user?.role === 'ADMIN' && (
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
            )}
          </nav>

          {/* O'ng taraf: User, Language Switcher, Theme Toggle, CTA va Mobil Menyu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Foydalanuvchi Profili / Kirish tugmasi (Desktop) */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="inline-flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer text-left"
                  title={lang === 'ru' ? "Профиль пользователя" : "Foydalanuvchi profili"}
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-1 max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold leading-none">
                      {user.totalUsed ?? 0}/{user.listingLimit ?? 3} {lang === 'ru' ? 'объявл.' : "e'lon"}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menyu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2.5 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">{lang === 'ru' ? 'Лимит объявлений:' : "E'lon limitingiz:"}</span>
                          <span className="font-extrabold text-blue-700 dark:text-blue-300">
                            {user.totalUsed ?? 0} / {user.listingLimit ?? 3} {lang === 'ru' ? 'объявл.' : 'ta'}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>{lang === 'ru' ? 'Мой профиль' : "Mening profilim"}</span>
                        </Link>
                        <Link
                          href="/my-listings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>{lang === 'ru' ? 'Мои объявления' : "Mening e'lonlarim"}</span>
                        </Link>
                        <Link
                          href="/new-listing"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{lang === 'ru' ? 'Подать объявление' : "Yangi e'lon berish"}</span>
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span>{lang === 'ru' ? 'Панель админа' : 'Admin paneli'}</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{lang === 'ru' ? 'Выйти' : 'Chiqish'}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
                title={lang === 'ru' ? 'Войти или зарегистрироваться' : "Kirish yoki ro'yxatdan o'tish"}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">{lang === 'ru' ? 'Вход' : 'Kirish'}</span>
              </button>
            )}

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
            {/* Mobil foydalanuvchi kartasi */}
            {user ? (
              <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {user.totalUsed ?? 0}/{user.listingLimit ?? 3} {lang === 'ru' ? 'объявл.' : "ta e'lon"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100/60 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Выйти' : 'Chiqish'}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-700 mb-2 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{lang === 'ru' ? 'Войти / Регистрация' : "Kirish / Ro'yxatdan o'tish"}</span>
              </button>
            )}

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
            {user && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#1e293b] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{lang === 'ru' ? 'Мой профиль' : "Mening profilim"}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  href="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#1e293b] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{lang === 'ru' ? 'Мои объявления' : "Mening e'lonlarim"}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{user.totalUsed ?? 0} {lang === 'ru' ? 'объявл.' : 'ta'}</span>
                </Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1e293b] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span suppressHydrationWarning>{t.nav.admin}</span>
              </Link>
            )}
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

