import Link from 'next/link';
import { Wrench, PhoneCall, Send, ShieldCheck, Heart } from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Logo va tavsif */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Sirdaryo<span className="text-blue-600">Xizmat</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Guliston shahri va unga tutash barcha tumanlar aholisi uchun eng qulay mahalliy ustalar, avtomobil va maishiy xizmatlar katalogi.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="tel:+998901234567"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors"
                aria-label="Telefon"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sirdaryo Tumanlari */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Viloyat shahar va tumanlari
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                <Link
                  key={loc}
                  href={`/?location=${encodeURIComponent(loc)}`}
                  className="text-slate-500 hover:text-blue-600 transition-colors py-1 truncate"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

          {/* Tezkor havolalar va e'lon berish */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Foydalanuvchilar uchun
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/new-listing" className="text-blue-600 font-medium hover:underline">
                  + Yangi e'lon berish (bepul)
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Barcha xizmatlar katalogi
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs block mt-3">
                  Xavfsizlik eslatmasi: Usta bilan shartnomalarni to'g'ridan-to'g'ri joyida tuzing.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mualliflik va pastki chiziq */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Sirdaryo Xizmat. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-1">
            <span>Sirdaryo va Guliston ahli uchun yaratildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
