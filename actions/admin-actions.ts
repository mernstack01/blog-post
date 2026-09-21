'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isUserAdmin, setAdminAuthSession, clearAdminAuthSession, verifyAdminPin } from '@/lib/admin-auth';
import { Role } from '@prisma/client';
import { ListingStatus, PaidTier, PrivilegeType, calculateListingScore } from '@/lib/scoring';
import { redirect } from 'next/navigation';
import { getUserAuthSession, setUserAuthSession, clearUserAuthSession } from '@/lib/user-auth';

// Brute-force himoyasi uchun xotirada urinishlarni saqlash
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 daqiqa
const loginAttempts = new Map<string, { failedCount: number; lockUntil: number }>();

function checkRateLimit(ipKey: string): { allowed: boolean; waitMinutes?: number; remainingAttempts?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ipKey);

  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (attempt.lockUntil > now) {
    const waitMinutes = Math.ceil((attempt.lockUntil - now) / (60 * 1000));
    return { allowed: false, waitMinutes };
  }

  // Agar qulf muddati tugagan bo'lsa, tozalaymiz
  if (attempt.lockUntil <= now && attempt.failedCount >= MAX_FAILED_ATTEMPTS) {
    loginAttempts.delete(ipKey);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  return { allowed: true, remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - attempt.failedCount) };
}

function recordFailedAttempt(ipKey: string): { locked: boolean; waitMinutes?: number; remaining: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ipKey) || { failedCount: 0, lockUntil: 0 };
  attempt.failedCount += 1;

  if (attempt.failedCount >= MAX_FAILED_ATTEMPTS) {
    attempt.lockUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ipKey, attempt);
    return { locked: true, waitMinutes: 15, remaining: 0 };
  }

  loginAttempts.set(ipKey, attempt);
  return { locked: false, remaining: MAX_FAILED_ATTEMPTS - attempt.failedCount };
}

function resetAttempts(ipKey: string) {
  loginAttempts.delete(ipKey);
}

export async function adminLoginAction(pin: string) {
  try {
    const rateLimitKey = 'admin_auth_global'; // In production, can be enriched by client headers if available
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return {
        success: false,
        message: `Xavfsizlik sababli kirish bloklangan. Iltimos, ${rateLimit.waitMinutes} daqiqadan so'ng qayta urinib ko'ring.`,
      };
    }

    if (!pin || typeof pin !== 'string') {
      return { success: false, message: "Iltimos, PIN-kodni kiriting." };
    }

    const isValid = verifyAdminPin(pin);

    if (isValid) {
      resetAttempts(rateLimitKey);
      await setAdminAuthSession();

      // Admin PIN orqali kirilganda xavfsiz SuperAdmin sessiyasi o'rnatiladi.
      // Mavjud oddiy foydalanuvchilarning bazadagi roliga mutlaqo tegilmaydi!
      try {
        let adminUser = await prisma.user.findFirst({
          where: { role: Role.ADMIN, phone: '+998000000000' },
        });
        if (!adminUser) {
          adminUser = await prisma.user.create({
            data: {
              phone: '+998000000000',
              name: 'SuperAdmin',
              role: Role.ADMIN,
              listingLimit: 9999,
            } as any,
          });
        }
        await setUserAuthSession(adminUser.id, adminUser.phone, Role.ADMIN);
      } catch (userErr) {
        console.warn('SuperAdmin sessiyasini o\'rnatishda ogohlantirish:', userErr);
      }

      return { success: true };
    }

    const failure = recordFailedAttempt(rateLimitKey);
    if (failure.locked) {
      return {
        success: false,
        message: `Noto'g'ri PIN-kod! 5 marotaba xato kiritildi. Tizim 15 daqiqaga bloklandi.`,
      };
    }

    return {
      success: false,
      message: `Noto'g'ri PIN-kod! Qayta urinib ko'ring. (Qolgan urinishlar: ${failure.remaining})`,
    };
  } catch (error: any) {
    console.error('adminLoginAction error:', error);
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

export async function adminLogoutAction() {
  await clearAdminAuthSession();
  await clearUserAuthSession();
  redirect('/admin/login');
}

export async function getAdminStatsAction() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('Ruxsat berilmagan');
  }

  const [
    totalListings,
    approvedCount,
    pendingCount,
    rejectedCount,
    vipCount,
    privilegedCount,
    totalCategories,
    activeCategories,
    totalDistricts,
    totalViewsAggregate,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: ListingStatus.APPROVED } }),
    prisma.listing.count({ where: { status: ListingStatus.PENDING } }),
    prisma.listing.count({ where: { status: ListingStatus.REJECTED } }),
    prisma.listing.count({
      where: {
        paidTier: { in: [PaidTier.VIP_GOLD, PaidTier.STANDARD] },
      } as any,
    }),
    prisma.listing.count({
      where: {
        privilegeType: {
          in: [
            PrivilegeType.DISABILITY,
            PrivilegeType.YOUTH_STARTUP,
            PrivilegeType.HONORARY_MASTER,
            PrivilegeType.SOCIAL_PROTECT,
          ],
        },
      } as any,
    }),
    prisma.category.count(),
    (async () => {
      try {
        return await (prisma.category as any).count({ where: { isActive: true } });
      } catch {
        return await prisma.category.count();
      }
    })(),
    (prisma as any).district?.count ? (prisma as any).district.count() : Promise.resolve(10),
    prisma.listing.aggregate({ _sum: { view_count: true } }),
  ]);

  return {
    totalListings,
    approvedCount,
    pendingCount,
    rejectedCount,
    vipCount,
    privilegedCount,
    totalCategories,
    activeCategories,
    totalDistricts,
    totalViews: totalViewsAggregate._sum.view_count || 0,
  };
}

