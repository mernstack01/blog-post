export type Language = 'uz' | 'ru';

export const translations = {
  uz: {
    // Navigatsiya
    nav: {
      home: "Bosh sahifa",
      general: "Umumiy",
      top10: "Top 10 Reyting",
      catalog: "Katalog",
      roadmap: "Yo'l Xaritasi (TZ)",
      admin: "Admin",
      newListing: "E'lon berish",
      regions: "Guliston & Tumanlar",
      selectLanguage: "Tilni tanlang",
    },

    // Hero Qidiruv
    hero: {
      title1: "Sirdaryoning yagona ma'lumotlar bazasi:",
      titleHighlight: "Kadrlar, Maskonlar va Xizmatlar",
      subtitle: "Har qanday kasbdagi mutaxassislar, o'quv markazlari, restoranlar, shifoxonalar va barcha xizmatlar bir joyda — kerakli ma'lumotni tez va qulay toping!",
      searchPlaceholder: "Kasb, mutaxassis, restoran, o'quv markazi yoki xizmat qidiring (masalan: o'qituvchi, kafe, shifokor)...",
      allRegions: "Barcha hududlar",
      searchBtn: "Qidirish",
      popularSearch: "Ko'p qidirilayotganlar:",
    },

    // Kategoriyalar
    categories: {
      all: "Barcha xizmatlar",
      plumbing: "Santexnika",
      electric: "Elektrik",
      renovation: "Remont va qurilish",
      auto: "Avto ta'mir",
      transport: "Yuk tashish",
      ac: "Konditsioner",
      appliances: "Maishiy texnika",
      blacksmith: "Temirchilik",
      popularTitle: "Ommabop Yo'nalishlar",
    },

    // Sirdaryo Tumanlari
    locations: {
      all: "Barcha hududlar",
      'Guliston shahri': "Guliston shahri",
      'Yangiyer shahri': "Yangiyer shahri",
      'Shirin shahri': "Shirin shahri",
      'Boyovut tumani': "Boyovut tumani",
      'Guliston tumani': "Guliston tumani",
      'Sayxunobod tumani': "Sayxunobod tumani",
      'Mirzaobod tumani': "Mirzaobod tumani",
      'Oqoltin tumani': "Oqoltin tumani",
      'Sardoba tumani': "Sardoba tumani",
      'Xovos tumani': "Xovos tumani",
      'Sirdaryo tumani': "Sirdaryo tumani",
    },

    // Rejim Tanlagich (Mode Switcher)
    mode: {
      allTab: "Umumiy Baza",
      top10Tab: "Top 10 Reyting",
      allDesc: "Umumiy: Sirdaryo bo'yicha barcha kadrlar, maskonlar va xizmatlar ma'lumotlar bazasi",
      top10Desc: "Top 10: Xodimlar bahosi, faollik va ishonchlilik bo'yicha saralangan yetakchilar doskasi",
    },

    // E'lonlar Gridi
    grid: {
      titleAll: "Kadrlar, maskonlar va barcha xizmatlar",
      titleTop10: "🏆 Top 10 Yetakchi Mutaxassislar va Joylar",
      descAll: "Sirdaryo viloyati va O'zbekiston bo'yicha saralangan mutaxassislar, tashkilotlar va maskanlar",
      descTop10: "Xodimlar xulosasi (40 ball), mijozlar bahosi (25 ball), homiylik (20 ball) va imtiyozlar (15 ball) asosida saralangan rasmiy yetakchilar doskasi",
      sortedByScore: "Jami ball bo'yicha saralangan",
      sortLabel: "Saralash:",
      sortPopular: "Eng ommabop (Ko'rishlar)",
      sortRating: "Yuqori reyting (5.0 ★)",
      sortNewest: "Eng yangi e'lonlar",
      countUnit: "ta",
      notFoundTitle: "Hech qanday e'lon topilmadi",
      notFoundDesc: "Tanlangan mezonlar yoki qidiruv so'zi bo'yicha hech qanday ma'lumot topilmadi. Qidiruvni o'zgartirib ko'ring yoki barcha e'lonlarni ko'ring.",
      resetFilters: "Filtrlarni tozalash",
    },

    // Usta Kartochkasi
    card: {
      goldMaster: "#1 OLTIN USTA",
      silverMaster: "#2 KUMUSH",
      bronzeMaster: "#3 BRONZA",
      rankPlace: "O'RIN",
      vipBadge: "VIP Homiylik",
      sponsorBadge: "Homiylik",
      privilegeBadge: "Imtiyozli Usta",
      scoreLabel: "Ball:",
      verified: "Tasdiqlangan mutaxassis",
      priceLabel: "Xizmat narxi",
      negotiable: "Kelishilgan holda",
      details: "Batafsil",
      call: "Qo'ng'iroq",
      telegram: "TG",
      website: "Veb-sayt",
      profile: "Profil",
      experience: "tajriba",
      views: "marta ko'rilgan",
    },

    // E'lon Tafsiloti
    detail: {
      verifiedBadge: "Tasdiqlangan Usta",
      masterTitle: "Usta / Mutaxassis",
      ratingsCount: "ta baho",
      serviceLocation: "Xizmat ko'rsatish hududi:",
      startingPrice: "Boshlang'ich narxi:",
      aboutService: "Xizmat haqida to'liq ma'lumot",
      directContact: "To'g'ridan-to'g'ri aloqaga chiqish:",
      callMaster: "Qo'ng'iroq qilish:",
      writeTelegram: "Telegram orqali yozish",
      noTelegram: "Telegram mavjud emas",
      viewInstagram: "Instagram sahifasini ko'rish",
      officialWebsite: "Rasmiy Veb-sayt / Havola:",
      shareLink: "E'lon havolasini ulashish",
      linkCopied: "Havola nusxalandi!",
      backHome: "Bosh sahifaga qaytish",
      relatedTitle: "O'xshash boshqa xizmatlar",
      seeAll: "Barchasini ko'rish →",
      quickCall: "Qo'ng'iroq",
      quickTG: "Telegram",
    },

    // Yangi E'lon Berish
    newListing: {
      pageTitle: "Yangi e'lon berish",
      pageSubtitle: "O'z xizmatlaringizni Sirdaryo aholisiga taqdim eting",
      step1Title: "Xizmat yoki Usta haqida ma'lumot",
      step1Subtitle: "Mijozlar sizni tezroq va oson topishi uchun sarlavha va yo'nalishni kiriting",
      titleLabel: "E'lon sarlavhasi",
      titlePlaceholder: "Masalan: Uylar uchun sifatli santexnika va isitish tizimlari montaji",
      nameLabel: "Ism-familiyangiz yoki Firma nomi",
      namePlaceholder: "Masalan: Usta Otabek yoki Guliston Climat",
      locationLabel: "Sirdaryo shahri / tumani",
      categoryLabel: "Asosiy Kategoriya",
      subCategoryLabel: "Ichki yo'nalish (Ixtiyoriy)",
      addressLabel: "Aniqroq manzil yoki mo'ljal",
      addressPlaceholder: "Masalan: 3-mavze, Sayxun restorani ro'parasida",
      step2Title: "Bog'lanish va Xizmat narxlari",
      step2Subtitle: "Mijozlar to'g'ridan-to'g'ri telefon yoki messenjer orqali qo'ng'iroq qilishadi",
      phoneLabel: "Telefon raqamingiz",
      telegramLabel: "Telegram username",
      telegramPlaceholder: "@usta_sirdaryo yoki link",
      instagramLabel: "Instagram sahifa (ixtiyoriy)",
      priceLabel: "Xizmat narxi",
      pricePlaceholder: "Masalan: 100,000 so'mdan yoki Kelishilgan",
      experienceLabel: "Ish tajribasi",
      experiencePlaceholder: "Masalan: 5 yil yoki 10 yillik professional tajriba",
      websiteLabel: "Veb-sayt yoki Portfolioga havola (ixtiyoriy)",
      websitePlaceholder: "https://usta-xizmati.uz yoki portfolioga havola",
      step3Title: "Tavsif va Mutaxassis rasmi",
      step3Subtitle: "Qiladigan ishlaringizni batafsil tushuntiring va mos rasmni tanlang",
      descriptionLabel: "Batafsil tavsif",
      descriptionPlaceholder: "Xizmatlaringiz, qulayliklar, kafolat muddati haqida batafsil yozing (kamida 20 ta belgi)...",
      imageLabel: "E'lon uchun rasm (Tanlang yoki URL kiriting)",
      submitBtn: "E'lonni chop etish",
      submitting: "Yuborilmoqda...",
    },

    // Admin Yangi Post
    admin: {
      backToAdmin: "Admin panelga qaytish",
      adminMode: "Admin Rejimi (Avto-tasdiqlash faol)",
      quickPostBadge: "Admin Tezkor Post Yaratish",
      addNewPostTitle: "Yangi Usta yoki Xizmat Postini Qo'shish",
      addNewPostSubtitle: "Siz admin sifatida yaratgan ushbu post darhol tasdiqlanadi va Sirdaryo ahli uchun asosiy sahifada eng yuqori o'rinda ko'rinadi.",
    },

    // Mobil Pastki Menyu (Bottom Nav)
    bottomNav: {
      home: "Bosh sahifa",
      top10: "Top 10",
      post: "E'lon berish",
      catalog: "Katalog",
      roadmap: "Yo'l xaritasi",
    },

    // Pastki Qism (Footer)
    footer: {
      about: "Guliston shahri va unga tutash barcha tumanlar aholisi uchun eng qulay mahalliy ustalar, avtomobil va maishiy xizmatlar portali.",
      districtsTitle: "Viloyat shahar va tumanlari",
      forUsers: "Foydalanuvchilar uchun",
      postFree: "+ Yangi e'lon berish (bepul)",
      top10Board: "Top 10 Reyting doskasi",
      roadmapTitle: "Yo'l xaritasi & TZ (Roadmap)",
      downloadPdf: "PDF Hujjatni yuklab olish",
      catalogAll: "Barcha xizmatlar katalogi",
      adminControl: "Admin Boshqaruv",
      loginSystem: "Tizimga kirish",
      allRights: "Barcha huquqlar himoyalangan.",
      safetyNote: "Xavfsizlik eslatmasi: Usta bilan shartnomalarni to'g'ridan-to'g'ri joyida tuzing.",
    },

    // Yo'l Xaritasi (Roadmap)
    roadmap: {
      badge: "Rasmiy Hujjat & Yo'l Xaritasi",
      title: "Texnik Topshiriq (TZ) va Rivojlantirish Yo'l Xaritasi",
      subtitle: "XayrliIsh.uz platformasining 'Top 10' peshqadam ustalari reytingi, ko'p omillik baholash formulasi hamda bosqichma-bosqich rivojlanish rejasi.",
      downloadPdf: "PDF Hujjatni Yuklab Olish",
      openPdf: "PDF ni Yangi Oynada Ochish",
      formulaTitle: "Adolatli Ko'p Omillik Reyting Formulasi (100 Ballik Tizim)",
      formulaSubtitle: "Top 10 talikda o'rinlarni belgilovchi 5 ta asosiy mustaqil koeffitsient",
      roadmapTitle: "Loyiha Rivojlantirish Yo'l Xaritasi (Roadmap)",
      roadmapProgress: "4/6 Bajarildi",
      pdfViewerTitle: "Rasmiy PDF Hujjat (Ko'rish oynasi)",
    },

    // Katalog Sahifasi
    catalogPage: {
      backHome: "Bosh sahifaga qaytish",
      title: "Barcha xizmatlar va yo'nalishlar",
      subtitle: "O'zingizga kerakli sohani tanlang va Sirdaryo hamda butun O'zbekistonning eng yaxshi mutaxassislari bilan bog'laning",
      listingsCount: "ta e'lon",
      subCount: "ta",
      defaultCategoryDesc: "Ushbu yo'nalish bo'yicha barcha ustalar va xizmatlar",
      viewAllInSection: "Bo'limdagi barcha mutaxassislarni ko'rish",
    },

    // Statistika Bo'limi
    stats: {
      whyTitle: "Nega aynan XayrliIsh.uz?",
      whySubtitle: "Aholiga qulaylik yaratish maqsadida yaratilgan ochiq va shaffof ustalar portali. Barcha raqamlar real vaqtda yangilanadi.",
      districtsLabel: "Shahar va Tumanlar",
      districtsDesc: "Guliston, Yangiyer, Shirin va barcha tumanlar",
      specialistsLabel: "Faol Mutaxassislar",
      specialistsDesc: "Platformada ro'yxatdan o'tgan haqiqiy ustalar",
      commissionLabel: "Bepul Aloqa",
      commissionVal: "0% Komissiya",
      commissionDesc: "Usta bilan to'g'ridan-to'g'ri bog'lanish",
      verifiedLabel: "Tasdiqlangan Profillar",
      verifiedVal: "Tekshirilgan",
      verifiedDesc: "Hujjat va telefon raqami tasdiqlangan",
      countUnit: "ta",
    },
  },

  ru: {
    // Навигация
    nav: {
      home: "Главная",
      general: "Общий",
      top10: "Топ 10 Рейтинг",
      catalog: "Каталог",
      roadmap: "Дорожная Карта (ТЗ)",
      admin: "Админ",
      newListing: "Подать объявление",
      regions: "Гулистан и Районы",
      selectLanguage: "Выберите язык",
    },

    // Главный Поиск
    hero: {
      title1: "Единая база Сырдарьи и Узбекистана:",
      titleHighlight: "Кадры, Заведения и Все Услуги",
      subtitle: "Специалисты любой профессии, рестораны, учебные центры, клиники и места отдыха — находите нужную информацию легко и быстро!",
      searchPlaceholder: "Профессия, специалист, кафе, учебный центр или услуга (например: врач, учитель, кафе)...",
      allRegions: "Все районы",
      searchBtn: "Найти",
      popularSearch: "Часто ищут:",
    },

    // Категории
    categories: {
      all: "Все услуги",
      plumbing: "Сантехника",
      electric: "Электрика",
      renovation: "Ремонт и стройка",
      auto: "Авторемонт",
      transport: "Грузоперевозки",
      ac: "Кондиционеры",
      appliances: "Бытовая техника",
      blacksmith: "Кузнечное дело",
      popularTitle: "Популярные Категории",
    },

    // Районы Сырдарьи
    locations: {
      all: "Все районы",
      'Guliston shahri': "г. Гулистан",
      'Yangiyer shahri': "г. Янгиер",
      'Shirin shahri': "г. Ширин",
      'Boyovut tumani': "Баяутский район",
      'Guliston tumani': "Гулистанский район",
      'Sayxunobod tumani': "Сайхунабадский район",
      'Mirzaobod tumani': "Мирзаабадский район",
      'Oqoltin tumani': "Акалтынский район",
      'Sardoba tumani': "Сардобинский район",
      'Xovos tumani': "Хавастский район",
      'Sirdaryo tumani': "Сырдарьинский район",
    },

    // Переключатель Режима (Mode Switcher)
    mode: {
      allTab: "Общая База",
      top10Tab: "Топ 10 Рейтинг",
      allDesc: "Общий: Полная база данных специалистов, заведений и сервисов по Сырдарье",
      top10Desc: "Топ 10: Доска лидеров на основе оценок персонала, VIP-статуса и отзывов",
    },

    // Сетка Объявлений
    grid: {
      titleAll: "Все специалисты, заведения и услуги",
      titleTop10: "🏆 Топ 10 Ведущих Кадров и Заведений",
      descAll: "Каталог проверенных специалистов, заведений и сервисов Сырдарьинской области",
      descTop10: "Официальная доска лидеров на основе оценки персонала (40 б.), отзывов клиентов (25 б.), спонсорства (20 б.) и льгот (15 б.)",
      sortedByScore: "Отсортировано по общему баллу",
      sortLabel: "Сортировка:",
      sortPopular: "По популярности (Просмотры)",
      sortRating: "Высокий рейтинг (5.0 ★)",
      sortNewest: "Сначала новые",
      countUnit: "объявл.",
      notFoundTitle: "Объявлений не найдено",
      notFoundDesc: "По заданным критериям или поисковому запросу ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры.",
      resetFilters: "Сбросить фильтры",
    },

    // Карточка Мастера
    card: {
      goldMaster: "#1 ЗОЛОТОЙ МАСТЕР",
      silverMaster: "#2 СЕРЕБРО",
      bronzeMaster: "#3 БРОНЗА",
      rankPlace: "МЕСТО",
      vipBadge: "VIP Спонсор",
      sponsorBadge: "Спонсор",
      privilegeBadge: "Мастер со льготами",
      scoreLabel: "Балл:",
      verified: "Проверенный специалист",
      priceLabel: "Стоимость",
      negotiable: "По договоренности",
      details: "Подробнее",
      call: "Позвонить",
      telegram: "ТГ",
      website: "Веб-сайт",
      profile: "Профиль",
      experience: "опыт",
      views: "просмотров",
    },

    // Детали Объявления
    detail: {
      verifiedBadge: "Проверенный Мастер",
      masterTitle: "Мастер / Специалист",
      ratingsCount: "оценок",
      serviceLocation: "Территория обслуживания:",
      startingPrice: "Начальная цена:",
      aboutService: "Полная информация об услуге",
      directContact: "Связаться напрямую:",
      callMaster: "Позвонить:",
      writeTelegram: "Написать в Telegram",
      noTelegram: "Telegram не указан",
      viewInstagram: "Посмотреть профиль в Instagram",
      officialWebsite: "Официальный сайт / Ссылка:",
      shareLink: "Поделиться объявлением",
      linkCopied: "Ссылка скопирована!",
      backHome: "Вернуться на главную",
      relatedTitle: "Похожие другие услуги",
      seeAll: "Смотреть все →",
      quickCall: "Позвонить",
      quickTG: "Telegram",
    },

    // Подача Нового Объявления
    newListing: {
      pageTitle: "Подать новое объявление",
      pageSubtitle: "Предложите свои услуги жителям Сырдарьинской области",
      step1Title: "Информация об услуге или мастере",
      step1Subtitle: "Укажите название и сферу деятельности, чтобы клиенты быстрее вас находили",
      titleLabel: "Заголовок объявления",
      titlePlaceholder: "Например: Качественный монтаж сантехники и отопления для домов",
      nameLabel: "Ваше имя или название компании",
      namePlaceholder: "Например: Мастер Отабек или Гулистан Климат",
      locationLabel: "Город / район Сырдарьи",
      categoryLabel: "Основная категория",
      subCategoryLabel: "Поднаправление (Необязательно)",
      addressLabel: "Точный адрес или ориентир",
      addressPlaceholder: "Например: 3-й микрорайон, напротив ресторана Сайхун",
      step2Title: "Контакты и стоимость услуг",
      step2Subtitle: "Клиенты свяжутся с вами напрямую по телефону или в мессенджерах",
      phoneLabel: "Номер телефона",
      telegramLabel: "Имя пользователя Telegram",
      telegramPlaceholder: "@usta_sirdaryo или ссылка",
      instagramLabel: "Страница Instagram (необязательно)",
      priceLabel: "Стоимость услуги",
      pricePlaceholder: "Например: от 100 000 сум или По договоренности",
      experienceLabel: "Опыт работы",
      experiencePlaceholder: "Например: 5 лет или 10 лет профессионального стажа",
      websiteLabel: "Веб-сайт или ссылка на портфолио (необязательно)",
      websitePlaceholder: "https://usta-xizmati.uz или ссылка на соцсети",
      step3Title: "Описание и фотография специалиста",
      step3Subtitle: "Подробно опишите ваши работы и выберите подходящую фотографию",
      descriptionLabel: "Подробное описание",
      descriptionPlaceholder: "Опишите ваши услуги, гарантии, используемое оборудование (не менее 20 символов)...",
      imageLabel: "Фотография для объявления (Выберите или укажите URL)",
      submitBtn: "Опубликовать объявление",
      submitting: "Публикация...",
    },

    // Админ Новый Пост
    admin: {
      backToAdmin: "Вернуться в админ-панель",
      adminMode: "Режим Администратора (Авто-одобрение)",
      quickPostBadge: "Быстрое Создание Поста (Админ)",
      addNewPostTitle: "Добавить Новую Услугу или Мастера",
      addNewPostSubtitle: "Созданное вами объявление будет мгновенно одобрено и отобразится на главной странице на высших позициях.",
    },

    // Мобильное Нижнее Меню (Bottom Nav)
    bottomNav: {
      home: "Главная",
      top10: "Топ 10",
      post: "Подать",
      catalog: "Каталог",
      roadmap: "Дорожная карта",
    },

    // Подвал (Footer)
    footer: {
      about: "Самый удобный портал местных мастеров, авто и бытовых услуг для жителей г. Гулистан и всех районов области.",
      districtsTitle: "Города и районы области",
      forUsers: "Для пользователей",
      postFree: "+ Подать объявление (бесплатно)",
      top10Board: "Доска Топ 10 Рейтинга",
      roadmapTitle: "Дорожная карта и ТЗ (Roadmap)",
      downloadPdf: "Скачать документ в PDF",
      catalogAll: "Каталог всех услуг",
      adminControl: "Панель администратора",
      loginSystem: "Вход в систему",
      allRights: "Все права защищены.",
      safetyNote: "Безопасность: заключайте договоренности с мастером напрямую на месте.",
    },

    // Дорожная Карта (Roadmap)
    roadmap: {
      badge: "Официальный Документ и Дорожная Карта",
      title: "Техническое Задание (ТЗ) и Дорожная Карта Развития",
      subtitle: "Официальный рейтинг 'Топ 10' ведущих мастеров XayrliIsh.uz, многофакторная формула оценки и план поэтапного масштабирования.",
      downloadPdf: "Скачать Документ PDF",
      openPdf: "Открыть PDF в Новой Вкладке",
      formulaTitle: "Справедливая Многофакторная Формула Рейтинга (100-Балльная Система)",
      formulaSubtitle: "5 ключевых независимых коэффициентов, определяющих места в Топ 10",
      roadmapTitle: "Дорожная Карта Развития Проекта (Roadmap)",
      roadmapProgress: "4/6 Выполнено",
      pdfViewerTitle: "Официальный PDF Документ (Окно просмотра)",
    },

    // Страница Каталога
    catalogPage: {
      backHome: "Вернуться на главную",
      title: "Все услуги и направления",
      subtitle: "Выберите нужную сферу и свяжитесь с лучшими специалистами Сырдарьи и всего Узбекистана",
      listingsCount: "объявл.",
      subCount: "объявл.",
      defaultCategoryDesc: "Все специалисты и услуги по данному направлению",
      viewAllInSection: "Смотреть всех специалистов раздела",
    },

    // Блок Статистики
    stats: {
      whyTitle: "Почему именно XayrliIsh.uz?",
      whySubtitle: "Открытый и прозрачный портал специалистов для удобства жителей. Все данные обновляются в реальном времени.",
      districtsLabel: "Города и районы",
      districtsDesc: "Гулистан, Янгиер, Ширин и все районы",
      specialistsLabel: "Активные специалисты",
      specialistsDesc: "Проверенные мастера, зарегистрированные на платформе",
      commissionLabel: "Прямая связь",
      commissionVal: "0% Комиссия",
      commissionDesc: "Связь со специалистом напрямую без посредников",
      verifiedLabel: "Подтвержденные профили",
      verifiedVal: "Проверено",
      verifiedDesc: "Документы и контактные данные подтверждены",
      countUnit: "ед.",
    },
  },
};

