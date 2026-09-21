'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Send,
  Calendar,
  ShieldCheck,
  Award,
  FileText,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Camera,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Check,
  Crop as CropIcon,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfileAction } from '@/actions/user-auth-actions';
import AuthGateModal from '@/components/AuthGateModal';
import ImageCropperModal from '@/components/ImageCropperModal';

interface ProfileClientProps {
  initialData: {
    user: {
      id: string;
      phone: string;
      name: string;
      role: string;
      telegram: string | null;
      avatar: string | null;
      createdAt: string | Date;
    } | null;
    stats: {
      listingLimit: number;
      totalUsed: number;
      remaining: number;
      approvedCount: number;
      pendingCount: number;
      totalViews: number;
    } | null;
    listings: any[];
  };
  isAuthenticated: boolean;
}

export default function ProfileClient({ initialData, isAuthenticated }: ProfileClientProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { logout, openAuthModal, user: contextUser } = useAuth();

  const [currentUser, setCurrentUser] = useState(initialData.user);
  const [stats, setStats] = useState(initialData.stats);
  const [listings, setListings] = useState(initialData.listings);

  // Tabs: 'LISTINGS' | 'EDIT' | 'SETTINGS'
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'EDIT'>('LISTINGS');

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editTelegram, setEditTelegram] = useState(currentUser?.telegram || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Rasm qirqish (Cropper) modal holatlari
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const editTabFileInputRef = useRef<HTMLInputElement>(null);

  const pt = t.profilePage;

  // 1. Fayl tanlanganda Cropper modalni ochish
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: lang === 'ru' ? 'Размер файла не должен превышать 15МБ' : "Fayl hajmi 15MB dan oshmasligi kerak",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // Qayta tanlash imkonini berish uchun qiymatni tozalaymiz
    e.target.value = '';
  };

  // 2. Qirqish yakunlangach serverga yuklash va profilni saqlash
  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploadingAvatar(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', croppedBlob, 'avatar.webp');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setEditAvatar(data.url);

        // Darhol profilni bazada saqlash
        const updateRes = await updateUserProfileAction({
          name: editName || currentUser?.name || '',
          telegram: editTelegram,
          avatar: data.url,
        });

        if (updateRes.success && updateRes.user) {
          setCurrentUser((prev: any) => ({ ...prev, avatar: data.url }));
        }

        setFeedback({
          type: 'success',
          message: lang === 'ru' ? 'Фото профиля успешно обновлено!' : "Profil rasmingiz muvaffaqiyatli saqlandi!",
        });
        router.refresh();
      } else {
        throw new Error(data.message || data.error || 'Upload error');
      }
    } catch {
      setFeedback({
        type: 'error',
        message: lang === 'ru' ? 'Ошибка при сохранении фото' : "Rasm saqlashda xatolik yuz berdi",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Profile save handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateUserProfileAction({
        name: editName,
        telegram: editTelegram,
        avatar: editAvatar,
      });

      if (res.success && res.user) {
        setCurrentUser((prev: any) => ({ ...prev, ...res.user }));
        setFeedback({
          type: 'success',
          message: lang === 'ru' ? 'Профиль успешно обновлен!' : "Profilingiz muvaffaqiyatli saqlangandi!",
        });
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: res.message || (lang === 'ru' ? 'Ошибка сохранения' : "Saqlashda xatolik yuz berdi"),
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: lang === 'ru' ? 'Ошибка сервера при сохранении' : "Serverda xatolik yuz berdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const user = currentUser
    ? currentUser
    : contextUser
    ? {
        id: contextUser.id,
        phone: contextUser.phone,
        name: contextUser.name,
        role: contextUser.role,
        telegram: null as string | null,
        avatar: null as string | null,
        createdAt: null as string | Date | null,
      }
    : null;

  // If user is not authenticated
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
          {pt.authRequired}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          {lang === 'ru'
            ? 'Войдите в личный кабинет, чтобы управлять профилем, просматривать статистику и подавать объявления.'
            : "Shaxsiy kabinetingizga kirib, profilingizni boshqarish, e'lonlaringiz statistikasini ko'rish va yangi xizmatlar qo'shishingiz mumkin."}
        </p>
        <button
          type="button"
          onClick={openAuthModal}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>{pt.loginButton}</span>
        </button>
      </div>
    );
  }

  const roleBadge =
    user.role === 'ADMIN'
      ? pt.adminBadge
      : user.role === 'SPECIALIST'
      ? pt.specialistBadge
      : pt.userBadge;

  const memberSinceFormatted = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
        year: 'numeric',
        month: 'long',
      })
    : (lang === 'ru' ? 'Недавно' : "Yaqinda");

  const totalUsed = stats?.totalUsed ?? 0;
  const listingLimit = stats?.listingLimit ?? 3;
  const remaining = stats?.remaining ?? Math.max(0, listingLimit - totalUsed);
  const usagePercent = Math.min(100, Math.round((totalUsed / listingLimit) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:py-12">
      
      {/* 1. Asosiy Profil Banneri & Foydalanuvchi Kartasi */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border dark:border-white/10 p-6 sm:p-8 shadow-sm mb-8 transition-colors">
        {/* Orqa fon nur effekti */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          
          {/* Avatar rasm & o'zgartirish nishoni */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-background flex items-center justify-center relative">
                {editAvatar || user.avatar ? (
                  <Image
                    src={(editAvatar || user.avatar)!}
                    alt={user.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Tezkor rasm yuklash va qirqish tugmachasi */}
            <button
              type="button"
              onClick={() => bannerFileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 p-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer transition-transform active:scale-90 border-2 border-background"
              title={lang === 'ru' ? 'Изменить фото' : "Rasmni o'zgartirish"}
            >
              {uploadingAvatar ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={bannerFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileSelect}
              disabled={uploadingAvatar}
            />
          </div>

          {/* Foydalanuvchi ma'lumotlari */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {user.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {user.role === 'ADMIN' ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>{roleBadge}</span>
              </span>
            </div>

            {/* Aloqa va ma'lumot qatorlari */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5 font-medium font-mono">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{user.phone}</span>
              </div>

              {user.telegram && (
                <a
                  href={`https://t.me/${user.telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                >
                  <Send className="w-4 h-4" />
                  <span>@{user.telegram.replace(/^@/, '')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {pt.memberSince}: <strong className="text-foreground">{memberSinceFormatted}</strong>
                </span>
              </div>
            </div>

            {/* Tezkor amallar tugmalari */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <Link
                href="/new-listing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{pt.postNewListing}</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'EDIT' ? 'LISTINGS' : 'EDIT')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted font-bold text-xs border border-border dark:border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{activeTab === 'EDIT' ? pt.myListingsTab : pt.editProfile}</span>
              </button>

              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{pt.adminPanel}</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs transition-colors cursor-pointer"
                title={pt.logout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{pt.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Statistik Kartalar (4 ta ko'rsatkich) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        
        {/* 1: Jami e'lonlar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{pt.totalListings}</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {totalUsed}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {lang === 'ru' ? 'Создано на платформе' : "Saytda yaratilgan jami"}
          </p>
        </div>

        {/* 2: Qolgan limit va progress bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{pt.remainingLimit}</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground flex items-baseline gap-1">
            <span>{remaining}</span>
            <span className="text-xs text-muted-foreground font-semibold">/ {listingLimit} {lang === 'ru' ? 'ед.' : 'ta'}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-secondary h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* 3: Tasdiqlangan e'lonlar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{pt.approvedListings}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats?.approvedCount ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {lang === 'ru' ? 'Активно на главной' : "Bosh sahifada ko'rinadi"}
          </p>
        </div>

        {/* 4: Umumiy ko'rishlar soni */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{pt.totalViews}</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {stats?.totalViews ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {lang === 'ru' ? 'Просмотров профилей' : "E'lonlar ko'rishlari"}
          </p>
        </div>
      </div>

      {/* 3. Bo'lim Tablari (Mening e'lonlarim / Profilni tahrirlash) */}
      <div className="flex items-center gap-2 border-b border-border dark:border-white/10 mb-6 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('LISTINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === 'LISTINGS'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{pt.myListingsTab} ({listings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === 'EDIT'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{pt.editProfile}</span>
        </button>
      </div>

      {/* Tab 1: Mening e'lonlarim ro'yxati */}
      {activeTab === 'LISTINGS' && (
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="p-10 rounded-3xl bg-card border border-border dark:border-white/10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {pt.noListingsYet}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                {lang === 'ru'
                  ? 'Разместите свое первое объявление, чтобы ваши услуги увидели жители Сырдарьи и клиенты со всего Узбекистана.'
                  : "Birinchi e'loningizni joylashtiring, Sirdaryo ahli va butun O'zbekistondagi buyurtmachilar siz bilan to'g'ridan-to'g'ri bog'lanishsin."}
              </p>
              <Link
                href="/new-listing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{pt.postFirstListing}</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((item: any) => {
                const isApproved = item.status === 'APPROVED';
                const isPending = item.status === 'PENDING';

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-card border border-border dark:border-white/10 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            isApproved
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : isPending
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lang === 'ru' ? 'Одобрено' : 'Tasdiqlangan'}</span>
                            </>
                          ) : isPending ? (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>{lang === 'ru' ? 'На модерации' : 'Kutilmoqda'}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>{lang === 'ru' ? 'Отклонено' : 'Rad etilgan'}</span>
                            </>
                          )}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{item.view_count || 0}</span>
                        </div>
                      </div>

                      <h4 className="text-base font-black text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">
                        {item.price || (lang === 'ru' ? 'Договорная' : 'Kelishilgan holda')}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/listing/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted font-bold transition-colors"
                        >
                          <span>{lang === 'ru' ? 'Просмотр' : "Ko'rish"}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {listings.length > 0 && (
            <div className="text-center pt-4">
              <Link
                href="/my-listings"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>{pt.viewAllListings}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profil ma'lumotlarini tahrirlash */}
      {activeTab === 'EDIT' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border dark:border-white/10 shadow-sm max-w-2xl">
          <h3 className="text-lg font-black text-foreground mb-1">
            {pt.editProfile}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6">
            {lang === 'ru'
              ? 'Обновите ваше имя, ссылку на Telegram или фото профиля.'
              : "Ismingiz, Telegram akkauntingiz yoki profilingiz rasmini o'zgartiring."}
          </p>

          {feedback && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* Ism */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {pt.fullName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder={lang === 'ru' ? 'Ваше имя' : "Ismingiz"}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-secondary/40 text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Telefon (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {pt.phone}
              </label>
              <div className="relative opacity-70">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={user.phone}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-muted text-muted-foreground text-sm font-mono cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {lang === 'ru' ? 'Номер телефона привязан к вашей учетной записи' : "Telefon raqami hisobingizga biriktirilgan"}
              </p>
            </div>

            {/* Telegram Username */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {pt.telegram}
              </label>
              <div className="relative">
                <Send className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={editTelegram}
                  onChange={(e) => setEditTelegram(e.target.value)}
                  placeholder={pt.telegramPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-secondary/40 text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {lang === 'ru' ? 'Клиенты смогут писать вам прямо в Telegram' : "Mijozlar sizga to'g'ridan-to'g'ri Telegram orqali yoza olishadi"}
              </p>
            </div>

            {/* Avatar Rasm va Qirqish */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {pt.avatarUrl}
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary border border-border dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {editAvatar ? (
                    <Image
                      src={editAvatar}
                      alt="Avatar preview"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 w-full flex items-center gap-2">
                  <div className="relative flex-1">
                    <Camera className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/... yoki rasm yuklang"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-secondary/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <input
                    ref={editTabFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileSelect}
                    disabled={uploadingAvatar}
                  />

                  <button
                    type="button"
                    onClick={() => editTabFileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                    title={lang === 'ru' ? 'Загрузить и обрезать фото' : "Rasm yuklash va qirqish"}
                  >
                    <CropIcon className="w-3.5 h-3.5" />
                    <span>{lang === 'ru' ? 'Обрезать' : 'Qirqish'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                disabled={saving || !editName.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>{pt.saving}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{pt.saveChanges}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('LISTINGS');
                  setFeedback(null);
                }}
                className="px-5 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted font-bold text-sm transition-colors cursor-pointer"
              >
                {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profil Rasmini Qirqish Modali (1:1 Doiraviy Ramka) */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropImageSrc}
        aspectRatio={1}
        cropShape="round"
        outputWidth={512}
        outputHeight={512}
        title={lang === 'ru' ? 'Обрезка фото профиля (1:1)' : "Profil rasmini qirqish (1:1)"}
        onCropComplete={handleCropComplete}
        onClose={() => {
          setCropperOpen(false);
          setCropImageSrc(null);
        }}
        lang={lang}
      />

    </div>
  );
}
