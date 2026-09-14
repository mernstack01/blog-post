import Link from 'next/link';
import { Search, Home, Layers, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-[#fffdfa] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* 404 badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-50 border border-orange-200 text-orange-600 mb-6 shadow-xs">
          <span className="text-3xl font-black tracking-tighter">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#282624] tracking-tight mb-3">
          Sahifa topilmadi
        </h1>

        <p className="text-sm sm:text-base text-[#67625d] mb-8 leading-relaxed">
          Kechirasiz, siz qidirayotgan e'lon yoki sahifa manzili o'zgargan yoki saytdan olib tashlangan bo'lishi mumkin.
        </p>

        {/* Tezkor tugmalar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Bosh sahifaga qaytish</span>
          </Link>

          <Link
            href="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#f6f3ef] hover:bg-[#ede9e3] text-[#282624] font-semibold text-sm transition-all"
          >
            <Layers className="w-4 h-4 text-orange-600" />
            <span>Barcha xizmatlar katalogi</span>
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-[#e6e0da] text-xs text-[#67625d]">
          Sirdaryo viloyati bo'yicha usta yoki xizmat qidiryapsizmi?{' '}
          <Link href="/" className="text-orange-600 font-bold hover:underline">
            Qidiruv orqali toping
          </Link>
        </div>
      </div>
    </div>
  );
}