export async function getAdminListingsAction(statusFilter?: string) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('Ruxsat berilmagan');
  }

  const where: any = {};
  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter as ListingStatus;
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      subCategory: { select: { id: true, name: true, slug: true } },
    },
  });

  return listings;
}

export async function adminUpdateListingStatusAction(id: string, status: ListingStatus) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return { success: false, message: 'Ruxsat yo\'q' };
  }

  try {
    await prisma.listing.update({
      where: { id },
      data: { status },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath(`/listing/${id}`);
    } catch {}

    return { success: true, message: "Status muvaffaqiyatli yangilandi" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

export async function adminToggleVerifyAction(id: string) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return { success: false, message: "Ruxsat yo'q" };
  }

  try {
    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { isVerified: true },
    });

    if (!existing) {
      return { success: false, message: "E'lon topilmadi" };
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: { isVerified: !existing.isVerified },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath(`/listing/${id}`);
    } catch {}

    return {
      success: true,
      isVerified: updated.isVerified,
      message: updated.isVerified
        ? "Usta muvaffaqiyatli tasdiqlandi (Verified nishoni berildi)!"
        : "Tasdiqlanganlik nishoni olib tashlandi.",
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

export async function adminDeleteListingAction(id: string) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return { success: false, message: 'Ruxsat yo\'q' };
  }

  try {
    await prisma.listing.delete({
      where: { id },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/categories');
    } catch {}

    return { success: true, message: "E'lon bazadan o'chirildi" };
  } catch (error: any) {
    return { success: false, message: error?.message || "O'chirishda xatolik" };
  }
}

/**
 * Xodimlar bahosini (Staff Rating) yangilash va qayta ball hisoblash
 */
export async function adminUpdateStaffRatingAction(id: string, staffRating: number) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat yo'q" };

  try {
    const listing: any = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return { success: false, message: "E'lon topilmadi" };

    const newScore = calculateListingScore({
      adminRating: staffRating,
      clientRating: listing.clientRating,
      reviewCount: listing.reviewCount,
      paidTier: listing.paidTier,
      isPrivileged: listing.isPrivileged,
      websiteUrl: listing.websiteUrl,
      isVerified: listing.isVerified,
    });

    const updated: any = await prisma.listing.update({
      where: { id },
      data: {
        adminRating: staffRating,
        totalScore: newScore,
      } as any,
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath(`/listing/${id}`);
    } catch {}

    return {
      success: true,
      message: `Xodim bahosi ${staffRating} ga o'rnatildi (Yangi ball: ${newScore})`,
      adminRating: updated.adminRating,
      totalScore: updated.totalScore,
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

/**
 * Imtiyoz (Privilege) biriktirish yoki bekor qilish
 */
export async function adminUpdatePrivilegeAction(
  id: string,
  privilegeType: PrivilegeType,
  privilegeReason?: string
) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat yo'q" };

  try {
    const listing: any = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return { success: false, message: "E'lon topilmadi" };

    const isPrivileged = privilegeType !== PrivilegeType.NONE;

    const newScore = calculateListingScore({
      adminRating: listing.adminRating,
      clientRating: listing.clientRating,
      reviewCount: listing.reviewCount,
      paidTier: listing.paidTier,
      isPrivileged,
      websiteUrl: listing.websiteUrl,
      isVerified: listing.isVerified,
    });

    const updated: any = await prisma.listing.update({
      where: { id },
      data: {
        privilegeType,
        privilegeReason: isPrivileged ? privilegeReason || "Ijtimoiy imtiyoz" : null,
        isPrivileged,
        totalScore: newScore,
      } as any,
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath(`/listing/${id}`);
    } catch {}

    return {
      success: true,
      message: isPrivileged
        ? `Usta uchun imtiyoz tasdiqlandi (Yangi ball: ${newScore})`
        : "Imtiyoz olib tashlandi",
      isPrivileged: updated.isPrivileged,
      privilegeType: updated.privilegeType,
      totalScore: updated.totalScore,
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

/**
 * To'lov / Homiylik (VIP Gold, Standard) statusini berish
 */
export async function adminUpdatePaidTierAction(
  id: string,
  paidTier: PaidTier,
  durationDays: number = 30
) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat yo'q" };

  try {
    const listing: any = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return { success: false, message: "E'lon topilmadi" };

    const paidUntil = paidTier !== PaidTier.FREE && durationDays > 0
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      : null;

    const newScore = calculateListingScore({
      adminRating: listing.adminRating,
      clientRating: listing.clientRating,
      reviewCount: listing.reviewCount,
      paidTier,
      isPrivileged: listing.isPrivileged,
      websiteUrl: listing.websiteUrl,
      isVerified: listing.isVerified,
    });

    const updated: any = await prisma.listing.update({
      where: { id },
      data: {
        paidTier,
        paidUntil,
        totalScore: newScore,
      } as any,
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath(`/listing/${id}`);
    } catch {}

    return {
      success: true,
      message: `To'lov tarifi ${paidTier} ga o'zgartirildi (Yangi ball: ${newScore})`,
      paidTier: updated.paidTier,
      paidUntil: updated.paidUntil,
      totalScore: updated.totalScore,
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

/**
 * Barcha mavjud e'lonlarning reyting ballarini sinxronlashtirish
 */
export async function adminSyncListingScoresAction() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat yo'q" };

  try {
    const listings: any[] = await prisma.listing.findMany();
    let updatedCount = 0;

    for (const item of listings) {
      const score = calculateListingScore({
        adminRating: item.adminRating,
        clientRating: item.clientRating,
        reviewCount: item.reviewCount,
        paidTier: item.paidTier,
        isPrivileged: item.isPrivileged,
        websiteUrl: item.websiteUrl,
        isVerified: item.isVerified,
      });

      await prisma.listing.update({
        where: { id: item.id },
        data: { totalScore: score } as any,
      });
      updatedCount++;
    }

    try {
      revalidatePath('/');
      revalidatePath('/admin');
    } catch {}

    return { success: true, count: updatedCount, message: `${updatedCount} ta e'lonning ballari muvaffaqiyatli hisoblandi!` };
  } catch (error: any) {
    return { success: false, message: error?.message || "Xatolik yuz berdi" };
  }
}

export interface AdminUpdateListingInput {
  title?: string;
  name?: string;
  phone?: string;
  description?: string;
  images?: string[];
  instagram?: string | null;
  telegram?: string | null;
  websiteUrl?: string | null;
  location?: string;
  address?: string | null;
  price?: string | null;
  experience?: string | null;
  categoryId?: string;
  subCategoryId?: string | null;
  status?: ListingStatus;
  paidTier?: PaidTier;
  isPrivileged?: boolean;
  privilegeType?: PrivilegeType;
  privilegeReason?: string | null;
  adminRating?: number;
  clientRating?: number;
  isVerified?: boolean;
}

/**
 * Admin: E'lonni to'liq tahrirlash (Instagram, telefon, tavsif, manzil, status va h.k.)
 */
export async function adminUpdateListingFullAction(id: string, data: AdminUpdateListingInput) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat berilmagan" };

  try {
    const existing: any = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "E'lon topilmadi" };

    const adminRating = data.adminRating !== undefined ? data.adminRating : existing.adminRating;
    const clientRating = data.clientRating !== undefined ? data.clientRating : existing.clientRating;
    const paidTier = data.paidTier !== undefined ? data.paidTier : existing.paidTier;
    const isPrivileged = data.isPrivileged !== undefined ? data.isPrivileged : existing.isPrivileged;
    const websiteUrl = data.websiteUrl !== undefined ? data.websiteUrl : existing.websiteUrl;
    const isVerified = data.isVerified !== undefined ? data.isVerified : existing.isVerified;

    const newScore = calculateListingScore({
      adminRating,
      clientRating,
      reviewCount: existing.reviewCount,
      paidTier,
      isPrivileged,
      websiteUrl,
      isVerified,
    });

    const updated: any = await prisma.listing.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.phone !== undefined && { phone: data.phone.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.instagram !== undefined && { instagram: data.instagram ? data.instagram.trim() : null }),
        ...(data.telegram !== undefined && { telegram: data.telegram ? data.telegram.trim() : null }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null }),
        ...(data.location !== undefined && { location: data.location.trim() }),
        ...(data.address !== undefined && { address: data.address ? data.address.trim() : null }),
        ...(data.price !== undefined && { price: data.price ? data.price.trim() : 'Kelishilgan holda' }),
        ...(data.experience !== undefined && { experience: data.experience ? data.experience.trim() : 'Mavjud' }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.subCategoryId !== undefined && { subCategoryId: data.subCategoryId || null }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.paidTier !== undefined && { paidTier: data.paidTier }),
        ...(data.isPrivileged !== undefined && { isPrivileged: data.isPrivileged }),
        ...(data.privilegeType !== undefined && { privilegeType: data.privilegeType }),
        ...(data.privilegeReason !== undefined && { privilegeReason: data.privilegeReason ? data.privilegeReason.trim() : null }),
        ...(data.adminRating !== undefined && { adminRating }),
        ...(data.clientRating !== undefined && { clientRating }),
        ...(data.isVerified !== undefined && { isVerified }),
        totalScore: newScore,
      } as any,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subCategory: { select: { id: true, name: true, slug: true } },
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath(`/listing/${id}`);
      revalidatePath('/categories');
    } catch {}

    return {
      success: true,
      message: "E'lon muvaffaqiyatli to'liq tahrirlandi!",
      listing: updated,
    };
  } catch (error: any) {
    console.error('adminUpdateListingFullAction error:', error);
    return { success: false, message: error?.message || "Tahrirlashda xatolik yuz berdi" };
  }
}

/**
 * Admin: Ro'yxatdan o'tgan foydalanuvchilar va ularning limitlari ro'yxatini olish
 */
export async function adminGetUsersAction() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, users: [], message: "Ruxsat berilmagan" };

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    });

    // Har bir user uchun e'lonlar statistikasi
    const usersWithStats = users.map((u) => {
      const userLimit = (u as any).listingLimit ?? (u as any).dailyLimit ?? 3;
      return {
        id: u.id,
        phone: u.phone,
        name: u.name,
        role: u.role,
        listingLimit: userLimit,
        totalListings: u._count.listings,
        createdAt: u.createdAt,
      };
    });

    return { success: true, users: usersWithStats };
  } catch (error: any) {
    console.error('adminGetUsersAction error:', error);
    return { success: false, users: [], message: error?.message || "Xatolik yuz berdi" };
  }
}

