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
  FileText,
} from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();

  return (
    <footer key={lang} className="bg-card text-card-foreground border-t border-border pt-12 pb-24 md:pb-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Logo va tavsif */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1.5 ring-border shadow-xs group-hover:scale-105 transition-transform shrink-0 bg-white">
                <img
                  src="/logo.jpg"
                  alt="TopBaza.uz"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                {siteTitle.replace(/\.uz$/i, '')}
                <span className="text-primary font-extrabold">.uz</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <a
                href={`https://t.me/${telegram}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-secondary hover:bg-muted hover:text-primary flex items-center justify-center transition-colors shrink-0"
                aria-label="Telegram"
                title={`Telegram: @${telegram}`}
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="w-8 h-8 rounded-xl bg-secondary hover:bg-muted hover:text-emerald-600 flex items-center justify-center transition-colors shrink-0"
                aria-label="Telefon"
                title={`Tel: ${phone}`}
              >
                <PhoneCall className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 rounded-xl bg-secondary hover:bg-muted hover:text-primary flex items-center justify-center transition-colors shrink-0"
                aria-label="Email"
                title={`Email: ${email}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sirdaryo Tumanlari */}
          <div className="md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
              {t.footer.districtsTitle}
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').slice(0, 10).map((loc) => (
                <Link
                  key={loc}
                  href={`/?location=${encodeURIComponent(loc)}`}
                  className="text-muted-foreground hover:text-primary transition-colors py-0.5 truncate font-medium"
                >
                  {getLocationLocalizedName(loc, lang)}
                </Link>
              ))}
            </div>
          </div>

          {/* Tezkor havolalar */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              {t.footer.forUsers}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/new-listing" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>{t.footer.postFree}</span>
                </Link>
              </li>
              <li>
                <Link href="/?mode=top10" className="text-muted-foreground hover:text-amber-500 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                  <span>{t.footer.top10Board}</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{t.footer.catalogAll}</span>
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/my-listings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span>{lang === 'ru' ? 'Мои объявления' : "Mening e'lonlarim"}</span>
                  </Link>
                </li>
              )}
              {user?.role === 'ADMIN' && (
                <li>
                  <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>{t.footer.adminControl}</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Bog'lanish */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              {lang === 'ru' ? 'Контакты' : "Bog'lanish"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-primary shrink-0" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Send className="w-4 h-4 text-primary shrink-0" />
                  <span>{telegram.startsWith('@') ? telegram : `@${telegram}`}</span>
                </a>
              </li>
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Mualliflik va pastki chiziq */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {siteTitle}. {t.footer.allRights}
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'ADMIN' && (
              <>
                <Link href="/admin" className="hover:text-primary transition-colors font-medium">
                  {t.footer.loginSystem}
                </Link>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-1">
              <span>{lang === 'ru' ? 'Создано для жителей Сырдарьи и Узбекистана' : "Sirdaryo va butun O'zbekiston uchun yaratildi"}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
