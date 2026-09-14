import Link from 'next/link';
import { Wrench, PhoneCall, Send, ShieldCheck, Heart, Layers, PlusCircle } from 'lucide-react';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e6e0da] text-[#67625d] pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Logo va tavsif */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#282624]">
                Sirdaryo<span className="text-orange-600 font-extrabold">Xizmat</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#67625d] leading-relaxed">
              Guliston shahri va unga tutash barcha tumanlar aholisi uchun eng qulay mahalliy ustalar, avtomobil va maishiy xizmatlar portali.
            </p>
            <div className="flex items-center gap-2.5 text-[#67625d]">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#f6f3ef] hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="tel:+998901234567"
                className="w-8 h-8 rounded-xl bg-[#f6f3ef] hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors"
                aria-label="Telefon"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sirdaryo Tumanlari */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#282624] mb-3.5">
              Viloyat shahar va tumanlari
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                <Link
                  key={loc}
                  href={`/?location=${encodeURIComponent(loc)}`}
                  className="text-[#67625d] hover:text-orange-600 transition-colors py-1 truncate font-medium"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

          {/* Tezkor havolalar va e'lon berish */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#282624] mb-3.5">
              Foydalanuvchilar uchun
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/new-listing" className="text-orange-600 font-semibold hover:underline flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Yangi e'lon berish (bepul)</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[#67625d] hover:text-[#282624] transition-colors flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>Barcha xizmatlar katalogi</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#67625d] hover:text-orange-600 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Admin Boshqaruv</span>
                </Link>
              </li>
              <li>
                <span className="text-[#67625d]/70 text-xs block mt-2 leading-relaxed">
                  Xavfsizlik eslatmasi: Usta bilan shartnomalarni to'g'ridan-to'g'ri joyida tuzing.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mualliflik va pastki chiziq */}
        <div className="pt-6 border-t border-[#e6e0da] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#67625d]">
          <div>
            © {new Date().getFullYear()} Sirdaryo Xizmat. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="hover:text-orange-600 transition-colors font-medium">
              Tizimga kirish
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Sirdaryo va Guliston ahli uchun yaratildi</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
