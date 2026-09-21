'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  getUserAuthSession,
  setUserAuthSession,
  clearUserAuthSession,
  getTashkentStartOfDay,
} from '@/lib/user-auth';
import { PrismaClient, Role } from '@prisma/client';
import { isUserAdmin, clearAdminAuthSession, setAdminAuthSession } from '@/lib/admin-auth';
import { isSuperAdminPhone } from '@/lib/constants';


// Fallback in-memory store in case Prisma Client in active Node dev process hasn't reloaded
const globalForOtp = globalThis as unknown as {
  otpMemoryStore?: Map<string, { code: string; expiresAt: Date }>;
};
if (!globalForOtp.otpMemoryStore) {
  globalForOtp.otpMemoryStore = new Map();
}
const otpStore = globalForOtp.otpMemoryStore;

/**
 * Har doim yangilangan va to'g'ri PrismaClient nusxasini olish
 */
function getPrismaDb(): PrismaClient {
  if (prisma && typeof (prisma as any).otpCode?.deleteMany === 'function') {
    return prisma;
  }
  return new PrismaClient();
}

/**
 * Telefon raqamni toza +998XXXXXXXXX formatiga keltirish
 */
function normalizePhone(rawPhone: string): string {
  let clean = rawPhone.replace(/[^\d+]/g, '').trim();
  if (!clean.startsWith('+') && clean.startsWith('998')) {
    clean = `+${clean}`;
  } else if (!clean.startsWith('+')) {
    clean = `+998${clean.replace(/^0+/, '')}`;
  }
  return clean;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  devCode?: string;
  isRegistered?: boolean;
  userName?: string;
}

/**
 * 1. Telefon raqamiga 4 xonali OTP kod yuborish
 */
export async function sendOtpAction(rawPhone: string): Promise<SendOtpResponse> {
  try {
    const db = getPrismaDb();
    const phone = normalizePhone(rawPhone);

    if (!/^\+998\d{9}$/.test(phone)) {
      return {
        success: false,
        message: "Iltimos, to'g'ri O'zbekiston telefon raqamini kiriting (masalan: +998 90 123 45 67).",
      };
    }

    // Foydalanuvchi allaqachon ro'yxatdan o'tganligini tekshirish
    let existingUser: { id: string; name: string } | null = null;
    try {
      existingUser = await db.user.findUnique({
        where: { phone },
        select: { id: true, name: true },
      });
    } catch (checkErr) {
      console.warn('Mavjud userni tekshirishda ogohlantirish:', checkErr);
    }

    // 4 xonali tasodifiy kod generatsiya qilish (1000 - 9999)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 daqiqa

    // 1. Agar db.otpCode mavjud bo'lsa, bazada saqlaymiz
    if (db && (db as any).otpCode && typeof (db as any).otpCode.deleteMany === 'function') {
      try {
        await (db as any).otpCode.deleteMany({
          where: { phone },
        });
        await (db as any).otpCode.create({
          data: {
            phone,
            code,
            expiresAt,
          },
        });
      } catch (dbErr) {
        console.warn('db.otpCode saqlashda xato, xotiraga yozilmoqda:', dbErr);
        otpStore.delete(phone);
        otpStore.set(phone, { code, expiresAt });
      }
    } else {
      // 2. Server qayta ishga tushirilmagan bo'lsa xotirada saqlaymiz
      otpStore.delete(phone);
      otpStore.set(phone, { code, expiresAt });
    }

    // Development rejimida foydalanuvchiga qulay bo'lishi uchun kodni qaytaramiz
    return {
      success: true,
      message: existingUser
        ? `Xush kelibsiz! Tasdiqlash kodi ${phone} raqamiga yuborildi.`
        : `Tasdiqlash kodi ${phone} raqamiga yuborildi.`,
      devCode: code,
      isRegistered: Boolean(existingUser),
      userName: existingUser?.name,
    };
  } catch (error: any) {
    console.error('sendOtpAction error:', error);
    return {
      success: false,
      message: error?.message || "Kod yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
    };
  }
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    phone: string;
    name: string;
    role: string;
    listingLimit: number;
    totalUsed?: number;
    remaining?: number;
  };
}

/**
 * 2. 4 xonali OTP kodni tekshirish va ro'yxatdan o'tkazish / tizimga kiritish
 */
