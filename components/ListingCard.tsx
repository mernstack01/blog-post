'use client';

import Link from 'next/link';
import {
  Phone,
  Send,
  MapPin,
  Star,
  CheckCircle2,
  Eye,
  Clock,
  ArrowUpRight,
  Crown,
  ShieldCheck,
  Globe,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { ListingWithRelations } from '@/actions/listing-actions';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryLocalizedName, getSubCategoryLocalizedName, getLocationLocalizedName } from '@/lib/translations';

interface ListingCardProps {
  listing: ListingWithRelations;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { t, lang } = useLanguage();

  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800';

  const phoneHref = `tel:${listing.phone.replace(/\s+/g, '')}`;

  const telegramHref = listing.telegram
    ? listing.telegram.startsWith('http')
      ? listing.telegram
      : `https://t.me/${listing.telegram.replace('@', '')}`
    : null;

  const instagramHref = listing.instagram
    ? listing.instagram.startsWith('http')
      ? listing.instagram
      : `https://instagram.com/${listing.instagram.replace('@', '')}`
    : null;

  const websiteHref = listing.websiteUrl
    ? listing.websiteUrl.startsWith('http')
      ? listing.websiteUrl
      : `https://${listing.websiteUrl}`
    : null;

  // Rank styling
  const rank = listing.rank;
  const isTop1 = rank === 1;
  const isTop2 = rank === 2;
  const isTop3 = rank === 3;
  const isTop10 = typeof rank === 'number' && rank >= 1 && rank <= 10;

  // Border and container styling based on rank or VIP
  const cardBorderClass = isTop1
    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
    : isTop2
    ? 'border-slate-300 ring-1 ring-slate-300/60 shadow-md'
    : isTop3
    ? 'border-amber-600/60 ring-1 ring-amber-600/20 shadow-md'
    : listing.paidTier === 'VIP_GOLD'
    ? 'border-amber-300 shadow-md shadow-amber-500/5'
    : 'border-border dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-xl hover:shadow-blue-500/10';

  const categoryName = listing.subCategory
    ? (getSubCategoryLocalizedName(listing.subCategory.slug, lang) || getSubCategoryLocalizedName(listing.subCategory.name, lang) || getCategoryLocalizedName(listing.subCategory.name, lang))
    : (getCategoryLocalizedName(listing.category.slug, lang) || getCategoryLocalizedName(listing.category.name, lang));

  const locationName = getLocationLocalizedName(listing.location, lang);

