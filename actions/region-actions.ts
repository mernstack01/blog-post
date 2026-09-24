'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin-auth';

export interface DistrictAdminItem {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
  order: number;
  regionId: string;
  listingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegionAdminItem {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
  order: number;
  districts: DistrictAdminItem[];
  listingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Slug generator helper
function createSlug(text: string): string {
  const charMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya', 'ў': 'o', 'ғ': 'g', 'қ': 'q', 'ҳ': 'h',
    'oʻ': 'o', 'o‘': 'o', 'o\'': 'o', 'gʻ': 'g', 'g‘': 'g', 'g\'': 'g',
  };

  let clean = text.toLowerCase().trim();
  for (const [key, val] of Object.entries(charMap)) {
    clean = clean.split(key).join(val);
  }

  return clean
    .replace(/['`ʻ’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Sayt foydalanuvchilari va formalar uchun barcha hududlar va ularning tumanlarini olish
 */
export async function getRegionsWithDistrictsAction(): Promise<RegionAdminItem[]> {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { order: 'asc' },
      include: {
        districts: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { listings: true },
            },
          },
        },
        _count: {
          select: { listings: true },
        },
      },
    });

    return regions.map((r) => ({
      id: r.id,
      nameUz: r.nameUz,
      nameRu: r.nameRu,
      slug: r.slug,
      order: typeof r.order === 'number' ? r.order : 0,
      listingsCount: r._count?.listings || 0,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      districts: (r.districts || []).map((d) => ({
        id: d.id,
        nameUz: d.nameUz,
        nameRu: d.nameRu,
        slug: d.slug,
        order: typeof d.order === 'number' ? d.order : 0,
        regionId: d.regionId,
        listingsCount: (d as any)._count?.listings || 0,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
    }));
  } catch (error) {
    console.error('getRegionsWithDistrictsAction error:', error);
    return [];
  }
}

/**
 * Admin uchun barcha hududlarni to'liq olish
 */
export async function getAdminRegionsAction(): Promise<RegionAdminItem[]> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('Ruxsat berilmagan');
  }
  return getRegionsWithDistrictsAction();
}

export interface CreateRegionInput {
  nameUz: string;
  nameRu: string;
  slug?: string;
  order?: number;
}

/**
 * Yangi viloyat yaratish (masalan: Jizzax viloyati)
 */
export async function createRegionAction(data: CreateRegionInput) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const nameUz = data.nameUz.trim();
    const nameRu = data.nameRu.trim();

    if (!nameUz || !nameRu) {
      return { success: false, message: "Viloyat nomi (O'zbekcha va Ruscha) to'ldirilishi shart." };
    }

    let slug = data.slug?.trim().toLowerCase();
    if (!slug) {
      slug = createSlug(nameUz);
    }
    if (!slug) {
      slug = `viloyat-${Date.now().toString().slice(-4)}`;
    }

    // Takroriy slug tekshiruvi
    const existing = await prisma.region.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let order = Number(data.order);
    if (isNaN(order) || order < 0) {
      const count = await prisma.region.count();
      order = count + 1;
    }

    const newRegion = await prisma.region.create({
      data: {
        nameUz,
        nameRu,
        slug,
        order,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
      revalidatePath('/new-listing');
    } catch {}

    return { success: true, message: "Viloyat muvaffaqiyatli qo'shildi", region: newRegion };
  } catch (error: any) {
    console.error('createRegionAction error:', error);
    return { success: false, message: error?.message || "Viloyat qo'shishda xatolik yuz berdi" };
  }
}

/**
 * Mavjud viloyatni tahrirlash
 */
export async function updateRegionAction(id: string, data: Partial<CreateRegionInput>) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const existing = await prisma.region.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, message: "Viloyat topilmadi" };
    }

    const updateData: any = {};
    if (data.nameUz !== undefined) updateData.nameUz = data.nameUz.trim();
    if (data.nameRu !== undefined) updateData.nameRu = data.nameRu.trim();
    if (data.slug !== undefined && data.slug.trim()) {
      updateData.slug = createSlug(data.slug.trim());
    }
    if (data.order !== undefined) {
      updateData.order = Number(data.order);
    }

    const updated = await prisma.region.update({
      where: { id },
      data: updateData,
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
      revalidatePath('/new-listing');
    } catch {}

    return { success: true, message: "Viloyat muvaffaqiyatli yangilandi", region: updated };
  } catch (error: any) {
    console.error('updateRegionAction error:', error);
    return { success: false, message: error?.message || "Viloyatni yangilashda xatolik yuz berdi" };
  }
}

/**
 * Viloyatni o'chirish (agar e'lonlar bo'lsa xavfsiz rad etiladi)
 */
export async function deleteRegionAction(id: string) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    // Ushbu viloyatga yoki uning tumanlariga biriktirilgan e'lonlar sonini tekshirish
    const region = await prisma.region.findUnique({
      where: { id },
      include: {
        districts: { select: { id: true, nameUz: true } },
      },
    });

    if (!region) {
      return { success: false, message: "Viloyat topilmadi" };
    }

    const districtIds = region.districts.map((d) => d.id);
    const districtNames = region.districts.map((d) => d.nameUz);

    const listingsCount = await prisma.listing.count({
      where: {
        OR: [
          { regionId: id },
          { districtId: { in: districtIds } },
          { location: { in: districtNames } },
        ],
      },
    });

    if (listingsCount > 0) {
      return {
        success: false,
        message: `Ushbu viloyat va uning tumanlarida ${listingsCount} ta e'lon mavjud. Avval e'lonlarni boshqa hududga o'tkazing yoki o'chiring.`,
      };
    }

    // Tumanlarni o'chirish
    await prisma.district.deleteMany({
      where: { regionId: id },
    });

    // Viloyatni o'chirish
    await prisma.region.delete({
      where: { id },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
      revalidatePath('/new-listing');
    } catch {}

    return { success: true, message: "Viloyat va uning tumanlari muvaffaqiyatli o'chirildi" };
  } catch (error: any) {
    console.error('deleteRegionAction error:', error);
    return { success: false, message: error?.message || "O'chirishda xatolik yuz berdi" };
  }
}