export const categorySlugMap: Record<string, { uz: string; ru: string }> = {
  'ustalar': { uz: "Ustalar va Ta'mir", ru: 'Мастера и Ремонт' },
  'santexnika': { uz: 'Santexnika', ru: 'Сантехника' },
  'santexnik': { uz: 'Santexnika', ru: 'Сантехника' },
  'elektrik': { uz: 'Elektrik', ru: 'Электрика' },
  'remont': { uz: 'Remont va qurilish', ru: 'Ремонт и стройка' },
  'avto': { uz: "Avto va Yuk tashish", ru: 'Авто и Грузоперевозки' },
  'yuk-tashish': { uz: 'Yuk tashish', ru: 'Грузоперевозки' },
  'konditsioner': { uz: 'Konditsioner', ru: 'Кондиционеры' },
  'maishiy-texnika': { uz: 'Maishiy texnika', ru: 'Бытовая техника' },
  'qurilish': { uz: 'Qurilish va Mahsulotlar', ru: 'Строительство и Материалы' },
  'gozallik': { uz: "Go'zallik va Salomatlik", ru: 'Красота и Здоровье' },
  'talim': { uz: "Ta'lim va Repetitorlik", ru: 'Образование и Репетиторы' },
  'temirchilik': { uz: 'Temirchilik', ru: 'Кузнечное дело' },
};

export const subCategorySlugMap: Record<string, { uz: string; ru: string }> = {
  'santexnik': { uz: 'Santexnika xizmatlari', ru: 'Сантехнические услуги' },
  'elektrik': { uz: 'Elektr montaj', ru: 'Электромонтаж' },
  'yevro-tamir': { uz: "Yevro ta'mir va pardoz", ru: 'Евроремонт и отделка' },
  'kafelchi': { uz: 'Kafel va bruschatka', ru: 'Кафель и брусчатка' },
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

export function getCategoryLocalizedName(nameOrSlug: string, lang: Language = 'uz'): string {
  if (!nameOrSlug) return '';
  const lower = nameOrSlug.toLowerCase().trim();
  for (const [key, val] of Object.entries(categorySlugMap)) {
    if (lower === key || lower.includes(key)) {
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
  const lower = slugOrName.toLowerCase().trim();
  for (const [key, val] of Object.entries(subCategorySlugMap)) {
    if (lower === key || lower.includes(key)) {
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

