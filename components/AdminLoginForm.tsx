'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/actions/admin-actions';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLoginForm() {
  const { lang } = useLanguage();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError(lang === 'ru' ? 'Пожалуйста, введите PIN-код' : 'Iltimos, PIN-kodni kiriting');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLoginAction(pin);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.message || (lang === 'ru' ? 'Неверный код' : "Noto'g'ri kod"));
      }
    } catch (err: any) {
      setError(err?.message || (lang === 'ru' ? 'Непредвиденная ошибка' : 'Kutilmagan xatolik'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-xl shadow-black/5">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-xs shrink-0">
        <ShieldCheck className="w-6 h-6 shrink-0" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">
          {lang === 'ru' ? 'Вход в панель администратора' : 'Admin Panelga Kirish'}
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {lang === 'ru'
            ? 'Безопасная система управления платформой Сырдарья Услуги'
            : "Sirdaryo Xizmat platformasi ma'muriyati uchun xavfsiz boshqaruv tizimi"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            {lang === 'ru' ? 'Секретный PIN-код администратора' : 'Admin Maxfiy PIN-kod'}
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border text-sm text-foreground bg-secondary/40 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono tracking-wider"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-md transition-colors shrink-0"
              title={showPin ? (lang === 'ru' ? 'Скрыть' : 'Yashirish') : (lang === 'ru' ? 'Показать' : "Ko'rsatish")}
              tabIndex={-1}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{lang === 'ru' ? 'Войти в систему' : 'Tizimga kirish'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>{lang === 'ru' ? 'Зашифрованная защищенная сессия' : 'Shifrlangan himoyalangan sessiya'}</span>
        </div>
      </form>
    </div>
  );
}