/**
 * Admin: Foydalanuvchining butun umrlik e'lon limitini o'zgartirish (CRUD)
 */
export async function adminUpdateUserLimitAction(userId: string, newLimit: number) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat berilmagan" };

  if (typeof newLimit !== 'number' || newLimit < 0 || newLimit > 1000) {
    return { success: false, message: "Limit 0 dan 1000 gacha bo'lgan butun son bo'lishi kerak." };
  }

  try {
    const limitVal = Math.floor(newLimit);
    let updated;
    try {
      updated = await prisma.user.update({
        where: { id: userId },
        data: { listingLimit: limitVal, dailyLimit: limitVal } as any,
      });
    } catch {
      updated = await prisma.user.update({
        where: { id: userId },
        data: { dailyLimit: limitVal } as any,
      });
    }

    return {
      success: true,
      message: `${updated.name} uchun e'lon berish limiti ${limitVal} taga o'zgartirildi!`,
      listingLimit: limitVal,
    };
  } catch (error: any) {
    console.error('adminUpdateUserLimitAction error:', error);
    return { success: false, message: error?.message || "Limitni yangilashda xatolik yuz berdi" };
  }
}


/**
 * Admin: Foydalanuvchi rolini o'zgartirish
 */
export async function adminUpdateUserRoleAction(userId: string, newRole: Role) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return { success: false, message: "Ruxsat berilmagan" };

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return {
      success: true,
      message: `${updated.name} roli ${updated.role} ga o'zgartirildi!`,
      role: updated.role,
    };
  } catch (error: any) {
    console.error('adminUpdateUserRoleAction error:', error);
    return { success: false, message: error?.message || "Rolni yangilashda xatolik" };
  }
}
