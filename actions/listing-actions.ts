'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createListingSchema, CreateListingInput, ListingFilterParams } from '@/lib/validations';
import { ListingStatus, Prisma } from '@prisma/client';

export interface ListingWithRelations {
  id: string;
  title: string;
  name: string;
  description: string;
  phone: string;
  telegram: string | null;
  instagram: string | null;
  location: string;
  address: string | null;
  price: string | null;
  experience: string | null;
  rating: number;
  reviewCount: number;
  images: string[];
  isVerified: boolean;
  status: ListingStatus;
  view_count: number;
  categoryId: string;
  subCategoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  subCategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

/**
 * E'lonlarni filtrlash va saralash bilan olish
 */
export async function getListings(filters: Partial<ListingFilterParams> = {}): Promise<ListingWithRelations[]> {
  try {
    const { q, location, category, subCategory, sortBy = 'popular' } = filters;

    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.APPROVED,
    };

    // Qidiruv so'zi bo'yicha
    if (q && q.trim() !== '') {
      const searchTerm = q.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { subCategory: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    // Hudud bo'yicha (agar "Barcha hududlar" bo'lmasa)
    if (location && location !== 'Barcha hududlar' && location.trim() !== '') {
      where.location = {
        contains: location.trim(),
        mode: 'insensitive',
      };
    }

    // Kategoriya bo'yicha (slug yoki ObjectId)
    if (category && category !== 'all' && category.trim() !== '') {
      const catTrim = category.trim();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(catTrim);
      if (isObjectId) {
        where.category = {
          OR: [{ slug: catTrim }, { id: catTrim }],
        };
      } else {
        where.category = {
          slug: catTrim,
        };
      }
    }

    // Sub-kategoriya bo'yicha (slug yoki ObjectId)
    if (subCategory && subCategory !== 'all' && subCategory.trim() !== '') {
      const subTrim = subCategory.trim();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(subTrim);
      if (isObjectId) {
        where.subCategory = {
          OR: [{ slug: subTrim }, { id: subTrim }],
        };
      } else {
        where.subCategory = {
          slug: subTrim,
        };
      }
    }

    // Saralash qoidasi
    let orderBy: Prisma.ListingOrderByWithRelationInput = { view_count: 'desc' };
    if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else {
      orderBy = { view_count: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true },
        },
        subCategory: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return listings as ListingWithRelations[];
  } catch (error) {
    console.error('getListings error:', error);
    return [];
  }
}

/**
 * Bitta e'lonni ID bo'yicha olish
 */
export async function getListingById(id: string): Promise<ListingWithRelations | null> {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true },
        },
        subCategory: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return listing as ListingWithRelations | null;
  } catch (error) {
    console.error(`getListingById(${id}) error:`, error);
    return null;
  }
}

/**
 * Ko'rishlar sonini 1 taga oshirish
 */
export async function incrementViewCountAction(id: string) {
  try {
    await prisma.listing.update({
      where: { id },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`incrementViewCountAction(${id}) error:`, error);
    return { success: false };
  }
}

/**
 * Barcha kategoriyalar va pastki kategoriyalarni e'lonlar soni bilan olish
 */
export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        subCategories: {
          include: {
            _count: {
              select: { listings: { where: { status: ListingStatus.APPROVED } } },
            },
          },
        },
        _count: {
          select: { listings: { where: { status: ListingStatus.APPROVED } } },
        },
      },
    });

    return categories;
  } catch (error) {
    console.error('getCategoriesAction error:', error);
    return [];
  }
}

/**
 * Yangi e'lon yaratish Server Action
 */
export type ActionResponse = {
  success: boolean;
  message?: string;
  listingId?: string;
  errors?: Record<string, string[]>;
};

export async function createListingAction(data: CreateListingInput): Promise<ActionResponse> {
  try {
    // 1. Zod validatsiya
    const validatedData = createListingSchema.safeParse(data);
    if (!validatedData.success) {
      const errorMap: Record<string, string[]> = {};
      const issues = (validatedData.error as any).issues || (validatedData.error as any).errors || [];
      issues.forEach((err: any) => {
        const path = Array.isArray(err.path) ? err.path.join('.') : 'general';
        if (!errorMap[path]) {
          errorMap[path] = [];
        }
        errorMap[path].push(err.message);
      });
      return {
        success: false,
        message: "Ma'lumotlar to'g'ri to'ldirilmagan. Qaytadan tekshiring.",
        errors: errorMap,
      };
    }

    const val = validatedData.data;

    // 2. Agar rasm berilmagan bo'lsa, default zamonaviy rasm qo'yish
    let finalImages = val.images && val.images.length > 0 ? val.images : [];
    if (finalImages.length === 0) {
      finalImages = [
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
      ];
    }

    // 3. Bazaga yaratish
    const newListing = await prisma.listing.create({
      data: {
        title: val.title.trim(),
        name: val.name.trim(),
        description: val.description.trim(),
        phone: val.phone.trim(),
        telegram: val.telegram?.trim() || null,
        instagram: val.instagram?.trim() || null,
        location: val.location.trim(),
        address: val.address?.trim() || null,
        price: val.price?.trim() || 'Kelishilgan holda',
        experience: val.experience?.trim() || "Mavjud",
        rating: 5.0,
        reviewCount: 1,
        images: finalImages,
        isVerified: true, // Sinov va qulaylik uchun tasdiqlangan holatda
        status: ListingStatus.APPROVED,
        view_count: 1,
        categoryId: val.categoryId,
        subCategoryId: val.subCategoryId ? val.subCategoryId : null,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/categories');
    } catch {
      // Ignore if called outside of request context
    }

    return {
      success: true,
      message: "E'lon muvaffaqiyatli joylashtirildi!",
      listingId: newListing.id,
    };
  } catch (error: any) {
    console.error('createListingAction error:', error);
    return {
      success: false,
      message: error?.message || "E'lonni saqlashda kutilmagan xatolik yuz berdi.",
    };
  }
}
