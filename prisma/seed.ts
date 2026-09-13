import { PrismaClient, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Sirdaryo services...');

  // Tozalash (avvalgi test ma'lumotlar bo'lsa)
  await prisma.listing.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Kategoriyalar va Sub-kategoriyalar yaratish
  const categoriesData = [
    {
      name: "Ustalar va Ta'mir",
      slug: "ustalar",
      icon: "Wrench",
      description: "Santexnik, elektrik, pardozlash, yevro ta'mir ustalari",
      subCategories: [
        { name: "Santexnika xizmatlari", slug: "santexnik", description: "Quvurlar, kranlar, dush va ariston o'rnatish" },
        { name: "Elektr montaj", slug: "elektrik", description: "Uylar va ofislar uchun xavfsiz elektr tarmog'i" },
        { name: "Yevro ta'mir va pardoz", slug: "yevro-tamir", description: "Shpaklyovka, oboy, gipsokarton va bo'yoq ishlari" },
        { name: "Kafel va bruschatka", slug: "kafelchi", description: "Hammom, oshxona va hovli plitkalarini terish" },
        { name: "Payvandlash (Svarka)", slug: "svarka", description: "Darvoza, reshyotka, naves va temir konstruksiyalar" },
      ]
    },
    {
      name: "Avto va Yuk tashish",
      slug: "avto",
      icon: "Car",
      description: "Yuk tashish, avto ijara, diagnostika va ta'mirlash",
      subCategories: [
        { name: "Yuk tashish (Labo, Damas, Gazel)", slug: "yuk-tashish", description: "Shahar va viloyatlararo yuk hamda mebellar ko'chirish" },
        { name: "Avto elektr va diagnostika", slug: "avto-diagnostika", description: "Kompyuter diagnostika, signalizatsiya va starter ta'mirlash" },
        { name: "Avtomobil ijarasi", slug: "avto-ijara", description: "To'ylar, safarlar va shaxsiy ehtiyojlar uchun" },
        { name: "Avtomoyka va Detailing", slug: "detailing", description: "Ximchistka, polirovka va yuvish xizmati" },
      ]
    },
    {
      name: "Maishiy texnika",
      slug: "maishiy-texnika",
      icon: "Tv",
      description: "Konditsioner, muzlatgich, kir yuvish mashinalari",
      subCategories: [
        { name: "Konditsioner ustasi", slug: "konditsioner", description: "O'rnatish, freon quyish va chuqur tozalash" },
        { name: "Muzlatgich va Kir yuvish", slug: "muzlatgich-kir-yuvish", description: "Barcha brendlar uchun sifatli va kafolatli ehtiyot qismlar" },
        { name: "Gaz plita va Isitish kotyollari", slug: "gaz-kotyol", description: "Isitish tizimlari va plitalarni sozlash" },
      ]
    },
    {
      name: "Qurilish va Mahsulotlar",
      slug: "qurilish",
      icon: "Hammer",
      description: "Uy qurish, poydevor, g'isht terish va tom yopish",
      subCategories: [
        { name: "G'isht va Blok terish", slug: "gisht-terish", description: "Uylar va korxonalar uchun fundament va devor tiklash" },
        { name: "Tom yopish ustalari", slug: "tom-yopish", description: "Tunika, cherepitsa va profnastil bilan qoplash" },
      ]
    },
    {
      name: "Go'zallik va Salomatlik",
      slug: "gozallik",
      icon: "Sparkles",
      description: "Sartarosh, stilist, massaj va parvarish xizmatlari",
      subCategories: [
        { name: "Sartaroshlik va Stilist", slug: "sartarosh", description: "Erkaklar va ayollar soch turmaklari" },
        { name: "To'y va Kecha pardozlari", slug: "vizaj", description: "Kelinlar va bayramlar uchun professional vizaj" },
      ]
    },
    {
      name: "Ta'lim va Repetitorlik",
      slug: "talim",
      icon: "GraduationCap",
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

  // 2. Namunaviy foydalanuvchilar (Mutaxassislar)
  const user1 = await prisma.user.create({
    data: {
      name: "Usta Otabek Xolmirzayev",
      phone: "+998901234567",
      telegram: "otabek_santexnik",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Rustam Alimov",
      phone: "+998912345678",
      telegram: "rustam_elektrik_guliston",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Jasur Murodov",
      phone: "+998933456789",
      telegram: "jasur_konditsioner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    }
  });

  // 3. Sirdaryo hududiga xos 10 ta realistik e'lonlar
  const listingsData = [
    {
      title: "Santexnika va isitish tizimlarini montaj qilish (Kafolat 2 yil)",
      name: "Otabek Xolmirzayev (Usta Otabek)",
      description: "Assalomu alaykum! Guliston shahri va unga yaqin hududlarda 10 yillik tajribaga ega santexnik xizmati. Issiq pol (teplyy pol), ariston, kotyol o'rnatish, plastik va temir quvurlarni almashtirish, vannaxona jihozlarini sozlash. Har qanday murakkablikdagi oqishlarni zudlik bilan bartaraf etamiz. Sifat kafolatlanadi, materiallarni sifatli va ulgurji narxda tanlashga yordam beramiz.",
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
        "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80",
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
      description: "Guliston, Yangiyer va Boyovut tumanlari bo'ylab yuqori darajadagi elektr montaj ishlari. 220V va 380V tarmoqlar, avtomatika, lyustra, LED lentalar, yashirin yoritish va elektr qalqonlarini (shit) yig'ish. To'liq xavfsizlik qoidalariga rioya qilinadi. Qisqa tutashuv va nosozliklarni tezkor topish va tuzatish.",
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
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
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
      description: "Barcha turdagi konditsionerlarni (Artel, LG, Midea, Gree, Chigo va boshqalar) montaj, demontaj qilish. Maxsus par va kimyoviy vositalar bilan ichki va tashqi bloklarni bakteriyalardan tozalash. Trassani devor ichidan chiroyli yotqizish. Guliston shahri va Yangiyer bo'ylab chaqiruvga 1 soatda yetib boramiz.",
      phone: "+998933456789",
      telegram: "jasur_konditsioner",
      instagram: "climat_sirdaryo",
      location: "Yangiyer shahri",
      address: "Tinchlik ko'chasi, mo'ljal: Yangiyer bozor yonida",
      price: "200,000 so'mdan boshlab",
      experience: "6 yil",
      rating: 4.8,
      reviewCount: 29,
      images: [
        "https://images.unsplash.com/photo-1614633833026-062045db1264?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 289,
      categoryId: createdCategories["maishiy-texnika"].id,
      subCategoryId: createdSubCategories["konditsioner"].id,
      userId: user3.id,
    },
    {
      title: "Kvartira va hovlilarni kalit topshirish (Pod klyuch) Yevro ta'mir",
      name: "Sherzod Usta Brigadasi",
      description: "Bizning 6 kishilik tajribali ustalar jamoamiz xonadoningizni noldan zamonaviy ko'rinishga keltiradi: gipsokarton figuralar, shpaklyovka, sifatli oboy yopishtirish, polga laminat yotqizish, fasad bo'yoqlari. Ishlarni shartnoma asosida, o'z vaqtida va toza topshiramiz. Ko'rsatilgan ishlarimizni Gulistondagi ob'yektlarda ko'rishingiz mumkin.",
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
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
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
      description: "Sirdaryo viloyatining barcha tumanlaridan (Guliston, Shirin, Yangiyer, Sayxunobod, Mirzaobod) O'zbekiston bo'ylab mebel, qurilish mollari va boshqa yuklarni arzon va ishonchli yetkazib beramiz. Yuk ortish va tushirish uchun baquvvat mardikorlarimiz ham bor. Mashinamiz toza va tentli.",
      phone: "+998993214567",
      telegram: "ilhom_labo_yuk",
      instagram: "yuk_tashish_sirdaryo",
      location: "Sayxunobod tumani",
      address: "Sayxunobod markaz, Paxtakor ko'chasi",
      price: "1 km uchun 6,000 so'm yoki kelishuv",
      experience: "7 yil",
      rating: 4.9,
      reviewCount: 64,
      images: [
        "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80",
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
      description: "Hammom, tualet, oshxona va hovlilarga har qanday o'lchamdagi kafel (60x60, 60x120 kafelografiya) terish. 45 gradus burchaklarni tekis chiqarish (lasochek), lazer darajasida aniqlik. 100% silliq va bexato ish. Materiallarni hisoblab berish mutlaqo bepul.",
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
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80",
      ],
      isVerified: false,
      status: ListingStatus.APPROVED,
      view_count: 198,
      categoryId: createdCategories["ustalar"].id,
      subCategoryId: createdSubCategories["kafelchi"].id,
    },
    {
      title: "Avtomobillarni kompyuter diagnostikasi va injektor tozalash",
      name: "Guliston Avto Master (Bekzod usta)",
      description: "Cobalt, Gentra, Nexia 3, Tracker, Onix, Kia, Hyundai avtomobillarini zamonaviy Launch skaneri orqali diagnostika qilish. Check chirog'i yonish sababini aniqlash, drosselni adaptatsiya qilish, yonilg'i tizimi va forsunka (injektor)larni stendda yuvish.",
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
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80",
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
      description: "Samsung, LG, Artel, Indesit, Beko kir yuvish mashinalari suv chiqarmayotgan, siqmayotgan yoki shovqin solayotgan bo'lsa darhol murojaat qiling. Asl ehtiyot qismlar (nasos, podshipnik, ten, plata) o'zimizda bor. Shirin, Yangiyer va Guliston bo'ylab uyingizga borib joyida ta'mirlaymiz.",
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
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80",
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
      description: "Sifatli metalldan zamonaviy dizayndagi darvozalar, hovli va garaj naveslari, deraza panjaralari, zina tutqichlari (perila). Bo'yoqlari chang emal va patinalar bilan bezatiladi. O'lchash va yetkazib berish butun Sirdaryo viloyati bo'yicha bepul.",
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
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80",
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
      description: "Guliston shahrida yoshlar va abituriyentlar uchun professional ingliz tili darslari. O'qituvchilarimiz IELTS 8.0 ball sohiblari. Speaking klublar, xorijiy universitetlarga grantlar yutish bo'yicha konsultatsiyalar. Birinchi dars bepul!",
      phone: "+998907770011",
      telegram: "guliston_ielts_center",
      instagram: "guliston_ielts",
      location: "Guliston shahri",
      address: "Guliston davlat universiteti (GulDU) ro'parasida, 2-qavat",
      price: "Oyiga 350,000 so'm",
      experience: "5 yil",
      rating: 5.0,
      reviewCount: 78,
      images: [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
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
      description: "Guliston shahrida eng go'zal kelin obrazlari, fason soch turmaklari, zamonaviy visaj va parvarish. Biz faqat jahonning yetakchi brendlari (MAC, Dior, Huda Beauty) sifatli kosmetikasidan foydalanamiz. Marosimingizda beqiyos ko'rinishga ega bo'ling.",
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
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
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
      description: "Sardoba, Oqoltin va Mirzaobod tumanlari bo'ylab yengil va mustahkam temir konstruksiyali tomlar qurish. Qor va yomg'ir suvlari sizmaydigan qilib yopish, suv novlari (vodostok) o'rnatish. Tezkor, sifatli va o'rtadagi dallollarsiz to'g'ridan-to'g'ri usta bilan shartnoma qiling.",
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
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?w=800&auto=format&fit=crop&q=80",
      ],
      isVerified: true,
      status: ListingStatus.APPROVED,
      view_count: 245,
      categoryId: createdCategories["qurilish"].id,
      subCategoryId: createdSubCategories["tom-yopish"].id,
    }
  ];

  for (const listing of listingsData) {
    await prisma.listing.create({
      data: listing,
    });
  }

  console.log(`Successfully seeded ${categoriesData.length} categories and ${listingsData.length} listings!`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
