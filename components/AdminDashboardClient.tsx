'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  adminUpdateListingStatusAction,
  adminDeleteListingAction,
  adminToggleVerifyAction,
  adminLogoutAction,
  adminUpdateStaffRatingAction,
  adminUpdatePrivilegeAction,
  adminUpdatePaidTierAction,
  adminSyncListingScoresAction,
} from '@/actions/admin-actions';
import { ListingStatus, PaidTier, PrivilegeType } from '@/lib/scoring';
import {
  PlusCircle,
  LogOut,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  ExternalLink,
  MapPin,
  Phone,
  Layers,
  Sparkles,
  AlertCircle,
  Search,
  ShieldCheck,
  BadgeCheck,
  Crown,
  Star,
  RefreshCw,
  Globe,
} from 'lucide-react';
import SafeImage from '@/components/SafeImage';

interface AdminDashboardClientProps {
  stats: {
    totalListings: number;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    vipCount?: number;
    privilegedCount?: number;
    totalCategories?: number;
    activeCategories?: number;
    totalDistricts?: number;
    totalViews: number;
  };
  initialListings: any[];
}

export default function AdminDashboardClient({ stats, initialListings }: AdminDashboardClientProps) {
  const [listings, setListings] = useState(initialListings);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ListingStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Qidiruv va status bo'yicha filtrlash
  const filteredListings = listings.filter((l) => {
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (l.title && l.title.toLowerCase().includes(q)) ||
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (l.location && l.location.toLowerCase().includes(q))
    );
  });

  // Statusni o'zgartirish
  const handleStatusChange = async (id: string, newStatus: ListingStatus) => {
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await adminUpdateListingStatusAction(id, newStatus);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        setMessage({ text: `Status ${newStatus} ga o'zgartirildi`, type: 'success' });
      } else {
        setMessage({ text: res.message || "Xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Usta verifikatsiyasini o'zgartirish
  const handleToggleVerify = async (id: string) => {
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await adminToggleVerifyAction(id);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, isVerified: res.isVerified } : l))
        );
        setMessage({ text: res.message || "Verifikatsiya yangilandi", type: 'success' });
      } else {
        setMessage({ text: res.message || "Xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // E'lonni o'chirish
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Haqiqatan ham "${title}" e'lonini o'chirmoqchimisiz?`)) {
      return;
    }
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await adminDeleteListingAction(id);
      if (res.success) {
        setListings((prev) => prev.filter((l) => l.id !== id));
        setMessage({ text: "E'lon muvaffaqiyatli o'chirildi", type: 'success' });
      } else {
        setMessage({ text: res.message || "O'chirishda xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Xodim bahosini o'zgartirish
  const handleRatingChange = async (id: string, staffRating: number) => {
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await adminUpdateStaffRatingAction(id, staffRating);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, adminRating: res.adminRating, totalScore: res.totalScore } : l))
        );
        setMessage({ text: res.message || "Xodim bahosi yangilandi", type: 'success' });
      } else {
        setMessage({ text: res.message || "Xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // To'lov / Homiylik darajasini o'zgartirish
  const handlePaidTierChange = async (id: string, tier: PaidTier) => {
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await adminUpdatePaidTierAction(id, tier);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, paidTier: res.paidTier, totalScore: res.totalScore } : l))
        );
        setMessage({ text: res.message || "To'lov darajasi yangilandi", type: 'success' });
      } else {
        setMessage({ text: res.message || "Xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Ijtimoiy imtiyozni o'zgartirish
  const handlePrivilegeChange = async (id: string, privilege: PrivilegeType) => {
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await adminUpdatePrivilegeAction(id, privilege);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, privilegeType: res.privilegeType, totalScore: res.totalScore } : l))
        );
        setMessage({ text: res.message || "Imtiyoz yangilandi", type: 'success' });
      } else {
        setMessage({ text: res.message || "Xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Barcha ballarni sinxronlash
  const handleSyncScores = async () => {
    setActionLoadingId('sync');
    setMessage(null);
    try {
      const res = await adminSyncListingScoresAction();
      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } catch {
      setMessage({ text: "Sinxronlashda xatolik yuz berdi", type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = async () => {
    await adminLogoutAction();
  };

  return (
    <div className="space-y-6">
      
      {/* Yuqori Panel: Sarlavha, Navigatsiya, Yangi Post va Chiqish */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              SuperAdmin
            </span>
            <span className="text-xs text-[#67625d] dark:text-zinc-400 font-medium">
              E'lonlar Boshqaruvi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#282624] dark:text-zinc-100 tracking-tight mt-1">
            XayrliIsh.uz Boshqaruv Markazi
          </h1>
        </div>

        {/* Sub-Navigatsiya Tablari va Tugmalar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
          >
            E'lonlar
          </Link>
          <Link
            href="/admin/categories"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 transition-colors"
          >
            Kategoriyalar
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 transition-colors"
          >
            Sozlamalar
          </Link>

          {/* Ballarni qayta hisoblash tugmasi */}
          <button
            onClick={handleSyncScores}
            disabled={actionLoadingId === 'sync'}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
            title="Barcha e'lonlarning Top 10 reyting ballarini sinxronlash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${actionLoadingId === 'sync' ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Ballarni Sinxronlash</span>
          </button>

          {/* Yangi Post Yaratish Tugmasi */}
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Yangi e'lon</span>
          </Link>

          {/* Chiqish */}
          <button
            onClick={handleLogout}
            type="button"
            className="p-2 rounded-xl bg-[#f6f3ef] dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[#67625d] dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Xabar bildirishnomasi */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Real-time DB Statistika Kartalari */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-[#67625d] dark:text-zinc-400 uppercase tracking-wider block">
            Jami E'lonlar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#282624] dark:text-zinc-100 tracking-tight mt-1 block">
            {stats.totalListings}
          </span>
          <span className="text-[10px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Barcha tumanlar
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Tasdiqlangan
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 block">
            {stats.approvedCount}
          </span>
          <span className="text-[10px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Saytda ko'rinmoqda
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            Kutilmoqda
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight mt-1 block">
            {stats.pendingCount}
          </span>
          <span className="text-[10px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Tekshiruv kutilmoqda
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
            Kategoriyalar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight mt-1 block">
            {stats.totalCategories ?? 6}
          </span>
          <span className="text-[10px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            {stats.activeCategories ?? 6} ta faol
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
            VIP & Imtiyoz
          </span>
          <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mt-1 block">
            {(stats.vipCount || 0) + (stats.privilegedCount || 0)}
          </span>
          <span className="text-[10px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            {stats.vipCount || 0} VIP / {stats.privilegedCount || 0} imtiyoz
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
            Ko'rishlar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight mt-1 block">
            {stats.totalViews}
          </span>
          <span className="text-[10px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Mijozlar tashriflari
          </span>
        </div>
      </div>

      {/* Qidiruv va Filtr boshqaruvi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3.5 sm:p-4 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
        {/* Qidiruv qatori */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#67625d] dark:text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Usta ismi, e'lon sarlavhasi, telefon yoki tuman bo'yicha tezkor qidiruv..."
            className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 text-xs sm:text-sm text-[#282624] dark:text-zinc-100 bg-white dark:bg-zinc-800 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 px-1.5 py-0.5 rounded-md hover:bg-[#f6f3ef] dark:hover:bg-zinc-800"
            >
              Tozalash
            </button>
          )}
        </div>

        {/* Filtr tablari */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { label: `Hammasi (${listings.length})`, value: 'ALL' },
            { label: `Tasdiqlangan (${listings.filter((l) => l.status === 'APPROVED').length})`, value: 'APPROVED' },
            { label: `Kutilmoqda (${listings.filter((l) => l.status === 'PENDING').length})`, value: 'PENDING' },
            { label: `Rad etilgan (${listings.filter((l) => l.status === 'REJECTED').length})`, value: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value as any)}
              type="button"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-[#282624] dark:bg-blue-600 text-white shadow-xs'
                  : 'text-[#67625d] dark:text-zinc-400 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 hover:text-[#282624] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* E'lonlar Ro'yxati */}
      <div className="space-y-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((item) => {
            const isLoading = actionLoadingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 p-4 sm:p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/50 transition-all flex flex-col gap-3.5"
              >
                {/* 1. Yuqori Qator: Asosiy Ma'lumotlar va Boshqaruv Tugmalari */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Chap taraf: Rasm va ma'lumotlar */}
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <SafeImage
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800'
                      }
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 bg-[#f6f3ef] dark:bg-zinc-800 border border-[#e6e0da] dark:border-zinc-700"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Status nishoni */}
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : item.status === 'PENDING'
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {item.status === 'APPROVED' ? 'Faol' : item.status === 'PENDING' ? 'Kutilmoqda' : 'Rad etilgan'}
                        </span>

                        {/* Verifikatsiya belgisi */}
                        {item.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-950" />
                            Verified
                          </span>
                        )}

                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded-md">
                          {item.category?.name}
                        </span>

                        {/* Veb-sayt mavjudligi */}
                        {item.websiteUrl && (
                          <a
                            href={item.websiteUrl.startsWith('http') ? item.websiteUrl : `https://${item.websiteUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                            title={item.websiteUrl}
                          >
                            <Globe className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                            <span>Veb-sayt</span>
                          </a>
                        )}
                      </div>

                      <Link
                        href={`/listing/${item.id}`}
                        className="text-sm sm:text-base font-bold text-[#282624] dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 block"
                      >
                        {item.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#67625d] dark:text-zinc-400 mt-1.5">
                        <span className="font-bold text-[#282624] dark:text-zinc-100 flex items-center gap-1">
                          {item.name}
                          {item.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-950" />
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {item.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {item.view_count} ko'rilgan
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* O'ng taraf: Asosiy Harakatlar tugmalari */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#e6e0da] dark:border-zinc-800 w-full md:w-auto justify-end">
                    {/* Saytda ko'rish */}
                    <Link
                      href={`/listing/${item.id}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-[#f6f3ef] dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#67625d] dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Saytda ko'rish"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Verifikatsiya berish / bekor qilish */}
                    <button
                      onClick={() => handleToggleVerify(item.id)}
                      disabled={isLoading}
                      type="button"
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 ${
                        item.isVerified
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/70'
                          : 'bg-[#f6f3ef] dark:bg-zinc-800 text-[#67625d] dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                      }`}
                      title={item.isVerified ? "Verifikatsiyani bekor qilish" : "Ustaga Verified ko'k galochka berish"}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${item.isVerified ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                      <span className="hidden sm:inline">{item.isVerified ? 'Tasdiqlangan' : 'Verifikatsiya'}</span>
                    </button>

                    {/* Tasdiqlash */}
                    {item.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleStatusChange(item.id, ListingStatus.APPROVED)}
                        disabled={isLoading}
                        type="button"
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        title="Tasdiqlash"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tasdiqlash</span>
                      </button>
                    )}

                    {/* Rad etish */}
                    {item.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleStatusChange(item.id, ListingStatus.REJECTED)}
                        disabled={isLoading}
                        type="button"
                        className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        title="Rad etish"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rad etish</span>
                      </button>
                    )}

                    {/* O'chirish */}
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={isLoading}
                      type="button"
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                      title="Butunlay o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Quyi Qator: Top 10 Reyting, Xodim Bahosi, Homiylik va Imtiyoz Boshqaruvi */}
                <div className="pt-3 border-t border-[#f0ece7] dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center bg-[#faf8f5] dark:bg-zinc-800/60 p-3 rounded-2xl">
                  {/* Jami Ball va Nishonlar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#67625d] dark:text-zinc-400">Jami Ball:</span>
                    <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 text-xs font-black shadow-2xs">
                      {typeof item.totalScore === 'number' ? item.totalScore.toFixed(1) : '0.0'} / 100
                    </span>
                    {item.paidTier === 'VIP_GOLD' && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 text-[10px] font-extrabold flex items-center gap-1 border border-amber-300 dark:border-amber-700">
                        <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-amber-500" />
                        VIP
                      </span>
                    )}
                    {item.isPrivileged && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 text-[10px] font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-700">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Imtiyoz
                      </span>
                    )}
                  </div>

                  {/* Xodim Bahosi */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#67625d] dark:text-zinc-400 shrink-0">Xodim:</span>
                    <select
                      value={item.adminRating || 4.5}
                      disabled={isLoading}
                      onChange={(e) => handleRatingChange(item.id, parseFloat(e.target.value))}
                      className="w-full text-xs font-bold bg-white dark:bg-zinc-800 border border-[#e6e0da] dark:border-zinc-700 text-[#282624] dark:text-zinc-100 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="5.0">5.0 ★ (A'lo xizmat)</option>
                      <option value="4.8">4.8 ★ (Yuqori daraja)</option>
                      <option value="4.5">4.5 ★ (Yaxshi)</option>
                      <option value="4.0">4.0 ★ (O'rtacha)</option>
                      <option value="3.5">3.5 ★ (Qoniqarli)</option>
                      <option value="3.0">3.0 ★ (Past)</option>
                    </select>
                  </div>

                  {/* Tarif / Homiylik */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#67625d] dark:text-zinc-400 shrink-0">Tarif:</span>
                    <select
                      value={item.paidTier || 'FREE'}
                      disabled={isLoading}
                      onChange={(e) => handlePaidTierChange(item.id, e.target.value as PaidTier)}
                      className="w-full text-xs font-bold bg-white dark:bg-zinc-800 border border-[#e6e0da] dark:border-zinc-700 text-[#282624] dark:text-zinc-100 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="FREE">Oddiy (FREE)</option>
                      <option value="STANDARD">⭐ Standart Homiy (+10)</option>
                      <option value="VIP_GOLD">👑 VIP Homiylik (+20)</option>
                    </select>
                  </div>

                  {/* Ijtimoiy Imtiyoz */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#67625d] dark:text-zinc-400 shrink-0">Imtiyoz:</span>
                    <select
                      value={item.privilegeType || 'NONE'}
                      disabled={isLoading}
                      onChange={(e) => handlePrivilegeChange(item.id, e.target.value as PrivilegeType)}
                      className="w-full text-xs font-bold bg-white dark:bg-zinc-800 border border-[#e6e0da] dark:border-zinc-700 text-[#282624] dark:text-zinc-100 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="NONE">Imtiyozsiz</option>
                      <option value="DISABILITY">♿ Nogironlik (+15)</option>
                      <option value="YOUTH_STARTUP">🚀 Yoshlar startapi (+15)</option>
                      <option value="HONORARY_MASTER">🏅 Faxriy usta (+15)</option>
                      <option value="SOCIAL_PROTECT">🛡️ Ijtimoiy himoya (+15)</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 p-10 text-center text-[#67625d] dark:text-zinc-400">
            <p className="font-semibold text-sm mb-2">Qidiruv bo'yicha mos e'lonlar topilmadi.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Qidiruvni tozalash
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
