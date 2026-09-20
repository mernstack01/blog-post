import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Fayl tanlanmagan." },
        { status: 400 }
      );
    }

    // 1. Fayl hajmini tekshirish
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "Fayl hajmi 10MB dan oshmasligi kerak." },
        { status: 400 }
      );
    }

    // 2. Fayl turini tekshirish
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/heic', 'image/heif'];
    if (!file.type.startsWith('image/') && !validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Faqat rasm fayllari (JPG, PNG, WebP) qabul qilinadi." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 3. Faylni public/uploads papkasiga saqlash
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir, { recursive: true });
      }

      // Xavfsiz fayl nomi generatsiya qilish
      const rawExt = path.extname(file.name).toLowerCase();
      const ext = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(rawExt)
        ? rawExt
        : '.jpg';
      const safeName = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
      const filePath = path.join(uploadsDir, safeName);

      await fs.promises.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${safeName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        name: file.name,
        size: file.size,
      });
    } catch (fsErr) {
      console.warn("Fayl tizimiga yozishda ogohlantirish (serverless/read-only bo'lishi mumkin), DataURL qaytarilmoqda:", fsErr);

      // Serverless (Vercel) kabi read-only tizimlarda Base64 DataURL orqali saqlash
      const base64 = buffer.toString('base64');
      const mime = file.type || 'image/jpeg';
      const dataUrl = `data:${mime};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        name: file.name,
        size: file.size,
      });
    }
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || "Rasm yuklashda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
