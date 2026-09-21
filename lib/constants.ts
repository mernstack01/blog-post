export const SIRDARYO_LOCATIONS = [
  'Barcha hududlar',
  'Guliston shahri',
  'Yangiyer shahri',
  'Shirin shahri',
  'Boyovut tumani',
  'Guliston tumani',
  'Mirzaobod tumani',
  'Sayxunobod tumani',
  'Sardoba tumani',
  'Oqoltin tumani',
  'Xovos tumani',
] as const;

export type SirdaryoLocation = (typeof SIRDARYO_LOCATIONS)[number];

export const POPULAR_SEARCH_TAGS_MAP: { uz: string; ru: string }[] = [
  { uz: "O'quv markazi", ru: "Учебный центр" },
  { uz: "Restoran & Kafe", ru: "Ресторан и Кафе" },
  { uz: "Shifokor", ru: "Врач" },
  { uz: "Repetitor", ru: "Репетитор" },
  { uz: "Santexnik", ru: "Сантехник" },
  { uz: "Elektrik", ru: "Электрик" },
  { uz: "Dasturchi", ru: "Программист" },
  { uz: "Avto ta'mir", ru: "Авторемонт" },
  { uz: "Yuk tashish", ru: "Грузоперевозки" },
  { uz: "Mehmonxona", ru: "Гостиница" },
];

export const POPULAR_SEARCH_TAGS = POPULAR_SEARCH_TAGS_MAP.map((t) => t.uz);

export const CATEGORY_ICONS: Record<string, string> = {
  Wrench: 'Wrench',
  Car: 'Car',
  Tv: 'Tv',
  Hammer: 'Hammer',
  Sparkles: 'Sparkles',
  GraduationCap: 'GraduationCap',
  Home: 'Home',
};

// Super Admin konfiguratsiyasi
export const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || '+998973314717';

export function isSuperAdminPhone(rawPhone?: string | null): boolean {
  if (!rawPhone) return false;
  const clean = rawPhone.replace(/[^\d]/g, '');
  return clean === '998973314717' || clean.endsWith('973314717');
}

