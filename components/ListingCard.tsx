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
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
    : 'border-border hover:border-primary shadow-xs hover:shadow-xl hover:shadow-primary/10';

  const categoryName = listing.subCategory
    ? (getSubCategoryLocalizedName(listing.subCategory.slug, lang) || getSubCategoryLocalizedName(listing.subCategory.name, lang) || getCategoryLocalizedName(listing.subCategory.name, lang))
    : (getCategoryLocalizedName(listing.category.slug, lang) || getCategoryLocalizedName(listing.category.name, lang));

  const locationName = getLocationLocalizedName(listing.location, lang);

  return (
    <div
      className={`group bg-card text-card-foreground rounded-3xl border ${cardBorderClass} transition-all duration-200 flex flex-col overflow-hidden relative`}
    >
      {/* 1. Rasm va Yuqori Nishonlar */}
      <div className="relative w-full h-48 sm:h-52 bg-muted overflow-hidden">
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
                <Crown className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                <span className="truncate">{t.card.goldMaster}</span>
              </div>
            ) : isTop2 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 font-extrabold text-xs shadow-md border border-white">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.card.silverMaster}</span>
              </div>
            ) : isTop3 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-700 to-orange-700 text-white font-extrabold text-xs shadow-md border border-amber-400/50">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.card.bronzeMaster}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-black/75 backdrop-blur-md text-white font-extrabold text-xs border border-white/20">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">#{rank} {t.card.rankPlace}</span>
              </div>
            )}
          </div>
        )}

        {/* Hudud nishoni */}
        <div
          className={`absolute ${
            isTop10 ? 'top-3 right-3' : 'top-3 left-3'
          } bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1 z-10`}
        >
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate max-w-[120px]">{locationName}</span>
        </div>

        {/* Ko'rishlar soni */}
        {!isTop10 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-300 shrink-0" />
            <span>{listing.view_count}</span>
          </div>
        )}

        {/* Kategoriya va Tajriba */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white z-10 gap-2">
          <span className="bg-primary/95 backdrop-blur-xs text-primary-foreground px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-xs truncate">
            {categoryName}
          </span>
          {listing.experience && (
            <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[11px] shrink-0">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{listing.experience}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Kartochka Tanasi */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nishonlar qatori */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {listing.status === 'PENDING' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse shrink-0">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{lang === 'ru' ? 'На проверке' : 'Tekshiruvda'}</span>
              </span>
            )}
            {listing.status === 'REJECTED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-destructive/15 text-destructive border border-destructive/30 shrink-0">
                <span>{lang === 'ru' ? 'Отклонено' : 'Rad etilgan'}</span>
              </span>
            )}

            {listing.paidTier === 'VIP_GOLD' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shrink-0">
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500 shrink-0" />
                <span>{t.card.vipBadge}</span>
              </span>
            )}
            {listing.paidTier === 'STANDARD' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Sparkles className="w-3 h-3 text-primary shrink-0" />
                <span>{t.card.sponsorBadge}</span>
              </span>
            )}

            {listing.isPrivileged && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 shrink-0"
                title={listing.privilegeReason || t.card.privilegeBadge}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.card.privilegeBadge}</span>
              </span>
            )}

            {typeof listing.totalScore === 'number' && listing.totalScore > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-muted text-muted-foreground ml-auto border border-border shrink-0">
                <span>{t.card.scoreLabel}</span>
                <span className="text-primary">{listing.totalScore.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Usta ismi va Verified status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-base font-bold text-foreground truncate">
                {listing.name}
              </h3>
              {listing.isVerified && (
                <span title={t.card.verified} className="shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                </span>
              )}
            </div>

            {/* Mijoz va Xodim Reytingi */}
            <div className="flex items-center gap-1 shrink-0 bg-amber-500/10 px-2 py-1 rounded-xl border border-amber-300/40 dark:border-amber-800/50" title={`Rating: ${listing.rating.toFixed(1)}`}>
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
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
            className="block text-foreground font-semibold text-sm hover:text-primary line-clamp-2 leading-snug transition-colors mb-2"
          >
            {listing.title}
          </Link>

          {/* Qisqa tavsif */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {listing.description}
          </p>

          {/* Veb-sayt */}
          {websiteHref && (
            <div className="mb-3">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-muted border border-border transition-colors group/web w-full justify-between shrink-0"
                title={t.card.website}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    {listing.websiteUrl?.replace(/^https?:\/\//, '')}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 group-hover/web:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>

        {/* Pastki qism: Narx va Tezkor kontaktlar */}
        <div className="pt-3 border-t border-border mt-1">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium truncate">
                {t.card.priceLabel}
              </span>
              <span className="text-sm font-extrabold text-primary truncate block">
                {listing.price || t.card.negotiable}
              </span>
            </div>

            <Link
              href={`/listing/${listing.id}`}
              className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-muted active:scale-95 shrink-0"
            >
              <span>{t.card.details}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Smartfonda qulay sensor tugmalar */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Qo'ng'iroq qilish tugmasi */}
            <Tooltip className="col-span-2">
              <TooltipTrigger asChild>
                <a
                  href={phoneHref}
                  className="min-w-0 w-full min-h-11 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer touch-manipulation shrink-0"
                  aria-label={t.card.call}
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.card.call}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>{t.card.call}: {listing.phone}</TooltipContent>
            </Tooltip>

            {/* Telegram tugmasi */}
            {telegramHref ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 w-full min-h-11 py-2.5 px-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-xs transition-all touch-manipulation shrink-0"
                    aria-label="Telegram"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold hidden sm:inline truncate">{t.card.telegram}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>Telegram</TooltipContent>
              </Tooltip>
            ) : (
              <div className="min-w-0 w-full min-h-11 py-2.5 px-2 rounded-xl bg-muted text-muted-foreground text-xs flex items-center justify-center shrink-0 opacity-40">
                <Send className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Instagram yoki Veb-sayt */}
            {instagramHref ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 w-full min-h-11 py-2.5 px-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-medium text-xs flex items-center justify-center shadow-xs active:scale-95 transition-all touch-manipulation shrink-0"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Instagram</TooltipContent>
              </Tooltip>
            ) : websiteHref ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 w-full min-h-11 py-2.5 px-2 rounded-xl bg-secondary hover:bg-muted text-secondary-foreground active:scale-95 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs touch-manipulation shrink-0 border border-border"
                    aria-label={t.card.website}
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{t.card.website}</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/listing/${listing.id}`}
                    className="min-w-0 w-full min-h-11 py-2.5 px-2 rounded-xl bg-muted hover:bg-secondary active:scale-95 text-foreground text-[11px] font-semibold flex items-center justify-center transition-colors touch-manipulation shrink-0 border border-border"
                    aria-label={t.card.details}
                  >
                    <span className="truncate">{t.card.profile}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{t.card.details}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
