import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'sirdaryo_admin_token';
const DEFAULT_PIN = 'sirdaryo2025';

export function getExpectedAdminPin(): string {
  return process.env.ADMIN_PIN || DEFAULT_PIN;
}

export async function isUserAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return Boolean(token && token === getExpectedAdminPin());
  } catch (err) {
    console.error('isUserAdmin error:', err);
    return false;
  }
}

export async function setAdminAuthSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, getExpectedAdminPin(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 kun
      path: '/',
    });
  } catch (err) {
    console.error('setAdminAuthSession error:', err);
  }
}

export async function clearAdminAuthSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
  } catch (err) {
    console.error('clearAdminAuthSession error:', err);
  }
}

