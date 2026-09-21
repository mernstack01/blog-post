export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export const ListingStatus = {
  PENDING: 'PENDING' as const,
  APPROVED: 'APPROVED' as const,
  REJECTED: 'REJECTED' as const,
};

export type PaidTier = 'FREE' | 'STANDARD' | 'VIP_GOLD';
export const PaidTier = {
  FREE: 'FREE' as const,
  STANDARD: 'STANDARD' as const,
  VIP_GOLD: 'VIP_GOLD' as const,
};

export type PrivilegeType =
  | 'NONE'
  | 'DISABILITY'
  | 'YOUTH_STARTUP'
  | 'HONORARY_MASTER'
  | 'SOCIAL_PROTECT';
export const PrivilegeType = {
  NONE: 'NONE' as const,
  DISABILITY: 'DISABILITY' as const,
  YOUTH_STARTUP: 'YOUTH_STARTUP' as const,
  HONORARY_MASTER: 'HONORARY_MASTER' as const,
  SOCIAL_PROTECT: 'SOCIAL_PROTECT' as const,
};

/**
 * TopBaza.uz: Ko'p omillik reyting va ball hisoblash tizimi
 *
 * Mezoni:
 * - Xodim / Admin xulosasi: max 40 ball
 * - Mijozlar bahosi va sharhlari: max 25 ball
 * - To'lov / Homiylik darajasi (VIP Gold: 20, Standard: 10): max 20 ball
 * - Ijtimoiy imtiyozlar (Nogironlik, Faxriy, Yoshlar): max 15 ball
 * - Veb-sayt va Verifikatsiya to'liqligi: max 5 ball
 * Jami maksimal: 100 ball
 */
export function calculateListingScore(item: {
  adminRating?: number | null;
  clientRating?: number | null;
  reviewCount?: number | null;
  paidTier?: string | null;
  isPrivileged?: boolean | null;
  websiteUrl?: string | null;
  isVerified?: boolean | null;
}): number {
  const adminScore = ((item.adminRating ?? 4.0) / 5) * 40; // 0 - 40 ball
  const clientRating = item.clientRating ?? 5.0;
  const reviews = item.reviewCount ?? 1;
  const clientScore = (clientRating / 5) * 20 + Math.min(5, reviews * 0.5); // 0 - 25 ball

  let paidScore = 0;
  if (item.paidTier === 'VIP_GOLD') paidScore = 20;
  else if (item.paidTier === 'STANDARD') paidScore = 10;

  const privScore = item.isPrivileged ? 15 : 0;
  const profileScore = (item.websiteUrl ? 3 : 0) + (item.isVerified ? 2 : 0);

  const total = Math.min(
    100,
    Math.round((adminScore + clientScore + paidScore + privScore + profileScore) * 10) / 10
  );
  return total;
}
