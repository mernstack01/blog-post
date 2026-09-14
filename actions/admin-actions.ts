'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isUserAdmin, setAdminAuthSession, clearAdminAuthSession, verifyAdminPin } from '@/lib/admin-auth';
import { ListingStatus } from '@prisma/client';
import { redirect } from 'next/navigation';

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
  redirect('/admin/login');
}

export async function getAdminStatsAction() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('Ruxsat berilmagan');
  }

  const [totalListings, approvedCount, pendingCount, rejectedCount, totalViewsAggregate] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: ListingStatus.APPROVED } }),
    prisma.listing.count({ where: { status: ListingStatus.PENDING } }),
    prisma.listing.count({ where: { status: ListingStatus.REJECTED } }),
    prisma.listing.aggregate({ _sum: { view_count: true } }),
  ]);

  return {
    totalListings,
    approvedCount,
    pendingCount,
    rejectedCount,
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
