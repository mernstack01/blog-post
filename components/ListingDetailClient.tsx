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
  ArrowLeft,
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import Link from 'next/link';

interface ListingDetailClientProps {
  listing: ListingWithRelations;
}

export default function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const searchParams = useSearchParams();
  const isJustCreated = searchParams.get('created') === 'true';
  const [selectedImage, setSelectedImage] = useState<string>(
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80'
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

  return (
    <div className="space-y-6">
      {/* Yangi yaratilgandagi muvaffaqiyat xabari */}
      {isJustCreated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">Tabriklaymiz!</strong> E'loningiz muvaffaqiyatli joylashtirildi va hozirda barcha foydalanuvchilarga ko'rinmoqda.
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Bosh sahifaga
          </Link>
        </div>
      )}

      {/* Asosiy Kartochka */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Chap qism: Galereya (5 ustun) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between">
            <div>
              {/* Asosiy katta rasm */}
              <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xs bg-slate-200">
                <img
                  src={selectedImage}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{listing.location}</span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>{viewCount} marta ko'rildi</span>
                </div>
              </div>

              {/* Kichik rasmchalar (thumbnails) */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex items-center gap-2.5 mt-3 overflow-x-auto no-scrollbar py-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
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
            <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
              <span>E'lon ID: #{listing.id.slice(-6)}</span>
              <button
                onClick={handleShare}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ulashish</span>
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
                <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  {listing.category.name}
                </span>
                {listing.subCategory && (
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    {listing.subCategory.name}
                  </span>
                )}
                {listing.isVerified && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Tasdiqlangan Usta
                  </span>
                )}
              </div>

              {/* Sarlavha */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {listing.title}
              </h1>

              {/* Usta ismi, reyting va tajriba */}
              <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Usta / Mutaxassis</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    {listing.name}
                    {listing.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
                    )}
                  </span>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/70">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-900">
                    {listing.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-amber-700/80">
                    ({listing.reviewCount} ta baho)
                  </span>
                </div>

                {listing.experience && (
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{listing.experience} tajriba</span>
                  </div>
                )}
              </div>

              {/* Manzil va Narx */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs text-slate-400 block font-medium">
                    Xizmat ko'rsatish hududi:
                  </span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{listing.location}</span>
                  </span>
                  {listing.address && (
                    <span className="text-xs text-slate-500 block mt-1">
                      {listing.address}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                  <span className="text-xs text-blue-600 block font-medium">
                    Boshlang'ich narxi:
                  </span>
                  <span className="text-base font-extrabold text-blue-900 flex items-center gap-1.5 mt-0.5">
                    <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{listing.price || 'Kelishilgan holda'}</span>
                  </span>
                </div>
              </div>

              {/* Batafsil tavsif */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Xizmat haqida to'liq ma'lumot
                </h3>
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {listing.description}
                </div>
              </div>

            </div>

            {/* Aloqa tugmalari (Katta va qulay) */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                To'g'ridan-to'g'ri aloqaga chiqish:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Qo'ng'iroq qilish */}
                <a
                  href={`tel:${listing.phone.replace(/\s+/g, '')}`}
                  className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span>Qo'ng'iroq: {listing.phone}</span>
                </a>

                {/* Telegram */}
                {telegramHref ? (
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98]"
                  >
                    <Send className="w-5 h-5" />
                    <span>Telegram orqali yozish</span>
                  </a>
                ) : (
                  <div className="py-4 px-6 rounded-2xl bg-slate-100 text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>Telegram mavjud emas</span>
                  </div>
                )}
              </div>

              {/* Instagram linki (agar mavjud bo'lsa) */}
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-opacity"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram sahifasini ko'rish</span>
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