export interface CreateDistrictInput {
  regionId: string;
  nameUz: string;
  nameRu: string;
  slug?: string;
  order?: number;
}

/**
 * Yangi shahar yoki tuman yaratish
 */
export async function createDistrictAction(data: CreateDistrictInput) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const regionId = data.regionId?.trim();
    const nameUz = data.nameUz?.trim();
    const nameRu = data.nameRu?.trim();

    if (!regionId) {
      return { success: false, message: "Viloyat tanlanishi shart" };
    }
    if (!nameUz || !nameRu) {
      return { success: false, message: "Shahar/tuman nomi (O'zbekcha va Ruscha) to'ldirilishi shart." };
    }

    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });
    if (!region) {
      return { success: false, message: "Tanlangan viloyat topilmadi" };
    }

    let slug = data.slug?.trim().toLowerCase();
    if (!slug) {
      slug = createSlug(nameUz);
    }
    if (!slug) {
      slug = `tuman-${Date.now().toString().slice(-4)}`;
    }

    const existing = await prisma.district.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let order = Number(data.order);
    if (isNaN(order) || order < 0) {
      const count = await prisma.district.count({ where: { regionId } });
      order = count + 1;
    }

    const newDistrict = await prisma.district.create({
      data: {
        regionId,
        nameUz,
        nameRu,
        slug,
        order,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
      revalidatePath('/new-listing');
    } catch {}

    return { success: true, message: "Shahar/tuman muvaffaqiyatli qo'shildi", district: newDistrict };
  } catch (error: any) {
    console.error('createDistrictAction error:', error);
    return { success: false, message: error?.message || "Shahar/tuman qo'shishda xatolik yuz berdi" };
  }
}

/**
 * Mavjud shahar yoki tumanni tahrirlash
 */
export async function updateDistrictAction(
  id: string,
  data: Partial<CreateDistrictInput>
) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const existing = await prisma.district.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, message: "Shahar/tuman topilmadi" };
    }

    const updateData: any = {};
    if (data.regionId) updateData.regionId = data.regionId.trim();
    if (data.nameUz !== undefined) updateData.nameUz = data.nameUz.trim();
    if (data.nameRu !== undefined) updateData.nameRu = data.nameRu.trim();
    if (data.slug !== undefined && data.slug.trim()) {
      updateData.slug = createSlug(data.slug.trim());
    }
    if (data.order !== undefined) {
      updateData.order = Number(data.order);
    }

    const updated = await prisma.district.update({
      where: { id },
      data: updateData,
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
      revalidatePath('/new-listing');
    } catch {}

    return { success: true, message: "Shahar/tuman muvaffaqiyatli yangilandi", district: updated };
  } catch (error: any) {
    console.error('updateDistrictAction error:', error);
    return { success: false, message: error?.message || "Shahar/tumanni yangilashda xatolik yuz berdi" };
  }
}

/**
 * Shahar yoki tumanni o'chirish (agar e'lonlar bo'lsa xavfsiz rad etiladi)
 */
export async function deleteDistrictAction(id: string) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const district = await prisma.district.findUnique({
      where: { id },
    });
    if (!district) {
      return { success: false, message: "Shahar/tuman topilmadi" };
    }

    // Biriktirilgan e'lonlar tekshiruvi
    const count = await prisma.listing.count({
      where: {
        OR: [
          { districtId: id },
          { location: district.nameUz },
          { location: district.nameRu },
        ],
      },
    });

    if (count > 0) {
      return {
        success: false,
        message: `Ushbu shahar/tumanga ${count} ta e'lon biriktirilgan. Avval ularning manzilini o'zgartiring yoki o'chiring.`,
      };
    }

    await prisma.district.delete({
      where: { id },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
      revalidatePath('/new-listing');
    } catch {}

    return { success: true, message: "Shahar/tuman muvaffaqiyatli o'chirildi" };
  } catch (error: any) {
    console.error('deleteDistrictAction error:', error);
    return { success: false, message: error?.message || "O'chirishda xatolik yuz berdi" };
  }
}

/**
 * Xavfsiz avtomatik sinxronlash:
 * Mavjud e'lonlarning `location` matni bo'yicha `districtId` va `regionId` larni bog'lash
 */
export async function syncListingLocationsAction() {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const districts = await prisma.district.findMany({
      include: { region: true },
    });

    let updatedCount = 0;

    for (const d of districts) {
      const res = await prisma.listing.updateMany({
        where: {
          location: { in: [d.nameUz, d.nameRu] },
          districtId: null,
        },
        data: {
          districtId: d.id,
          regionId: d.regionId,
        },
      });
      updatedCount += res.count;
    }

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/regions');
    } catch {}

    return {
      success: true,
      message: `${updatedCount} ta e'lon muvaffaqiyatli viloyat va tumanlar bazasi bilan bog'landi!`,
      updatedCount,
    };
  } catch (error: any) {
    console.error('syncListingLocationsAction error:', error);
    return { success: false, message: error?.message || "Sinxronlashda xatolik yuz berdi" };
  }
}
