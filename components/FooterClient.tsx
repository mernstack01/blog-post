'use client';

import Link from 'next/link';
import {
  Wrench,
  PhoneCall,
  Send,
  ShieldCheck,
  Heart,
  Layers,
  PlusCircle,
  Sparkles,
  Mail,
} from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { getLocationLocalizedName } from '@/lib/translations';

interface FooterClientProps {
  siteTitle: string;
  phone: string;
  telegram: string;
  email: string;
}

export default function FooterClient({
  siteTitle,
  phone,
  telegram,
  email,
}: FooterClientProps) {
  const { lang, t } = useLanguage();

  return (
    <footer key={lang} className="bg-white dark:bg-[#0f172a] border-t border-[#e6e0da] dark:border-slate-800 text-[#67625d] dark:text-slate-400 pt-12 pb-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Logo va tavsif */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#282624] dark:text-white">
                {siteTitle.replace(/\.uz$/i, '')}
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">.uz</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#67625d] dark:text-slate-400 leading-relaxed">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2.5 text-[#67625d] dark:text-slate-400">
              <a
                href={`https://t.me/${telegram}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#f6f3ef] dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-colors"
                aria-label="Telegram"
                title={`Telegram: @${telegram}`}
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="w-8 h-8 rounded-xl bg-[#f6f3ef] dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors"
                aria-label="Telefon"
                title={`Tel: ${phone}`}
              >
                <PhoneCall className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 rounded-xl bg-[#f6f3ef] dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-colors"
                aria-label="Email"
                title={`Email: ${email}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sirdaryo Tumanlari */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#282624] dark:text-white mb-3.5">
              {t.footer.districtsTitle}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                <Link
                  key={loc}
                  href={`/?location=${encodeURIComponent(loc)}`}
                  className="text-[#67625d] dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 truncate font-medium"
                >
                  {getLocationLocalizedName(loc, lang)}
                </Link>
              ))}
            </div>
          </div>

          {/* Tezkor havolalar va e'lon berish */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#282624] dark:text-white mb-3.5">
              {t.footer.forUsers}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/new-listing" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.footer.postFree}</span>
                </Link>
              </li>
              <li>
                <Link href="/?mode=top10" className="text-[#67625d] dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>{t.footer.top10Board}</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[#67625d] dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{t.footer.catalogAll}</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#67625d] dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{t.footer.adminControl}</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Mualliflik va pastki chiziq */}
        <div className="pt-6 border-t border-[#e6e0da] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#67625d] dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} {siteTitle}. {t.footer.allRights}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {t.footer.loginSystem}
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>{lang === 'ru' ? 'Создано для жителей Сырдарьи и Узбекистана' : "Sirdaryo va butun O'zbekiston uchun yaratildi"}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
