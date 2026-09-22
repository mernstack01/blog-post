'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createListingSchema, CreateListingInput, ListingFilterParams } from '@/lib/validations';
import { ListingStatus, Prisma } from '@prisma/client';
import { isUserAdmin } from '@/lib/admin-auth';
import { getUserAuthSession, getTashkentStartOfDay } from '@/lib/user-auth';


export interface ListingWithRelations {
  id: string;
  title: string;
  name: string;
  description: string;
  phone: string;
  telegram: string | null;
  instagram: string | null;
  websiteUrl: string | null;
  location: string;
  address: string | null;
  price: string | null;
  experience: string | null;
  rating: number;
  adminRating: number;
  clientRating: number;
  totalScore: number;
  paidTier: 'FREE' | 'STANDARD' | 'VIP_GOLD';
  paidUntil: Date | null;
  privilegeType: 'NONE' | 'DISABILITY' | 'YOUTH_STARTUP' | 'HONORARY_MASTER' | 'SOCIAL_PROTECT';
  privilegeReason: string | null;
  isPrivileged: boolean;
  reviewCount: number;
  images: string[];
  isVerified: boolean;
  status: ListingStatus;
  view_count: number;
  categoryId: string;
  subCategoryId: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    nameUz?: string;
    nameRu?: string;
    slug: string;
    icon: string | null;
  };
  subCategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  rank?: number;
}

import { calculateListingScore } from '@/lib/scoring';

/**
 * E'lonlarni filtrlash va saralash bilan olish ("Umumiy" va "Top 10" rejimlari)
 */
export async function getListings(filters: Partial<ListingFilterParams> = {}): Promise<ListingWithRelations[]> {
  try {
    const { q, location, category, subCategory, sortBy = 'popular', mode = 'all' } = filters;
    const userSession = await getUserAuthSession();

    const andConditions: Prisma.ListingWhereInput[] = [];

    // 1. Status sharti: tasdiqlangan e'lonlar YOKI joriy kirgan foydalanuvchining o'z e'lonlari
    if (userSession?.userId) {
      const userConditions: Prisma.ListingWhereInput[] = [
        { status: ListingStatus.APPROVED },
        { userId: userSession.userId },
      ];
      if (userSession.phone) {
        userConditions.push({ phone: userSession.phone });
      }
      andConditions.push({
        OR: userConditions,
      });
    } else {
      andConditions.push({
        status: ListingStatus.APPROVED,
      });
    }

    // 2. Qidiruv so'zi bo'yicha
    if (q && q.trim() !== '') {
      const searchTerm = q.trim();
      andConditions.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
          { subCategory: { name: { contains: searchTerm, mode: 'insensitive' } } },
        ],
      });
    }

    // 3. Hudud bo'yicha (agar "Barcha hududlar" bo'lmasa)
    if (location && location !== 'Barcha hududlar' && location.trim() !== '') {
      andConditions.push({
        location: {
          contains: location.trim(),
          mode: 'insensitive',
        },
      });
    }

    // 4. Kategoriya bo'yicha (slug orqali)
    if (category && category !== 'all' && category.trim() !== '') {
      andConditions.push({
        category: {
          slug: category.trim(),
        },
      });
    }

    // 5. Kichik kategoriya (subCategory) bo'yicha
    if (subCategory && subCategory.trim() !== '') {
      andConditions.push({
        subCategory: {
          slug: subCategory.trim(),
        },
      });
    }

    const where: Prisma.ListingWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    // 6. Saralash tartibini belgilash
    let orderBy: any = [];

    if (mode === 'top10') {
      orderBy = [{ totalScore: 'desc' }, { view_count: 'desc' }, { createdAt: 'desc' }];
    } else {
      switch (sortBy) {
        case 'newest':
          orderBy = [{ createdAt: 'desc' }];
          break;
        case 'rating':
          orderBy = [{ rating: 'desc' }, { totalScore: 'desc' }];
          break;
        case 'popular':
        default:
          orderBy = [{ view_count: 'desc' }, { totalScore: 'desc' }, { createdAt: 'desc' }];
          break;
      }
    }

    // 7. Bazadan e'lonlarni yuklab olish
    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      take: mode === 'top10' ? 10 : 60,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            slug: true,
            icon: true,
          } as any,
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Top 10 uchun 1 dan 10 gacha aniq rank tayinlash
    const result: ListingWithRelations[] = (listings as any[]).map((item, index) => ({
      ...item,
      rank: mode === 'top10' ? index + 1 : undefined,
    })) as any;

    return result;
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
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            slug: true,
            icon: true,
          } as any,
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return listing as ListingWithRelations | null;
  } catch (error) {
    console.error('getListingById error:', error);
    return null;
  }
}

