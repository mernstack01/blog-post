'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RegionAdminItem,
  DistrictAdminItem,
  createRegionAction,
  updateRegionAction,
  deleteRegionAction,
  createDistrictAction,
  updateDistrictAction,
  deleteDistrictAction,
  syncListingLocationsAction,
} from '@/actions/region-actions';
import { adminLogoutAction } from '@/actions/admin-actions';
import {
  MapPin,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Layers,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Building2,
  Globe,
  Loader2,
  X,
  Check,
} from 'lucide-react';

interface AdminRegionsClientProps {
  initialRegions: RegionAdminItem[];
}

export default function AdminRegionsClient({ initialRegions }: AdminRegionsClientProps) {
  const [regions, setRegions] = useState<RegionAdminItem[]>(initialRegions);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>(() => {
    // Odatiy holatda birinchi viloyatni ochib qo'yish
    const initial: Record<string, boolean> = {};
    if (initialRegions.length > 0) {
      initial[initialRegions[0].id] = true;
    }
    return initial;
  });

  const router = useRouter();

  // Region Modal State
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<RegionAdminItem | null>(null);
  const [regionForm, setRegionForm] = useState({
    nameUz: '',
    nameRu: '',
    slug: '',
    order: 0,
  });

  // District Modal State
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<DistrictAdminItem | null>(null);
  const [districtForm, setDistrictForm] = useState({
    regionId: '',
    nameUz: '',
    nameRu: '',
    slug: '',
    order: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Region accordion toggle
  const toggleRegionExpand = (regionId: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionId]: !prev[regionId],
    }));
  };

  // Qidiruv filtri
  const filteredRegions = regions.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const regionMatches =
      r.nameUz.toLowerCase().includes(q) ||
      r.nameRu.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q);

    const districtMatches = r.districts.some(
      (d) =>
        d.nameUz.toLowerCase().includes(q) ||
        d.nameRu.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q)
    );

    return regionMatches || districtMatches;
  });

  // Umumiy statistika
  const totalDistricts = regions.reduce((sum, r) => sum + r.districts.length, 0);
  const totalListings = regions.reduce((sum, r) => {
    const fromDistricts = r.districts.reduce((dSum, d) => dSum + (d.listingsCount || 0), 0);
    return sum + (r.listingsCount || fromDistricts);
  }, 0);

  // --- REGION CRUD ---
  const openCreateRegionModal = () => {
    setEditingRegion(null);
    setRegionForm({
      nameUz: '',
      nameRu: '',
      slug: '',
      order: regions.length + 1,
    });
    setIsRegionModalOpen(true);
  };

  const openEditRegionModal = (region: RegionAdminItem) => {
    setEditingRegion(region);
    setRegionForm({
      nameUz: region.nameUz,
      nameRu: region.nameRu,
      slug: region.slug,
      order: region.order,
    });
    setIsRegionModalOpen(true);
  };

  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionForm.nameUz.trim() || !regionForm.nameRu.trim()) {
      setMessage({ text: "Viloyat nomi (O'zbekcha va Ruscha) to'ldirilishi shart", type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (editingRegion) {
        const res = await updateRegionAction(editingRegion.id, {
          nameUz: regionForm.nameUz,
          nameRu: regionForm.nameRu,
          slug: regionForm.slug,
          order: Number(regionForm.order),
        });

        if (res.success && res.region) {
          setRegions((prev) =>
            prev.map((r) =>
              r.id === editingRegion.id
                ? {
                    ...r,
                    nameUz: res.region!.nameUz,
                    nameRu: res.region!.nameRu,
                    slug: res.region!.slug,
                    order: res.region!.order,
                  }
                : r
            )
          );
          setMessage({ text: "Viloyat ma'lumotlari muvaffaqiyatli yangilandi!", type: 'success' });
          setIsRegionModalOpen(false);
        } else {
          setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
        }
      } else {
        const res = await createRegionAction({
          nameUz: regionForm.nameUz,
          nameRu: regionForm.nameRu,
          slug: regionForm.slug,
          order: Number(regionForm.order),
        });

        if (res.success && res.region) {
          const newRegionItem: RegionAdminItem = {
            id: res.region.id,
            nameUz: res.region.nameUz,
            nameRu: res.region.nameRu,
            slug: res.region.slug,
            order: res.region.order,
            districts: [],
            listingsCount: 0,
            createdAt: res.region.createdAt,
            updatedAt: res.region.updatedAt,
          };
          setRegions((prev) => [...prev, newRegionItem]);
          setExpandedRegions((prev) => ({ ...prev, [newRegionItem.id]: true }));
          setMessage({ text: `"${res.region.nameUz}" viloyati muvaffaqiyatli qo'shildi!`, type: 'success' });
          setIsRegionModalOpen(false);
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

  const handleDeleteRegion = async (region: RegionAdminItem) => {
    if (region.districts.some((d) => d.listingsCount > 0) || region.listingsCount > 0) {
      alert(`Ushbu viloyatda e'lonlar mavjud. Avval e'lonlarni boshqa hududga o'tkazing yoki o'chiring!`);
      return;
    }

    if (!window.confirm(`Haqiqatan ham "${region.nameUz}" viloyatini va barcha ichki tumanlarini o'chirmoqchimisiz?`)) {
      return;
    }

    setLoadingId(`region-del-${region.id}`);
    setMessage(null);

    try {
      const res = await deleteRegionAction(region.id);
      if (res.success) {
        setRegions((prev) => prev.filter((r) => r.id !== region.id));
        setMessage({ text: "Viloyat muvaffaqiyatli o'chirildi", type: 'success' });
      } else {
        setMessage({ text: res.message || "O'chirishda xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  // --- DISTRICT CRUD ---
  const openCreateDistrictModal = (regionId: string) => {
    setEditingDistrict(null);
    const targetRegion = regions.find((r) => r.id === regionId);
    setDistrictForm({
      regionId,
      nameUz: '',
      nameRu: '',
      slug: '',
      order: (targetRegion?.districts.length || 0) + 1,
    });
    setIsDistrictModalOpen(true);
  };

  const openEditDistrictModal = (district: DistrictAdminItem) => {
    setEditingDistrict(district);
    setDistrictForm({
      regionId: district.regionId,
      nameUz: district.nameUz,
      nameRu: district.nameRu,
      slug: district.slug,
      order: district.order,
    });
    setIsDistrictModalOpen(true);
  };

  const handleDistrictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtForm.regionId || !districtForm.nameUz.trim() || !districtForm.nameRu.trim()) {
      setMessage({ text: "Barcha maydonlar to'ldirilishi shart", type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (editingDistrict) {
        const res = await updateDistrictAction(editingDistrict.id, {
          regionId: districtForm.regionId,
          nameUz: districtForm.nameUz,
          nameRu: districtForm.nameRu,
          slug: districtForm.slug,
          order: Number(districtForm.order),
        });

        if (res.success && res.district) {
          setRegions((prev) =>
            prev.map((r) => {
              if (r.id === editingDistrict.regionId && districtForm.regionId !== editingDistrict.regionId) {
                // Viloyati o'zgargan bo'lsa eskidan o'chirish
                return {
                  ...r,
                  districts: r.districts.filter((d) => d.id !== editingDistrict.id),
                };
              }
              if (r.id === districtForm.regionId) {
                const exists = r.districts.some((d) => d.id === editingDistrict.id);
                if (exists) {
                  return {
                    ...r,
                    districts: r.districts.map((d) =>
                      d.id === editingDistrict.id
                        ? {
                            ...d,
                            nameUz: res.district!.nameUz,
                            nameRu: res.district!.nameRu,
                            slug: res.district!.slug,
                            order: res.district!.order,
                            regionId: res.district!.regionId,
                          }
                        : d
                    ),
                  };
                } else {
                  return {
                    ...r,
                    districts: [
                      ...r.districts,
                      {
                        id: res.district!.id,
                        nameUz: res.district!.nameUz,
                        nameRu: res.district!.nameRu,
                        slug: res.district!.slug,
                        order: res.district!.order,
                        regionId: res.district!.regionId,
                        listingsCount: editingDistrict.listingsCount || 0,
                        createdAt: res.district!.createdAt,
                        updatedAt: res.district!.updatedAt,
                      },
                    ],
                  };
                }
              }
              return r;
            })
          );
          setMessage({ text: "Shahar/tuman muvaffaqiyatli yangilandi!", type: 'success' });
          setIsDistrictModalOpen(false);
        } else {
          setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
        }
      } else {
        const res = await createDistrictAction({
          regionId: districtForm.regionId,
          nameUz: districtForm.nameUz,
          nameRu: districtForm.nameRu,
          slug: districtForm.slug,
          order: Number(districtForm.order),
        });

        if (res.success && res.district) {
          const newDistrictItem: DistrictAdminItem = {
            id: res.district.id,
            nameUz: res.district.nameUz,
            nameRu: res.district.nameRu,
            slug: res.district.slug,
            order: res.district.order,
            regionId: res.district.regionId,
            listingsCount: 0,
            createdAt: res.district.createdAt,
            updatedAt: res.district.updatedAt,
          };

          setRegions((prev) =>
            prev.map((r) =>
              r.id === districtForm.regionId
                ? {
                    ...r,
                    districts: [...r.districts, newDistrictItem].sort((a, b) => a.order - b.order),
                  }
                : r
            )
          );
          setExpandedRegions((prev) => ({ ...prev, [districtForm.regionId]: true }));
          setMessage({ text: `"${res.district.nameUz}" muvaffaqiyatli qo'shildi!`, type: 'success' });
          setIsDistrictModalOpen(false);
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

  const handleDeleteDistrict = async (district: DistrictAdminItem) => {
    if (district.listingsCount > 0) {
      alert(`Ushbu shaharda/tumanda ${district.listingsCount} ta e'lon mavjud. Avval ularning manzilini o'zgartiring!`);
      return;
    }

    if (!window.confirm(`Haqiqatan ham "${district.nameUz}" hududini o'chirmoqchimisiz?`)) {
      return;
    }

    setLoadingId(`district-del-${district.id}`);
    setMessage(null);

    try {
      const res = await deleteDistrictAction(district.id);
      if (res.success) {
        setRegions((prev) =>
          prev.map((r) =>
            r.id === district.regionId
              ? {
                  ...r,
                  districts: r.districts.filter((d) => d.id !== district.id),
                }
              : r
          )
        );
        setMessage({ text: "Shahar/tuman muvaffaqiyatli o'chirildi", type: 'success' });
      } else {
        setMessage({ text: res.message || "O'chirishda xatolik", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik", type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  // Sinxronlash
  const handleSyncLocations = async () => {
    setLoadingId('sync-locations');
    setMessage(null);
    try {
      const res = await syncListingLocationsAction();
      if (res.success) {
        setMessage({ text: res.message || "E'lonlar bog'landi!", type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
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
              Hududlar Boshqaruvi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1 flex items-center gap-2">
            <span>Viloyat, Shahar va Tumanlar</span>
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
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            Kategoriyalar
          </Link>
          <Link
            href="/admin/regions"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary/10 text-primary border border-primary/20 shrink-0"
          >
            Hududlar
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            Sozlamalar
          </Link>

          {/* Sinxronlash tugmasi */}
          <button
            onClick={handleSyncLocations}
            disabled={loadingId === 'sync-locations'}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300/40 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="E'lonlarning matnli manzilini avtomatik tuman va viloyat bilan bog'lash"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loadingId === 'sync-locations' ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">E'lonlarni Bog'lash</span>
          </button>

          {/* Yangi Viloyat Qo'shish */}
          <button
            onClick={openCreateRegionModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Yangi Viloyat</span>
          </button>

          <button
            onClick={handleLogout}
            type="button"
            className="p-2 rounded-xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Xabar bildirishnomasi */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-medium transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Statistika Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground p-5 rounded-3xl border border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Jami Viloyatlar
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-foreground mt-2">{regions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Faol qo'shilgan viloyat va hududlar
          </p>
        </div>

        <div className="bg-card text-card-foreground p-5 rounded-3xl border border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Shahar va Tumanlar
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-foreground mt-2">{totalDistricts}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Viloyatlar ichidagi barcha shahar va tumanlar
          </p>
        </div>

        <div className="bg-card text-card-foreground p-5 rounded-3xl border border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Hududlardagi E'lonlar
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-foreground mt-2">{totalListings}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Aniq hududlarga biriktirilgan e'lonlar
          </p>
        </div>
      </div>

      {/* Qidiruv va Filtr */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Viloyat yoki tuman nomini qidiring (masalan: Jizzax, Guliston, Sirdaryo)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted rounded-xl transition-colors cursor-pointer"
          >
            Tozalash
          </button>
        )}
      </div>

      {/* Viloyatlar va Tumanlar Ro'yxati */}
      <div className="space-y-4">
        {filteredRegions.length === 0 ? (
          <div className="bg-card text-card-foreground p-12 text-center rounded-3xl border border-border">
            <MapPin className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">Hududlar topilmadi</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Qidiruv so'zini o'zgartiring yoki yangi viloyat qo'shing (masalan: "Jizzax viloyati").
            </p>
            <button
              onClick={openCreateRegionModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi Viloyat qo'shish</span>
            </button>
          </div>
        ) : (
          filteredRegions.map((region) => {
            const isExpanded = !!expandedRegions[region.id];
            return (
              <div
                key={region.id}
                className="bg-card text-card-foreground rounded-3xl border border-border overflow-hidden shadow-2xs transition-all"
              >
                {/* Viloyat Boshqaruvi Paneli (Header) */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div
                    onClick={() => toggleRegionExpand(region.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-foreground truncate">
                          {region.nameUz}
                        </h2>
                        <span className="text-xs text-muted-foreground font-medium truncate">
                          ({region.nameRu})
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                          Tartib: #{region.order}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          slug: {region.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {region.districts.length} ta shahar/tuman
                        </span>
                        <span>•</span>
                        <span>
                          {region.districts.reduce((s, d) => s + (d.listingsCount || 0), 0)} ta e'lon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Viloyat Amallari */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openCreateDistrictModal(region.id)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Tuman qo'shish</span>
                    </button>

                    <button
                      onClick={() => openEditRegionModal(region)}
                      type="button"
                      className="p-2 rounded-xl bg-secondary hover:bg-muted text-foreground transition-colors cursor-pointer"
                      title="Viloyatni tahrirlash"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteRegion(region)}
                      disabled={loadingId === `region-del-${region.id}`}
                      type="button"
                      className="p-2 rounded-xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
                      title="Viloyatni o'chirish"
                    >
                      {loadingId === `region-del-${region.id}` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleRegionExpand(region.id)}
                      type="button"
                      className="p-2 rounded-xl bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
                      title={isExpanded ? "Yopish" : "Ochish"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tumanlar Jadvali (Expandable) */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {region.districts.length === 0 ? (
                      <div className="p-8 text-center bg-muted/5">
                        <Building2 className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Ushbu viloyatda hali shahar yoki tumanlar mavjud emas.
                        </p>
                        <button
                          onClick={() => openCreateDistrictModal(region.id)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Birinchi tuman yoki shaharni qo'shish</span>
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-border bg-muted/30 text-muted-foreground font-bold">
                              <th className="py-2.5 px-4 w-12 text-center">#</th>
                              <th className="py-2.5 px-4">Shahar / Tuman nomi (O'zbekcha)</th>
                              <th className="py-2.5 px-4">Ruscha nomi (Русский)</th>
                              <th className="py-2.5 px-4">Slug</th>
                              <th className="py-2.5 px-4 text-center">E'lonlar soni</th>
                              <th className="py-2.5 px-4 text-right">Amallar</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {region.districts.map((district, idx) => (
                              <tr
                                key={district.id}
                                className="hover:bg-muted/10 transition-colors"
                              >
                                <td className="py-3 px-4 text-center font-bold text-muted-foreground">
                                  {district.order || idx + 1}
                                </td>
                                <td className="py-3 px-4 font-bold text-foreground">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>{district.nameUz}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground font-medium">
                                  {district.nameRu}
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                                  {district.slug}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                      district.listingsCount > 0
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {district.listingsCount} ta
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => openEditDistrictModal(district)}
                                      type="button"
                                      className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground transition-colors cursor-pointer"
                                      title="Tahrirlash"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDistrict(district)}
                                      disabled={loadingId === `district-del-${district.id}`}
                                      type="button"
                                      className="p-1.5 rounded-lg bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
                                      title="O'chirish"
                                    >
                                      {loadingId === `district-del-${district.id}` ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- 1. VILOYAT QO'SHISH / TAHRIRLASH MODALI --- */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-3xl border border-border shadow-2xl p-6 relative">
            <button
              onClick={() => setIsRegionModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {editingRegion ? "Viloyatni tahrirlash" : "Yangi Viloyat qo'shish"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Masalan: Jizzax viloyati, Toshkent shahri va h.k.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Viloyat nomi (O'zbekcha) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regionForm.nameUz}
                  onChange={(e) => setRegionForm({ ...regionForm, nameUz: e.target.value })}
                  placeholder="Masalan: Jizzax viloyati"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Viloyat nomi (Ruscha) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regionForm.nameRu}
                  onChange={(e) => setRegionForm({ ...regionForm, nameRu: e.target.value })}
                  placeholder="Masalan: Джизакская область"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Slug (URL identifikator)
                  </label>
                  <input
                    type="text"
                    value={regionForm.slug}
                    onChange={(e) => setRegionForm({ ...regionForm, slug: e.target.value })}
                    placeholder="Masalan: jizzax"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-[10px] text-muted-foreground">Bo'sh qolsa avtomatik yaratiladi</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={regionForm.order}
                    onChange={(e) => setRegionForm({ ...regionForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saqlash</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. SHAHAR / TUMAN QO'SHISH / TAHRIRLASH MODALI --- */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-3xl border border-border shadow-2xl p-6 relative">
            <button
              onClick={() => setIsDistrictModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {editingDistrict ? "Shahar / Tumanni tahrirlash" : "Yangi Shahar yoki Tuman qo'shish"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Masalan: Jizzax shahri, Zomin tumani, Guliston shahri
                </p>
              </div>
            </div>

            <form onSubmit={handleDistrictSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Tegishli Viloyat <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={districtForm.regionId}
                  onChange={(e) => setDistrictForm({ ...districtForm, regionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary cursor-pointer"
                >
                  <option value="" disabled>Viloyatni tanlang</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameUz} ({r.nameRu})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Shahar yoki Tuman nomi (O'zbekcha) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={districtForm.nameUz}
                  onChange={(e) => setDistrictForm({ ...districtForm, nameUz: e.target.value })}
                  placeholder="Masalan: Jizzax shahri yoki Zomin tumani"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Shahar yoki Tuman nomi (Ruscha) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={districtForm.nameRu}
                  onChange={(e) => setDistrictForm({ ...districtForm, nameRu: e.target.value })}
                  placeholder="Masalan: г. Джизак yoki Зааминский район"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Slug (URL identifikator)
                  </label>
                  <input
                    type="text"
                    value={districtForm.slug}
                    onChange={(e) => setDistrictForm({ ...districtForm, slug: e.target.value })}
                    placeholder="Masalan: zomin"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-[10px] text-muted-foreground">Bo'sh qolsa avtomatik yaratiladi</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={districtForm.order}
                    onChange={(e) => setDistrictForm({ ...districtForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDistrictModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saqlash</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
