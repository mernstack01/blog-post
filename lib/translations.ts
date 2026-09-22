import uzTranslations from '@/locales/uz.json';
import ruTranslations from '@/locales/ru.json';

export type Language = 'uz' | 'ru';

export const translations = {
  uz: uzTranslations,
  ru: ruTranslations,
};

export const categorySlugMap: Record<string, { uz: string; ru: string }> = {
  'ustalar': { uz: "Ustalar va Ta'mir", ru: 'Мастера и Ремонт' },
  'santexnika': { uz: 'Santexnika', ru: 'Сантехника' },
  'santexnik': { uz: 'Santexnika', ru: 'Сантехника' },
  'elektrik': { uz: 'Elektrik', ru: 'Электрика' },
  'elektr': { uz: 'Elektrik', ru: 'Электрика' },
  'remont': { uz: 'Remont va qurilish', ru: 'Ремонт и стройка' },
  'avto': { uz: "Avto va Yuk tashish", ru: 'Авто и Грузоперевозки' },
  'yuk-tashish': { uz: 'Yuk tashish', ru: 'Грузоперевозки' },
  'konditsioner': { uz: 'Konditsioner', ru: 'Кондиционеры' },
  'maishiy-texnika': { uz: 'Maishiy texnika', ru: 'Бытовая техника' },
  'qurilish': { uz: 'Qurilish va Mahsulotlar', ru: 'Строительство и Материалы' },
  'gozallik': { uz: "Go'zallik va Salomatlik", ru: 'Красота и Здоровье' },
  'talim': { uz: "Ta'lim va Repetitorlik", ru: 'Образование и Репетиторы' },
  'temirchilik': { uz: 'Temirchilik', ru: 'Кузнечное дело' },
  'oquv markazi': { uz: "O'quv markazi", ru: 'Учебный центр' },
  'restoran': { uz: 'Restoran & Kafe', ru: 'Ресторан и Кафе' },
  'kafe': { uz: 'Restoran & Kafe', ru: 'Ресторан и Кафе' },
  'shifokor': { uz: 'Shifokor', ru: 'Врач' },
  'repetitor': { uz: 'Repetitor', ru: 'Репетитор' },
  'dasturchi': { uz: 'Dasturchi', ru: 'Программист' },
  'mehmonxona': { uz: 'Mehmonxona', ru: 'Гостиница' },
};

export const subCategorySlugMap: Record<string, { uz: string; ru: string }> = {
  'santexnik': { uz: 'Santexnika xizmatlari', ru: 'Сантехнические услуги' },
  'santexnika': { uz: 'Santexnika xizmatlari', ru: 'Сантехнические услуги' },
  'elektrik': { uz: 'Elektr montaj', ru: 'Электромонтаж' },
  'elektr': { uz: 'Elektr montaj', ru: 'Электромонтаж' },
  'yevro-tamir': { uz: "Yevro ta'mir va pardoz", ru: 'Евроремонт и отделка' },
  'kafelchi': { uz: 'Kafel va bruschatka', ru: 'Кафель и брусчатка' },
  'kafel': { uz: 'Kafel va bruschatka', ru: 'Кафель и брусчатка' },
  'svarka': { uz: 'Payvandlash (Svarka)', ru: 'Сварочные работы (Сварка)' },
  'yuk-tashish': { uz: 'Yuk tashish (Labo, Damas, Gazel)', ru: 'Грузоперевозки (Лабо, Дамас, Газель)' },
  'avto-diagnostika': { uz: 'Avto elektr va diagnostika', ru: 'Автоэлектрика и диагностика' },
  'avto-ijara': { uz: 'Avtomobil ijarasi', ru: 'Аренда автомобилей' },
  'detailing': { uz: 'Avtomoyka va Detailing', ru: 'Автомойка и Детейлинг' },
  'konditsioner': { uz: 'Konditsioner ustasi', ru: 'Мастер кондиционеров' },
  'muzlatgich-kir-yuvish': { uz: 'Muzlatgich va Kir yuvish', ru: 'Холодильники и Стиральные машины' },
  'gaz-kotyol': { uz: 'Gaz plita va Isitish kotyollari', ru: 'Газовые плиты и Котлы отопления' },
  'gisht-terish': { uz: "G'isht va Blok terish", ru: 'Кладка кирпича и блоков' },
  'tom-yopish': { uz: 'Tom yopish ustalari', ru: 'Кровельные работы' },
  'sartarosh': { uz: 'Sartaroshlik va Stilist', ru: 'Парикмахер и Стилист' },
  'vizaj': { uz: "To'y va Kecha pardozlari", ru: 'Свадебный и вечерний макияж' },
  'ingliz-tili': { uz: 'Ingliz tili (IELTS / CEFR)', ru: 'Английский язык (IELTS / CEFR)' },
  'matematika': { uz: 'Matematika va Fizika', ru: 'Математика и Физика' },
  'oquv markazi': { uz: "O'quv markazi", ru: 'Учебный центр' },
  'restoran': { uz: 'Restoran va Kafe', ru: 'Ресторан и Кафе' },
  'shifokor': { uz: 'Shifokor', ru: 'Врач' },
  'repetitor': { uz: 'Repetitor', ru: 'Репетитор' },
  'dasturchi': { uz: 'Dasturchi', ru: 'Программист' },
  'mehmonxona': { uz: 'Mehmonxona', ru: 'Гостиница' },
};

