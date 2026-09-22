import { PrismaClient, ListingStatus } from '@prisma/client';

const prisma: any = new PrismaClient();

async function main() {
  console.log('Seeding MongoDB with rich Sirdaryo services...');

  // Tozalash
  await prisma.listing.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.district.deleteMany();
  await prisma.region.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.user.deleteMany();

  // 1. Tizim sozlamalari (Singleton)
  await prisma.systemSetting.create({
    data: {
      contactPhone: "+998 90 123 45 67",
      telegramUsername: "topbaza_admin",
      supportEmail: "info@topbaza.uz",
      siteTitle: "TopBaza.uz",
    },
  });

  // 2. Region va Districtlar (Sirdaryo viloyati)
  const sirdaryoRegion = await prisma.region.create({
    data: {
      nameUz: "Sirdaryo viloyati",
      nameRu: "Сырдарьинская область",
      slug: "sirdaryo",
      order: 1,
    },
  });

  const districtsData = [
    { nameUz: "Guliston shahri", nameRu: "г. Гулистан", slug: "guliston", order: 1 },
    { nameUz: "Yangiyer shahri", nameRu: "г. Янгиер", slug: "yangiyer", order: 2 },
    { nameUz: "Shirin shahri", nameRu: "г. Ширин", slug: "shirin", order: 3 },
    { nameUz: "Boyovut tumani", nameRu: "Баяутский район", slug: "boyovut", order: 4 },
    { nameUz: "Sayxunobod tumani", nameRu: "Сайхунабадский район", slug: "sayxunobod", order: 5 },
    { nameUz: "Mirzaobod tumani", nameRu: "Мирзаабадский район", slug: "mirzaobod", order: 6 },
    { nameUz: "Oqoltin tumani", nameRu: "Акалтынский район", slug: "oqoltin", order: 7 },
    { nameUz: "Sardoba tumani", nameRu: "Сардобинский район", slug: "sardoba", order: 8 },
    { nameUz: "Xovos tumani", nameRu: "Хавастский район", slug: "xovos", order: 9 },
    { nameUz: "Sirdaryo tumani", nameRu: "Сырдарьинский район", slug: "sirdaryo-tumani", order: 10 },
  ];

  const districtMap: Record<string, any> = {};
  for (const d of districtsData) {
    const createdDistrict = await prisma.district.create({
      data: {
        ...d,
        regionId: sirdaryoRegion.id,
      },
    });
    districtMap[d.nameUz] = createdDistrict;
  }

  // 3. Kategoriyalar va Sub-kategoriyalar (Ikki tilli)
  const categoriesData = [
    {
      nameUz: "Ustalar va Ta'mir",
      nameRu: "Мастера и Ремонт",
      name: "Ustalar va Ta'mir",
      slug: "ustalar",
      icon: "Wrench",
      order: 1,
      isActive: true,
      description: "Santexnik, elektrik, pardozlash, yevro ta'mir ustalari",
      subCategories: [
        { name: "G'isht va Blok terish", slug: "gisht-terish", description: "Uylar va korxonalar uchun fundament va devor tiklash" },
        { name: "Tom yopish ustalari", slug: "tom-yopish", description: "Tunika, cherepitsa va profnastil bilan qoplash" },
        { name: "Santexnika xizmatlari", slug: "santexnik", description: "Quvurlar, kranlar, dush va ariston o'rnatish" },
        { name: "Elektr montaj", slug: "elektrik", description: "Uylar va ofislar uchun xavfsiz elektr tarmog'i" },
        { name: "Yevro ta'mir va pardoz", slug: "yevro-tamir", description: "Shpaklyovka, oboy, gipsokarton va bo'yoq ishlari" },
        { name: "Kafel va bruschatka", slug: "kafelchi", description: "Hammom, oshxona va hovli plitkalarini terish" },
        { name: "Payvandlash (Svarka)", slug: "svarka", description: "Darvoza, reshyotka, naves va temir konstruksiyalar" },
      ]
    },
    {
      nameUz: "Avto va Yuk tashish",
      nameRu: "Авто и Грузоперевозки",
      name: "Avto va Yuk tashish",
      slug: "avto",
      icon: "Car",
      order: 2,
      isActive: true,
      description: "Yuk tashish, avto ijara, diagnostika va ta'mirlash",
      subCategories: [
        { name: "Yuk tashish (Labo, Damas, Gazel)", slug: "yuk-tashish", description: "Shahar va viloyatlararo yuk hamda mebellar ko'chirish" },
        { name: "Avto elektr va diagnostika", slug: "avto-diagnostika", description: "Kompyuter diagnostika, signalizatsiya va starter ta'mirlash" },
        { name: "Avtomobil ijarasi", slug: "avto-ijara", description: "To'ylar, safarlar va shaxsiy ehtiyojlar uchun" },
        { name: "Avtomoyka va Detailing", slug: "detailing", description: "Ximchistka, polirovka va yuvish xizmati" },
      ]
    },
    {
      nameUz: "Maishiy texnika",
      nameRu: "Бытовая техника",
      name: "Maishiy texnika",
      slug: "maishiy-texnika",
      icon: "Tv",
      order: 3,
      isActive: true,
      description: "Konditsioner, muzlatgich, kir yuvish mashinalari",
      subCategories: [
        { name: "Konditsioner ustasi", slug: "konditsioner", description: "O'rnatish, freon quyish va chuqur tozalash" },
        { name: "Muzlatgich va Kir yuvish", slug: "muzlatgich-kir-yuvish", description: "Barcha brendlar uchun sifatli va kafolatli ehtiyot qismlar" },
        { name: "Gaz plita va Isitish kotyollari", slug: "gaz-kotyol", description: "Isitish tizimlari va plitalarni sozlash" },
      ]
    },
    {
      nameUz: "Qurilish mahsulotlari",
      nameRu: "Строительные материалы",
      name: "Qurilish mahsulotlari",
      slug: "qurilish",
      icon: "Hammer",
      order: 4,
      isActive: true,
      description: "G'isht, sement, laminat va boshqa qurilish mahsulotlari",
      subCategories: [
        { name: "G'isht", slug: "gisht", description: "Qurilish uchun g'isht" },
        { name: "Sement", slug: "sement", description: "Qurilish uchun sement" },
        { name: "Laminat", slug: "laminat", description: "Pol uchun laminat" },
      ]
    },
    {
      nameUz: "Go'zallik va Salomatlik",
      nameRu: "Красота и Здоровье",
      name: "Go'zallik va Salomatlik",
      slug: "gozallik",
      icon: "Sparkles",
      order: 5,
      isActive: true,
      description: "Sartarosh, stilist, massaj va parvarish xizmatlari",
      subCategories: [
        { name: "Sartaroshlik va Stilist", slug: "sartarosh", description: "Erkaklar va ayollar soch turmaklari" },
        { name: "To'y va Kecha pardozlari", slug: "vizaj", description: "Kelinlar va bayramlar uchun professional vizaj" },
      ]
    },
    {
      nameUz: "Ta'lim va Repetitorlik",
      nameRu: "Образование и Репетиторы",
      name: "Ta'lim va Repetitorlik",
      slug: "talim",
      icon: "GraduationCap",
      order: 6,
      isActive: true,
      description: "Tillar, aniq fanlar va maktabga tayyorlov",
      subCategories: [
        { name: "Ingliz tili (IELTS / CEFR)", slug: "ingliz-tili", description: "Guliston markazida individual va guruh darslari" },
        { name: "Matematika va Fizika", slug: "matematika", description: "Abituriyentlar va Prezident maktabiga tayyorlov" },
      ]
    }
  ];

  const createdCategories: Record<string, any> = {};
  const createdSubCategories: Record<string, any> = {};

  for (const catData of categoriesData) {
    const { subCategories, ...catFields } = catData;
    const cat = await prisma.category.create({
      data: catFields,
    });
    createdCategories[cat.slug] = cat;

    for (const sub of subCategories) {
      const subCat = await prisma.subCategory.create({
        data: {
          ...sub,
          categoryId: cat.id,
        }
      });
      createdSubCategories[sub.slug] = subCat;
    }
  }


  // 2. Foydalanuvchilar
  const user1 = await prisma.user.create({
    data: {
      name: "Usta Otabek Xolmirzayev",
      phone: "+998901234567",
      telegram: "otabek_santexnik",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400",
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Rustam Alimov",
      phone: "+998912345678",
      telegram: "rustam_elektrik_guliston",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    }
  });

  // 3. Sirdaryoning barcha tumanlariga xos 18 ta realistik e'lonlar
  const listingsData = [
    {
      title: "Santexnika va isitish tizimlarini montaj qilish (Kafolat 2 yil)",
      name: "Otabek Xolmirzayev (Usta Otabek)",
      description: "Assalomu alaykum! Guliston shahri va unga yaqin hududlarda 10 yillik tajribaga ega santexnik xizmati. Issiq pol, ariston, kotyol o'rnatish, plastik va temir quvurlarni almashtirish, vannaxona jihozlarini sozlash. Har qanday oqishlarni zudlik bilan bartaraf etamiz.",
      phone: "+998901234567",
      telegram: "otabek_santexnik",
      instagram: "otabek_santexnik_guliston",
      location: "Guliston shahri",
      address: "3-mavze, O'zbekiston ko'chasi, mo'ljal: Sayxun restorani",
      price: "150,000 so'mdan boshlab",
      experience: "10 yil",
      rating: 4.9,
      reviewCount: 38,
      images: [
        "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 342,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["santexnik"].id,
      userId: user1.id,
    },
    {
      title: "Xonadonlar va tashkilotlar uchun professional elektr montaj",
      name: "Rustam Alimov",
      description: "Guliston, Yangiyer va Boyovut tumanlari bo'ylab yuqori darajadagi elektr montaj ishlari. 220V va 380V tarmoqlar, avtomatika, lyustra, LED lentalar, yashirin yoritish va shit yig'ish.",
      phone: "+998912345678",
      telegram: "rustam_elektrik_guliston",
      instagram: "elektrik_sirdaryo",
      location: "Guliston shahri",
      address: "Navoiy shoh ko'chasi, Guliston vokzali yaqinida",
      price: "Kelishilgan holda",
      experience: "8 yil",
      rating: 5.0,
      reviewCount: 42,
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 512,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["elektrik"].id,
      userId: user2.id,
    },
    {
      title: "Konditsionerlarni o'rnatish, yuvish va R410 freon to'ldirish",
      name: "Jasur Murodov (Guliston Climat)",
      description: "Barcha turdagi konditsionerlarni montaj, demontaj qilish. Maxsus par va kimyoviy vositalar bilan ichki va tashqi bloklarni chuqur tozalash. Yangiyer va Shirin shaharlariga ham boramiz.",
      phone: "+998933456789",
      telegram: "jasur_konditsioner",
      instagram: "climat_sirdaryo",
      location: "Yangiyer shahri",
      address: "Tinchlik ko'chasi, Yangiyer bozor yonida",
      price: "200,000 so'mdan boshlab",
      experience: "6 yil",
      rating: 4.8,
      reviewCount: 29,
      images: [
        "https://images.unsplash.com/photo-1614633833026-062045db1264?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 289,
      categoryId: createdCategories["maishiy-texnika"].id,
      subCategoryId: createdSubCategories["konditsioner"].id,
    },
    {
      title: "Kvartira va hovlilarni kalit topshirish (Pod klyuch) Yevro ta'mir",
      name: "Sherzod Usta Brigadasi",
      description: "Xonadoningizni noldan zamonaviy ko'rinishga keltiramiz: gipsokarton figuralar, shpaklyovka, sifatli oboy, polga laminat yotqizish. Ishlarni shartnoma asosida topshiramiz.",
      phone: "+998971112233",
      telegram: "sherzod_remont_sirdaryo",
      instagram: "sherzod_design_remont",
      location: "Guliston shahri",
      address: "1-mavze, Al-Xorazmiy ko'chasi",
      price: "120,000 so'm/kv.m",
      experience: "12 yil",
      rating: 4.9,
      reviewCount: 51,
      images: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 670,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["yevro-tamir"].id,
    },
    {
      title: "Yuk tashish xizmati: Labo va Gazel (Sirdaryo - Toshkent - Samarqand)",
      name: "Ilhomjon Haydovchi",
      description: "Sayxunobod, Guliston va Shirin shaharlaridan mebel, qurilish mollari va boshqa yuklarni arzon va ishonchli yetkazib beramiz. Yuk ortish va tushirish xizmati ham mavjud.",
      phone: "+998993214567",
      telegram: "ilhom_labo_yuk",
      instagram: "yuk_tashish_sirdaryo",
      location: "Sayxunobod tumani",
      address: "Sayxunobod markaz, Paxtakor ko'chasi",
      price: "1 km uchun 6,000 so'm",
      experience: "7 yil",
      rating: 4.9,
      reviewCount: 64,
      images: [
        "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 420,
      categoryId: createdCategories["avto"].id,
      subCategoryId: createdSubCategories["yuk-tashish"].id,
    },
    {
      title: "Kafel, granit va mozaika terish ustalari",
      name: "Farrux Usta",
      description: "Hammom, tualet, oshxona va hovlilarga har qanday o'lchamdagi kafel terish. 45 gradus burchaklarni tekis chiqarish, lazer darajasida aniqlik. 100% silliq va bexato ish.",
      phone: "+998904567890",
      telegram: "farrux_kafelchi",
      instagram: "kafelchi_guliston",
      location: "Boyovut tumani",
      address: "Boyovut markazi, Mustaqillik shoh ko'chasi",
      price: "90,000 so'm/kv.m dan",
      experience: "9 yil",
      rating: 4.7,
      reviewCount: 23,
      images: [
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 198,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["kafelchi"].id,
    },
    {
      title: "Avtomobillarni kompyuter diagnostikasi va injektor tozalash",
      name: "Guliston Avto Master (Bekzod usta)",
      description: "Cobalt, Gentra, Nexia 3, Tracker, Onix avtomobillarini kompyuter diagnostika qilish, injektorlarni stendda tozalash, drosselni sozlash.",
      phone: "+998918889900",
      telegram: "bekzod_avto_diag",
      instagram: "guliston_avto_master",
      location: "Guliston shahri",
      address: "Guliston avtoturargohi orqasi, 12-boks",
      price: "70,000 so'mdan boshlab",
      experience: "11 yil",
      rating: 5.0,
      reviewCount: 47,
      images: [
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 489,
      categoryId: createdCategories["avto"].id,
      subCategoryId: createdSubCategories["avto-diagnostika"].id,
    },
    {
      title: "Kir yuvish mashinalari va muzlatgichlarni uyingizda tuzatish",
      name: "Azizbek Texno Servis",
      description: "Samsung, LG, Artel, Indesit kir yuvish mashinalarini joyida tuzatish. Shirin shahri va Yangiyer bo'ylab chaqiruvga darhol boramiz.",
      phone: "+998945554433",
      telegram: "azizbek_texno",
      instagram: "texnoservis_sirdaryo",
      location: "Shirin shahri",
      address: "Farhod ko'chasi, Shirin GRES yaqinida",
      price: "100,000 so'mdan boshlab",
      experience: "5 yil",
      rating: 4.8,
      reviewCount: 19,
      images: [
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 310,
      categoryId: createdCategories["maishiy-texnika"].id,
      subCategoryId: createdSubCategories["muzlatgich-kir-yuvish"].id,
    },
    {
      title: "Darvoza, panjara (reshyotka) va naveslar tayyorlash",
      name: "Bobur Usta Temirchi",
      description: "Sifatli metalldan zamonaviy darvozalar, hovli va garaj naveslari, deraza panjaralari. Mirzaobod va Guliston bo'ylab o'lchash bepul.",
      phone: "+998939991122",
      telegram: "bobur_temirchi",
      instagram: "darvoza_sirdaryo",
      location: "Mirzaobod tumani",
      address: "Navro'z qo'rg'oni, Toshkent trakti yoqasida",
      price: "Kvadratiga 450,000 so'mdan",
      experience: "14 yil",
      rating: 4.9,
      reviewCount: 31,
      images: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 380,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["svarka"].id,
    },
    {
      title: "Ingliz tili (IELTS 7.5+ va General English) kurslari",
      name: "Guliston Academic IELTS Center",
      description: "Guliston shahrida yoshlar va abituriyentlar uchun professional ingliz tili darslari. Speaking klublar, individual va guruh darslari.",
      phone: "+998907770011",
      telegram: "guliston_ielts_center",
      instagram: "guliston_ielts",
      location: "Guliston shahri",
      address: "Guliston davlat universiteti ro'parasida",
      price: "Oyiga 350,000 so'm",
      experience: "5 yil",
      rating: 5.0,
      reviewCount: 78,
      images: [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 530,
      categoryId: createdCategories["talim"].id,
      subCategoryId: createdSubCategories["ingliz-tili"].id,
    },
    {
      title: "To'y va marosimlar uchun kelinlar makiyaji va soch turmaklash",
      name: "Malika Beauty Salon",
      description: "Guliston shahrida eng go'zal kelin obrazlari, fason soch turmaklari, zamonaviy visaj va parvarish. Sifatli brend kosmetika.",
      phone: "+998946663322",
      telegram: "malika_beauty_guliston",
      instagram: "malika_beauty_salon",
      location: "Guliston shahri",
      address: "Sayxun ko'chasi, Baxt uyi yonida",
      price: "300,000 so'mdan boshlab",
      experience: "7 yil",
      rating: 4.9,
      reviewCount: 56,
      images: [
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 615,
      categoryId: createdCategories["gozallik"].id,
      subCategoryId: createdSubCategories["vizaj"].id,
    },
    {
      title: "Uylar va binolar uchun tom yopish (Profildan tunika va cherepitsa)",
      name: "Sardoba Qurilish Ustalari",
      description: "Sardoba, Oqoltin va Mirzaobod tumanlari bo'ylab yengil va mustahkam temir konstruksiyali tomlar qurish, suv novlari o'rnatish.",
      phone: "+998935559988",
      telegram: "sardoba_tomchi",
      instagram: "tom_yopish_sirdaryo",
      location: "Sardoba tumani",
      address: "Paxtaobod qo'rg'oni, Dehqon bozori yaqinida",
      price: "50,000 so'm/kv.m dan",
      experience: "13 yil",
      rating: 4.8,
      reviewCount: 34,
      images: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 245,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["tom-yopish"].id,
    },
    // Qo'shimcha tumanlar uchun xizmatlar:
    {
      title: "Oqoltin tumani: G'isht va shlakoblok terish brigadasi",
      name: "Usta Jasurbek Brigadasi",
      description: "Poydevordan tomlarigacha sifatli g'isht terish, shlakoblok va beton quyish xizmati. 10 yillik tajribali brigada.",
      phone: "+998912223344",
      location: "Oqoltin tumani",
      address: "Sardoba yo'li, Oqoltin markazi",
      price: "1,200 so'm/dona",
      experience: "10 yil",
      rating: 4.8,
      reviewCount: 22,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 310,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["gisht-terish"].id,
    },
    {
      title: "Xovos tumani: Damas yuk tashish va ko'chirish",
      name: "Shavkatjon Haydovchi",
      description: "Xovos va Yangiyer bo'ylab arzon yuk tashish. Xonadon mebellari, qopdagi yuklar va mahsulotlarni o'z vaqtida manzilga yetkazamiz.",
      phone: "+998902221144",
      telegram: "shavkat_xovos_yuk",
      location: "Xovos tumani",
      address: "Xovos vokzali yaqinida",
      price: "1 km uchun 5,000 so'm",
      experience: "6 yil",
      rating: 4.8,
      reviewCount: 17,
      images: ["https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 165,
      categoryId: createdCategories["avto"].id,
      subCategoryId: createdSubCategories["yuk-tashish"].id,
    },
    {
      title: "Guliston tumani: Santexnik va qozonxona (kotyol) montaji",
      name: "Akmal Usta",
      description: "Guliston tumani (Dehqonobod) va atrof qishloqlar bo'ylab suv nasoslari, dush, ariston va isitish tizimlarini sozlash.",
      phone: "+998934445566",
      telegram: "akmal_santexnik",
      location: "Guliston tumani",
      address: "Dehqonobod qo'rg'oni",
      price: "120,000 so'mdan",
      experience: "8 yil",
      rating: 4.7,
      reviewCount: 15,
      images: ["https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800"],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 140,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["santexnik"].id,
    },
    {
      title: "Shirin shahri: Avto elektrik va akkumulyator diagnostikasi",
      name: "Ravshan Avto Usta",
      description: "Shirin shahri va Yangiyer haydovchilari uchun avto elektr, generator, starter ta'miri va kompyuter tekshiruvi.",
      phone: "+998917778899",
      telegram: "ravshan_shirin_avto",
      location: "Shirin shahri",
      address: "Shirin avtoshohbekati ro'parasida",
      price: "60,000 so'mdan",
      experience: "9 yil",
      rating: 5.0,
      reviewCount: 33,
      images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800"],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 220,
      categoryId: createdCategories["avto"].id,
      subCategoryId: createdSubCategories["avto-diagnostika"].id,
    },

    {
      title: "Yangiyer shahri: Erkaklar sartaroshi va soqol olish",
      name: "Barbershop Yangiyer (Sardorbek)",
      description: "Klassik va fason soch turmaklari, soqol fasoni, yuz parvarishi. Qulay kutish zali, choy va kofe bepul.",
      phone: "+998943332211",
      telegram: "yangiyer_barbershop",
      location: "Yangiyer shahri",
      address: "Yangiyer shahar parki ro'parasi",
      price: "40,000 so'mdan",
      experience: "4 yil",
      rating: 4.9,
      reviewCount: 45,
      images: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800"],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 310,
      categoryId: createdCategories["gozallik"].id,
      subCategoryId: createdSubCategories["sartarosh"].id,
    },
    {
      title: "Mirzaobod tumani: Matematika va Fizika tayyorlov kursi",
      name: "Mirzaobod Ziyo O'quv Markazi",
      description: "5-11 sinf o'quvchilari va abituriyentlar uchun chuqurlashtirilgan matematika darslari. Milliy sertifikat va DTM testlariga tayyorgarlik.",
      phone: "+998906667788",
      telegram: "mirzaobod_ziyo",
      location: "Mirzaobod tumani",
      address: "Navro'z markazi, 1-maktab yonida",
      price: "Oyiga 200,000 so'm",
      experience: "7 yil",
      rating: 4.9,
      reviewCount: 39,
      images: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 260,
      categoryId: createdCategories["talim"].id,
      subCategoryId: createdSubCategories["matematika"].id,
    }
  ];

  for (const listing of listingsData) {
    const dist = districtMap[listing.location];
    await prisma.listing.create({
      data: {
        ...listing,
        regionId: sirdaryoRegion.id,
        districtId: dist ? dist.id : undefined,
      } as any,
    });
  }

  console.log(`Successfully seeded ${categoriesData.length} categories, 1 region, ${districtsData.length} districts, and ${listingsData.length} rich listings across Sirdaryo!`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
