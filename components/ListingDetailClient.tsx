'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { incrementViewCountAction, ListingWithRelations } from '@/actions/listing-actions';
import {
  Phone,
  Send,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Eye,
  Coins,
  ShieldCheck,
  Share2,
  Check,
  Crown,
  Globe,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryLocalizedName, getLocationLocalizedName } from '@/lib/translations';

interface ListingDetailClientProps {
  listing: ListingWithRelations;
}

export default function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const isJustCreated = searchParams.get('created') === 'true';
  const isPending = searchParams.get('pending') === 'true' || listing.status === 'PENDING';
  const [selectedImage, setSelectedImage] = useState<string>(
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800'
  );
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(listing.view_count);

  // Sahifa ochilganda ko'rishlar sonini oshirish
  useEffect(() => {
    let isMounted = true;
    incrementViewCountAction(listing.id).then((res) => {
      if (res.success && isMounted) {
        setViewCount((prev) => prev + 1);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [listing.id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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

  const categoryName = listing.subCategory
    ? getCategoryLocalizedName(listing.subCategory.name, lang)
    : getCategoryLocalizedName(listing.category.name, lang);

  const locationName = getLocationLocalizedName(listing.location, lang);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Kutilayotgan e'lon xabari */}
      {isPending && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <strong className="font-bold">{lang === 'ru' ? "Объявление на проверке:" : "E'lon tekshiruvda:"}</strong>{' '}
              {lang === 'ru'
                ? "Данное объявление принято и будет видно всем после одобрения модератором."
                : "Ushbu e'lon qabul qilindi va moderator tomonidan tasdiqlangach saytda barchaga ko'rinadi."}
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 ml-3 active:scale-95"
          >
            {t.detail.backHome}
          </Link>
        </div>
      )}

      {/* Yangi yaratilgandagi muvaffaqiyat xabari */}
      {isJustCreated && !isPending && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <strong className="font-bold">{lang === 'ru' ? "Поздравляем!" : "Tabriklaymiz!"}</strong>{' '}
              {lang === 'ru'
                ? "Ваше объявление успешно опубликовано и доступно пользователям."
                : "E'loningiz muvaffaqiyatli joylashtirildi va hozirda barcha foydalanuvchilarga ko'rinmoqda."}
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors active:scale-95"
          >
            {t.detail.backHome}
          </Link>
        </div>
      )}

      {/* Asosiy Kartochka */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e6e0da] dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Chap qism: Galereya (5 ustun) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-[#e6e0da] dark:border-slate-800 flex flex-col justify-between">
            <div>
              {/* Asosiy katta rasm */}
              <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xs bg-[#f6f3ef] dark:bg-slate-800">
                <SafeImage
                  src={selectedImage}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 pointer-events-none">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{locationName}</span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 pointer-events-none">
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>{viewCount} {t.card.views}</span>
                </div>
              </div>

              {/* Kichik rasmchalar (thumbnails) */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex items-center gap-2.5 mt-3 overflow-x-auto no-scrollbar touch-pan-x py-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      type="button"
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer active:scale-95 touch-manipulation ${
                        selectedImage === img
                          ? 'border-blue-600 ring-2 ring-blue-500/20'
                          : 'border-[#e6e0da] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Havolani ulashish */}
            <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>ID: #{listing.id.slice(-6)}</span>
              <button
                onClick={handleShare}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer touch-manipulation"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{t.detail.linkCopied}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{t.detail.shareLink}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* O'ng qism: Batafsil ma'lumotlar va aloqa (7 ustun) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Kategoriya va Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                  {categoryName}
                </span>
                {listing.subCategory && (
                  <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    {getCategoryLocalizedName(listing.subCategory.name, lang)}
                  </span>
                )}
                {listing.paidTier === 'VIP_GOLD' && (
                  <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-extrabold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
                    {t.card.vipBadge}
                  </span>
                )}
                {listing.paidTier === 'STANDARD' && (
                  <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    {t.card.sponsorBadge}
                  </span>
                )}
                {listing.isPrivileged && (
                  <span
                    className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1"
                    title={listing.privilegeReason || t.card.privilegeBadge}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {t.card.privilegeBadge}
                  </span>
                )}
                {listing.isVerified && (
                  <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-950" />
                    {t.detail.verifiedBadge}
                  </span>
                )}
                {typeof listing.totalScore === 'number' && listing.totalScore > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1 ml-auto shadow-2xs border border-slate-700/50">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.card.scoreLabel} {listing.totalScore.toFixed(1)} / 100</span>
                  </span>
                )}
              </div>

              {/* Sarlavha */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                {listing.title}
              </h1>

              {/* Usta ismi, reyting va tajriba */}
              <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">{t.detail.masterTitle}</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {listing.name}
                    {listing.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-950" />
                    )}
                  </span>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/70 dark:border-amber-800/50">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-900 dark:text-amber-300">
                    {listing.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-amber-700/80 dark:text-amber-400/80">
                    ({listing.reviewCount} {t.detail.ratingsCount})
                  </span>
                </div>

                {listing.experience && (
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/50 dark:border-slate-700/50">
                    <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{listing.experience} {t.card.experience}</span>
                  </div>
                )}
              </div>

              {/* Manzil va Narx */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-xs text-slate-400 block font-medium">
                    {t.detail.serviceLocation}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{locationName}</span>
                  </span>
                  {listing.address && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                      {listing.address}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40">
                  <span className="text-xs text-blue-600 dark:text-blue-400 block font-medium">
                    {t.detail.startingPrice}
                  </span>
                  <span className="text-base font-extrabold text-blue-950 dark:text-blue-300 flex items-center gap-1.5 mt-0.5">
                    <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{listing.price || t.card.negotiable}</span>
                  </span>
                </div>
              </div>

              {/* Batafsil tavsif */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t.detail.aboutService}
                </h3>
                <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {listing.description}
                </div>
              </div>

            </div>

            {/* Aloqa tugmalari (Desktop va Tablet) */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.detail.directContact}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Qo'ng'iroq qilish */}
                <a
                  href={phoneHref}
                  className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer touch-manipulation"
                >
                  <Phone className="w-5 h-5" />
                  <span>{t.detail.callMaster} {listing.phone}</span>
                </a>

                {/* Telegram */}
                {telegramHref ? (
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] touch-manipulation"
                  >
                    <Send className="w-5 h-5" />
                    <span>{t.detail.writeTelegram}</span>
                  </a>
                ) : (
                  <div className="py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>{t.detail.noTelegram}</span>
                  </div>
                )}
              </div>

              {/* Instagram linki (agar mavjud bo'lsa) */}
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-opacity active:scale-95 touch-manipulation"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>{t.detail.viewInstagram}</span>
                </a>
              )}

              {/* Veb-sayt yoki Tashqi havola (agar mavjud bo'lsa) */}
              {listing.websiteUrl && (
                <a
                  href={listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95 touch-manipulation border border-slate-700/50"
                >
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>{t.detail.officialWebsite} {listing.websiteUrl.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* SMARTFONLAR UCHUN MAXSUS STICKY ALOQA PANELI (Pastki qotib turuvchi tezkor panel) */}
      <aside aria-label="Tezkor aloqa paneli" className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#e6e0da] dark:border-slate-800 p-2.5 px-4 flex items-center gap-2.5 md:hidden shadow-2xl">
        <a
          href={phoneHref}
          className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all touch-manipulation"
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span className="truncate">{t.detail.quickCall}</span>
        </a>

        {telegramHref ? (
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-2xl bg-sky-500 active:bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 active:scale-95 transition-all touch-manipulation"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.detail.quickTG}</span>
          </a>
        ) : (
          <button
            onClick={handleShare}
            type="button"
            className="py-3 px-4 rounded-2xl bg-[#f6f3ef] dark:bg-slate-800 text-[#282624] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-manipulation"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="text-xs">{copied ? t.detail.linkCopied : t.detail.shareLink}</span>
          </button>
        )}
      </aside>

    </div>
  );
}