export async function verifyOtpAction(
  rawPhone: string,
  code: string,
  name?: string
): Promise<VerifyOtpResponse> {
  try {
    const db = getPrismaDb();
    const phone = normalizePhone(rawPhone);
    const cleanCode = code.trim();

    if (!phone || !cleanCode) {
      return { success: false, message: "Telefon raqami va kodni to'liq kiriting." };
    }

    let isValid = false;

    // 1. Bazadan tekshirish (agar model yuklangan bo'lsa)
    if (db && (db as any).otpCode && typeof (db as any).otpCode.findFirst === 'function') {
      try {
        const validOtp = await (db as any).otpCode.findFirst({
          where: {
            phone,
            code: cleanCode,
            expiresAt: { gt: new Date() },
          },
        });

        if (validOtp) {
          isValid = true;
          await (db as any).otpCode.deleteMany({
            where: { phone },
          });
        }
      } catch (err) {
        console.warn('db.otpCode findFirst xatoligi, xotiradan tekshirilmoqda:', err);
      }
    }

    // 2. Agar bazadan topilmasa, xotiradan tekshirish
    if (!isValid) {
      const stored = otpStore.get(phone);
      if (stored && stored.code === cleanCode && stored.expiresAt > new Date()) {
        isValid = true;
        otpStore.delete(phone);
      }
    }

    if (!isValid) {
      return {
        success: false,
        message: "Tasdiqlash kodi noto'g'ri yoki muddati tugagan. Qaytadan kod so'rang.",
      };
    }

    // Foydalanuvchini topish yoki yangisini yaratish
    let user = await db.user.findUnique({
      where: { phone },
    });

    const isSuperAdmin = isSuperAdminPhone(phone);
    const assignedRole = isSuperAdmin ? Role.ADMIN : Role.SPECIALIST;
    const defaultName = isSuperAdmin
      ? (name && name.trim() ? name.trim() : 'Super Admin')
      : (name && name.trim() ? name.trim() : `Mutaxassis (${phone.slice(-4)})`);

    if (!user) {
      try {
        user = await db.user.create({
          data: {
            phone,
            name: defaultName,
            role: assignedRole,
            listingLimit: isSuperAdmin ? 99999 : 3,
          } as any,
        });
      } catch {
        user = await db.user.create({
          data: {
            phone,
            name: defaultName,
            role: assignedRole,
          },
        });
      }
    } else {
      // Agar Super Admin bo'lsa va uning roli ADMIN bo'lmasa, darhol ADMIN ga o'tkazish
      if (isSuperAdmin && user.role !== Role.ADMIN) {
        user = await db.user.update({
          where: { id: user.id },
          data: { role: Role.ADMIN, listingLimit: 99999 } as any,
        });
      } else if (name && name.trim() && user.name.startsWith('Mutaxassis (')) {
        user = await db.user.update({
          where: { id: user.id },
          data: { name: name.trim() },
        });
      }
    }

    // Sessiya cookie-ga yozish
    await setUserAuthSession(user.id, user.phone, user.role);

    // Agar Super Admin yoki Admin bo'lsa, to'g'ridan-to'g'ri admin tokenini ham berish
    if (user.role === Role.ADMIN || isSuperAdmin) {
      try {
        await setAdminAuthSession();
      } catch {}
    } else {
      try {
        await clearAdminAuthSession();
      } catch {}
    }

    const userLimit = (user as any)?.listingLimit ?? (user as any)?.dailyLimit ?? 3;

    // Butun umrlik (umumiy) e'lonlar hisobi
    const totalUsed = await db.listing.count({
      where: {
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz!",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        listingLimit: userLimit,
        totalUsed,
        remaining: Math.max(0, userLimit - totalUsed),
      },
    };
  } catch (error: any) {
    console.error('verifyOtpAction error:', error);
    return {
      success: false,
      message: error?.message || "Kodni tekshirishda xatolik yuz berdi.",
    };
  }
}

/**
 * 3. Hozirda tizimga kirgan foydalanuvchi ma'lumotlarini olish
 */
export async function getCurrentUserAction() {
  try {
    const session = await getUserAuthSession();
    const db = getPrismaDb();

    // 1. Agar foydalanuvchi sessiyasi mavjud bo'lsa
    if (session?.userId) {
      const user = await db.user.findUnique({
        where: { id: session.userId },
      });

      if (user) {
        // Agar foydalanuvchi haqiqiy Admin yoki Super Admin bo'lsa
        const isSuperAdmin = user.role === Role.ADMIN || isSuperAdminPhone(user.phone);
        if (isSuperAdmin) {
          return {
            success: true,
            user: {
              id: user.id,
              phone: user.phone,
              name: user.name,
              role: 'ADMIN',
              listingLimit: 99999,
              totalUsed: 0,
              remaining: 99999,
            },
          };
        }

        // Oddiy foydalanuvchi / Mutaxassis
        const userLimit = (user as any)?.listingLimit ?? (user as any)?.dailyLimit ?? 3;
        const totalUsed = await db.listing.count({
          where: { userId: user.id },
        });

        return {
          success: true,
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
            role: user.role,
            listingLimit: userLimit,
            totalUsed,
            remaining: Math.max(0, userLimit - totalUsed),
          },
        };
      }
      return { success: false, user: null };
    }

    // 2. Agar foydalanuvchi sessiyasi bo'lmasa, faqat PIN orqali admin kirganligini tekshiramiz
    const adminActive = await isUserAdmin();
    if (adminActive) {
      return {
        success: true,
        user: {
          id: 'admin_root',
          phone: '+998 (Admin)',
          name: 'SuperAdmin',
          role: 'ADMIN',
          listingLimit: 9999,
          totalUsed: 0,
          remaining: 9999,
        },
      };
    }

    return { success: false, user: null };
  } catch (error) {
    console.error('getCurrentUserAction error:', error);
    return { success: false, user: null };
  }
}

