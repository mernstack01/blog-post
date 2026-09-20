'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin-auth';

export interface SystemSettingsData {
  id: string;
  contactPhone: string;
  telegramUsername: string;
  supportEmail: string;
  siteTitle: string | null;
  updatedAt: Date;
}

const DEFAULT_SETTINGS = {
  contactPhone: "+998 90 123 45 67",
  telegramUsername: "xayrliish_admin",
  supportEmail: "info@xayrliish.uz",
  siteTitle: "XayrliIsh.uz",
};

/**
 * Saytning global aloqa va tizim sozlamalarini olish (Singleton)
 */
export async function getSystemSettingsAction(): Promise<SystemSettingsData> {
  try {
    const settingModel = (prisma as any)?.systemSetting;
    if (settingModel) {
      let setting = await settingModel.findFirst();
      if (!setting) {
        setting = await settingModel.create({
          data: DEFAULT_SETTINGS,
        });
      }
      if (setting) {
        return {
          id: setting.id,
          contactPhone: setting.contactPhone,
          telegramUsername: setting.telegramUsername,
          supportEmail: setting.supportEmail,
          siteTitle: setting.siteTitle,
          updatedAt: setting.updatedAt,
        };
      }
    }

    return {
      id: 'default',
      ...DEFAULT_SETTINGS,
      updatedAt: new Date(),
    };
  } catch {
    return {
      id: 'default',
      ...DEFAULT_SETTINGS,
      updatedAt: new Date(),
    };
  }
}

/**
 * Sayt aloqa sozlamalarini yangilash (Admin)
 */
export async function updateSystemSettingsAction(data: {
  contactPhone: string;
  telegramUsername: string;
  supportEmail: string;
  siteTitle?: string;
}) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return { success: false, message: 'Ruxsat berilmagan' };
    }

    const contactPhone = data.contactPhone.trim();
    const telegramUsername = data.telegramUsername.trim().replace(/^@/, '');
    const supportEmail = data.supportEmail.trim();
    const siteTitle = data.siteTitle?.trim() || 'XayrliIsh.uz';

    if (!contactPhone || !telegramUsername || !supportEmail) {
      return { success: false, message: "Barcha aloqa maydonlarini to'ldirish shart." };
    }

    const settingModel = (prisma as any)?.systemSetting;
    if (!settingModel) {
      return { success: false, message: "Tizim sozlamalari modeli topilmadi." };
    }

    let setting = await settingModel.findFirst();
    if (setting) {
      setting = await settingModel.update({
        where: { id: setting.id },
        data: {
          contactPhone,
          telegramUsername,
          supportEmail,
          siteTitle,
        },
      });
    } else {
      setting = await settingModel.create({
        data: {
          contactPhone,
          telegramUsername,
          supportEmail,
          siteTitle,
        },
      });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/settings');
    } catch {}

    return { success: true, message: "Sozlamalar muvaffaqiyatli saqlandi", settings: setting };
  } catch (error: any) {
    console.error('updateSystemSettingsAction error:', error);
    return { success: false, message: error?.message || "Sozlamalarni saqlashda xatolik yuz berdi" };
  }
}
