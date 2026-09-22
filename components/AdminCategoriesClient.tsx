'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CategoryAdminItem,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/category-actions';
import { adminLogoutAction } from '@/actions/admin-actions';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Layers,
  Check,
  X,
  Wrench,
  Car,
  Tv,
  Hammer,
  GraduationCap,
  Heart,
  ShoppingBag,
  Utensils,
  Laptop,
  Camera,
  Scissors,
  Home,
  Loader2,
} from 'lucide-react';

// Icon mapper helper
const ICON_OPTIONS = [
  { name: 'Wrench', label: "Ta'mir / Ustalar", icon: Wrench },
  { name: 'Car', label: 'Avto / Yuk tashish', icon: Car },
  { name: 'Tv', label: 'Maishiy texnika', icon: Tv },
  { name: 'Hammer', label: 'Qurilish', icon: Hammer },
  { name: 'GraduationCap', label: "Ta'lim / Kurslar", icon: GraduationCap },
  { name: 'Scissors', label: "Go'zallik / Sartarosh", icon: Scissors },
  { name: 'Heart', label: 'Salomatlik / Tibbiyot', icon: Heart },
  { name: 'ShoppingBag', label: 'Savdo / Do\'konlar', icon: ShoppingBag },
  { name: 'Utensils', label: 'Taom / Restoranlar', icon: Utensils },
  { name: 'Laptop', label: 'IT va Texnologiya', icon: Laptop },
  { name: 'Camera', label: 'Foto / Video', icon: Camera },
  { name: 'Home', label: 'Ko\'chmas mulk / Ijara', icon: Home },
  { name: 'Layers', label: 'Umumiy xizmatlar', icon: Layers },
];

function CategoryIcon({ iconName, className = 'w-5 h-5' }: { iconName: string | null; className?: string }) {
  const found = ICON_OPTIONS.find((item) => item.name.toLowerCase() === (iconName || '').toLowerCase());
  const IconComponent = found ? found.icon : Layers;
  return <IconComponent className={className} />;
}

interface AdminCategoriesClientProps {
  initialCategories: CategoryAdminItem[];
}

