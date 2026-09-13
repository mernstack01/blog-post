'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Rasm va yuqori nishonlar */}
      <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Hudud nishoni */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>{listing.location}</span>
        </div>

        {/* Ko'rishlar soni */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-300" />
          <span>{listing.view_count}</span>
        </div>

        {/* Tajriba va Kategoriya (Rasm pastida) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="bg-blue-600/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md font-semibold text-[11px] uppercase tracking-wider">
            {listing.subCategory ? listing.subCategory.name : listing.category.name}
          </span>
          {listing.experience && (
            <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{listing.experience} tajriba</span>
            </span>
          )}
        </div>
      </div>

      {/* Kartochka asosiy matni */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Usta ismi va Verified status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {listing.name}
              </h3>
              {listing.isVerified && (
                <span title="Tasdiqlangan mutaxassis" className="shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
                </span>
              )}
            </div>

            {/* Reyting */}
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-900">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-amber-700/80">
                ({listing.reviewCount})
              </span>
            </div>
          </div>

          {/* Sarlavha */}
          <Link
            href={`/listing/${listing.id}`}
            className="block text-slate-800 font-semibold text-sm sm:text-base hover:text-blue-600 line-clamp-2 leading-snug transition-colors mb-2"
          >
            {listing.title}
          </Link>

          {/* Qisqa tavsif */}
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Pastki qism: Narx va Tezkor kontaktlar */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Narxi
              </span>
              <span className="text-sm font-bold text-blue-700">
                {listing.price || 'Kelishilgan holda'}
              </span>
            </div>

            <Link
              href={`/listing/${listing.id}`}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-0.5 transition-colors group-hover:translate-x-0.5"
            >
              <span>Batafsil</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Aloqa tugmalari */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Qo'ng'iroq qilish tugmasi */}
            <a
              href={`tel:${listing.phone.replace(/\s+/g, '')}`}
              className="col-span-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
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
                className="py-2.5 px-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
                title="Telegramdan yozish"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TG</span>
              </a>
            ) : (
              <div className="py-2.5 px-2 rounded-xl bg-slate-100 text-slate-400 text-xs flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Instagram yoki Batafsil tugmasi */}
            {instagramHref ? (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
                title="Instagram profil"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={`/listing/${listing.id}`}
                className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center transition-colors"
                title="E'lon haqida to'liq"
              >
                Profil
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