export const categoryDescMap: Record<string, { uz: string; ru: string }> = {
  'ustalar': {
    uz: "Santexnik, elektrik, pardozlash, yevro ta'mir ustalari",
    ru: "Мастера по сантехнике, электрике, отделке и евроремонту",
  },
  'avto': {
    uz: "Yuk tashish, avto ijara, diagnostika va ta'mirlash",
    ru: "Грузоперевозки, аренда авто, автодиагностика и ремонт",
  },
  'maishiy-texnika': {
    uz: "Konditsioner, muzlatgich, kir yuvish mashinalari",
    ru: "Кондиционеры, холодильники, стиральные машины",
  },
  'qurilish': {
    uz: "Uy qurish, poydevor, g'isht terish va tom yopish",
    ru: "Строительство домов, фундамент, кладка кирпича и кровля",
  },
  'gozallik': {
    uz: "Sartarosh, stilist, massaj va parvarish xizmatlari",
    ru: "Парикмахеры, стилисты, массаж и косметология",
  },
  'talim': {
    uz: "Tillar, aniq fanlar va maktabga tayyorlov",
    ru: "Иностранные языки, точные науки и подготовка к школе",
  },
};

function normalizeKey(str: string): string {
  return str.toLowerCase().trim().replace(/['`‘’ʻʼ]/g, '').replace(/[-_]/g, ' ');
}

export function getCategoryLocalizedName(nameOrSlug: string, lang: Language = 'uz'): string {
  if (!nameOrSlug) return '';
  const normalized = normalizeKey(nameOrSlug);
  for (const [key, val] of Object.entries(categorySlugMap)) {
    const normKey = normalizeKey(key);
    if (normalized === normKey || normalized.includes(normKey) || normKey.includes(normalized)) {
      return val[lang];
    }
  }
  return nameOrSlug;
}

export function getCategoryLocalizedDesc(slug: string, defaultDesc?: string | null, lang: Language = 'uz'): string {
  if (slug && categoryDescMap[slug]) {
    return categoryDescMap[slug][lang];
  }
  return defaultDesc || (lang === 'ru' ? 'Все специалисты и услуги по данному направлению' : "Ushbu yo'nalish bo'yicha barcha ustalar va xizmatlar");
}

export function getSubCategoryLocalizedName(slugOrName: string, lang: Language = 'uz'): string {
  if (!slugOrName) return '';
  const normalized = normalizeKey(slugOrName);
  for (const [key, val] of Object.entries(subCategorySlugMap)) {
    const normKey = normalizeKey(key);
    if (normalized === normKey || normalized.includes(normKey) || normKey.includes(normalized)) {
      return val[lang];
    }
  }
  return slugOrName;
}

export function getLocationLocalizedName(location: string, lang: Language = 'uz'): string {
  if (!location) return '';
  if (location === 'Barcha hududlar' || location === 'all') {
    return translations[lang].locations.all;
  }
  const locs = translations[lang].locations as Record<string, string>;
  return locs[location] || location;
}
