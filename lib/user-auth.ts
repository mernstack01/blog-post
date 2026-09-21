import { cookies } from 'next/headers';
import crypto from 'crypto';

const USER_COOKIE_NAME = 'topbaza_user_token';

function getUserSecret(): string {
  return (
    process.env.USER_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    'topbaza_user_auth_secure_secret_key_2026'
  );
}

export interface UserSessionPayload {
  userId: string;
  phone: string;
  role: string;
  exp: number;
}

/**
 * Payloadni HMAC-SHA256 imzosi bilan xavfsiz token holatiga keltirish
 */
export function signUserToken(payload: Omit<UserSessionPayload, 'exp'>, expiresInDays = 30): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload: UserSessionPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload), 'utf8').toString('base64url');

  const signature = crypto
    .createHmac('sha256', getUserSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Token imzosini va amal qilish muddatini tekshirish
 */
export function verifyUserToken(token?: string): UserSessionPayload | null {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  try {
    const [encodedPayload, providedSignature] = token.split('.');
    if (!encodedPayload || !providedSignature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', getUserSecret())
      .update(encodedPayload)
      .digest('base64url');

    const sigBuf = Buffer.from(providedSignature, 'utf8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload: UserSessionPayload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    );

    // Muddati o'tganligini tekshirish
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('verifyUserToken error:', err);
    return null;
  }
}

/**
 * Cookie'dan joriy foydalanuvchi sessiyasini olish
 */
export async function getUserAuthSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get(USER_COOKIE_NAME)?.value ||
      cookieStore.get('xayrli_user_token')?.value;
    return verifyUserToken(token);
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    console.error('getUserAuthSession error:', err);
    return null;
  }
}


/**
 * Foydalanuvchi sessiyasini cookie'ga yozish
 */
export async function setUserAuthSession(
  userId: string,
  phone: string,
  role: string = 'SPECIALIST'
): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = signUserToken({ userId, phone, role });

    cookieStore.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 kunlik sessiya
      path: '/',
    });
  } catch (err) {
    console.error('setUserAuthSession error:', err);
  }
}

/**
 * Foydalanuvchi sessiyasini tozalash (Chiqish)
 */
export async function clearUserAuthSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(USER_COOKIE_NAME);
    cookieStore.delete('xayrli_user_token');
  } catch (err: any) {
    if (err?.message?.includes('Cookies can only be modified') || err?.digest === 'DYNAMIC_SERVER_USAGE') {
      return;
    }
    console.error('clearUserAuthSession error:', err);
  }
}

/**
 * Tashkent (UTC+5) vaqti bo'yicha bugungi kunning boshlanish vaqtini olish
 */
export function getTashkentStartOfDay(): Date {
  const now = new Date();
  const tashkentOffsetMs = 5 * 60 * 60 * 1000;
  const tashkentNow = new Date(now.getTime() + tashkentOffsetMs);
  return new Date(
    Date.UTC(
      tashkentNow.getUTCFullYear(),
      tashkentNow.getUTCMonth(),
      tashkentNow.getUTCDate()
    ) - tashkentOffsetMs
  );
}

