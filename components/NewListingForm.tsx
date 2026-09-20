'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createListingAction,
  ActionResponse,
} from '@/actions/listing-actions';
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
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryLocalizedName, getLocationLocalizedName } from '@/lib/translations';


interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subCategories: { id: string; name: string; slug: string }[];
}

interface NewListingFormProps {
  categories: CategoryItem[];
}

// Ustalarga qulaylik uchun namunaviy professional rasmlar
const PRESET_IMAGES = [
  { slug: 'santexnika', labelUz: "Santexnik", labelRu: "Сантехника", url: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80" },
  { slug: 'elektrik', labelUz: "Elektrik", labelRu: "Электрика", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
  { slug: 'remont', labelUz: "Ta'mir / Remont", labelRu: "Ремонт", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80" },
  { slug: 'avto', labelUz: "Avto master", labelRu: "Автомастер", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80" },
  { slug: 'yuk-tashish', labelUz: "Yuk tashish", labelRu: "Грузоперевозки", url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80" },
  { slug: 'konditsioner', labelUz: "Konditsioner", labelRu: "Кондиционеры", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
  { slug: 'maishiy-texnika', labelUz: "Maishiy texnika", labelRu: "Быттехника", url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80" },
  { slug: 'temirchilik', labelUz: "Temirchilik", labelRu: "Кузнечное дело", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80" },
];

export default function NewListingForm({ categories }: NewListingFormProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    categoryId: categories[0]?.id || '',
    subCategoryId: '',
    location: 'Guliston shahri',
    address: '',
    phone: '+998',
    telegram: '',
    instagram: '',
    websiteUrl: '',
    price: '',
    experience: '',
    description: '',
    imageUrl: '',
    selectedPresetImage: PRESET_IMAGES[0].url,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Tanlangan kategoriya bo'yicha sub-kategoriyalarni olish
  const currentCategory = categories.find((c) => c.id === formData.categoryId);

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
    if (formData.imageUrl.trim()) {
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      {/* 1-Bo'lim: Asosiy ma'lumotlar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#e6e0da] dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f6f3ef] dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center font-extrabold text-sm shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#282624] dark:text-white">
              {t.newListing.step1Title}
            </h2>
            <p className="text-xs sm:text-sm text-[#67625d] dark:text-slate-400">
              {t.newListing.step1Subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* E'lon sarlavhasi */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.titleLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t.newListing.titlePlaceholder}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-950'
                  : 'border-[#e6e0da] dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Mutaxassis yoki Usta ismi */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.newListing.namePlaceholder}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-950'
                  : 'border-[#e6e0da] dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Hudud */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.locationLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-blue-600 dark:text-blue-400 pointer-events-none" />
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none transition-all"
              >
                {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                  <option key={loc} value={loc}>
                    {getLocationLocalizedName(loc, lang)}
                  </option>
                ))}
              </select>
            </div>
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>

          {/* Kategoriya */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.categoryLabel} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {getCategoryLocalizedName(c.name, lang)}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
          </div>

          {/* Sub-kategoriya */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.subCategoryLabel}
            </label>
            <select
              value={formData.subCategoryId}
              onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="">{lang === 'ru' ? "-- Выберите подкатегорию --" : "-- Ichki yo'nalishni tanlang --"}</option>
              {currentCategory?.subCategories.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {getCategoryLocalizedName(sc.name, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Aniq manzil */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.addressLabel}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.newListing.addressPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2-Bo'lim: Aloqa va Narxlar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#e6e0da] dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f6f3ef] dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center font-extrabold text-sm shadow-xs">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#282624] dark:text-white">
              {t.newListing.step2Title}
            </h2>
            <p className="text-xs sm:text-sm text-[#67625d] dark:text-slate-400">
              {t.newListing.step2Subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Telefon raqam */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.phoneLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998901234567"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-950'
                    : 'border-[#e6e0da] dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Telegram username */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.telegramLabel}
            </label>
            <div className="relative">
              <Send className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-500 dark:text-sky-400 pointer-events-none" />
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder={t.newListing.telegramPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.instagramLabel}
            </label>
            <div className="relative">
              <InstagramIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-rose-500 pointer-events-none" />
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="usta_instagram"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.priceLabel}
            </label>
            <div className="relative">
              <Coins className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500 dark:text-amber-400 pointer-events-none" />
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder={t.newListing.pricePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Ish tajribasi */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.experienceLabel}
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#67625d] dark:text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder={t.newListing.experiencePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Veb-sayt yoki Manzil (Havola) */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
              {t.newListing.websiteLabel}
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-600 dark:text-sky-400 pointer-events-none" />
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder={t.newListing.websitePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            {errors.websiteUrl && <p className="text-xs text-red-500 mt-1">{errors.websiteUrl}</p>}
          </div>
        </div>
      </div>

      {/* 3-Bo'lim: Rasm va Tavsif */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#e6e0da] dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f6f3ef] dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center font-extrabold text-sm shadow-xs">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#282624] dark:text-white">
              {t.newListing.step3Title}
            </h2>
            <p className="text-xs sm:text-sm text-[#67625d] dark:text-slate-400">
              {t.newListing.step3Subtitle}
            </p>
          </div>
        </div>

        {/* Tavsif textarea */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200 mb-1.5">
            {t.newListing.descriptionLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t.newListing.descriptionPlaceholder}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-950'
                : 'border-[#e6e0da] dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Rasm tanlash / URL */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-semibold text-[#282624] dark:text-slate-200">
            {t.newListing.imageLabel}
          </label>

          {/* Oson tanlash uchun tayyor professional usta rasmlari */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_IMAGES.map((preset) => {
              const isSelected =
                formData.selectedPresetImage === preset.url && !formData.imageUrl;
              const presetLabel = lang === 'ru' ? preset.labelRu : preset.labelUz;
              return (
                <div
                  key={preset.slug}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      selectedPresetImage: preset.url,
                      imageUrl: '',
                    });
                  }}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group active:scale-95 touch-manipulation ${
                    isSelected
                      ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-md'
                      : 'border-[#e6e0da] dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  <SafeImage
                    src={preset.url}
                    alt={presetLabel}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-1">
                    <span className="text-white text-xs font-bold text-center drop-shadow-md">
                      {presetLabel}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Yoki o'z rasm havolasini kiritish */}
          <div className="pt-2">
            <span className="text-xs text-[#67625d] dark:text-slate-400 block mb-1.5 font-medium">
              {lang === 'ru' ? "Или укажите прямую ссылку на фото (URL):" : "Yoki o'z rasmingiz havolasi (URL):"}
            </span>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[#67625d] dark:text-slate-400 pointer-events-none" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] dark:border-slate-700 text-xs sm:text-sm text-[#282624] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Yuborish tugmasi */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#e6e0da] dark:border-slate-700 hover:bg-[#f6f3ef] dark:hover:bg-slate-800 active:scale-95 text-[#67625d] dark:text-slate-300 hover:text-[#282624] dark:hover:text-white text-sm font-semibold transition-all cursor-pointer touch-manipulation"
        >
          {lang === 'ru' ? "Отмена" : "Bekor qilish"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 active:scale-95 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer touch-manipulation"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.newListing.submitting}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.newListing.submitBtn}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
