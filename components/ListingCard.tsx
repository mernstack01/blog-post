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
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { ListingWithRelations } from '@/actions/listing-actions';

interface ListingCardProps {
  listing: ListingWithRelations;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80';

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
    <div className="group bg-white rounded-2xl border border-[#e6e0da] hover:border-orange-400 shadow-xs hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Rasm va yuqori nishonlar */}
      <div className="relative w-full h-44 sm:h-48 bg-[#f6f3ef] overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

        {/* Hudud nishoni */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{listing.location}</span>
        </div>

        {/* Ko'rishlar soni */}
        <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
          <Eye className="w-3 h-3 text-slate-300" />
          <span>{listing.view_count}</span>
        </div>

        {/* Kategoriya va Tajriba (Rasm pastida) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
          <span className="bg-orange-600/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider">
            {listing.subCategory ? listing.subCategory.name : listing.category.name}
          </span>
          {listing.experience && (
            <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px]">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{listing.experience}</span>
            </span>
          )}
        </div>
      </div>

      {/* Kartochka tanasi */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Usta ismi va Verified status */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#282624] truncate">
                {listing.name}
              </h3>
              {listing.isVerified && (
                <span title="Tasdiqlangan mutaxassis" className="shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
                </span>
              )}
            </div>

            {/* Reyting */}
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-amber-950">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-amber-800">
                ({listing.reviewCount})
              </span>
            </div>
          </div>

          {/* Sarlavha */}
          <Link
            href={`/listing/${listing.id}`}
            className="block text-[#282624] font-semibold text-xs sm:text-sm hover:text-orange-600 line-clamp-2 leading-snug transition-colors mb-1.5"
          >
            {listing.title}
          </Link>

          {/* Qisqa tavsif */}
          <p className="text-[11px] sm:text-xs text-[#67625d] line-clamp-2 mb-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Pastki qism: Narx va Tezkor kontaktlar */}
        <div className="pt-2.5 border-t border-[#e6e0da] mt-1">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[10px] text-[#67625d] uppercase tracking-wider block">
                Narxi
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-orange-600">
                {listing.price || 'Kelishilgan holda'}
              </span>
            </div>

            <Link
              href={`/listing/${listing.id}`}
              className="text-xs font-semibold text-[#67625d] hover:text-orange-600 flex items-center gap-0.5 transition-colors"
            >
              <span>Batafsil</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Smartfonda qulay sensor tugmalar */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Qo'ng'iroq qilish tugmasi */}
            <a
              href={`tel:${listing.phone.replace(/\s+/g, '')}`}
              className="col-span-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Qo'ng'iroq qilish"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Qo'ng'iroq</span>
            </a>

            {/* Telegram tugmasi */}
            {telegramHref ? (
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-xs transition-all"
                title="Telegramdan yozish"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">TG</span>
              </a>
            ) : (
              <div className="py-2 px-2 rounded-xl bg-[#f6f3ef] text-[#67625d] text-xs flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Instagram yoki Profil */}
            {instagramHref ? (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-medium text-xs flex items-center justify-center shadow-xs active:scale-95 transition-all"
                title="Instagram profil"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={`/listing/${listing.id}`}
                className="py-2 px-2 rounded-xl bg-[#f6f3ef] hover:bg-orange-50 text-[#282624] text-[11px] font-semibold flex items-center justify-center transition-colors"
                title="E'lon haqida to'liq"
              >
                Ko'rish
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