export default function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryAdminItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Modal holati
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryAdminItem | null>(null);
  const [formData, setFormData] = useState({
    nameUz: '',
    nameRu: '',
    slug: '',
    icon: 'Layers',
    order: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Qidiruv
  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      cat.nameUz.toLowerCase().includes(q) ||
      cat.nameRu.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q)
    );
  });

  const totalListings = categories.reduce((sum, c) => sum + (c.listingsCount || 0), 0);
  const activeCount = categories.filter((c) => c.isActive).length;

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      nameUz: '',
      nameRu: '',
      slug: '',
      icon: 'Layers',
      order: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryAdminItem) => {
    setEditingCategory(cat);
    setFormData({
      nameUz: cat.nameUz,
      nameRu: cat.nameRu,
      slug: cat.slug,
      icon: cat.icon || 'Layers',
      order: cat.order,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Saqlash (Yaratish yoki Yangilash)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameUz.trim() || !formData.nameRu.trim()) {
      setMessage({ text: "O'zbekcha va Ruscha nomlarini kiritish majburiy!", type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (editingCategory) {
        // Yangilash
        const res = await updateCategoryAction(editingCategory.id, {
          nameUz: formData.nameUz,
          nameRu: formData.nameRu,
          slug: formData.slug,
          icon: formData.icon,
          order: Number(formData.order),
          isActive: formData.isActive,
        });

        if (res.success && res.category) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? {
                    ...c,
                    nameUz: res.category!.nameUz,
                    nameRu: res.category!.nameRu,
                    slug: res.category!.slug,
                    icon: res.category!.icon,
                    order: res.category!.order,
                    isActive: res.category!.isActive,
                  }
                : c
            )
          );
          setMessage({ text: "Kategoriya muvaffaqiyatli yangilandi!", type: 'success' });
          closeModal();
        } else {
          setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
        }
      } else {
        // Yaratish
        const res = await createCategoryAction({
          nameUz: formData.nameUz,
          nameRu: formData.nameRu,
          slug: formData.slug,
          icon: formData.icon,
          order: Number(formData.order),
          isActive: formData.isActive,
        });

        if (res.success && res.category) {
          const newCat: CategoryAdminItem = {
            id: res.category.id,
            name: res.category.name,
            nameUz: res.category.nameUz,
            nameRu: res.category.nameRu,
            slug: res.category.slug,
            icon: res.category.icon,
            order: res.category.order,
            isActive: res.category.isActive,
            listingsCount: 0,
            createdAt: res.category.createdAt,
            updatedAt: res.category.updatedAt,
          };
          setCategories((prev) => [...prev, newCat]);
          setMessage({ text: "Yangi kategoriya yaratildi!", type: 'success' });
          closeModal();
        } else {
          setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
        }
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik yuz berdi", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Holatni tezkor o'zgartirish (Faol / Nofaol)
  const handleToggleActive = async (cat: CategoryAdminItem) => {
    setLoadingId(cat.id);
    setMessage(null);
    try {
      const res = await updateCategoryAction(cat.id, { isActive: !cat.isActive });
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: !cat.isActive } : c))
        );
        setMessage({
          text: `"${cat.nameUz}" ${!cat.isActive ? 'faollashtirildi' : 'nofaol qilindi'}`,
          type: 'success',
        });
      } else {
        setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  // O'chirish
  const handleDelete = async (cat: CategoryAdminItem) => {
    if (cat.listingsCount > 0) {
      alert(`Ushbu kategoriyada ${cat.listingsCount} ta e'lon bor. Avval ularni ko'chiring yoki o'chiring!`);
      return;
    }

    if (!window.confirm(`Haqiqatan ham "${cat.nameUz}" kategoriyasini o'chirmoqchimisiz?`)) {
      return;
    }

    setLoadingId(cat.id);
    setMessage(null);
    try {
      const res = await deleteCategoryAction(cat.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        setMessage({ text: "Kategoriya o'chirildi", type: 'success' });
      } else {
        setMessage({ text: res.message || "O'chirishda xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = async () => {
    await adminLogoutAction();
  };

  return (
    <div className="space-y-6">
      {/* Sarlavha va Navigatsiya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card text-card-foreground p-4 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/40">
              SuperAdmin
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Kategoriyalar Boshqaruvi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
            Kategoriyalar va Xizmatlar
          </h1>
        </div>

        {/* Sub-Navigatsiya Tablari */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            E'lonlar
          </Link>
          <Link
            href="/admin/categories"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary/10 text-primary border border-primary/20 shrink-0"
          >
            Kategoriyalar
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            Sozlamalar
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Yangi Kategoriya</span>
          </button>

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

      {/* Statistika Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Jami Kategoriyalar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1 block">
            {categories.length}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Barcha soha yo'nalishlari
          </span>
        </div>

        <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Faol Kategoriyalar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 block">
            {activeCount}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Bosh sahifada ko'rinmoqda
          </span>
        </div>

        <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
            Biriktirilgan E'lonlar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight mt-1 block">
            {totalListings}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Ustalar va xizmatlar soni
          </span>
        </div>
      </div>

      {/* Qidiruv qatori */}
      <div className="bg-card text-card-foreground p-3.5 sm:p-4 rounded-3xl border border-border shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kategoriya nomi (O'zbekcha, Ruscha yoki slug) bo'yicha qidiruv..."
            className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
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
      </div>

      {/* Kategoriyalar Jadvali */}
      <div className="bg-card text-card-foreground rounded-3xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="mobile-category-table w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Tartib</th>
                <th className="py-3.5 px-4">Ikonka & Nomi</th>
                <th className="py-3.5 px-4">Ruscha Nomi</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-center">E'lonlar</th>
                <th className="py-3.5 px-4 text-center">Holati</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Hech qanday kategoriya topilmadi
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    {/* Tartib raqami */}
                    <td data-label="Tartib" className="py-3.5 px-4 sm:px-6 font-bold text-muted-foreground">
                      #{cat.order}
                    </td>

                    {/* Ikonka & O'zbekcha Nomi */}
                    <td data-label="Ikonka & Nomi" className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <CategoryIcon iconName={cat.icon} className="w-5 h-5 shrink-0" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            <span>{cat.nameUz}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold">
                              UZ
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Ikonka: <code className="font-mono text-[10px]">{cat.icon || 'Layers'}</code>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Ruscha Nomi */}
                    <td data-label="Ruscha Nomi" className="py-3.5 px-4">
                      <div className="font-medium text-foreground flex items-center gap-1.5">
                        <span>{cat.nameRu}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-destructive/10 text-destructive font-bold">
                          RU
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td data-label="Slug" className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      /{cat.slug}
                    </td>

                    {/* E'lonlar soni */}
                    <td data-label="E’lonlar" className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-secondary text-secondary-foreground">
                        {cat.listingsCount}
                      </span>
                    </td>

                    {/* Holati */}
                    <td data-label="Holati" className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        disabled={loadingId === cat.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                          cat.isActive
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {loadingId === cat.id ? (
                          <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                        ) : cat.isActive ? (
                          <Check className="w-3 h-3 stroke-[3] shrink-0" />
                        ) : (
                          <X className="w-3 h-3 stroke-[3] shrink-0" />
                        )}
                        <span>{cat.isActive ? 'Faol' : 'Nofaol'}</span>
                      </button>
                    </td>

                    {/* Amallar */}
                    <td data-label="Amallar" className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4 shrink-0" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={loadingId === cat.id || cat.listingsCount > 0}
                          className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                          title={cat.listingsCount > 0 ? "E'lonlar mavjud bo'lgani sababli o'chirib bo'lmaydi" : "O'chirish"}
                        >
                          <Trash2 className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yaratish / Tahrirlash Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7 relative overflow-y-auto max-h-[calc(100dvh-2rem)] overscroll-contain">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                {editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya Qo'shish"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* O'zbekcha Nomi */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Kategoriya Nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameUz}
                  onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                  placeholder="Masalan: Ustalar va Ta'mir"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              {/* Ruscha Nomi */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Kategoriya Nomi (Ruscha) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                  placeholder="Например: Мастера и Ремонт"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  URL Slug (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ustalar (bo'sh qoldirilsa avtomatik generatsiya qilinadi)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              {/* Ikonka Tanlash */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Ikonka Tanlang
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 rounded-2xl border border-border bg-muted/30 max-h-36 overflow-y-auto">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = formData.icon.toLowerCase() === opt.name.toLowerCase();
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: opt.name })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-card text-foreground hover:bg-muted'
                        }`}
                        title={opt.label}
                      >
                        <IconComp className="w-5 h-5 shrink-0" />
                        <span className="text-[9px] truncate w-full font-medium">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tartib raqami va Faol status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Tartib Raqami
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-secondary/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-ring"
                    />
                    <span className="text-xs font-bold text-foreground">
                      Faol holatda
                    </span>
                  </label>
                </div>
              </div>

              {/* Tugmalar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                  <span>{editingCategory ? "Saqlash" : "Yaratish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
