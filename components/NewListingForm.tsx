'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  createListingAction,
  ActionResponse,
} from '@/actions/listing-actions';
import { logoutUserAction } from '@/actions/user-auth-actions';
import AuthGateModal from '@/components/AuthGateModal';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';
import { createListingSchema } from '@/lib/validations';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Phone,
  Send,
  MapPin,
  Clock,
  Coins,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Globe,
  Trash2,
  Plus,
  Check,
  Crop as CropIcon,
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SafeImage from '@/components/SafeImage';
import ImageCropperModal from '@/components/ImageCropperModal';
import { useLanguage } from '@/context/LanguageContext';
import {
  getCategoryLocalizedName,
  getSubCategoryLocalizedName,
  getLocationLocalizedName,
} from '@/lib/translations';

export interface CategoryItem {
  id: string;
  name: string;
  nameUz?: string | null;
  nameRu?: string | null;
  slug: string;
  icon?: string | null;
  description?: string | null;
  subCategories?: { id: string; name: string; nameUz?: string | null; nameRu?: string | null; slug: string }[] | null;
}

interface NewListingFormProps {
  categories: CategoryItem[];
  initialUser?: any;
  isAdmin?: boolean;
}

// Ustalarga qulaylik uchun namunaviy professional rasmlar (18 ta toifa)
const PRESET_IMAGES = [
  { slug: 'santexnika', labelUz: "Santexnika", labelRu: "Сантехника", url: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80" },
  { slug: 'elektrik', labelUz: "Elektrik", labelRu: "Электрика", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
  { slug: 'remont', labelUz: "Ta'mir / Qurilish", labelRu: "Ремонт / Стройка", url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80" },
  { slug: 'ichki-dizayn', labelUz: "Ichki dizayn & Pardoz", labelRu: "Дизайн и отделка", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80" },
  { slug: 'avto', labelUz: "Avtoservis / Usta", labelRu: "Автомастер", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80" },
  { slug: 'yuk-tashish', labelUz: "Yuk tashish & Evakuator", labelRu: "Грузоперевозки", url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80" },
  { slug: 'konditsioner', labelUz: "Konditsioner & Sovitkich", labelRu: "Кондиционеры", url: "https://images.unsplash.com/photo-1631545806609-b22305886475?w=800&auto=format&fit=crop&q=80" },
  { slug: 'maishiy-texnika', labelUz: "Maishiy texnika", labelRu: "Быттехника", url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80" },
  { slug: 'temirchilik', labelUz: "Temirchilik & Svarka", labelRu: "Сварка / Металл", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80" },
  { slug: 'mebel', labelUz: "Mebel & Duradgor", labelRu: "Мебель / Плотник", url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80" },
  { slug: 'malyar', labelUz: "Bo'yoqchi & Malyar", labelRu: "Малярные работы", url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80" },
  { slug: 'kafel', labelUz: "Kafel & Plitka", labelRu: "Плитка / Кафель", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80" },
  { slug: 'tozalash', labelUz: "Klining & Tozalash", labelRu: "Клининг / Уборка", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" },
  { slug: 'tibbiyot', labelUz: "Shifokor & Tibbiyot", labelRu: "Медицина / Врач", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80" },
  { slug: 'talim', labelUz: "Ta'lim & Repetitor", labelRu: "Обучение / Репетитор", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80" },
  { slug: 'sartarosh', labelUz: "Sartarosh & Go'zallik", labelRu: "Барбер / Салон", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80" },
  { slug: 'it', labelUz: "Dasturlash & IT", labelRu: "IT и веб-услуги", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" },
  { slug: 'foto', labelUz: "Foto & Video", labelRu: "Фото и видео", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80" },
];

export default function NewListingForm({ categories, initialUser, isAdmin }: NewListingFormProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [currentUser, setCurrentUser] = useState(initialUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    name: initialUser?.name && !initialUser.name.startsWith('Mutaxassis (') ? initialUser.name : '',
    categoryId: categories[0]?.id || '',
    subCategoryId: '',
    location: 'Guliston shahri',
    address: '',
    phone: initialUser?.phone || '+998',
    telegram: '',
    instagram: '',
    websiteUrl: '',
    price: '',
    experience: '',
    description: '',
    imageUrl: '',
    selectedPresetImage: PRESET_IMAGES[0].url,
  });

  // Rasm yuklash va qirqish holatlari
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'preset' | 'url'>('upload');

  // E'lon uchun 4:3 Cropper modal holatlari
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropEditingIndex, setCropEditingIndex] = useState<number | null>(null);
  const pendingFilesRef = useRef<File[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fayl tanlanganda Cropper ochish
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);

    if (uploadedImages.length + files.length > 5) {
      setUploadError(
        lang === 'ru'
          ? "Вы можете загрузить не более 5 фотографий."
          : "Maksimal 5 tagacha rasm yuklashingiz mumkin."
      );
      return;
    }

    const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      setUploadError(
        lang === 'ru'
          ? "Принимаются только изображения (JPG, PNG, WebP)."
          : "Faqat rasm fayllari (JPG, PNG, WebP) qabul qilinadi."
      );
      return;
    }

    const firstFile = fileList[0];
    pendingFilesRef.current = fileList.slice(1);
    setCropEditingIndex(null);

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(firstFile);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Mavjud rasmni qayta qirqish
  const handleCropExisting = (imgUrl: string, index: number) => {
    setCropImageSrc(imgUrl);
    setCropEditingIndex(index);
    setCropperOpen(true);
  };

  // Qirqish yakunlangach serverga yuklash
  const handleListingCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', croppedBlob, 'listing.webp');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (cropEditingIndex !== null) {
          setUploadedImages((prev) => {
            const updated = [...prev];
            updated[cropEditingIndex] = data.url;
            return updated;
          });
          setCropEditingIndex(null);
        } else {
          setUploadedImages((prev) => [...prev, data.url]);
          setFormData((prev) => ({ ...prev, imageUrl: '' }));
        }
      } else {
        setUploadError(
          data.message ||
            (lang === 'ru' ? "Ошибка при загрузке фото." : "Rasm yuklashda xatolik yuz berdi.")
        );
      }
    } catch {
      setUploadError(
        lang === 'ru'
          ? "Произошла ошибка при загрузке фото на сервер."
          : "Rasmni serverga yuklashda xatolik yuz berdi."
      );
    } finally {
      setIsUploading(false);

      // Agar navbatda yana fayllar bo'lsa, navbatdagisini qirqishga uzatamiz
      if (pendingFilesRef.current.length > 0) {
        const nextFile = pendingFilesRef.current.shift()!;
        const reader = new FileReader();
        reader.onload = () => {
          setCropImageSrc(reader.result as string);
          setCropperOpen(true);
        };
        reader.readAsDataURL(nextFile);
      }
    }
  };

  const handleCloseCropper = () => {
    setCropperOpen(false);
    setCropImageSrc(null);
    setCropEditingIndex(null);
    pendingFilesRef.current = [];
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Agar admin bo'lmasa va foydalanuvchi kirmagan bo'lsa, AuthGateModal ko'rsatiladi
  if (!isAdmin && !currentUser) {
    return (
      <AuthGateModal
        onSuccess={(user) => {
          setCurrentUser(user);
          setFormData((prev) => ({
            ...prev,
            phone: user.phone || prev.phone,
            name: user.name && !user.name.startsWith('Mutaxassis (') ? user.name : prev.name,
          }));
        }}
      />
    );
  }

  const currentLimit = currentUser?.listingLimit ?? (currentUser as any)?.dailyLimit ?? 3;
  const totalUsed = currentUser?.totalUsed ?? (currentUser as any)?.usedToday ?? 0;
  const isLimitReached = !isAdmin && (currentUser?.remaining ?? (currentLimit - totalUsed)) <= 0;

  // Tanlangan kategoriya bo'yicha sub-kategoriyalarni olish
  const currentCategory = categories.find((c) => c.id === formData.categoryId);

  const getCatName = (c: CategoryItem) => {
    if (lang === 'ru') {
      return (c as any).nameRu || getCategoryLocalizedName(c.slug, 'ru') || getCategoryLocalizedName(c.name, 'ru') || c.name;
    }
    return (c as any).nameUz || getCategoryLocalizedName(c.slug, 'uz') || getCategoryLocalizedName(c.name, 'uz') || c.name;
  };

  const getSubCatName = (sc: { id: string; name: string; slug: string; nameUz?: string | null; nameRu?: string | null }) => {
    if (lang === 'ru') {
      return (sc as any).nameRu || getSubCategoryLocalizedName(sc.slug, 'ru') || getCategoryLocalizedName(sc.name, 'ru') || sc.name;
    }
    return (sc as any).nameUz || getSubCategoryLocalizedName(sc.slug, 'uz') || getCategoryLocalizedName(sc.name, 'uz') || sc.name;
  };

  const handleCategoryChange = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      subCategoryId: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Rasmlar massivini tayyorlash
    const imageList: string[] = [];
    if (uploadedImages.length > 0) {
      imageList.push(...uploadedImages);
    } else if (formData.imageUrl.trim()) {
      imageList.push(formData.imageUrl.trim());
    } else if (formData.selectedPresetImage) {
      imageList.push(formData.selectedPresetImage);
    }

    const payload = {
      title: formData.title.trim(),
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId || undefined,
      location: formData.location,
      address: formData.address.trim() || undefined,
      phone: formData.phone.trim(),
      telegram: formData.telegram.trim() || undefined,
      instagram: formData.instagram.trim() || undefined,
      websiteUrl: formData.websiteUrl.trim() || undefined,
      price: formData.price.trim() || undefined,
      experience: formData.experience.trim() || undefined,
      description: formData.description.trim(),
      images: imageList,
    };

    // 1. Zod client validatsiyasi
    const validationResult = createListingSchema.safeParse(payload);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // 2. Server Action chaqiruvi
    setIsSubmitting(true);
    try {
      const res: ActionResponse = await createListingAction(payload);
      if (res.success && res.listingId) {
        if (res.isPending) {
          router.push(`/listing/${res.listingId}?pending=true`);
        } else {
          router.push(`/listing/${res.listingId}?created=true`);
        }
      } else {
        setServerError(res.message || (lang === 'ru' ? "Произошла ошибка" : "Xatolik yuz berdi"));
        if (res.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(res.errors).forEach(([k, v]) => {
            mapped[k] = v[0];
          });
          setErrors(mapped);
        }
      }
    } catch (err: any) {
      setServerError(err?.message || (lang === 'ru' ? "Непредвиденная ошибка" : "Kutilmagan xatolik yuz berdi"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form key={lang} onSubmit={handleSubmit} className="space-y-8">
      {/* Foydalanuvchi Profili va Kunlik Limit Banneri */}
      <div className="bg-card text-card-foreground rounded-3xl border border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20 shrink-0">
            {isAdmin ? '👑' : '👤'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-foreground">
                {isAdmin ? 'Admin' : (currentUser?.name || (lang === 'ru' ? 'Специалист' : 'Mutaxassis'))}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {isAdmin ? 'ADMIN' : (currentUser?.role || 'SPECIALIST')}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {isAdmin ? (lang === 'ru' ? 'Сессия админа' : 'Admin sessiyasi') : currentUser?.phone}
            </span>
          </div>
        </div>

        {/* Limit Ko'rsatkichi */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {isAdmin ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ru' ? 'Безлимитная публикация' : "Cheksiz e'lon berish"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-secondary px-3.5 py-2 rounded-2xl border border-border text-xs shrink-0">
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider">
                  {lang === 'ru' ? 'Использовано:' : 'Ishlatilgan:'}
                </span>
                <span className="font-extrabold text-foreground">
                  {totalUsed} / {currentLimit} {lang === 'ru' ? 'объявлений' : "ta e'lon"}<br />{lang === 'ru' ? 'Осталось:' : 'Qolgan:'} {Math.max(0, currentUser?.remaining ?? (currentLimit - totalUsed))}
                </span>
              </div>
              <div className="h-6 w-px bg-border mx-1" />
              <button
                type="button"
                onClick={async () => {
                  await logoutUserAction();
                  setCurrentUser(null);
                }}
                className="text-xs text-destructive hover:underline font-bold cursor-pointer shrink-0"
              >
                {lang === 'ru' ? 'Выйти' : 'Chiqish'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Limit tugagan bo'lsa ogohlantirish */}
      {isLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center gap-3 text-amber-700 dark:text-amber-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-bold block">
              {lang === 'ru' ? 'Лимит объявлений исчерпан!' : "E'lon berish limitingiz tugadi!"}
            </span>
            <span>
              {lang === 'ru'
                ? `Вы использовали свой лимит объявлений (${totalUsed}/${currentLimit}). Чтобы увеличить лимит, обратитесь к администратору.`
                : `Siz e'lon berish limitingizga (${totalUsed}/${currentLimit}) yetdingiz. Limitni oshirish uchun adminga murojaat qiling.`}
            </span>
          </div>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      {/* 1-Bo'lim: Asosiy ma'lumotlar */}
      <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {t.newListing.step1Title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.newListing.step1Subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* E'lon sarlavhasi */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.titleLabel} <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t.newListing.titlePlaceholder}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-border focus:ring-ring focus:border-primary'
              }`}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>

          {/* Mutaxassis yoki Usta ismi */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.nameLabel} <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.newListing.namePlaceholder}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-border focus:ring-ring focus:border-primary'
              }`}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          {/* Hudud */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.locationLabel} <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-primary pointer-events-none shrink-0" />
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary cursor-pointer appearance-none transition-all"
              >
                {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                  <option key={loc} value={loc}>
                    {getLocationLocalizedName(loc, lang)}
                  </option>
                ))}
              </select>
            </div>
            {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
          </div>

          {/* Kategoriya */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.categoryLabel} <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary cursor-pointer transition-all"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {getCatName(c)}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId}</p>}
          </div>

          {/* Sub-kategoriya */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.subCategoryLabel}
            </label>
            <select
              value={formData.subCategoryId}
              onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary cursor-pointer transition-all"
            >
              <option value="">{lang === 'ru' ? "-- Выберите подкатегорию --" : "-- Ichki yo'nalishni tanlang --"}</option>
              {currentCategory?.subCategories?.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {getSubCatName(sc)}
                </option>
              ))}
            </select>
          </div>

          {/* Aniq manzil */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.addressLabel}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.newListing.addressPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2-Bo'lim: Aloqa va Narxlar */}
      <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {t.newListing.step2Title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.newListing.step2Subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Telefon raqam */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.phoneLabel} <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600 dark:text-emerald-400 pointer-events-none shrink-0" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998901234567"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-destructive focus:ring-destructive/30'
                    : 'border-border focus:ring-ring focus:border-primary'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>

          {/* Telegram username */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.telegramLabel}
            </label>
            <div className="relative">
              <Send className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-500 pointer-events-none shrink-0" />
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder={t.newListing.telegramPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.instagramLabel}
            </label>
            <div className="relative">
              <InstagramIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-rose-500 pointer-events-none shrink-0" />
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="usta_instagram"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.priceLabel}
            </label>
            <div className="relative">
              <Coins className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500 pointer-events-none shrink-0" />
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder={t.newListing.pricePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Ish tajribasi */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.experienceLabel}
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder={t.newListing.experiencePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Veb-sayt yoki Manzil (Havola) */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              {t.newListing.websiteLabel}
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-primary pointer-events-none shrink-0" />
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder={t.newListing.websitePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
            {errors.websiteUrl && <p className="text-xs text-destructive mt-1">{errors.websiteUrl}</p>}
          </div>
        </div>
      </div>

      {/* 3-Bo'lim: Rasm va Tavsif */}
      <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {t.newListing.step3Title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.newListing.step3Subtitle}
            </p>
          </div>
        </div>

        {/* Tavsif textarea */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
            {t.newListing.descriptionLabel} <span className="text-destructive">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t.newListing.descriptionPlaceholder}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-border focus:ring-ring focus:border-primary'
            }`}
          />
          {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
        </div>

        {/* Rasm tanlash / Yuklash / URL */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs sm:text-sm font-semibold text-foreground">
              {t.newListing.imageLabel}
            </label>
            <span className="text-[11px] text-muted-foreground">
              {uploadedImages.length > 0
                ? (lang === 'ru' ? `Загружено ${uploadedImages.length} фото` : `${uploadedImages.length} ta rasm yuklandi`)
                : (lang === 'ru' ? 'Выберите способ добавления фото' : "Rasm qo'shish usulini tanlang")}
            </span>
          </div>

          {/* Tab tugmalari */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-1 p-1 rounded-2xl bg-secondary border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveImageTab('upload')}
              className={`min-w-0 min-h-11 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation shrink-0 ${
                activeImageTab === 'upload'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'ru' ? 'Загрузить' : 'Fayl yuklash'}
              </span>
              {uploadedImages.length > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shrink-0">
                  {uploadedImages.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveImageTab('preset')}
              className={`min-w-0 min-h-11 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation shrink-0 ${
                activeImageTab === 'preset'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'ru' ? 'Примеры (18)' : 'Namunalar (18)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveImageTab('url')}
              className={`min-w-0 min-h-11 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation shrink-0 ${
                activeImageTab === 'url'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'ru' ? 'Ссылка (URL)' : 'Havola (URL)'}
              </span>
            </button>
          </div>

          {/* TAB 1: Fayl yuklash */}
          {activeImageTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-secondary/30 hover:bg-secondary/60 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shrink-0">
                  <UploadCloud className="w-7 h-7 shrink-0" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">
                  {lang === 'ru' ? 'Нажмите, чтобы загрузить фото с устройства' : "Qurilmadan rasm yuklash uchun bosing"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {lang === 'ru'
                    ? 'JPG, PNG, WebP — до 10 МБ (до 5 фотографий)'
                    : "JPG, PNG, WebP — 10 MB gacha (5 tagacha rasm yuklash mumkin)"}
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ru' ? 'Выбрать файлы' : 'Fayllarni tanlash'}</span>
                </button>
              </div>

              {/* Yuklanayotgan holat */}
              {isUploading && (
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/10 text-primary text-xs font-semibold">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>{lang === 'ru' ? 'Загрузка фотографий...' : 'Rasmlar yuklanmoqda...'}</span>
                </div>
              )}

              {/* Xatolik bo'lsa */}
              {uploadError && (
                <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Yuklangan rasmlar ro'yxati */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground block">
                    {lang === 'ru' ? 'Загруженные фото:' : 'Yuklangan rasmlar:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedImages.map((imgUrl, index) => (
                      <div
                        key={imgUrl + index}
                        className="relative rounded-2xl overflow-hidden border border-border group bg-secondary"
                      >
                        <SafeImage
                          src={imgUrl}
                          alt={lang === 'ru' ? `Загруженное фото ${index + 1}` : `Yuklangan rasm ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold shadow-xs">
                            {lang === 'ru' ? 'Главная' : 'Asosiy'}
                          </span>
                        )}
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCropExisting(imgUrl, index)}
                            className="w-6 h-6 rounded-full bg-background/80 hover:bg-background text-foreground flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer shrink-0"
                            title={lang === 'ru' ? 'Обрезать заново' : 'Qayta qirqish'}
                          >
                            <CropIcon className="w-3 h-3 shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(index)}
                            className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer shrink-0"
                            title={lang === 'ru' ? 'Удалить' : "O'chirish"}
                          >
                            <Trash2 className="w-3 h-3 shrink-0" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Namunaviy rasmlar (18 ta) */}
          {activeImageTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {lang === 'ru'
                  ? 'Выберите подходящее изображение из нашей подборки (18 категорий):'
                  : "Ushbu 18 ta tayyor toifaviy rasmlardan mosini tanlashingiz mumkin:"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected =
                    formData.selectedPresetImage === preset.url &&
                    !formData.imageUrl &&
                    uploadedImages.length === 0;
                  const presetLabel = lang === 'ru' ? preset.labelRu : preset.labelUz;
                  return (
                    <div
                      key={preset.slug}
                      onClick={() => {
                        setUploadedImages([]);
                        setFormData({
                          ...formData,
                          selectedPresetImage: preset.url,
                          imageUrl: '',
                        });
                      }}
                      className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group active:scale-95 touch-manipulation ${
                        isSelected
                          ? 'border-primary ring-4 ring-primary/20 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <SafeImage
                        src={preset.url}
                        alt={presetLabel}
                        className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-1">
                        <span className="text-white text-[11px] font-bold text-center drop-shadow-md leading-tight">
                          {presetLabel}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Rasm havolasi (URL) */}
          {activeImageTab === 'url' && (
            <div className="space-y-3">
              <span className="text-xs text-muted-foreground block font-medium">
                {lang === 'ru'
                  ? "Укажите прямую интернет-ссылку на фотографию (URL):"
                  : "Internetdagi rasmning to'g'ridan-to'g'ri havolasini (URL) kiriting:"}
              </span>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setUploadedImages([]);
                    setFormData({ ...formData, imageUrl: e.target.value });
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>

              {formData.imageUrl && (
                <div className="mt-2">
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    {lang === 'ru' ? 'Предпросмотр:' : "Ko'rinishi:"}
                  </span>
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-border">
                    <SafeImage
                      src={formData.imageUrl}
                      alt="URL Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Yuborish tugmasi */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-border hover:bg-secondary/80 active:scale-95 text-muted-foreground hover:text-foreground text-sm font-semibold transition-all cursor-pointer touch-manipulation shrink-0"
        >
          {lang === 'ru' ? "Отмена" : "Bekor qilish"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting || isLimitReached}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer touch-manipulation shrink-0"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{t.newListing.submitting}</span>
            </>
          ) : isLimitReached ? (
            <span>{lang === 'ru' ? 'Лимит исчерпан' : 'Limit tugagan'}</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{t.newListing.submitBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Yuklanish (Submitting) Modali */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[150] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-3xl border border-border p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-primary/70 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary/50 border-l-primary/30 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1s' }}
              />
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-base font-bold text-foreground mb-1">
              {lang === 'ru' ? 'Публикация объявления...' : "E'lon joylanmoqda..."}
            </h4>
            <p className="text-xs text-muted-foreground">
              {lang === 'ru' ? 'Пожалуйста, подождите несколько секунд' : 'Iltimos, bir necha soniya kuting'}
            </p>
          </div>
        </div>
      )}
      {/* E'lon Rasmini Qirqish Modali (4:3 To'g'ri To'rtburchak Ramka) */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropImageSrc}
        aspectRatio={4 / 3}
        cropShape="rect"
        outputWidth={800}
        outputHeight={600}
        title={
          lang === 'ru'
            ? 'Обрезка фото для объявления (4:3)'
            : "E'lon rasmini qirqish (4:3)"
        }
        onCropComplete={handleListingCropComplete}
        onClose={handleCloseCropper}
        lang={lang}
      />
    </form>
  );
}

