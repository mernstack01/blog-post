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

export const POPULAR_SEARCH_TAGS = [
  'Santexnik',
  'Elektrik',
  'Konditsioner',
  'Yuk tashish',
  'Yevro ta\'mir',
  'Kafelchi',
  'Avto diagnostika',
  'Ingliz tili',
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  Wrench: 'Wrench',
  Car: 'Car',
  Tv: 'Tv',
  Hammer: 'Hammer',
  Sparkles: 'Sparkles',
  GraduationCap: 'GraduationCap',
  Home: 'Home',
};
