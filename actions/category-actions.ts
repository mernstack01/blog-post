'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin-auth';

export interface CategoryAdminItem {
  id: string;
  name: string | null;
  nameUz: string;
  nameRu: string;
  slug: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  listingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin uchun barcha kategoriyalarni olish (e'lonlar soni bilan)
 */
export async function getCategoriesAdminAction(): Promise<CategoryAdminItem[]> {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      throw new Error('Ruxsat berilmagan');
    }

    let categories: any[] = [];
    try {
      categories = await prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          _count: {
            select: { listings: true },
          },
        },
      });
    } catch {
      categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { listings: true },
          },
        },
      });
    }

    // Sort by order ascending, then by createdAt
    categories.sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 0;
      const orderB = typeof b.order === 'number' ? b.order : 0;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name || cat.nameUz || '',
      nameUz: cat.nameUz || cat.name || '',
      nameRu: cat.nameRu || cat.name || '',
      slug: cat.slug,
      icon: cat.icon,
      order: typeof cat.order === 'number' ? cat.order : 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
      listingsCount: cat._count?.listings || 0,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  } catch (error) {
    console.error('getCategoriesAdminAction error:', error);
    return [];
  }
}

export interface CreateCategoryInput {
  nameUz: string;
  nameRu: string;
  slug?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

/**
 * Yangi kategoriya yaratish
 */
export async function createCategoryAction(data: CreateCategoryInput) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const nameUz = data.nameUz.trim();
    const nameRu = data.nameRu.trim();
    if (!nameUz || !nameRu) {
      return { success: false, message: "Kategoriya nomi (O'zbekcha va Ruscha) to'ldirilishi shart." };
    }

    // Slug yaratish
    let slug = data.slug?.trim().toLowerCase();
    if (!slug) {
      slug = nameUz
        .toLowerCase()
        .replace(/['`ʻ’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Takroriy slug tekshiruvi
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await prisma.category.create({
      data: {
        name: nameUz,
        nameUz,
        nameRu,
        slug,
        icon: data.icon?.trim() || 'Layers',
        order: Number(data.order) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/categories');
      revalidatePath('/admin');
      revalidatePath('/admin/categories');
    } catch {}

    return { success: true, message: "Kategoriya muvaffaqiyatli yaratildi", category };
  } catch (error: any) {
    console.error('createCategoryAction error:', error);
    return { success: false, message: error?.message || "Kategoriya yaratishda xatolik yuz berdi" };
  }
}

/**
 * Mavjud kategoriyani tahrirlash
 */
export async function updateCategoryAction(
  id: string,
  data: Partial<CreateCategoryInput>
) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, message: "Kategoriya topilmadi" };
    }

    const updateData: any = {};
    if (data.nameUz !== undefined) {
      updateData.nameUz = data.nameUz.trim();
      updateData.name = data.nameUz.trim();
    }
    if (data.nameRu !== undefined) {
      updateData.nameRu = data.nameRu.trim();
    }
    if (data.slug !== undefined && data.slug.trim()) {
      updateData.slug = data.slug.trim().toLowerCase();
    }
    if (data.icon !== undefined) {
      updateData.icon = data.icon.trim();
    }
    if (data.order !== undefined) {
      updateData.order = Number(data.order);
    }
    if (data.isActive !== undefined) {
      updateData.isActive = Boolean(data.isActive);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    try {
      revalidatePath('/');
      revalidatePath('/categories');
      revalidatePath('/admin');
      revalidatePath('/admin/categories');
    } catch {}

    return { success: true, message: "Kategoriya muvaffaqiyatli yangilandi", category: updated };
  } catch (error: any) {
    console.error('updateCategoryAction error:', error);
    return { success: false, message: error?.message || "Kategoriyani yangilashda xatolik yuz berdi" };
  }
}

/**
 * Kategoriyani o'chirish
 */
export async function deleteCategoryAction(id: string) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    // E'lonlar bor-yo'qligini tekshirish
    const listingsCount = await prisma.listing.count({
      where: { categoryId: id },
    });

    if (listingsCount > 0) {
      return {
        success: false,
        message: `Ushbu kategoriyaga biriktirilgan ${listingsCount} ta e'lon mavjud. Avval ularni boshqa kategoriyaga o'tkazing yoki o'chiring.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    try {
      revalidatePath('/');
      revalidatePath('/categories');
      revalidatePath('/admin');
      revalidatePath('/admin/categories');
    } catch {}

    return { success: true, message: "Kategoriya muvaffaqiyatli o'chirildi" };
  } catch (error: any) {
    console.error('deleteCategoryAction error:', error);
    return { success: false, message: error?.message || "O'chirishda xatolik yuz berdi" };
  }
}
