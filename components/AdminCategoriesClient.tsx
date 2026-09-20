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
  ArrowUpDown,
  Check,
  X,
  Sparkles,
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
  ShieldAlert,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              SuperAdmin
            </span>
            <span className="text-xs text-[#67625d] dark:text-zinc-400 font-medium">
              Kategoriyalar Boshqaruvi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#282624] dark:text-zinc-100 tracking-tight mt-1">
            Kategoriyalar va Xizmatlar
          </h1>
        </div>

        {/* Sub-Navigatsiya Tablari */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 transition-colors"
          >
            E'lonlar
          </Link>
          <Link
            href="/admin/categories"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
          >
            Kategoriyalar
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 transition-colors"
          >
            Sozlamalar
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Yangi Kategoriya</span>
          </button>

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

      {/* Statistika Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-[#67625d] dark:text-zinc-400 uppercase tracking-wider block">
            Jami Kategoriyalar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#282624] dark:text-zinc-100 tracking-tight mt-1 block">
            {categories.length}
          </span>
          <span className="text-[11px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Barcha soha yo'nalishlari
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Faol Kategoriyalar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 block">
            {activeCount}
          </span>
          <span className="text-[11px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Bosh sahifada ko'rinmoqda
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
            Biriktirilgan E'lonlar
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight mt-1 block">
            {totalListings}
          </span>
          <span className="text-[11px] text-[#67625d] dark:text-zinc-400 mt-1 block">
            Ustalar va xizmatlar soni
          </span>
        </div>
      </div>

      {/* Qidiruv qatori */}
      <div className="bg-white dark:bg-zinc-900 p-3.5 sm:p-4 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#67625d] dark:text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kategoriya nomi (O'zbekcha, Ruscha yoki slug) bo'yicha qidiruv..."
            className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm text-[#282624] dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#67625d] dark:text-zinc-400 hover:text-[#282624] px-1.5 py-0.5 rounded-md hover:bg-[#f6f3ef] dark:hover:bg-zinc-700"
            >
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Kategoriyalar Jadvali */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e6e0da] dark:border-zinc-800 bg-[#fbf9f6] dark:bg-zinc-800/60 text-[11px] font-bold text-[#67625d] dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Tartib</th>
                <th className="py-3.5 px-4">Ikonka & Nomi</th>
                <th className="py-3.5 px-4">Ruscha Nomi</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-center">E'lonlar</th>
                <th className="py-3.5 px-4 text-center">Holati</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2eee9] dark:divide-zinc-800 text-xs sm:text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#67625d] dark:text-zinc-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-[#b0a9a1] dark:text-zinc-600" />
                    Hech qanday kategoriya topilmadi
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#faf7f3] dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Tartib raqami */}
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-[#67625d] dark:text-zinc-400">
                      #{cat.order}
                    </td>

                    {/* Ikonka & O'zbekcha Nomi */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <CategoryIcon iconName={cat.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-[#282624] dark:text-zinc-100 flex items-center gap-1.5">
                            <span>{cat.nameUz}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
                              UZ
                            </span>
                          </div>
                          <div className="text-[11px] text-[#67625d] dark:text-zinc-400">
                            Ikonka: <code className="font-mono text-[10px]">{cat.icon || 'Layers'}</code>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Ruscha Nomi */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#282624] dark:text-zinc-200 flex items-center gap-1.5">
                        <span>{cat.nameRu}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold">
                          RU
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#67625d] dark:text-zinc-400">
                      /{cat.slug}
                    </td>

                    {/* E'lonlar soni */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#f6f3ef] dark:bg-zinc-800 text-[#282624] dark:text-zinc-200">
                        {cat.listingsCount}
                      </span>
                    </td>

                    {/* Holati (Status Toggle) */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        disabled={loadingId === cat.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {loadingId === cat.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : cat.isActive ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <X className="w-3 h-3 stroke-[3]" />
                        )}
                        <span>{cat.isActive ? 'Faol' : 'Nofaol'}</span>
                      </button>
                    </td>

                    {/* Amallar */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 text-[#67625d] hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={loadingId === cat.id || cat.listingsCount > 0}
                          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-[#67625d] hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={cat.listingsCount > 0 ? "E'lonlar mavjud bo'lgani sababli o'chirib bo'lmaydi" : "O'chirish"}
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-2xl p-6 sm:p-7 relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#f2eee9] dark:border-zinc-800">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#282624] dark:text-zinc-100">
                {editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya Qo'shish"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* O'zbekcha Nomi */}
              <div>
                <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Kategoriya Nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameUz}
                  onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                  placeholder="Masalan: Ustalar va Ta'mir"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Ruscha Nomi */}
              <div>
                <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Kategoriya Nomi (Ruscha) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                  placeholder="Например: Мастера и Ремонт"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  URL Slug (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ustalar (bo'sh qoldirilsa avtomatik generatsiya qilinadi)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Ikonka Tanlash */}
              <div>
                <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Ikonka Tanlang
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 rounded-2xl border border-[#e6e0da] dark:border-zinc-700 bg-[#faf8f5] dark:bg-zinc-800/50 max-h-36 overflow-y-auto">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = formData.icon.toLowerCase() === opt.name.toLowerCase();
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: opt.name })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-600'
                        }`}
                        title={opt.label}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[9px] truncate w-full font-medium">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tartib raqami va Faol status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Tartib Raqami
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-[#faf8f5] dark:bg-zinc-800/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-[#282624] dark:text-zinc-200">
                      Faol holatda
                    </span>
                  </label>
                </div>
              </div>

              {/* Tugmalar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f2eee9] dark:border-zinc-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