  return (
    <div
      className={`group bg-card text-card-foreground rounded-3xl border ${cardBorderClass} transition-all duration-200 flex flex-col overflow-hidden relative`}
    >
      {/* 1. Rasm va Yuqori Nishonlar */}
      <div className="relative w-full h-48 sm:h-52 bg-[#f1f5f9] dark:bg-slate-800 overflow-hidden">
        <SafeImage
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30 pointer-events-none" />

        {/* Top 10 Reyting Nishoni (Yuqori chap burchak) */}
        {isTop10 && (
          <div className="absolute top-3 left-3 z-10">
            {isTop1 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 border border-yellow-200 animate-pulse">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>{t.card.goldMaster}</span>
              </div>
            ) : isTop2 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 font-extrabold text-xs shadow-md border border-white">
                <Award className="w-3.5 h-3.5" />
                <span>{t.card.silverMaster}</span>
              </div>
            ) : isTop3 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-700 to-orange-700 text-white font-extrabold text-xs shadow-md border border-amber-400/50">
                <Award className="w-3.5 h-3.5" />
                <span>{t.card.bronzeMaster}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-black/75 backdrop-blur-md text-white font-extrabold text-xs border border-white/20">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>#{rank} {t.card.rankPlace}</span>
              </div>
            )}
          </div>
        )}

        {/* Hudud nishoni (Agar Top10 bo'lsa o'ngda yoki rank bo'lmasa chapda) */}
        <div
          className={`absolute ${
            isTop10 ? 'top-3 right-3' : 'top-3 left-3'
          } bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1 z-10`}
        >
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate max-w-[120px]">{locationName}</span>
        </div>

        {/* Ko'rishlar soni (Faqat oddiy ko'rinishda yuqori o'ngda) */}
        {!isTop10 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-300" />
            <span>{listing.view_count}</span>
          </div>
        )}

        {/* Kategoriya va Tajriba (Rasm pastida) */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
          <span className="bg-blue-600/95 backdrop-blur-xs px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-xs">
            {categoryName}
          </span>
          {listing.experience && (
            <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[11px]">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{listing.experience}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Kartochka Tanasi */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nishonlar qatori: Status, VIP Homiy & Imtiyozli Usta */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {/* Tekshiruvda (Kutilmoqda) nishoni */}
            {listing.status === 'PENDING' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{lang === 'ru' ? 'На проверке' : 'Tekshiruvda'}</span>
              </span>
            )}
            {listing.status === 'REJECTED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700">
                <span>{lang === 'ru' ? 'Отклонено' : 'Rad etilgan'}</span>
              </span>
            )}

            {/* VIP Homiylik nishoni */}
            {listing.paidTier === 'VIP_GOLD' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
                <span>{t.card.vipBadge}</span>
              </span>
            )}
            {listing.paidTier === 'STANDARD' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>{t.card.sponsorBadge}</span>
              </span>
            )}

            {/* Imtiyozli Usta nishoni */}
            {listing.isPrivileged && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                title={listing.privilegeReason || t.card.privilegeBadge}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.card.privilegeBadge}</span>
              </span>
            )}

            {/* TopBaza Ball / Jami Ball */}
            {typeof listing.totalScore === 'number' && listing.totalScore > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ml-auto border border-slate-200 dark:border-slate-700">
                <span>{t.card.scoreLabel}</span>
                <span className="text-blue-600 dark:text-blue-400">{listing.totalScore.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Usta ismi va Verified status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-base font-bold text-[#1e293b] dark:text-white truncate">
                {listing.name}
              </h3>
              {listing.isVerified && (
                <span title={t.card.verified} className="shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-950" />
                </span>
              )}
            </div>

            {/* Mijoz va Xodim Reytingi */}
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-xl border border-amber-200/80 dark:border-amber-800/50" title={`Rating: ${listing.rating.toFixed(1)}`}>
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-amber-950 dark:text-amber-300">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-amber-800 dark:text-amber-400">
                ({listing.reviewCount})
              </span>
            </div>
          </div>

          {/* Sarlavha */}
          <Link
            href={`/listing/${listing.id}`}
            className="block text-[#1e293b] dark:text-slate-100 font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 leading-snug transition-colors mb-2"
          >
            {listing.title}
          </Link>

          {/* Qisqa tavsif */}
          <p className="text-xs text-[#64748b] dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {listing.description}
          </p>

          {/* Veb-sayt / Manzil / Tashqi havola (Agar mavjud bo'lsa) */}
          {websiteHref && (
            <div className="mb-3">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200/80 dark:border-sky-800/60 transition-colors group/web w-full justify-between"
                title={t.card.website}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="truncate">
                    {listing.websiteUrl?.replace(/^https?:\/\//, '')}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-sky-500 dark:text-sky-400 shrink-0 group-hover/web:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>

        {/* Pastki qism: Narx va Tezkor kontaktlar */}
        <div className="pt-3 border-t border-[#e2e8f0] dark:border-slate-800 mt-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] text-[#64748b] dark:text-slate-400 uppercase tracking-wider block font-medium">
                {t.card.priceLabel}
              </span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {listing.price || t.card.negotiable}
              </span>
            </div>

            <Link
              href={`/listing/${listing.id}`}
              className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 active:scale-95"
            >
              <span>{t.card.details}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Smartfonda qulay sensor tugmalar */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Qo'ng'iroq qilish tugmasi */}
            <a
              href={phoneHref}
              className="col-span-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer touch-manipulation"
              title={t.card.call}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.card.call}</span>
            </a>

            {/* Telegram tugmasi */}
            {telegramHref ? (
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-xs transition-all touch-manipulation"
                title="Telegram"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{t.card.telegram}</span>
              </a>
            ) : (
              <div className="py-2.5 px-2 rounded-xl bg-[#f1f5f9] dark:bg-slate-800 text-[#64748b] dark:text-slate-400 text-xs flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Instagram yoki Veb-sayt */}
            {instagramHref ? (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-medium text-xs flex items-center justify-center shadow-xs active:scale-95 transition-all touch-manipulation"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            ) : websiteHref ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-xs touch-manipulation"
                title={t.card.website}
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={`/listing/${listing.id}`}
                className="py-2.5 px-2 rounded-xl bg-[#f1f5f9] dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 active:scale-95 text-[#1e293b] dark:text-slate-200 text-[11px] font-semibold flex items-center justify-center transition-colors touch-manipulation"
                title={t.card.details}
              >
                {t.card.profile}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

