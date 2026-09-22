'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ExternalLink,
  MapPin,
  AlertCircle,
  User,
  ArrowLeft,
  Info,
} from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import { ListingWithRelations, userDeleteListingAction } from '@/actions/listing-actions';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryLocalizedName, getLocationLocalizedName } from '@/lib/translations';

interface MyListingsClientProps {
  initialListings: ListingWithRelations[];
  userStats: {
    id: string;
    name: string;
    phone: string;
    listingLimit: number;
    totalUsed: number;
    remaining: number;
  } | null;
  isAuthenticated: boolean;
}

export default function MyListingsClient({
  initialListings,
  userStats,
  isAuthenticated,
}: MyListingsClientProps) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { lang, t } = useLanguage();

  const [listings, setListings] = useState<ListingWithRelations[]>(initialListings);
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const effectiveUser = userStats || user;

  // Filter listings based on active tab
  const approvedListings = listings.filter((item) => item.status === 'APPROVED');
  const pendingListings = listings.filter((item) => item.status === 'PENDING');
  const rejectedListings = listings.filter((item) => item.status === 'REJECTED');

  const displayedListings =
    activeTab === 'approved'
      ? approvedListings
      : activeTab === 'pending'
      ? pendingListings
      : activeTab === 'rejected'
      ? rejectedListings
      : listings;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setFeedbackMessage(null);
    try {
      const res = await userDeleteListingAction(id);
      if (res.success) {
        setListings((prev) => prev.filter((item) => item.id !== id));
        setFeedbackMessage({ type: 'success', text: lang === 'ru' ? "Объявление успешно удалено." : "E'lon muvaffaqiyatli o'chirildi." });
        router.refresh();
      } else {
        setFeedbackMessage({ type: 'error', text: res.message || (lang === 'ru' ? "Ошибка при удалении." : "O'chirishda xatolik yuz berdi.") });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err?.message || (lang === 'ru' ? "Непредвиденная ошибка." : "Kutilmagan xatolik yuz berdi.") });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // 1. Agar foydalanuvchi tizimga kirmagan bo'lsa
  if (!isAuthenticated && !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-lg border border-primary/20">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-3 tracking-tight">
          {lang === 'ru' ? "Мои объявления" : "Mening e'lonlarim"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          {lang === 'ru'
            ? "Войдите в систему, чтобы просматривать созданные вами объявления, отслеживать статус модерации и управлять ими."
            : "O'zingiz yaratgan e'lonlarni ko'rish, ularning tasdiqlanish holatini kuzatish va boshqarish uchun avval tizimga kiring."}
        </p>
        <button
          type="button"
          onClick={openAuthModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <User className="w-4 h-4 shrink-0" />
          <span>{lang === 'ru' ? "Войти / Регистрация" : "Kirish / Ro'yxatdan o'tish"}</span>
        </button>
      </div>
    );
  }

  const limitTotal = effectiveUser?.listingLimit ?? 3;
  const limitUsed = listings.length;
  const limitRemaining = Math.max(0, limitTotal - limitUsed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Orqaga qaytish havolasi */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>{lang === 'ru' ? "Вернуться на главную" : "Bosh sahifaga qaytish"}</span>
        </Link>
      </div>

      {/* Profil va Statistika Banneri */}
      <div className="bg-card text-card-foreground rounded-3xl border border-border p-5 sm:p-7 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Chap tomon: Foydalanuvchi ma'lumoti */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shadow-primary/20 shrink-0">
              {effectiveUser?.name ? effectiveUser.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">
                  {effectiveUser?.name || (lang === 'ru' ? "Мой аккаунт" : "Mening hisobim")}
                </h1>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {effectiveUser?.phone}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lang === 'ru'
                  ? "Все ваши объявления и их статус модерации"
                  : "Sizning barcha e'lonlaringiz va ularning tekshiruv holati"}
              </p>
            </div>
          </div>

          {/* O'ng tomon: Limit va Yangi e'lon berish tugmasi */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-secondary border border-border text-xs">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                {lang === 'ru' ? "Лимит объявлений" : "E'lon berish limiti"}
              </span>
              <div className="flex items-center gap-1.5 font-extrabold text-foreground text-sm">
                <span className="text-primary">{limitUsed}</span>
                <span className="text-muted-foreground">/</span>
                <span>{limitTotal} {lang === 'ru' ? 'объявл.' : 'ta'}</span>
                <span className="text-[11px] font-semibold text-muted-foreground ml-1">
                  ({lang === 'ru' ? `Осталось: ${limitRemaining}` : `Qolgan: ${limitRemaining}`})
                </span>
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary hover:bg-muted text-secondary-foreground font-bold text-xs sm:text-sm border border-border transition-all active:scale-95 shrink-0"
            >
              <User className="w-4 h-4 text-primary shrink-0" />
              <span>{lang === 'ru' ? "Мой профиль" : "Mening profilim"}</span>
            </Link>

            <Link
              href="/new-listing"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 active:scale-95 transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>{lang === 'ru' ? "Подать объявление" : "Yangi e'lon berish"}</span>
            </Link>
          </div>
        </div>

        {/* Xabar/Xatolik qutisi */}
        {feedbackMessage && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-150 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}
      </div>

      {/* Tablar va filtrlar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2 flex-wrap pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'ru' ? "Все" : "Barchasi"}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary-foreground/20">
              {listings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'ru' ? "Активные (Одобрено)" : "Faol (Tasdiqlangan)"}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-700/20">
              {approvedListings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'ru' ? "На проверке (Ожидает)" : "Tekshiruvda (Kutilmoqda)"}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-700/20">
              {pendingListings.length}
            </span>
          </button>

          {rejectedListings.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('rejected')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'rejected'
                  ? 'bg-destructive text-destructive-foreground shadow-sm'
                  : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ru' ? "Отклоненные" : "Rad etilgan"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-destructive/20">
                {rejectedListings.length}
              </span>
            </button>
          )}
        </div>

        {/* Eslatma / Ma'lumot matni */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{lang === 'ru' ? "Новые объявления активируются на сайте после одобрения администратором" : "Yangi berilgan e'lonlar admin tasdig'idan so'ng saytda faollashadi"}</span>
        </div>
      </div>

      {/* E'lonlar Ro'yxati */}
      {displayedListings.length === 0 ? (
        <div className="bg-card text-card-foreground rounded-3xl border border-dashed border-border p-12 text-center my-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-secondary text-muted-foreground flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-foreground mb-1">
            {activeTab === 'approved'
              ? (lang === 'ru' ? "У вас пока нет одобренных объявлений" : "Hali tasdiqlangan e'lonlaringiz yo'q")
              : activeTab === 'pending'
              ? (lang === 'ru' ? "Нет объявлений на стадии проверки" : "Tekshiruv jarayonidagi e'lonlar mavjud emas")
              : activeTab === 'rejected'
              ? (lang === 'ru' ? "Нет отклоненных объявлений" : "Rad etilgan e'lonlar yo'q")
              : (lang === 'ru' ? "У вас пока нет объявлений" : "Sizda hali hech qanday e'lon yo'q")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            {activeTab === 'all'
              ? (lang === 'ru'
                  ? "Разместите объявление о своих услугах или компании и находите клиентов."
                  : "O'z xizmatlaringiz, korxonangiz yoki mutaxassisligingiz bo'yicha e'lon joylashtiring va mijozlar toping.")
              : (lang === 'ru'
                  ? "Чтобы просмотреть все свои объявления, перейдите на вкладку 'Все'."
                  : "Barcha e'lonlaringizni ko'rish uchun 'Barchasi' tabiga o'ting.")}
          </p>
          <Link
            href="/new-listing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 active:scale-95 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>{lang === 'ru' ? "Подать первое объявление" : "Birinchi e'loningizni joylang"}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedListings.map((item) => {
            const mainImg =
              item.images && item.images.length > 0
                ? item.images[0]
                : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800';

            const isPending = item.status === 'PENDING';
            const isApproved = item.status === 'APPROVED';
            const isRejected = item.status === 'REJECTED';

            const catName = item.subCategory
              ? getCategoryLocalizedName(item.subCategory.name, lang)
              : getCategoryLocalizedName(item.category.name, lang);

            const locName = getLocationLocalizedName(item.location, lang);

            return (
              <div
                key={item.id}
                className="bg-card text-card-foreground rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Rasm va Status Nishoni */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <SafeImage
                    src={mainImg}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

                  {/* Holat nishoni */}
                  <div className="absolute top-3 left-3 z-10">
                    {isPending && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md border border-amber-300/40 animate-pulse">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{lang === 'ru' ? "На проверке" : "Kutilmoqda (Tekshiruvda)"}</span>
                      </div>
                    )}
                    {isApproved && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md border border-emerald-300/40">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{lang === 'ru' ? "Активно" : "Faol"}</span>
                      </div>
                    )}
                    {isRejected && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-destructive text-destructive-foreground font-black text-xs shadow-md border border-destructive/30">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{lang === 'ru' ? "Отклонено" : "Rad etilgan"}</span>
                      </div>
                    )}
                  </div>

                  {/* Ko'rishlar soni */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1 z-10">
                    <Eye className="w-3 h-3 text-slate-300 shrink-0" />
                    <span>{item.view_count}</span>
                  </div>

                  {/* Kategoriya va Hudud */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white z-10 gap-2">
                    <span className="bg-primary/90 backdrop-blur-xs text-primary-foreground px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wider truncate">
                      {catName}
                    </span>
                    <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[11px] shrink-0">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{locName}</span>
                    </span>
                  </div>
                </div>

                {/* Kartochka Ma'lumotlari */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary mb-2 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Qo'shimcha ma'lumotlar: Narx va Tajriba */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border mb-3">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-muted-foreground block truncate">{lang === 'ru' ? "Цена:" : "Narx:"}</span>
                        <span className="font-bold text-foreground truncate block">
                          {item.price || (lang === 'ru' ? "По договоренности" : "Kelishilgan holda")}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-muted-foreground block">{lang === 'ru' ? "Дата:" : "Sana:"}</span>
                        <span className="font-medium">
                          {new Date(item.createdAt).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ')}
                        </span>
                      </div>
                    </div>

                    {/* Pending haqida tushuntirish xabari */}
                    {isPending && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed mb-3 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <span>
                          {lang === 'ru'
                            ? "Это объявление проверяется модератором. После одобрения оно станет доступно всем пользователям."
                            : "Ushbu e'lon moderator tomonidan tekshirilmoqda. Tez orada tasdiqlangach barcha foydalanuvchilarga ko'rinadi."}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Amallar: Ko'rish va O'chirish */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Link
                      href={`/listing/${item.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary hover:bg-muted text-secondary-foreground font-bold text-xs transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{lang === 'ru' ? "Просмотр" : "Ko'rish"}</span>
                    </Link>

                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="px-3 py-2 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {deletingId === item.id
                            ? (lang === 'ru' ? "Удаление..." : "O'chirilmoqda...")
                            : (lang === 'ru' ? "Да, удалить" : "Ha, o'chirilsin")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs transition-colors cursor-pointer shrink-0"
                        >
                          {lang === 'ru' ? "Отмена" : "Bekor"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors cursor-pointer shrink-0"
                        title={lang === 'ru' ? "Удалить объявление" : "E'lonni o'chirish"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
