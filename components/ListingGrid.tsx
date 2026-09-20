'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListingWithRelations } from '@/actions/listing-actions';
import ListingCard from '@/components/ListingCard';
import { SlidersHorizontal, SearchX, RotateCcw, User, Users, Globe, Plus, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ListingGridProps {
  listings: ListingWithRelations[];
  currentUser?: {
    id: string;
    phone: string;
    name: string;
    role: string;
    listingLimit?: number;
    totalUsed?: number;
    remaining?: number;
  } | null;
  isAdmin?: boolean;
}

export default function ListingGrid({ listings, currentUser, isAdmin }: ListingGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const { user: authUser, openAuthModal } = useAuth();
  const effectiveUser = currentUser || authUser;

  const currentSort = searchParams.get('sortBy') || 'popular';
  const isTop10 = searchParams.get('mode') === 'top10';

  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'my' | 'others'>('all');

  // E'lon egasini aniqlash funksiyasi
  const isMyListing = (item: ListingWithRelations) => {
    if (isAdmin) {
      return !item.userId || (effectiveUser && (item.userId === effectiveUser.id || item.phone === effectiveUser.phone));
    }
    return Boolean(effectiveUser && (item.userId === effectiveUser.id || item.phone === effectiveUser.phone));
  };

  const isOthersListing = (item: ListingWithRelations) => {
    if (isAdmin) {
      return Boolean(item.userId && (!effectiveUser || (item.userId !== effectiveUser.id && item.phone !== effectiveUser.phone)));
    }
    return Boolean(!effectiveUser || (item.userId !== effectiveUser.id && item.phone !== effectiveUser.phone));
  };

  const myCount = listings.filter(isMyListing).length;
  const othersCount = listings.filter(isOthersListing).length;

  const filteredListings = listings.filter((item) => {
    if (ownershipFilter === 'my') return isMyListing(item);
    if (ownershipFilter === 'others') return isOthersListing(item);
    return true;
  });

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/');
  };

  const handleTabClick = (tabId: 'all' | 'my' | 'others') => {
    if (tabId === 'my' && !effectiveUser && !isAdmin) {
      openAuthModal();
      return;
    }
    setOwnershipFilter(tabId);
  };

  // Bosh sahifada ham Adminniki kabi 3 ta tab filtri
  const ownershipTabs = [
    { id: 'all', label: lang === 'ru' ? 'Все' : 'Barchasi', count: listings.length, icon: Globe },
    { id: 'my', label: lang === 'ru' ? 'Мои' : "O'zimniki", count: myCount, icon: User },
    { id: 'others', label: lang === 'ru' ? 'Другие' : 'Boshqalar', count: othersCount, icon: Users },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 pb-12">
      
      {/* 1. Ro'yxatdan o'tgan foydalanuvchi xush kelibsiz va limit paneli */}
      {effectiveUser && (
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-3xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 shrink-0">
              {effectiveUser.name ? effectiveUser.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-black text-base text-slate-900 dark:text-white truncate">
                  {effectiveUser.name}
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {isAdmin ? 'SuperAdmin' : (lang === 'ru' ? 'Специалист' : 'Mutaxassis')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span>{effectiveUser.phone}</span>
                <span>•</span>
                <span>
                  {lang === 'ru' ? 'Лимит объявлений:' : "E'lon berish limitingiz:"} <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{effectiveUser.totalUsed ?? myCount} / {effectiveUser.listingLimit ?? 3}</strong> {lang === 'ru' ? 'объявл.' : "ta e'lon"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              href="/my-listings"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{lang === 'ru' ? 'Мои объявления' : "Mening e'lonlarim"}</span>
            </Link>
            <Link
              href="/new-listing"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Подать объявление' : "Yangi e'lon berish"}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Sarlavha, Tablar va Saralash Paneli */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#282624] dark:text-white tracking-tight flex items-center gap-2">
                {isTop10 ? (
                  <>
                    <span>{t.grid.titleTop10}</span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                      TOP 10
                    </span>
                  </>
                ) : (
                  <>
                    <span>{t.grid.titleAll}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                      {filteredListings.length} {t.grid.countUnit}
                    </span>
                  </>
                )}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isTop10 ? t.grid.descTop10 : t.grid.descAll}
            </p>
          </div>

          {/* Saralash (Top 10 rejimida avtomatik reyting bo'yicha) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isTop10 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{t.grid.sortedByScore}</span>
              </div>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {t.grid.sortLabel}
                </span>
                <select
                  value={currentSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="popular">{t.grid.sortPopular}</option>
                  <option value="rating">{t.grid.sortRating}</option>
                  <option value="newest">{t.grid.sortNewest}</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* E'lonlar Egasi Filtrlash Tablari (Barchasi, O'zimniki, Boshqalar) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
            {ownershipTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = ownershipFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-700 text-blue-700 dark:text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agar e'lonlar bo'lsa Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : ownershipFilter === 'my' ? (
        /* O'zimniki bo'sh holati */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            {effectiveUser
              ? (lang === 'ru' ? 'У вас пока нет объявлений' : "Sizda hali e'lonlar yo'q")
              : (lang === 'ru' ? 'Войдите, чтобы увидеть свои объявления' : "O'z e'lonlaringizni ko'rish uchun tizimga kiring")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {effectiveUser
              ? (lang === 'ru'
                  ? 'Разместите свое первое объявление, чтобы ваши услуги увидели клиенты со всего региона.'
                  : "O'z xizmatlaringiz yoki ustaxonangiz haqida birinchi e'loningizni joylashtiring.")
              : (lang === 'ru'
                  ? 'После входа вы сможете управлять своими объявлениями и просматривать их здесь.'
                  : "Tizimga kirganingizdan so'ng, barcha e'lonlaringizni shu yerda boshqarishingiz mumkin bo'ladi.")}
          </p>
          {effectiveUser ? (
            <Link
              href="/new-listing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Подать объявление' : "Yangi e'lon berish"}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Войти по номеру' : "Raqam bilan kirish"}</span>
            </button>
          )}
        </div>
      ) : (
        /* Topilmadi holati */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t.grid.notFoundTitle}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {t.grid.notFoundDesc}
          </p>
          <button
            onClick={handleResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.grid.resetFilters}</span>
          </button>
        </div>
      )}

    </section>
  );
}


