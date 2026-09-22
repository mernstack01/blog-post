'use client';

import { useState, useRef } from 'react';
import { adminUpdateListingFullAction, AdminUpdateListingInput } from '@/actions/admin-actions';
import { SIRDARYO_LOCATIONS } from '@/lib/constants';
import {
  X,
  Save,
  AlertCircle,
  Phone,
  Send,
  Globe,
  User,
  RefreshCw,
  Trash2,
  Plus,
  Crop as CropIcon,
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SafeImage from '@/components/SafeImage';
import ImageCropperModal from '@/components/ImageCropperModal';

interface AdminEditListingModalProps {
  listing: any;
  categories: any[];
  onClose: () => void;
  onSuccess: (updatedListing: any) => void;
}

export default function AdminEditListingModal({
  listing,
  categories,
  onClose,
  onSuccess,
}: AdminEditListingModalProps) {
  const [formData, setFormData] = useState<AdminUpdateListingInput>({
    title: listing.title || '',
    name: listing.name || '',
    phone: listing.phone || '',
    instagram: listing.instagram || '',
    telegram: listing.telegram || '',
    websiteUrl: listing.websiteUrl || '',
    location: listing.location || 'Guliston shahri',
    address: listing.address || '',
    price: listing.price || '',
    experience: listing.experience || '',
    description: listing.description || '',
    images: listing.images || [],
    categoryId: listing.categoryId || (categories[0]?.id || ''),
    subCategoryId: listing.subCategoryId || '',
    status: listing.status || 'APPROVED',
    paidTier: listing.paidTier || 'FREE',
    isVerified: listing.isVerified || false,
    adminRating: listing.adminRating ?? 4.5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rasm qirqish holatlari
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropEditingIndex, setCropEditingIndex] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentImages = formData.images || [];
    if (currentImages.length >= 5) {
      alert("Maksimal 5 tagacha rasm yuklash mumkin");
      return;
    }

    setCropEditingIndex(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropExisting = (imgUrl: string, index: number) => {
    setCropImageSrc(imgUrl);
    setCropEditingIndex(index);
    setCropperOpen(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', croppedBlob, 'admin-listing.webp');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => {
          const currentImages = [...(prev.images || [])];
          if (cropEditingIndex !== null) {
            currentImages[cropEditingIndex] = data.url;
          } else {
            currentImages.push(data.url);
          }
          return { ...prev, images: currentImages };
        });
      } else {
        alert(data.message || "Rasm yuklashda xatolik yuz berdi");
      }
    } catch {
      alert("Serverga yuklashda xatolik yuz berdi");
    } finally {
      setIsUploadingImage(false);
      setCropEditingIndex(null);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminUpdateListingFullAction(listing.id, formData);
      if (res.success && res.listing) {
        onSuccess(res.listing);
        onClose();
      } else {
        setError(res.message || "Xatolik yuz berdi");
      }
    } catch {
      setError("Kutilmagan xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground rounded-3xl border border-border shadow-2xl w-full max-w-3xl overflow-hidden my-auto max-h-[calc(100dvh-2rem)] overscroll-contain flex flex-col">
        
        {/* Modal Boshi */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                Admin Full Edit
              </span>
              <span className="text-xs text-muted-foreground font-mono truncate">
                ID: {listing.id.slice(-6)}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-foreground tracking-tight mt-1">
              E'lonni to'liq tahrirlash
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tanasi */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Asosiy identifikatorlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1">
                E'lon sarlavhasi (Kasb / Mutaxassislik) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Usta / Mutaxassis ismi *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Telefon raqami *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400 pointer-events-none shrink-0" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Ijtimoiy tarmoqlar */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3">
            <span className="text-xs font-bold text-foreground block uppercase tracking-wider">
              Ijtimoiy Tarmoqlar va Havolalar
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Instagram profil
                </label>
                <div className="relative">
                  <InstagramIcon className="absolute left-3 top-3 w-3.5 h-3.5 text-rose-500 pointer-events-none shrink-0" />
                  <input
                    type="text"
                    value={formData.instagram || ''}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@username yoki havola"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Telegram profil
                </label>
                <div className="relative">
                  <Send className="absolute left-3 top-3 w-3.5 h-3.5 text-sky-500 pointer-events-none shrink-0" />
                  <input
                    type="text"
                    value={formData.telegram || ''}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    placeholder="@username yoki havola"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Veb-sayt / Portfolio
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-3.5 h-3.5 text-primary pointer-events-none shrink-0" />
                  <input
                    type="text"
                    value={formData.websiteUrl || ''}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Kategoriya, Tuman va Manzil */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Kategoriya
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subCategoryId: '' })}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Yo'nalish (Sub-kategoriya)
              </label>
              <select
                value={formData.subCategoryId || ''}
                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="">Barchasi (Tanlanmagan)</option>
                {selectedCategory?.subCategories?.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Hudud / Tuman
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {SIRDARYO_LOCATIONS.filter((l) => l !== 'Barcha hududlar').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Narx, Tajriba va Manzil */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Narxi
              </label>
              <input
                type="text"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Masalan: 100,000 so'm"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Tajriba
              </label>
              <input
                type="text"
                value={formData.experience || ''}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Masalan: 5 yil"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Aniq manzil / Mo'ljal
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Mo'ljal yoki ko'cha"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* 5. Status, VIP, Verified va Admin Bahosi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-primary/5 border border-primary/20">
            <div>
              <label className="block text-[11px] font-bold text-primary mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground cursor-pointer"
              >
                <option value="APPROVED">Tasdiqlangan</option>
                <option value="PENDING">Kutilmoqda</option>
                <option value="REJECTED">Rad etilgan</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary mb-1">
                Tarif (PaidTier)
              </label>
              <select
                value={formData.paidTier}
                onChange={(e) => setFormData({ ...formData, paidTier: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground cursor-pointer"
              >
                <option value="FREE">FREE</option>
                <option value="STANDARD">STANDARD (Homiy)</option>
                <option value="VIP_GOLD">VIP GOLD</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary mb-1">
                Admin bahosi (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.adminRating}
                onChange={(e) => setFormData({ ...formData, adminRating: parseFloat(e.target.value) || 4.5 })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-xs font-bold text-primary">
                  Verified nishoni
                </span>
              </label>
            </div>
          </div>

          {/* 6. E'lon Rasmlari */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-foreground">
                E'lon rasmlari (Maksimal 5 ta, 4:3 formatda)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage || (formData.images || []).length >= 5}
                className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold border border-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Yangi rasm qo'shish</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileSelect}
              disabled={isUploadingImage}
            />

            {(formData.images || []).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(formData.images || []).map((imgUrl, idx) => (
                  <div
                    key={imgUrl + idx}
                    className="relative rounded-xl overflow-hidden border border-border group bg-muted"
                  >
                    <SafeImage
                      src={imgUrl}
                      alt={`Listing photo ${idx + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">
                        Asosiy
                      </span>
                    )}
                    <div className="absolute top-1 right-1 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCropExisting(imgUrl, idx)}
                        className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-xs transition-transform hover:scale-110 cursor-pointer shrink-0"
                        title="Qayta qirqish"
                      >
                        <CropIcon className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="w-5 h-5 rounded-full bg-destructive hover:opacity-90 text-destructive-foreground flex items-center justify-center text-xs transition-transform hover:scale-110 cursor-pointer shrink-0"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Ushbu e'londa hozircha rasm mavjud emas.
              </p>
            )}
          </div>

          {/* 7. Tavsif */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Batafsil tavsif *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />
          </div>

          {/* Modal Tugmalari */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer shrink-0"
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              ) : (
                <Save className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>O'zgarishlarni saqlash</span>
            </button>
          </div>
        </form>

      </div>

      {/* 4:3 E'lon Rasm Qirqish Modali */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropImageSrc}
        aspectRatio={4 / 3}
        cropShape="rect"
        outputWidth={800}
        outputHeight={600}
        title="Admin: E'lon rasmini qirqish (4:3)"
        onCropComplete={handleCropComplete}
        onClose={() => {
          setCropperOpen(false);
          setCropImageSrc(null);
          setCropEditingIndex(null);
        }}
        lang="uz"
      />
    </div>
  );
}
