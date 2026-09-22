'use client';

import Link from 'next/link';
import {
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Smartphone,
  CreditCard,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RoadmapClient() {
  const { t, lang } = useLanguage();
  const pdfUrl = '/docs/XayrliIsh_TZ_va_Roadmap.pdf';

  const roadmapPhasesUz = [
    {
      number: '1',
      title: 'Xavfsizlik, Autentifikatsiya va Kriptografik Himoya',
      status: 'COMPLETED',
      statusLabel: 'Bajarildi (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Lock,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      description: 'Loyiha xavfsizligini ta\'minlash va ochiq ma\'lumotlar kamchiliklarini butunlay bartaraf etish.',
      deliverables: [
        'Admin parolini ochiq matn (plaintext) va cookie\'dan olib tashlash',
        'HMAC SHA-256 xavfsiz kriptografik sessiya tokeni va timing-safe taqqoslash',
        '5 ta noto\'g\'ri urinishdan so\'ng 15 daqiqalik Brute-Force blokirovkasi',
        'XSS (Cross-Site Scripting) hujumlariga qarshi HTML sanitization',
        'Admin login sahifasida ko\'rish/yashirish (Eye toggle) tugmasi',
      ],
    },
    {
      number: '2',
      title: 'Ma\'lumotlar Bazasi va Ko\'p Omillik Reyting Logikasi',
      status: 'COMPLETED',
      statusLabel: 'Bajarildi (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Database,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      description: 'Top 10 reyting tizimini boshqarish uchun Prisma va MongoDB ma\'lumotlar arxitekturasini kengaytirish.',
      deliverables: [
        'Prisma modeliga websiteUrl, adminRating, clientRating, paidTier, privilegeType, totalScore maydonlari',
        'lib/scoring.ts: 100 ballik adolatli matematik reyting formulasi',
        'totalScore, paidTier va isPrivileged bo\'yicha indeksatsiyalar',
        'Barcha 18 ta mavjud usta e\'lonlariga ballar va sinov toifalarini sinxronlash',
      ],
    },
    {
      number: '3',
      title: '"Top 10" Peshqadam Ustalari va Vizual UI/UX Standartlari',
      status: 'COMPLETED',
      statusLabel: 'Bajarildi (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Award,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/40',
      description: 'Foydalanuvchi chizmasi bo\'yicha ikki rejimli interfeys, zarhal o\'rin nishonlari va veb-sayt havolalari.',
      deliverables: [
        'ModeTabSwitcher: "Umumiy Katalog" va "Top 10 Reyting" ikkitalik boshqaruv paneli',
        '#1 Oltin Usta (zarhal gradient, toj, pulsatsiya), #2 Kumush, #3 Bronza, #4-#10 nishonlari',
        '👑 VIP Homiylik va 🛡️ Imtiyozli Usta maxsus badjlari',
        '🌐 Veb-sayt / Manzil tugmasi: Ustanining portfolioga to\'g\'ridan-to\'g\'ri yo\'naltiruvchi havola',
        'Uz | Ru haqiqiy til almashtirgich bayroqchalari bilan va mobil bottom navigation',
      ],
    },
    {
      number: '4',
      title: 'Admin Boshqaruv Markazi va Tezkor Reyting Nazorati',
      status: 'COMPLETED',
      statusLabel: 'Bajarildi (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Layers,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50/30',
      description: 'Xodimlar bahosi, homiylik va imtiyozlarni to\'g\'ridan-to\'g\'ri boshqarish imkoniyatlari.',
      deliverables: [
        'Har bir usta kartochkasida Xodim bahosini tanlash (3.0 ★ dan 5.0 ★ gacha)',
        'Tarif va Homiylik darajasini tanlash (Oddiy, Standart Homiy, VIP Gold)',
        'Ijtimoiy imtiyozlarni biriktirish (Nogironlik, Yoshlar, Faxriy, Himoya)',
        'Barcha e\'lonlarning ballarini bir tugma bilan sinxronlash ("Ballarni Sinxronlash")',
        'Verified (Ko\'k galochka) statusini berish va bekor qilish',
      ],
    },
    {
      number: '5',
      title: 'Onlayn To\'lov Tizimlari va SMS Telefon Verifikatsiyasi',
      status: 'NEXT',
      statusLabel: 'Keyingi Bosqich (Rejada)',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CreditCard,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50/30',
      description: 'Ustalarga avtomatik tarzda VIP Homiylik sotib olish va telefon raqamini tasdiqlash imkonini berish.',
      deliverables: [
        'Click va Payme to\'lov shlyuzlari integratsiyasi (VIP tariflarini avtomatik faollashtirish)',
        'Usta e\'lon joylashda telefon raqamiga SMS OTP kod yuborish orqali tasdiqlash',
        'Homiylik muddati (7 kun, 30 kun) tugaganda avtomatik bildirishnoma va muddatni uzaytirish',
        'To\'lov cheklari va hisob-fakturalarni avtomatik PDF formatida shakllantirish',
      ],
    },
    {
      number: '6',
      title: 'Telegram Bot va Mobil Ilova (PWA / React Native)',
      status: 'PLANNED',
      statusLabel: 'Kelgusi Reja',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Smartphone,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-50',
      description: 'Foydalanuvchilar va ustalar o\'rtasidagi aloqani tezlashtirish va mobil qulaylik yaratish.',
      deliverables: [
        'Ustalar uchun Telegram bildirishnoma boti (yangi qo\'ng\'iroq va sharhlar haqida tezkor xabar)',
        'Mijozlar uchun offline ishlovchi PWA va mobil ilova ko\'rinishi',
        'GPS geolokatsiya orqali xaritada eng yaqin ustani aniqlash',
        'Mijoz va usta o\'rtasida platforma ichida xavfsiz chat va shartnoma moduli',
      ],
    },
  ];

  const roadmapPhasesRu = [
    {
      number: '1',
      title: 'Безопасность, Аутентификация и Криптографическая Защита',
      status: 'COMPLETED',
      statusLabel: 'Выполнено (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Lock,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      description: 'Обеспечение безопасности проекта и полное устранение уязвимостей открытых данных.',
      deliverables: [
        'Удаление пароля администратора из открытого текста (plaintext) и cookies',
        'Безопасный криптографический сессионный токен HMAC SHA-256 с timing-safe проверкой',
        'Блокировка Brute-Force атак на 15 минут после 5 неверных попыток',
        'Санитизация HTML против XSS-уязвимостей',
        'Кнопка показать/скрыть пароль на странице входа администратора',
      ],
    },
    {
      number: '2',
      title: 'База Данных и Многофакторная Логика Рейтинга',
      status: 'COMPLETED',
      statusLabel: 'Выполнено (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Database,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      description: 'Расширение архитектуры Prisma и MongoDB для управления рейтинговой системой Топ 10.',
      deliverables: [
        'Поля websiteUrl, adminRating, clientRating, paidTier, privilegeType, totalScore в Prisma',
        'lib/scoring.ts: Справедливая математическая 100-балльная формула оценки',
        'Индексы базы данных по totalScore, paidTier и isPrivileged',
        'Синхронизация баллов и тестовых статусов по всем 18 существующим объявлениям',
      ],
    },
    {
      number: '3',
      title: '"Топ 10" Ведущих Мастеров и Визуальные Стандарты UI/UX',
      status: 'COMPLETED',
      statusLabel: 'Выполнено (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Award,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/40',
      description: 'Двухрежимный интерфейс по эскизу, золотые значки мест и ссылки на веб-сайты мастеров.',
      deliverables: [
        'ModeTabSwitcher: Двойная панель "Общий Каталог" и "Топ 10 Рейтинг"',
        '#1 Золотой Мастер (градиент, корона, пульсация), #2 Серебро, #3 Бронза, #4-#10 значки',
        '👑 VIP Спонсор и 🛡️ Мастер со льготами - специальные бейджи',
        '🌐 Кнопка Веб-сайта: Прямой переход в портфолио специалиста',
        'Настоящий переключатель языков Uz | Ru с флагами и мобильная панель навигации',
      ],
    },
    {
      number: '4',
      title: 'Центр Управления Администратора и Мониторинг Рейтинга',
      status: 'COMPLETED',
      statusLabel: 'Выполнено (100%)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Layers,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50/30',
      description: 'Инструменты прямого управления оценками персонала, спонсорством и льготами.',
      deliverables: [
        'Выбор оценки сотрудника для каждого мастера (от 3.0 ★ до 5.0 ★)',
        'Выбор тарифа и уровня спонсорства (Обычный, Стандартный Спонсор, VIP Gold)',
        'Назначение социальных льгот (Инвалидность, Молодежь, Ветеран, Госзащита)',
        'Синхронизация баллов всех объявлений одной кнопкой ("Синхронизировать")',
        'Выдача и отзыв статуса Проверен (Синяя галочка Verified)',
      ],
    },
    {
      number: '5',
      title: 'Платежные Системы и SMS-Верификация Номеров',
      status: 'NEXT',
      statusLabel: 'Следующий Этап (В плане)',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CreditCard,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50/30',
      description: 'Автоматическая покупка VIP-тарифов мастерами и верификация номеров телефонов.',
      deliverables: [
        'Интеграция шлюзов Click и Payme (автоактивация VIP-тарифов)',
        'Подтверждение номера телефона при подаче объявления через SMS OTP-код',
        'Автоматические уведомления и продление спонсорства по истечении срока',
        'Генерация фискальных чеков и счетов в формате PDF',
      ],
    },
    {
      number: '6',
      title: 'Telegram-Бот и Мобильное Приложение (PWA / React Native)',
      status: 'PLANNED',
      statusLabel: 'Будущий План',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Smartphone,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-50',
      description: 'Ускорение связи между заказчиками и мастерами, максимальное удобство на смартфонах.',
      deliverables: [
        'Telegram-бот уведомлений для мастеров (мгновенные оповещения о звонках и отзывах)',
        'Офлайн PWA и нативное мобильное приложение для клиентов',
        'GPS-геолокация для поиска ближайшего мастера на карте',
        'Модуль безопасного чата и договоров между клиентом и мастером внутри платформы',
      ],
    },
  ];

  const roadmapPhases = lang === 'ru' ? roadmapPhasesRu : roadmapPhasesUz;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. Yuqori Hero Blok va Hujjat Sarlavhasi */}
        <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>{t.roadmap.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                {t.roadmap.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t.roadmap.subtitle}
              </p>
            </div>

            {/* PDF Hujjatini Yuklab Olish va Ko'rish Tugmalari */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <a
                href={pdfUrl}
                download="XayrliIsh_TZ_va_Roadmap.pdf"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold text-xs sm:text-sm shadow-md transition-all touch-manipulation shrink-0"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{t.roadmap.downloadPdf}</span>
              </a>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs sm:text-sm border border-border active:scale-95 transition-all touch-manipulation shrink-0"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>{t.roadmap.openPdf}</span>
              </a>
            </div>
          </div>

          {/* Hujjat parametrlari */}
          <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block">{lang === 'ru' ? "Тип документа:" : "Hujjat turi:"}</span>
              <span className="font-bold text-foreground">{lang === 'ru' ? "Техническое задание (ТЗ / PRD)" : "Texnik Topshiriq (TZ / PRD)"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">{lang === 'ru' ? "Проект:" : "Loyiha:"}</span>
              <span className="font-bold text-foreground">TopBaza.uz (Prod v2.0)</span>
            </div>
            <div>
              <span className="text-muted-foreground block">{lang === 'ru' ? "Модель рейтинга:" : "Reyting modeli:"}</span>
              <span className="font-bold text-primary">{lang === 'ru' ? "Многофакторная (100 баллов)" : "Ko'p omillik (100 ball)"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">{lang === 'ru' ? "Статус:" : "Holati:"}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {lang === 'ru' ? "Утверждено и Запущено" : "Tasdiqlangan & Ishga tushgan"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Reyting Formulasi Tushuntirishi (Interaktiv Quti) */}
        <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {t.roadmap.formulaTitle}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t.roadmap.formulaSubtitle}
              </p>
            </div>
          </div>

          {/* Matematik Formula Bloki */}
          <div className="p-4 sm:p-5 rounded-2xl bg-secondary/60 border border-border text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              {lang === 'ru' ? "Финальная Формула Индекса" : "Yakuniy Indeks Formula"}
            </span>
            <code className="text-sm sm:text-base lg:text-lg font-black text-foreground tracking-wide break-words">
              TotalScore = S_xodim (40) + S_mijoz (25) + S_homiy (20) + S_imtiyoz (15) + S_profil (5)
            </code>
          </div>

          {/* 5 ta ustun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  {lang === 'ru' ? "Макс: 40 баллов" : "Maks: 40 ball"}
                </span>
                <h3 className="font-bold text-sm text-foreground mt-2">{lang === 'ru' ? "1. Оценка Сотрудника" : "1. Xodim Bahosi"}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === 'ru'
                    ? "Заключение модератора по квалификации, инструменту и портфолио мастера (1-5 звезд)."
                    : "Mutaxassislik guvohnomasi, asboblari va portfoliosi bo'yicha xodim xulosasi (1-5 yulduz)."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-2 block">
                Formula: Rating × 8
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  {lang === 'ru' ? "Макс: 25 баллов" : "Maks: 25 ball"}
                </span>
                <h3 className="font-bold text-sm text-foreground mt-2">{lang === 'ru' ? "2. Оценка Клиента" : "2. Mijoz Bahosi"}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === 'ru'
                    ? "Оценки реальных клиентов (1-5) плюс бонус за количество подтвержденных отзывов."
                    : "Haqiqiy buyurtmachilar bahosi (1-5) va tasdiqlangan sharhlar soni bonusi."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2 block">
                Formula: Rating × 4 + bonus
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {lang === 'ru' ? "Макс: 20 баллов" : "Maks: 20 ball"}
                </span>
                <h3 className="font-bold text-sm text-foreground mt-2">{lang === 'ru' ? "3. VIP Спонсорство" : "3. VIP Homiylik"}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === 'ru'
                    ? "Тариф VIP Gold (+20 баллов) или Standard (+10 баллов). Действует определенный период."
                    : "VIP Gold tarifi (+20 ball) yoki Standard tarifi (+10 ball). Muddatli amal qiladi."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-primary mt-2 block">
                👑 {t.card.vipBadge}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {lang === 'ru' ? "Макс: 15 баллов" : "Maks: 15 ball"}
                </span>
                <h3 className="font-bold text-sm text-foreground mt-2">{lang === 'ru' ? "4. Бонус Льгот" : "4. Imtiyoz Bonusi"}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === 'ru'
                    ? "Социальная поддержка мастеров с ограниченными возможностями, молодых специалистов и ветеранов."
                    : "Nogironligi bor mohir ustalar, yosh tadbirkorlar va faxriy ustalarga ijtimoiy ko'mak."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 block">
                🛡️ {t.card.privilegeBadge}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {lang === 'ru' ? "Макс: 5 баллов" : "Maks: 5 ball"}
                </span>
                <h3 className="font-bold text-sm text-foreground mt-2">{lang === 'ru' ? "5. Профиль и URL" : "5. Profil va URL"}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === 'ru'
                    ? "Наличие официального веб-сайта / ссылки на портфолио (+3) и подтвержденного статуса (+2)."
                    : "Rasmiy veb-sayt / portfolio havolasi (+3) va Verified statusi (+2) mavjudligi."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground mt-2 block">
                🌐 {t.card.website}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Interaktiv Rivojlantirish Yo'l Xaritasi (Roadmap) */}
        <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span>{t.roadmap.roadmapTitle}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
                  {t.roadmap.roadmapProgress}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {lang === 'ru'
                  ? "Реализованные этапы платформы TopBaza.uz и дальнейший план развития"
                  : "TopBaza.uz platformasining amalga oshirilgan bosqichlari va kelgusi rejasi"}
              </p>
            </div>

            <Link
              href="/"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 active:scale-95 shrink-0"
            >
              <span>{lang === 'ru' ? "Смотреть каталог" : "Katalogni ko'rish"}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

          {/* Bosqichlar Ro'yxati */}
          <div className="space-y-4">
            {roadmapPhases.map((phase) => {
              const IconComp = phase.icon;
              return (
                <div
                  key={phase.number}
                  className="p-5 sm:p-6 rounded-2xl border border-border bg-secondary/20 transition-all hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-2xs">
                        <IconComp className={`w-5 h-5 ${phase.iconColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                            {lang === 'ru' ? `Этап ${phase.number}` : `${phase.number}-Bosqich`}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                          {phase.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${phase.badgeColor} shrink-0 self-start sm:self-auto`}
                    >
                      {phase.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : phase.status === 'NEXT' ? (
                        <Clock className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span>{phase.statusLabel}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                    {phase.description}
                  </p>

                  {/* Vazifalar ro'yxati */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-border">
                    {phase.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            phase.status === 'COMPLETED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                          }`}
                        />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. O'rnatilgan PDF Ko'rish Qutisi (Embedded PDF Viewer) */}
        <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {t.roadmap.pdfViewerTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={pdfUrl}
                download="XayrliIsh_TZ_va_Roadmap.pdf"
                className="text-xs font-bold text-primary hover:opacity-80 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 active:scale-95 transition-all touch-manipulation shrink-0"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>{t.roadmap.downloadPdf}</span>
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border active:scale-95 transition-all touch-manipulation shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>{t.roadmap.openPdf}</span>
              </a>
            </div>
          </div>

          <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-border bg-muted/20">
            <iframe
              src={`${pdfUrl}#toolbar=1`}
              className="w-full h-full border-none"
              title="TopBaza.uz Texnik Topshiriq va Yo'l Xaritasi PDF"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
