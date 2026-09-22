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
  Search,
  ShieldCheck,
  Crown,
  RefreshCw,
  Globe,
  Edit3,
  Users,
  User,
  AlertCircle,
} from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import AdminEditListingModal from '@/components/AdminEditListingModal';
import AdminUsersTab from '@/components/AdminUsersTab';

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
  categories?: any[];
}

export default function AdminDashboardClient({
  stats,
  initialListings,
  categories = [],
}: AdminDashboardClientProps) {
  const [listings, setListings] = useState(initialListings);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ListingStatus>('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState<'ALL' | 'MY' | 'OTHERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'USERS'>('LISTINGS');
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // O'zimniki va boshqalar hisoblagichlari
  const myCount = listings.filter((l) => !l.userId).length;
  const othersCount = listings.filter((l) => !!l.userId).length;

  // Qidiruv, status va egasi bo'yicha filtrlash
  const filteredListings = listings.filter((l) => {
    // 1. Egasi bo'yicha filtrlash (Admin uchun 3 ta tab)
    if (ownershipFilter === 'MY' && l.userId) return false;
    if (ownershipFilter === 'OTHERS' && !l.userId) return false;

    // 2. Status bo'yicha filtrlash
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    if (!matchesStatus) return false;

    // 3. Qidiruv bo'yicha filtrlash
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card text-card-foreground p-4 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/40">
              SuperAdmin
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              E'lonlar Boshqaruvi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
            TopBaza.uz Boshqaruv Markazi
          </h1>
        </div>

        {/* Sub-Navigatsiya Tablari va Tugmalar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('LISTINGS')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'LISTINGS'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            E'lonlar ({listings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('USERS')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'USERS'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Xodimlar va Limitlar</span>
          </button>

          <Link
            href="/admin/categories"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            Kategoriyalar
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            Sozlamalar
          </Link>

          {/* Ballarni qayta hisoblash tugmasi */}
          <button
            onClick={handleSyncScores}
            disabled={actionLoadingId === 'sync'}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300/40 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="Barcha e'lonlarning Top 10 reyting ballarini sinxronlash"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${actionLoadingId === 'sync' ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Ballarni Sinxronlash</span>
          </button>

          {/* Yangi Post Yaratish Tugmasi */}
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Yangi e'lon</span>
          </Link>

          {/* Chiqish */}
          <button
            onClick={handleLogout}
            type="button"
            className="p-2 rounded-xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* Xabar bildirishnomasi */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Agar Xodimlar va Limitlar tabi tanlangan bo'lsa */}
      {activeTab === 'USERS' ? (
        <AdminUsersTab />
      ) : (
        <>
          {/* Real-time DB Statistika Kartalari */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Jami E'lonlar
              </span>
              <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1 block">
                {stats.totalListings}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Barcha tumanlar
              </span>
            </div>

            <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Tasdiqlangan
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 block">
                {stats.approvedCount}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Saytda ko'rinmoqda
              </span>
            </div>

            <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                Kutilmoqda
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight mt-1 block">
                {stats.pendingCount}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Tekshiruv kutilmoqda
              </span>
            </div>

            <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                Kategoriyalar
              </span>
              <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight mt-1 block">
                {stats.totalCategories ?? 6}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                {stats.activeCategories ?? 6} ta faol
              </span>
            </div>

            <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                VIP & Imtiyoz
              </span>
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight mt-1 block">
                {(stats.vipCount || 0) + (stats.privilegedCount || 0)}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                {stats.vipCount || 0} VIP / {stats.privilegedCount || 0} imtiyoz
              </span>
            </div>

            <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                Ko'rishlar
              </span>
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight mt-1 block">
                {stats.totalViews}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Mijozlar tashriflari
              </span>
            </div>
          </div>

          {/* Qidiruv va Filtr boshqaruvi */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card text-card-foreground p-3.5 sm:p-4 rounded-3xl border border-border shadow-xs">
            {/* Qidiruv qatori */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Usta ismi, e'lon sarlavhasi, telefon yoki tuman bo'yicha tezkor qidiruv..."
                className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-border text-xs sm:text-sm text-foreground bg-secondary/40 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded-md hover:bg-muted"
                >
                  Tozalash
                </button>
              )}
            </div>

            {/* Filtr paneli: Egasi va Status */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-2.5">
              {/* Admin uchun 3 ta tab: Barchasi, O'zimniki, Boshqalar */}
              <div className="flex flex-wrap items-center p-1 rounded-2xl bg-secondary border border-border shadow-2xs">
                {[
                  { id: 'ALL', label: 'Barchasi', count: listings.length, icon: Globe },
                  { id: 'MY', label: "O'zimniki", count: myCount, icon: User },
                  { id: 'OTHERS', label: 'Boshqalar', count: othersCount, icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = ownershipFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOwnershipFilter(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-normal shrink-0 ${
                        isActive
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status Filtr tablari */}
              <div className="flex items-center gap-1.5 flex-wrap">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-normal transition-all cursor-pointer shrink-0 ${
                      statusFilter === tab.value
                        ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
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
                    className="bg-card text-card-foreground rounded-3xl border border-border p-4 sm:p-5 shadow-xs hover:border-primary/50 transition-all flex flex-col gap-3.5"
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
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 bg-muted border border-border"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {/* Status nishoni */}
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                                item.status === 'APPROVED'
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : item.status === 'PENDING'
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                  : 'bg-destructive/15 text-destructive border border-destructive/30'
                              }`}
                            >
                              {item.status === 'APPROVED' ? 'Faol' : item.status === 'PENDING' ? 'Kutilmoqda' : 'Rad etilgan'}
                            </span>

                            {/* Verifikatsiya belgisi */}
                            {item.isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10 shrink-0" />
                                Verified
                              </span>
                            )}

                            {/* Mualliflik nishoni */}
                            {item.userId ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full shrink-0">
                                <Users className="w-3 h-3 text-violet-600 dark:text-violet-400 shrink-0" />
                                Foydalanuvchi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full shrink-0">
                                <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                                Admin
                              </span>
                            )}

                            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md shrink-0">
                              {item.category?.name}
                            </span>

                            {/* Veb-sayt mavjudligi */}
                            {item.websiteUrl && (
                              <a
                                href={item.websiteUrl.startsWith('http') ? item.websiteUrl : `https://${item.websiteUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-secondary border border-border px-2 py-0.5 rounded-full hover:bg-muted transition-colors shrink-0"
                                title={item.websiteUrl}
                              >
                                <Globe className="w-3 h-3 text-primary shrink-0" />
                                <span>Veb-sayt</span>
                              </a>
                            )}
                          </div>

                          <Link
                            href={`/listing/${item.id}`}
                            className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1 block"
                          >
                            {item.title}
                          </Link>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
                            <span className="font-bold text-foreground flex items-center gap-1">
                              {item.name}
                              {item.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10 shrink-0" />
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              {item.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary shrink-0" />
                              {item.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-muted-foreground shrink-0" />
                              {item.view_count} ko'rilgan
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* O'ng taraf: Boshqaruv tugmalari */}
                      <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border w-full md:w-auto justify-end">
                        {/* To'liq tahrirlash */}
                        <button
                          type="button"
                          onClick={() => setEditingListing(item)}
                          className="px-2.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                          title="E'lonni to'liq tahrirlash"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Tahrirlash</span>
                        </button>

                        {/* Saytda ko'rish */}
                        <Link
                          href={`/listing/${item.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                          title="Saytda ko'rish"
                        >
                          <ExternalLink className="w-4 h-4 shrink-0" />
                        </Link>

                        {/* Verifikatsiya */}
                        <button
                          onClick={() => handleToggleVerify(item.id)}
                          disabled={isLoading}
                          type="button"
                          className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shrink-0 ${
                            item.isVerified
                              ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                              : 'bg-secondary text-secondary-foreground hover:bg-muted'
                          }`}
                          title={item.isVerified ? "Verifikatsiyani bekor qilish" : "Ustaga Verified ko'k galochka berish"}
                        >
                          <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${item.isVerified ? 'text-primary' : ''}`} />
                          <span className="hidden sm:inline">{item.isVerified ? 'Tasdiqlangan' : 'Verifikatsiya'}</span>
                        </button>

                        {/* Tasdiqlash */}
                        {item.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleStatusChange(item.id, ListingStatus.APPROVED)}
                            disabled={isLoading}
                            type="button"
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                            title="Tasdiqlash"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Tasdiqlash</span>
                          </button>
                        )}

                        {/* Rad etish */}
                        {item.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleStatusChange(item.id, ListingStatus.REJECTED)}
                            disabled={isLoading}
                            type="button"
                            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300/40 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                            title="Rad etish"
                          >
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Rad etish</span>
                          </button>
                        )}

                        {/* O'chirish */}
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={isLoading}
                          type="button"
                          className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                          title="Butunlay o'chirish"
                        >
                          <Trash2 className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Quyi Qator: Reyting, Baho, Tarif va Imtiyoz */}
                    <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center bg-secondary/30 p-3 rounded-2xl">
                      {/* Jami Ball va Nishonlar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-muted-foreground shrink-0">Jami Ball:</span>
                        <span className="px-2.5 py-1 rounded-xl bg-card text-primary border border-border text-xs font-black shadow-2xs shrink-0">
                          {typeof item.totalScore === 'number' ? item.totalScore.toFixed(1) : '0.0'} / 100
                        </span>
                        {item.paidTier === 'VIP_GOLD' && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-900 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1 border border-amber-300/40 shrink-0">
                            <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-amber-500 shrink-0" />
                            VIP
                          </span>
                        )}
                        {item.isPrivileged && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 text-[10px] font-bold flex items-center gap-1 border border-emerald-300/40 shrink-0">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            Imtiyoz
                          </span>
                        )}
                      </div>

                      {/* Xodim Bahosi */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">Xodim:</span>
                        <select
                          value={item.adminRating || 4.5}
                          disabled={isLoading}
                          onChange={(e) => handleRatingChange(item.id, parseFloat(e.target.value))}
                          className="w-full text-xs font-bold bg-background border border-border text-foreground rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
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
                        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">Tarif:</span>
                        <select
                          value={item.paidTier || 'FREE'}
                          disabled={isLoading}
                          onChange={(e) => handlePaidTierChange(item.id, e.target.value as PaidTier)}
                          className="w-full text-xs font-bold bg-background border border-border text-foreground rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
                        >
                          <option value="FREE">Oddiy (FREE)</option>
                          <option value="STANDARD">⭐ Standart Homiy (+10)</option>
                          <option value="VIP_GOLD">👑 VIP Homiylik (+20)</option>
                        </select>
                      </div>

                      {/* Ijtimoiy Imtiyoz */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">Imtiyoz:</span>
                        <select
                          value={item.privilegeType || 'NONE'}
                          disabled={isLoading}
                          onChange={(e) => handlePrivilegeChange(item.id, e.target.value as PrivilegeType)}
                          className="w-full text-xs font-bold bg-background border border-border text-foreground rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
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
              <div className="bg-card text-card-foreground rounded-3xl border border-border p-10 text-center text-muted-foreground">
                <p className="font-semibold text-sm mb-2">Qidiruv bo'yicha mos e'lonlar topilmadi.</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Qidiruvni tozalash
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Admin To'liq Tahrirlash Modali */}
      {editingListing && (
        <AdminEditListingModal
          listing={editingListing}
          categories={categories}
          onClose={() => setEditingListing(null)}
          onSuccess={(updated) => {
            setListings((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l))
            );
            setMessage({ text: "E'lon muvaffaqiyatli to'liq tahrirlandi!", type: 'success' });
          }}
        />
      )}
    </div>
  );
}