/**
 * 4. Tizimdan chiqish
 */
export async function logoutUserAction() {
  await clearUserAuthSession();
  await clearAdminAuthSession();
  return { success: true };
}

/**
 * 5. Foydalanuvchining to'liq profil ma'lumotlarini olish (Profile sahifasi uchun)
 */
export async function getUserFullProfileAction() {
  try {
    const session = await getUserAuthSession();
    if (!session?.userId) {
      return { success: false, message: "Avtorizatsiyadan o'tilmagan", user: null, stats: null, listings: [] };
    }

    const db = getPrismaDb();
    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      await clearUserAuthSession();
      return { success: false, message: "Foydalanuvchi topilmadi", user: null, stats: null, listings: [] };
    }

    const listings = await db.listing.findMany({
      where: {
        OR: [
          { userId: user.id },
          { phone: user.phone },
        ],
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true },
        },
        subCategory: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const isSuperAdmin = user.role === Role.ADMIN || isSuperAdminPhone(user.phone);
    const userLimit = isSuperAdmin ? 99999 : ((user as any)?.listingLimit ?? (user as any)?.dailyLimit ?? 3);
    const totalListings = listings.length;
    const approvedCount = listings.filter((l: any) => l.status === 'APPROVED').length;
    const pendingCount = listings.filter((l: any) => l.status === 'PENDING').length;
    const totalViews = listings.reduce((sum: number, l: any) => sum + (l.view_count || 0), 0);

    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: isSuperAdmin ? 'ADMIN' : user.role,
        telegram: user.telegram || null,
        avatar: user.avatar || null,
        createdAt: user.createdAt,
      },
      stats: {
        listingLimit: userLimit,
        totalUsed: totalListings,
        remaining: Math.max(0, userLimit - totalListings),
        approvedCount,
        pendingCount,
        totalViews,
      },
      listings: JSON.parse(JSON.stringify(listings)),
    };
  } catch (error: any) {
    console.error('getUserFullProfileAction error:', error);
    return { success: false, message: error?.message || "Profil ma'lumotlarini yuklashda xatolik", user: null, stats: null, listings: [] };
  }
}

/**
 * 6. Foydalanuvchi profili ma'lumotlarini yangilash (Ism, Telegram, Avatar)
 */
export async function updateUserProfileAction(data: {
  name: string;
  telegram?: string | null;
  avatar?: string | null;
}) {
  try {
    const session = await getUserAuthSession();
    if (!session?.userId) {
      return { success: false, message: "Avtorizatsiyadan o'tilmagan" };
    }

    const cleanName = data.name.trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: "Ism kamida 2 ta harfdan iborat bo'lishi kerak" };
    }

    let cleanTelegram = data.telegram ? data.telegram.trim().replace(/^@/, '') : null;

    const db = getPrismaDb();
    const updated = await db.user.update({
      where: { id: session.userId },
      data: {
        name: cleanName,
        telegram: cleanTelegram || null,
        ...(data.avatar !== undefined && { avatar: data.avatar || null }),
      },
    });

    try {
      revalidatePath('/profile');
      revalidatePath('/my-listings');
      revalidatePath('/');
    } catch {}

    return {
      success: true,
      message: "Profilingiz muvaffaqiyatli yangilandi!",
      user: {
        id: updated.id,
        phone: updated.phone,
        name: updated.name,
        role: updated.role,
        telegram: updated.telegram,
        avatar: updated.avatar,
      },
    };
  } catch (error: any) {
    console.error('updateUserProfileAction error:', error);
    return { success: false, message: error?.message || "Profilni yangilashda xatolik yuz berdi" };
  }
}
