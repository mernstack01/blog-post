'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  SystemSettingsData,
  updateSystemSettingsAction,
} from '@/actions/settings-actions';
import { adminLogoutAction } from '@/actions/admin-actions';
import {
  Phone,
  Send,
  Mail,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sliders,
  Loader2,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface AdminSettingsClientProps {
  initialSettings: SystemSettingsData;
}

export default function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [settings, setSettings] = useState<SystemSettingsData>(initialSettings);
  const [formData, setFormData] = useState({
    siteTitle: initialSettings.siteTitle || 'TopBaza.uz',
    contactPhone: initialSettings.contactPhone || '+998 90 123 45 67',
    telegramUsername: initialSettings.telegramUsername || 'topbaza_admin',
    supportEmail: initialSettings.supportEmail || 'info@topbaza.uz',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await updateSystemSettingsAction({
        siteTitle: formData.siteTitle,
        contactPhone: formData.contactPhone,
        telegramUsername: formData.telegramUsername,
        supportEmail: formData.supportEmail,
      });

      if (res.success && res.settings) {
        setSettings({
          id: res.settings.id,
          siteTitle: res.settings.siteTitle,
          contactPhone: res.settings.contactPhone,
          telegramUsername: res.settings.telegramUsername,
          supportEmail: res.settings.supportEmail,
          updatedAt: res.settings.updatedAt,
        });
        setMessage({ text: "Sayt sozlamalari muvaffaqiyatli saqlandi!", type: 'success' });
      } else {
        setMessage({ text: res.message || "Xatolik yuz berdi", type: 'error' });
      }
    } catch {
      setMessage({ text: "Kutilmagan xatolik yuz berdi", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await adminLogoutAction();
  };

  return (
    <div className="space-y-6">
      {/* Sarlavha va Navigatsiya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              SuperAdmin
            </span>
            <span className="text-xs text-[#67625d] dark:text-zinc-400 font-medium">
              Global Sozlamalar
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#282624] dark:text-zinc-100 tracking-tight mt-1">
            Sayt va Aloqa Sozlamalari
          </h1>
        </div>

        {/* Sub-Navigatsiya Tablari */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 transition-colors"
          >
            E'lonlar
          </Link>
          <Link
            href="/admin/categories"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#67625d] dark:text-zinc-400 hover:text-[#282624] dark:hover:text-zinc-100 hover:bg-[#f6f3ef] dark:hover:bg-zinc-800 transition-colors"
          >
            Kategoriyalar
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
          >
            Sozlamalar
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="p-2 rounded-xl bg-[#f6f3ef] dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[#67625d] dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Xabar bildirishnomasi */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sozlamalar va Live Preview bloki */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asosiy Form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f2eee9] dark:border-zinc-800 mb-6">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-[#282624] dark:text-zinc-100">
              Aloqa va Ma'lumotlarni Tahrirlash
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sayt Nomi */}
            <div>
              <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-2">
                Sayt / Loyiha Sarlavhasi
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={formData.siteTitle}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  placeholder="TopBaza.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Sayt sarlavhalari va barcha sahifalarning footer qismida namoyish etiladi.
              </p>
            </div>

            {/* Aloqa Telefoni */}
            <div>
              <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-2">
                Asosiy Aloqa Telefoni
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Mijozlar to'g'ridan-to'g'ri qo'ng'iroq qilishi uchun havola qilinadi (tel:).
              </p>
            </div>

            {/* Telegram Username */}
            <div>
              <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-2">
                Telegram Admin / Qo'llab-quvvatlash (@ belgisisiz)
              </label>
              <div className="relative">
                <Send className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={formData.telegramUsername}
                  onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                  placeholder="topbaza_admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Telegram havolasi avtomatik tarzda: <code className="font-mono text-blue-600 dark:text-blue-400">https://t.me/{formData.telegramUsername.replace(/^@/, '') || 'username'}</code>
              </p>
            </div>

            {/* Support Email */}
            <div>
              <label className="block text-xs font-bold text-[#67625d] dark:text-zinc-300 uppercase tracking-wider mb-2">
                Qo'llab-quvvatlash Emaili
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  placeholder="info@topbaza.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-[#282624] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Hamkorlar va foydalanuvchilar murojaati uchun rasmiy pochta.
              </p>
            </div>

            {/* Saqlash tugmasi */}
            <div className="pt-4 border-t border-[#f2eee9] dark:border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>O'zgarishlarni Saqlash</span>
              </button>
            </div>
          </form>
        </div>

        {/* Jonli Ko'rinish (Live Preview) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#f2eee9] dark:border-zinc-800 mb-4">
              <Eye className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-[#282624] dark:text-zinc-100">
                Jonli Ko'rinish (Footer va Aloqa)
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/60 border border-[#e6e0da] dark:border-zinc-700 space-y-3">
              <div className="font-extrabold text-[#282624] dark:text-zinc-100 text-base">
                {formData.siteTitle || 'TopBaza.uz'}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Sirdaryo va butun O'zbekiston bo'ylab eng yaxshi mutaxassislar, kadrlar va xizmatlar platformasi.
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span>{formData.contactPhone || '+998 90 123 45 67'}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <span>@{formData.telegramUsername.replace(/^@/, '') || 'topbaza_admin'}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>{formData.supportEmail || 'info@topbaza.uz'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <span>
                Ushbu sozlamalar saqlangandan so'ng, saytning barcha sahifalarida, footerda va mijozlar bilan aloqa bo'limlarida bir zumda yangilanadi.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
