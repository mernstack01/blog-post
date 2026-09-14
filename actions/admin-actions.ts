'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isUserAdmin, setAdminAuthSession, clearAdminAuthSession, getExpectedAdminPin } from '@/lib/admin-auth';
import { ListingStatus } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function adminLoginAction(pin: string) {
  try {
    const expected = getExpectedAdminPin();
    if (pin.trim() === expected.trim()) {
      await setAdminAuthSession();
      return { success: true };
    }
    return { success: false, message: "Noto'g'ri PIN-kod! Qaytadan urinib ko'ring." };
  } catch (error: any) {
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
