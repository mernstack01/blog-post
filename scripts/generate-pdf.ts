import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

async function generateTZRoadmapPDF() {
  const outputPath = path.join(process.cwd(), 'public', 'docs', 'XayrliIsh_TZ_va_Roadmap.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 45, left: 45, right: 45 },
    bufferPages: true,
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const colors = {
    primary: '#2563eb', // blue-600
    primaryDark: '#1d4ed8',
    primaryLight: '#eff6ff',
    textMain: '#1e293b', // slate-800
    textMuted: '#64748b', // slate-500
    cardBg: '#f8fafc', // slate-50
    borderColor: '#e2e8f0', // slate-200
    emerald: '#059669',
    emeraldBg: '#ecfdf5',
    amber: '#d97706',
    amberBg: '#fffbeb',
    blue: '#2563eb',
    blueBg: '#eff6ff',
  };

  // --- SAHIFA 1: TITUL VA LOYIHA PASPORTI ---
  
  // Yuqori dekorativ rangli chiziq
  doc.rect(45, 25, 505, 5).fill(colors.primary);

  // Logo / Katta Sarlavha
  doc.moveDown(1);
  doc.fillColor(colors.primary).fontSize(24).font('Helvetica-Bold').text('XayrliIsh.uz', 45, 45);
  doc.fillColor(colors.textMuted).fontSize(10).font('Helvetica').text('Sirdaryo viloyati ustalari va maishiy xizmatlar reyting portali', 45, 75);

  // Badge
  doc.roundedRect(400, 45, 150, 24, 6).fill(colors.primaryLight);
  doc.rect(400, 45, 150, 24).stroke(colors.primary);
  doc.fillColor(colors.primaryDark).fontSize(9).font('Helvetica-Bold').text('RASMIY TEXNIK TOPShIRIQ', 408, 52, { width: 134, align: 'center' });

  doc.moveDown(2);
  doc.strokeColor(colors.borderColor).lineWidth(1).moveTo(45, 95).lineTo(550, 95).stroke();

  // Asosiy Hujjat Sarlavhasi
  doc.y = 110;
  doc.fillColor(colors.textMain).fontSize(16).font('Helvetica-Bold').text('TEXNIK TOPSHIRIQ VA RIVOJLANTIRISH YO\'L XARITASI (ROADMAP)');
  doc.fillColor(colors.textMuted).fontSize(10).font('Helvetica').text('Mavzu: "Top 10" Peshqadam ustalari reytingi, ko\'p omillik baholash va imtiyozlar tizimi');
  doc.text('Versiya: 2.0 (Production)  |  Sana: 2026-yil Sentyabr  |  Holati: Tasdiqlangan va Amalga oshirilgan');

  doc.moveDown(1.2);

  // 1-Bo'lim: Loyiha Pasporti
  doc.fillColor(colors.primary).fontSize(12).font('Helvetica-Bold').text('1. LOYIHA PASPORTI VA MAQSADI');
  doc.moveDown(0.4);

  const passportTable = [
    ['Loyiha nomi:', 'XayrliIsh.uz (Sirdaryo Ustalari va Xizmatlari)'],
    ['Asosiy vazifasi:', 'Aholi uchun sifatli, tekshirilgan va xolis baholangan ustalarni topish; ustalarga adolatli reyting va homiylik imkoniyatini taqdim etish.'],
    ['Asosiy hudud:', 'Sirdaryo viloyati (Guliston, Yangiyer, Shirin va barcha 8 ta tuman)'],
    ['Til muhiti:', 'O\'zbek tili (Uz), Rus tili (Ru), Ingliz tili (En)'],
    ['Asosiy bo\'limlar:', '"Umumiy Katalog" (barcha e\'lonlar) va "Top 10 Reyting" (peshqadamlar)'],
  ];

  let currentY = doc.y + 4;
  passportTable.forEach(([k, v]) => {
    doc.roundedRect(45, currentY, 505, 22, 4).fill(colors.cardBg);
    doc.fillColor(colors.textMain).fontSize(9).font('Helvetica-Bold').text(k, 55, currentY + 6, { width: 130 });
    doc.fillColor(colors.textMain).fontSize(8.5).font('Helvetica').text(v, 185, currentY + 6, { width: 355 });
    currentY += 26;
  });

  doc.y = currentY + 10;

  // 2-Bo'lim: Tizim Arxitekturasi va Asosiy Rejimlar
  doc.fillColor(colors.primary).fontSize(12).font('Helvetica-Bold').text('2. FOYDALANUVCHI REJIMLARI VA ARXITEKTURASI');
  doc.moveDown(0.4);

  // 2 ta kartochka: Umumiy va Top 10
  const colY = doc.y;
  
  // Chap kartochka: Umumiy Katalog
  doc.roundedRect(45, colY, 245, 110, 8).fillAndStroke(colors.cardBg, colors.borderColor);
  doc.fillColor(colors.textMain).fontSize(11).font('Helvetica-Bold').text('A) "Umumiy Katalog" Rejimi', 55, colY + 10);
  doc.fillColor(colors.textMuted).fontSize(8.5).font('Helvetica').text(
    '- Sirdaryodagi barcha tasdiqlangan (APPROVED) usta va korxonalar e\'lonlari bazasi.\n' +
    '- Tumanlar bo\'yicha filtr (Guliston, Yangiyer, Sayxun va h.k.).\n' +
    '- 8 ta asosiy kategoriya va ichki yo\'nalishlar.\n' +
    '- Saralash: Ko\'rishlar soni, yangi e\'lonlar, mijozlar yulduzlari.',
    55, colY + 28, { width: 225, lineGap: 3 }
  );

  // O'ng kartochka: Top 10 Reyting
  doc.roundedRect(305, colY, 245, 110, 8).fillAndStroke(colors.amberBg, colors.amber);
  doc.fillColor(colors.amber).fontSize(11).font('Helvetica-Bold').text('B) "Top 10 Reyting" Rejimi', 315, colY + 10);
  doc.fillColor(colors.textMain).fontSize(8.5).font('Helvetica').text(
    '- Ko\'p omillik formula bo\'yicha eng yuqori ball to\'plagan TOP 10 nafar yetakchi usta doskasi.\n' +
    '- Oltin (#1), Kumush (#2), Bronza (#3) maxsus nishonlari.\n' +
    '- VIP Homiylik va Imtiyozli Usta badjlari.\n' +
    '- Ustanining rasmiy veb-sayti yoki portfolio manzili havolasi.\n' +
    '- Avtomatik tartiblangan rasmiy reyting.',
    315, colY + 28, { width: 225, lineGap: 3 }
  );

  doc.y = colY + 125;

  // 3-Bo'lim: Top 10 Usta Kartochkasi Standartlari
  doc.fillColor(colors.primary).fontSize(12).font('Helvetica-Bold').text('3. TOP 10 USTA KARTOCHKASI TARKIBI (Talablar)');
  doc.moveDown(0.4);

  const cardElements = [
    '1. O\'rin nishoni: #1 OLTIN USTA, #2 KUMUSH, #3 BRONZA va #4-#10 rasmiy o\'rinlar.',
    '2. Kategoriya belgisi: Ustaninig aniq sohasi (Santexnika, Elektrik, Avto master, Remont va h.k.).',
    '3. Reyting va Ball: Jami yig\'ilgan Xayrli Ball (0-100) va mijoz/xodim yulduzchalari.',
    '4. VIP Homiylik nishoni: Oltin toj shaklida homiy ustalar uchun ajralib turuvchi belgi.',
    '5. Imtiyozli Usta nishoni: Zumrad qalqon belgisi (nogironligi bor yoki faxriy ustalar uchun).',
    '6. Veb-sayt / Manzil tugmasi: Ustaninig tashqi portfolioga to\'g\'ridan-to\'g\'ri yo\'naltiruvchi havola.',
    '7. Sensor aloqa tugmalari: Bir bosishda to\'g\'ridan-to\'g\'ri qo\'ng\'iroq qilish, Telegram va Instagram.',
  ];

  cardElements.forEach((el) => {
    doc.fillColor(colors.textMain).fontSize(8.5).font('Helvetica').text(el, 55, doc.y, { lineGap: 2 });
  });

  // --- SAHIFA 2: KO'P OMILLIK REYTING FORMULASI VA MEZONLARI ---
  doc.addPage();
  doc.rect(45, 25, 505, 5).fill(colors.primary);

  doc.y = 45;
  doc.fillColor(colors.primary).fontSize(14).font('Helvetica-Bold').text('4. ADOLATLI KO\'P OMILLIK REYTING ALGORITMI (SCORING FORMULA)');
  doc.fillColor(colors.textMuted).fontSize(9).font('Helvetica').text('Top 10 talikni shakllantirishda insoniy adolat, sifat va ijtimoiy himoyani ta\'minlovchi ball tizimi');
  doc.moveDown(0.8);

  // Formula qutisi
  doc.roundedRect(45, doc.y, 505, 45, 6).fillAndStroke(colors.primaryLight, colors.primary);
  doc.fillColor(colors.primaryDark).fontSize(11).font('Helvetica-Bold').text(
    'TotalScore = S_xodim (40) + S_mijoz (25) + S_homiy (20) + S_imtiyoz (15) + S_profil (5)   [Max: 100 ball]',
    55, doc.y + 16, { width: 485, align: 'center' }
  );

  doc.y += 55;

  // Mezonlar Jadvali
  const scoringBreakdown = [
    {
      title: '1. Xodimlar / Admin bahosi (S_xodim) — Maksimal 40 ball',
      desc: 'Platforma xodimlari yoki moderatorlari usta sifatini tekshirib 1.0 dan 5.0 gacha baho qo\'yadi. (Formula: AdminRating / 5 * 40 ball). Mutaxassislik guvohnomasi, asbob-uskunalari va portfoliosi inobatga olinadi.',
      badge: 'Max: 40 ball',
      color: colors.blue,
      bg: colors.blueBg,
    },
    {
      title: '2. Mijozlar sharhlari va yulduzchalari (S_mijoz) — Maksimal 25 ball',
      desc: 'Haqiqiy mijozlar qoldirgan baho (1..5) va sharhlar soni. (Formula: ClientRating / 5 * 20 + min(5, Sharhlar * 0.5)). Haqiqiy xizmat olgan buyurtmachilar bahosi shaffof saqlanadi.',
      badge: 'Max: 25 ball',
      color: colors.amber,
      bg: colors.amberBg,
    },
    {
      title: '3. To\'lov / Homiylik darajasi (S_homiy) — Maksimal 20 ball',
      desc: 'Ustaning qo\'shimcha homiylik to\'lovi: VIP Gold tarifida +20 ball (30 kunlik oltin nishon); Standard tarifida +10 ball (7 kunlik nishon); Free tarifida +0 ball. Muddat tugagach avtomatik bekor bo\'ladi.',
      badge: 'Max: 20 ball',
      color: colors.primary,
      bg: colors.primaryLight,
    },
    {
      title: '4. Ijtimoiy imtiyoz bonusi (S_imtiyoz) — Maksimal 15 ball',
      desc: 'Adolat va ijtimoiy birdamlik printsipi asosida nogironligi bo\'lgan mohir ustalarga, Yoshlar daftari tadbirkorlariga yoki faxriy xalq ustalariga admin tomonidan +15 ball bonus va "Imtiyozli Usta" zumrad nishoni beriladi.',
      badge: 'Max: 15 ball',
      color: colors.emerald,
      bg: colors.emeraldBg,
    },
    {
      title: '5. Profil to\'liqligi va URL (S_profil) — Maksimal 5 ball',
      desc: 'Usta o\'zining rasmiy veb-sayti yoki portfoliosi manzilini (websiteUrl) kiritgan bo\'lsa +3 ball, admin tomonidan shaxsi tasdiqlangan (Verified) bo\'lsa +2 ball taqdim etiladi.',
      badge: 'Max: 5 ball',
      color: colors.textMain,
      bg: colors.cardBg,
    },
  ];

  scoringBreakdown.forEach((item) => {
    const itemY = doc.y;
    doc.roundedRect(45, itemY, 505, 52, 6).fillAndStroke(item.bg, colors.borderColor);
    
    doc.fillColor(item.color).fontSize(9.5).font('Helvetica-Bold').text(item.title, 55, itemY + 8);
    doc.fillColor(colors.textMain).fontSize(8).font('Helvetica').text(item.desc, 55, itemY + 22, { width: 410, lineGap: 1.5 });
    
    // O'ng taraf badge
    doc.roundedRect(470, itemY + 8, 70, 18, 4).fill(item.color);
    doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold').text(item.badge, 470, itemY + 12, { width: 70, align: 'center' });

    doc.y = itemY + 58;
  });

  doc.moveDown(0.5);

  // 5-Bo'lim: Admin Boshqaruv Imkoniyatlari
  doc.fillColor(colors.primary).fontSize(12).font('Helvetica-Bold').text('5. ADMIN BOSHQARUV MARKAZI IMKONIYATLARI');
  doc.moveDown(0.3);

  const adminCapabilities = [
    '• Xodim bahosini kiritish: Har bir e\'lon uchun alohida 1.0 dan 5.0 gacha xodim bahosini tanlash.',
    '• Tarif va Homiylik boshqaruvi: Bir teginishda "Oddiy (Free)", "Standart Homiy" yoki "VIP Gold" maqomini berish.',
    '• Ijtimoiy imtiyoz berish: Nogironlik, Yoshlar startapi, Faxriy usta yoki Ijtimoiy himoya toifasini biriktirish.',
    '• Ballarni avtomatik sinxronlash: "Ballarni Sinxronlash" tugmasi orqali butun bazadagi ustalarning ballarini qayta hisoblash.',
    '• Shaxsni tasdiqlash (Verified): Ustaga rasmiy ko\'k galochka nishonini berish yoki bekor qilish.',
  ];

  adminCapabilities.forEach((cap) => {
    doc.fillColor(colors.textMain).fontSize(8.5).font('Helvetica').text(cap, 55, doc.y, { lineGap: 2 });
  });

  // --- SAHIFA 3: RIVOJLANTIRISh YO'L XARITASI (ROADMAP) ---
  doc.addPage();
  doc.rect(45, 25, 505, 5).fill(colors.primary);

  doc.y = 45;
  doc.fillColor(colors.primary).fontSize(15).font('Helvetica-Bold').text('6. RIVOJLANTIRISH YO\'L XARITASI (PROJECT ROADMAP)');
  doc.fillColor(colors.textMuted).fontSize(9).font('Helvetica').text('XayrliIsh.uz platformasining amalga oshirilgan va rejalashtirilgan strategik bosqichlari');
  doc.moveDown(0.8);

  const roadmapPhases = [
    {
      phase: '1-BOSQICH',
      title: 'Xavfsizlik, Autentifikatsiya va Prod Tayyorgarlik',
      status: 'BAJARILDI',
      statusColor: colors.emerald,
      statusBg: colors.emeraldBg,
      items: [
        'Admin paroli va sirlari ochiq matndan olib tashlandi.',
        'HMAC SHA-256 xavfsiz kriptografik sessiya va timing-safe taqqoslash o\'rnatildi.',
        'Brute-force hujumlariga qarshi 5 ta urinishdan so\'ng 15 daqiqalik blokirovka kiritildi.',
        'Input sanitization (XSS himoyasi) va Zod validatsiyasi kuchaytirildi.',
      ],
    },
    {
      phase: '2-BOSQICH',
      title: 'Ma\'lumotlar Bazasi va Ko\'p Omillik Reyting Logikasi',
      status: 'BAJARILDI',
      statusColor: colors.emerald,
      statusBg: colors.emeraldBg,
      items: [
        'Prisma MongoDB schema kengaytirildi: websiteUrl, adminRating, clientRating, paidTier, privilegeType, totalScore maydonlari.',
        'Adolatli 100 ballik formula lib/scoring.ts ga chiqarildi.',
        'Mavjud 18 ta usta e\'lonlariga ballar va toifalar hisoblab chiqildi.',
      ],
    },
    {
      phase: '3-BOSQICH',
      title: '"Top 10" Peshqadam Ustalari va Vizual UI/UX',
      status: 'BAJARILDI',
      statusColor: colors.emerald,
      statusBg: colors.emeraldBg,
      items: [
        'ModeTabSwitcher komponenti: "Umumiy Katalog" va "Top 10 Reyting" ikkitalik boshqaruv.',
        'Kartochkalarda #1 Oltin Usta, #2 Kumush, #3 Bronza nishonlari.',
        'VIP Homiylik (zarhal toj) va Imtiyozli Usta (zumrad qalqon) badjlari.',
        'Ustanining veb-sayti va manziliga to\'g\'ridan-to\'g\'ri havola tugmasi.',
        'Header: XayrliIsh.uz brendi, Uz | Ru | En tillar paneli.',
      ],
    },
    {
      phase: '4-BOSQICH',
      title: 'Admin Boshqaruv Markazi va Tezkor Nazorat',
      status: 'BAJARILDI',
      statusColor: colors.emerald,
      statusBg: colors.emeraldBg,
      items: [
        'Har bir usta uchun Xodim bahosini sozlash interfeysi (3.0 dan 5.0 gacha).',
        'Homiylik darajasini sozlash (Free, Standard, VIP Gold).',
        'Ijtimoiy imtiyoz biriktirish (Nogironlik, Yoshlar, Faxriy, Himoya).',
        'Barcha ballarni bir bosishda sinxronlash (Recalculate all scores).',
      ],
    },
    {
      phase: '5-BOSQICH',
      title: 'Onlayn To\'lov Tizimlari va SMS Verifikatsiya',
      status: 'KEYINGI BOSQICH',
      statusColor: colors.blue,
      statusBg: colors.blueBg,
      items: [
        'Click va Payme to\'lov shlyuzlarini ulash (VIP Homiylikni avtomatik xarid qilish).',
        'Usta telefon raqamini SMS OTP kod orqali haqiqiy egasini tasdiqlash.',
        'Avtomatik hisob-faktura va to\'lov cheklarini shakllantirish.',
      ],
    },
    {
      phase: '6-BOSQICH',
      title: 'Telegram Bot va Mobil Ilova Integratsiyasi',
      status: 'KELGUSI REJA',
      statusColor: colors.textMuted,
      statusBg: colors.cardBg,
      items: [
        'Ustalar uchun maxsus Telegram bot (yangi buyurtmalar haqida darhol xabar olish).',
        'Mijozlar uchun qulay PWA yoki React Native mobil ilova.',
        'GPS geolokatsiya orqali eng yaqin ustani xaritada ko\'rsatish.',
      ],
    },
  ];

  roadmapPhases.forEach((p) => {
    const phaseY = doc.y;
    doc.roundedRect(45, phaseY, 505, 58, 6).fillAndStroke(colors.cardBg, colors.borderColor);

    // Bosqich belgisi
    doc.fillColor(colors.primary).fontSize(8.5).font('Helvetica-Bold').text(p.phase, 55, phaseY + 6);
    doc.fillColor(colors.textMain).fontSize(10).font('Helvetica-Bold').text(p.title, 115, phaseY + 6);

    // Status badge
    doc.roundedRect(440, phaseY + 6, 100, 16, 4).fill(p.statusBg);
    doc.rect(440, phaseY + 6, 100, 16).stroke(p.statusColor);
    doc.fillColor(p.statusColor).fontSize(7.5).font('Helvetica-Bold').text(p.status, 440, phaseY + 10, { width: 100, align: 'center' });

    // Itemlar
    let bulletY = phaseY + 22;
    p.items.slice(0, 2).forEach((it) => {
      doc.fillColor(colors.textMuted).fontSize(7.5).font('Helvetica').text(`✓ ${it}`, 55, bulletY, { width: 475 });
      bulletY += 11;
    });

    doc.y = phaseY + 64;
  });

  // Pastki yakuniy ma'lumot
  doc.moveDown(0.5);
  doc.roundedRect(45, doc.y, 505, 30, 4).fill(colors.primaryLight);
  doc.fillColor(colors.primaryDark).fontSize(8.5).font('Helvetica-Bold').text(
    'Hujjat XayrliIsh.uz boshqaruv guruhi tomonidan tasdiqlangan. Loyiha ko\'rsatilgan mezonlarga qat\'iy mos holda rivojlantiriladi.',
    55, doc.y + 10, { width: 485, align: 'center' }
  );

  // Har bir sahifaga pastki footer (Sahifa raqamlari) qo'shish
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor(colors.borderColor).lineWidth(0.5).moveTo(45, 800).lineTo(550, 800).stroke();
    doc.fillColor(colors.textMuted).fontSize(8).font('Helvetica').text(
      'XayrliIsh.uz — Texnik Topshiriq va Rivojlantirish Yo\'l Xaritasi (Roadmap)',
      45, 808
    );
    doc.fillColor(colors.textMuted).fontSize(8).font('Helvetica-Bold').text(
      `Sahifa ${i + 1} / ${range.count}`,
      480, 808, { width: 70, align: 'right' }
    );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log('PDF muvaffaqiyatli yaratildi:', outputPath);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

generateTZRoadmapPDF().catch((err) => {
  console.error('PDF yaratishda xatolik:', err);
  process.exit(1);
});
