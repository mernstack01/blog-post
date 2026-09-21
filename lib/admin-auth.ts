import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'sirdaryo_admin_token';
const DEFAULT_PIN = 'sirdaryo2025';

export function getExpectedAdminPin(): string {
  return (process.env.ADMIN_PIN || DEFAULT_PIN).trim();
}

function getAdminSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PIN || 'sirdaryo_session_secure_key_2025';
}

/**
 * PIN-kod va maxfiy kalit asosida HMAC-SHA256 sessiya tokenini hisoblash.
 * Cookie ichiga hech qachon ochiq PIN-kod yozilmaydi.
 */
export function generateAdminSessionToken(pin: string): string {
  return crypto
    .createHmac('sha256', getAdminSecret())
    .update(`sirdaryo_admin_auth_${pin}`)
    .digest('hex');
}

/**
 * Timing-safe solishtirish yordamida token to'g'riligini tekshirish
 */
export function verifySessionToken(token?: string): boolean {
  if (!token || typeof token !== 'string') return false;

  try {
    const expectedToken = generateAdminSessionToken(getExpectedAdminPin());
    const tokenBuf = Buffer.from(token, 'utf8');
    const expectedBuf = Buffer.from(expectedToken, 'utf8');

    if (tokenBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(tokenBuf, expectedBuf);
  } catch (err) {
    console.error('verifySessionToken error:', err);
    return false;
  }
}

/**
 * PIN-kodni timing-safe usulda tekshirish
 */
export function verifyAdminPin(enteredPin: string): boolean {
  if (!enteredPin || typeof enteredPin !== 'string') return false;

  try {
    const expectedPin = getExpectedAdminPin();
    const enteredBuf = Buffer.from(enteredPin.trim(), 'utf8');
    const expectedBuf = Buffer.from(expectedPin, 'utf8');

    if (enteredBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(enteredBuf, expectedBuf);
  } catch (err) {
    console.error('verifyAdminPin error:', err);
    return false;
  }
}

import { getUserAuthSession } from '@/lib/user-auth';
import { isSuperAdminPhone } from '@/lib/constants';

/**
 * Foydalanuvchi hozirda admin sifatida tizimga kirganligini tekshirish.
 * Agar foydalanuvchi Super Admin (+998973314717) yoki roli ADMIN bo'lsa, admin huquqi beriladi.
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const userSession = await getUserAuthSession();
    // 1. Agar foydalanuvchi tizimga kirgan bo'lsa va uning roli ADMIN yoki Super Admin bo'lsa:
    if (userSession && (userSession.role === 'ADMIN' || isSuperAdminPhone(userSession.phone))) {
      return true;
    }

    // 2. Agar foydalanuvchi tizimga kirgan bo'lsa va uning roli ADMIN bo'lmasa hamda Super Admin bo'lmasa:
    if (userSession && userSession.role !== 'ADMIN' && !isSuperAdminPhone(userSession.phone)) {
      return false;
    }

    // 3. Foydalanuvchi kirmagan bo'lsa, PIN orqali admin sessiya tokenini tekshirish
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    console.error('isUserAdmin error:', err);
    return false;
  }
}


/**
 * Xavfsiz shifrlangan sessiya tokenini cookie'ga yozish
 */
export async function setAdminAuthSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = generateAdminSessionToken(getExpectedAdminPin());

    cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 kunlik xavfsiz sessiya
      path: '/',
    });
  } catch (err) {
    console.error('setAdminAuthSession error:', err);
  }
}

/**
 * Admin sessiyasini tozalash (Chiqish)
 */
export async function clearAdminAuthSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
  } catch (err: any) {
    if (err?.message?.includes('Cookies can only be modified') || err?.digest === 'DYNAMIC_SERVER_USAGE') {
      return;
    }
    console.error('clearAdminAuthSession error:', err);
  }
}

