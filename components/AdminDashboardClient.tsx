'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  adminUpdateListingStatusAction,
  adminDeleteListingAction,
  adminLogoutAction,
} from '@/actions/admin-actions';
import { ListingStatus } from '@prisma/client';
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
} from 'lucide-react';
import SafeImage from '@/components/SafeImage';


interface AdminDashboardClientProps {
  stats: {
    totalListings: number;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalViews: number;
  };
  initialListings: any[];
}

export default function AdminDashboardClient({ stats, initialListings }: AdminDashboardClientProps) {
  const [listings, setListings] = useState(initialListings);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ListingStatus>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Filtrlangan e'lonlar
  const filteredListings = statusFilter === 'ALL'
    ? listings
    : listings.filter((l) => l.status === statusFilter);

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

  const handleLogout = async () => {
    await adminLogoutAction();
  };

  return (
    <div className="space-y-6">
      
      {/* Yuqori Panel: Sarlavha, Yangi Post va Chiqish */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#e6e0da] shadow-xs">
        <div>
          <span className="text-[11px] uppercase font-bold text-orange-600 tracking-wider">
            Admin Boshqaruv Markazi
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#282624] tracking-tight">
            Sirdaryo Xizmatlari Nazorati
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Yangi Post Yaratish Tugmasi */}
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>+ Yangi post yaratish</span>
          </Link>

          {/* Chiqish */}
          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#f6f3ef] hover:bg-red-50 text-[#67625d] hover:text-red-600 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </div>

      {/* Xabar bildirishnomasi */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 4 ta Statistika Kartalari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e6e0da] shadow-2xs">
          <span className="text-[11px] font-bold text-[#67625d] uppercase tracking-wider block">
            Jami E'lonlar
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#282624] tracking-tight mt-1 block">
            {stats.totalListings}
          </span>
          <span className="text-[11px] text-[#67625d] mt-1 block">
            Barcha tumanlar bo'yicha
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e6e0da] shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Tasdiqlangan
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight mt-1 block">
            {stats.approvedCount}
          </span>
          <span className="text-[11px] text-[#67625d] mt-1 block">
            Saytda ko'rinmoqda
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e6e0da] shadow-2xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Kutilmoqda
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight mt-1 block">
            {stats.pendingCount}
          </span>
          <span className="text-[11px] text-[#67625d] mt-1 block">
            Tekshiruv talab qilinadi
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e6e0da] shadow-2xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Jami Ko'rishlar
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight mt-1 block">
            {stats.totalViews}
          </span>
          <span className="text-[11px] text-[#67625d] mt-1 block">
            Mijozlar tashriflari
          </span>
        </div>
      </div>

      {/* Filtr tablari */}
      <div className="bg-white p-2 rounded-2xl border border-[#e6e0da] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.value
                ? 'bg-[#282624] text-white'
                : 'text-[#67625d] hover:bg-[#f6f3ef] hover:text-[#282624]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* E'lonlar Ro'yxati */}
      <div className="space-y-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((item) => {
            const isLoading = actionLoadingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#e6e0da] p-4 sm:p-5 shadow-2xs hover:border-orange-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Chap taraf: Rasm va ma'lumotlar */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <SafeImage
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800'
                    }
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-[#f6f3ef] border border-[#e6e0da]"
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Status nishoni */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {item.status === 'APPROVED' ? 'Faol' : item.status === 'PENDING' ? 'Kutilmoqda' : 'Rad etilgan'}
                      </span>

                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                        {item.category?.name}
                      </span>
                    </div>

                    <Link
                      href={`/listing/${item.id}`}
                      className="text-sm sm:text-base font-bold text-[#282624] hover:text-orange-600 transition-colors line-clamp-1 block"
                    >
                      {item.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#67625d] mt-1">
                      <span className="font-semibold text-[#282624]">{item.name}</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {item.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-600" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {item.view_count} marta
                      </span>
                    </div>
                  </div>
                </div>

                {/* O'ng taraf: Harakatlar tugmalari */}
                <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#e6e0da] w-full md:w-auto justify-end">
                  {/* Saytda ko'rish */}
                  <Link
                    href={`/listing/${item.id}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-[#f6f3ef] hover:bg-orange-50 text-[#67625d] hover:text-orange-600 transition-colors"
                    title="Saytda ko'rish"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

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
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
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
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Butunlay o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-[#e6e0da] p-10 text-center text-[#67625d]">
            Ushbu bo'limda hozircha hech qanday e'lon mavjud emas.
          </div>
        )}
      </div>

    </div>
  );
}
