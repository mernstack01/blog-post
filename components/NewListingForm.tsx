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
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SafeImage from '@/components/SafeImage';


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
  { label: "Santexnik", url: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80" },
  { label: "Elektrik", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
  { label: "Ta'mir / Remont", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80" },
  { label: "Avto master", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80" },
  { label: "Yuk tashish", url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80" },
  { label: "Konditsioner", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
  { label: "Maishiy texnika", url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80" },
  { label: "Temirchilik", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80" },
];

export default function NewListingForm({ categories }: NewListingFormProps) {
  const router = useRouter();

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
      title: formData.title,
      name: formData.name,
      description: formData.description,
      phone: formData.phone,
      telegram: formData.telegram,
      instagram: formData.instagram,
      location: formData.location,
      address: formData.address,
      price: formData.price || "Kelishilgan holda",
      experience: formData.experience || "Mavjud",
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId || undefined,
      images: imageList,
    };

    // 1. Client-side Zod tekshiruvi
    const clientValidation = createListingSchema.safeParse(payload);
    if (!clientValidation.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = (clientValidation.error as any).issues || (clientValidation.error as any).errors || [];
      issues.forEach((err: any) => {
        const fieldName = Array.isArray(err.path) ? (err.path[0] as string) : 'general';
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
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
        setServerError(res.message || "Xatolik yuz berdi");
        if (res.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(res.errors).forEach(([k, v]) => {
            mapped[k] = v[0];
          });
          setErrors(mapped);
        }
      }
    } catch (err: any) {
      setServerError(err?.message || "Kutilmagan xatolik yuz berdi");
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6e0da] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f6f3ef]">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-extrabold text-sm shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#282624]">
              Xizmat yoki Usta haqida ma'lumot
            </h2>
            <p className="text-xs sm:text-sm text-[#67625d]">
              Mijozlar sizni tezroq va oson topishi uchun sarlavha va yo'nalishni kiriting
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* E'lon sarlavhasi */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              E'lon sarlavhasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masalan: Uylar uchun sifatli santexnika va isitish tizimlari montaji"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#282624] focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-[#e6e0da] focus:ring-orange-500/20 focus:border-orange-500'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Mutaxassis yoki Usta ismi */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Ism-familiyangiz yoki Firma nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Usta Otabek yoki Guliston Climat"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#282624] focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-[#e6e0da] focus:ring-orange-500/20 focus:border-orange-500'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Hudud */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Sirdaryo shahri / tumani <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-orange-600 pointer-events-none" />
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer appearance-none transition-all"
              >
                {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>

          {/* Kategoriya */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Asosiy Kategoriya <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
          </div>

          {/* Sub-kategoriya */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Ichki yo'nalish (Ixtiyoriy)
            </label>
            <select
              value={formData.subCategoryId}
              onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
            >
              <option value="">-- Ichki yo'nalishni tanlang --</option>
              {currentCategory?.subCategories.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Aniq manzil */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Aniqroq manzil yoki mo'ljal
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Masalan: 3-mavze, Sayxun restorani ro'parasida"
              className="w-full px-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2-Bo'lim: Aloqa va Narxlar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6e0da] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f6f3ef]">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-extrabold text-sm shadow-xs">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#282624]">
              Bog'lanish va Xizmat narxlari
            </h2>
            <p className="text-xs sm:text-sm text-[#67625d]">
              Mijozlar to'g'ridan-to'g'ri telefon yoki messenjer orqali qo'ng'iroq qilishadi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Telefon raqam */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Telefon raqamingiz <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600 pointer-events-none" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998901234567"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#282624] focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-[#e6e0da] focus:ring-orange-500/20 focus:border-orange-500'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Telegram username */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Telegram username
            </label>
            <div className="relative">
              <Send className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-500 pointer-events-none" />
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="@usta_sirdaryo yoki link"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Instagram sahifa (ixtiyoriy)
            </label>
            <div className="relative">
              <InstagramIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-rose-500 pointer-events-none" />
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="usta_instagram"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Xizmat narxi
            </label>
            <div className="relative">
              <Coins className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500 pointer-events-none" />
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Masalan: 100,000 so'mdan yoki Kelishilgan"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Tajriba */}
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
              Ish tajribasi
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#67625d] pointer-events-none" />
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Masalan: 5 yil yoki 10 yillik professional tajriba"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0da] text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3-Bo'lim: Rasm va Tavsif */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6e0da] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f6f3ef]">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-extrabold text-sm shadow-xs">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#282624]">
              Tavsif va Mutaxassis rasmi
            </h2>
            <p className="text-xs sm:text-sm text-[#67625d]">
              Qiladigan ishlaringizni batafsil tushuntiring va mos rasmni tanlang
            </p>
          </div>
        </div>

        {/* Tavsif textarea */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#282624] mb-1.5">
            Batafsil tavsif <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Xizmatlaringiz, qulayliklar, kafolat muddati, ishlatiladigan asbob-uskunalar haqida batafsil yozing (kamida 20 ta belgi)..."
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#282624] focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-red-400 focus:ring-red-200'
                : 'border-[#e6e0da] focus:ring-orange-500/20 focus:border-orange-500'
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Rasm tanlash / URL */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-semibold text-[#282624]">
            E'lon uchun rasm (Tanlang yoki URL kiriting)
          </label>

          {/* Oson tanlash uchun tayyor professional usta rasmlari */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_IMAGES.map((preset) => {
              const isSelected =
                formData.selectedPresetImage === preset.url && !formData.imageUrl;
              return (
                <div
                  key={preset.label}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      selectedPresetImage: preset.url,
                      imageUrl: '',
                    });
                  }}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group ${
                    isSelected
                      ? 'border-orange-500 ring-4 ring-orange-500/20 shadow-md'
                      : 'border-[#e6e0da] hover:border-orange-300'
                  }`}
                >
                  <SafeImage
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-1">
                    <span className="text-white text-xs font-bold text-center drop-shadow-md">
                      {preset.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-orange-600 text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Yoki o'z rasm havolasini kiritish */}
          <div className="pt-2">
            <span className="text-xs text-[#67625d] block mb-1.5 font-medium">
              Yoki o'z rasmingiz havolasi (URL):
            </span>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[#67625d] pointer-events-none" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] text-xs sm:text-sm text-[#282624] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
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
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#e6e0da] hover:bg-[#f6f3ef] text-[#67625d] hover:text-[#282624] text-sm font-semibold transition-colors cursor-pointer"
        >
          Bekor qilish
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saqlanmoqda...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>E'lonni bepul joylashtirish</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