/**
 * E'lon ko'rishlar sonini 1 taga oshirish
 */
export async function incrementViewCountAction(id: string) {
  try {
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        view_count: {
          increment: 1,
        },
      },
      select: {
        id: true,
        view_count: true,
      },
    });
    return { success: true, view_count: updated.view_count };
  } catch (error) {
    console.error('incrementViewCountAction error:', error);
    return { success: false };
  }
}

/**
 * Barcha faol kategoriyalar va ularning ichki kategoriyalarini olish
 */
export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true } as any,
      orderBy: { order: 'asc' } as any,
      include: {
        subCategories: {
          orderBy: { createdAt: 'asc' },
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

export interface ActionResponse {
  success: boolean;
  message?: string;
  isPending?: boolean;
  listingId?: string;
  errors?: Record<string, string[]>;
}

/**
 * Yangi e'lon yaratish
 */
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

    // Matnli maydonlarni XSS va ortiqcha belgilardan tozalash
    const sanitize = (text?: string | null) => (text ? text.replace(/<[^>]*>?/gm, '').trim() : '');

    // Telefon raqamni toza formatga keltirish
    let cleanPhone = val.phone.replace(/[^\d+]/g, '').trim();
    if (!cleanPhone.startsWith('+') && cleanPhone.startsWith('998')) {
      cleanPhone = `+${cleanPhone}`;
    }

    // 2. Agar rasm berilmagan bo'lsa, default zamonaviy rasm qo'yish
    let finalImages = val.images && val.images.length > 0 ? val.images : [];
    if (finalImages.length === 0) {
      finalImages = [
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
      ];
    }

    // 3. Foydalanuvchi yoki adminligini tekshirish
    const isAdmin = await isUserAdmin();
    const userSession = await getUserAuthSession();

    if (!isAdmin && !userSession) {
      return {
        success: false,
        message: "E'lon berish uchun avval ro'yxatdan o'ting yoki tizimga kiring.",
      };
    }

    let activeUserId: string | null = null;

    if (!isAdmin && userSession) {
      activeUserId = userSession.userId;
      const user = await prisma.user.findUnique({ where: { id: activeUserId } });
      if (!user) {
        return {
          success: false,
          message: "Foydalanuvchi profilingiz topilmadi. Qaytadan kiring.",
        };
      }

      // Butun umrlik limit tekshiruvi
      const totalListings = await prisma.listing.count({
        where: {
          userId: activeUserId,
        },
      });

      const userLimit = (user as any).listingLimit ?? (user as any).dailyLimit ?? 3;

      if (totalListings >= userLimit) {
        return {
          success: false,
          message: `Sizning e'lon berish limitingiz (${totalListings}/${userLimit}) tugagan. Yangi e'lon berish uchun adminga murojaat qiling.`,
        };
      }
    }


    const initialStatus = isAdmin ? ListingStatus.APPROVED : ListingStatus.PENDING;

    const initialScore = calculateListingScore({
      adminRating: 4.5,
      clientRating: 5.0,
      reviewCount: 1,
      paidTier: 'FREE',
      isPrivileged: false,
      websiteUrl: val.websiteUrl?.trim() || null,
      isVerified: isAdmin,
    });

    // 4. Bazaga yaratish
    const newListing = await (prisma.listing as any).create({
      data: {
        title: sanitize(val.title),
        name: sanitize(val.name),
        description: sanitize(val.description),
        phone: cleanPhone,
        telegram: sanitize(val.telegram) || null,
        instagram: sanitize(val.instagram) || null,
        websiteUrl: sanitize(val.websiteUrl) || null,
        location: sanitize(val.location),
        address: sanitize(val.address) || null,
        price: sanitize(val.price) || 'Kelishilgan holda',
        experience: sanitize(val.experience) || 'Mavjud',
        rating: 5.0,
        adminRating: 4.5,
        clientRating: 5.0,
        totalScore: initialScore,
        reviewCount: 1,
        paidTier: 'FREE',
        privilegeType: 'NONE',
        isPrivileged: false,
        images: finalImages,
        isVerified: isAdmin,
        status: initialStatus,
        view_count: 1,
        categoryId: val.categoryId,
        subCategoryId: val.subCategoryId ? val.subCategoryId : null,
        userId: activeUserId,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/categories');
      revalidatePath('/my-listings');
    } catch {
      // Ignore if called outside of request context
    }

    return {
      success: true,
      isPending: !isAdmin,
      message: isAdmin
        ? "Admin posti muvaffaqiyatli chop etildi!"
        : "E'loningiz qabul qilindi va admin tekshiruviga yuborildi. Tez orada saytda e'lon qilinadi!",
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

/**
 * Joriy foydalanuvchining o'z e'lonlarini olish ("Mening e'lonlarim" sahifasi uchun)
 */
export async function getUserListingsAction(): Promise<{
  success: boolean;
  message?: string;
  listings?: ListingWithRelations[];
  user?: {
    id: string;
    name: string;
    phone: string;
    listingLimit: number;
    totalUsed: number;
    remaining: number;
  };
}> {
  try {
    const userSession = await getUserAuthSession();
    if (!userSession) {
      return { success: false, message: "Foydalanuvchi tizimga kirmagan" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userSession.userId },
    });

    if (!user) {
      return { success: false, message: "Foydalanuvchi topilmadi" };
    }

    const userLimit = (user as any).listingLimit ?? (user as any).dailyLimit ?? 3;

    const listings = await prisma.listing.findMany({
      where: {
        OR: [
          { userId: user.id },
          { phone: user.phone },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            slug: true,
            icon: true,
          } as any,
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalUsed = listings.length;

    return {
      success: true,
      listings: listings as any,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        listingLimit: userLimit,
        totalUsed,
        remaining: Math.max(0, userLimit - totalUsed),
      },
    };
  } catch (error: any) {
    console.error('getUserListingsAction error:', error);
    return { success: false, message: error?.message || "E'lonlarni yuklashda xatolik yuz berdi" };
  }
}

/**
 * Foydalanuvchi o'z e'lonini o'chirish
 */
export async function userDeleteListingAction(id: string) {
  try {
    const userSession = await getUserAuthSession();
    if (!userSession) {
      return { success: false, message: "Avval tizimga kiring." };
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return { success: false, message: "E'lon topilmadi." };
    }

    // Foydalanuvchi o'z e'lonimi yoki Adminmi tekshirish
    const isOwner = listing.userId === userSession.userId || listing.phone === userSession.phone;
    if (!isOwner && userSession.role !== 'ADMIN') {
      return { success: false, message: "Bu e'lonni o'chirishga faqat uning egasi yoki admin vakolatli." };
    }

    await prisma.listing.delete({
      where: { id },
    });

    try {
      revalidatePath('/my-listings');
      revalidatePath('/');
      revalidatePath('/admin');
    } catch {}

    return { success: true, message: "E'loningiz muvaffaqiyatli o'chirildi." };
  } catch (error: any) {
    console.error('userDeleteListingAction error:', error);
    return { success: false, message: error?.message || "O'chirishda xatolik yuz berdi." };
  }
}
