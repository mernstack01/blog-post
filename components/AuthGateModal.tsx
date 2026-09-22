'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtpAction, verifyOtpAction } from '@/actions/user-auth-actions';
import { adminLoginAction } from '@/actions/admin-actions';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  User,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AuthGateModalProps {
  onSuccess: (user: any) => void;
  onClose?: () => void;
}

export default function AuthGateModal({ onSuccess, onClose }: AuthGateModalProps) {
  const router = useRouter();
  const { lang } = useLanguage();

  // Rejim: Foydalanuvchi (OTP) yoki Admin (PIN)
  const [authMode, setAuthMode] = useState<'USER' | 'ADMIN'>('USER');

  // Foydalanuvchi holati
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [registeredUserName, setRegisteredUserName] = useState<string | null>(null);

  // Admin holati
  const [adminPin, setAdminPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Telefon raqam kiritilishini formatlash
  const handlePhoneChange = (val: string) => {
    let clean = val;
    if (!clean.startsWith('+998')) {
      clean = '+998 ';
    }
    setPhone(clean);
  };

  // 1-qadam: OTP yuborish
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await sendOtpAction(phone);
      if (res.success) {
        setDevCode(res.devCode || null);
        setIsRegistered(Boolean(res.isRegistered));
        setRegisteredUserName(res.userName || null);
        setStep('OTP');
      } else {
        setError(res.message);
      }
    } catch {
      setError(lang === 'ru' ? "Произошла ошибка при отправке кода. Попробуйте еще раз." : "Kod yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  // 2-qadam: OTP tasdiqlash
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtpAction(phone, otpCode, isRegistered ? undefined : name);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.message);
      }
    } catch {
      setError(lang === 'ru' ? "Произошла ошибка при подтверждении кода. Попробуйте еще раз." : "Tasdiqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  // Admin PIN tekshirish
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLoginAction(adminPin);
      if (res.success) {
        if (onClose) onClose();
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.message || (lang === 'ru' ? 'Неверный PIN-код' : "Noto'g'ri PIN-kod"));
      }
    } catch {
      setError(lang === 'ru' ? 'Ошибка входа' : 'Kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-card text-card-foreground rounded-3xl border border-border p-5 sm:p-10 shadow-xl max-w-lg mx-auto my-auto text-center animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[calc(100dvh-2rem)] overscroll-contain ${onClose ? 'pt-16 sm:pt-16' : ''}`}>
      
      {/* Yopish tugmasi */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-2xl bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer z-10 shrink-0"
          title={lang === 'ru' ? "Закрыть" : "Yopish"}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Yuqori yuklanish progress chizig'i */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted overflow-hidden">
          <div className="w-full h-full bg-primary animate-pulse" />
        </div>
      )}

      {/* Foydalanuvchi va Admin Tab Almashtirgich */}
      <div className="flex p-1 bg-secondary rounded-2xl mb-6 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => {
            setAuthMode('USER');
            setError(null);
          }}
          className={`grow basis-auto min-w-0 py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            authMode === 'USER'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>{lang === 'ru' ? 'Пользователь' : 'Foydalanuvchi'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('ADMIN');
            setError(null);
          }}
          className={`grow basis-auto min-w-0 py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            authMode === 'ADMIN'
              ? 'bg-card text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-muted-foreground hover:text-purple-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Admin</span>
        </button>
      </div>

      {authMode === 'ADMIN' ? (
        /* ================= ADMIN KIRISH QISMI ================= */
        <div>
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 shrink-0">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2">
            {lang === 'ru' ? 'Вход в панель администратора' : "Admin boshqaruviga kirish"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            {lang === 'ru'
              ? 'Введите секретный PIN-код для входа в систему управления.'
              : "Sirdaryo Xizmatlari boshqaruv paneli uchun maxfiy PIN-kodni kiriting."}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {lang === 'ru' ? 'Секретный PIN-код' : "Admin Maxfiy PIN-kod"}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
                <input
                  type={showAdminPin ? 'text' : 'password'}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground text-sm font-semibold tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPin(!showAdminPin)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-md transition-colors shrink-0"
                  title={showAdminPin ? (lang === 'ru' ? "Скрыть" : "Yashirish") : (lang === 'ru' ? "Показать" : "Ko'rsatish")}
                  tabIndex={-1}
                >
                  {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{lang === 'ru' ? 'Проверка PIN-кода...' : 'PIN-kod tekshirilmoqda...'}</span>
                </div>
              ) : (
                <>
                  <span>{lang === 'ru' ? 'Войти как администратор' : "Admin sifatida kirish"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>
              {lang === 'ru'
                ? 'Защищенная административная сессия'
                : "Maxfiy shifrlangan admin sessiyasi"}
            </span>
          </div>
        </div>
      ) : (
        /* ================= FOYDALANUVCHI (OTP) QISMI ================= */
        <div>
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 shrink-0">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2">
            {step === 'PHONE'
              ? (lang === 'ru' ? 'Вход / Регистрация' : "Kirish / Ro'yxatdan o'tish")
              : isRegistered
              ? (lang === 'ru' ? 'С возвращением!' : 'Xush kelibsiz!')
              : (lang === 'ru' ? 'Регистрация нового пользователя' : "Yangi hisob yaratish")}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            {step === 'PHONE'
              ? (lang === 'ru'
                  ? 'Введите ваш номер телефона. Мы отправим 4-значный код подтверждения.'
                  : "Telefon raqamingizni kiriting. Sizga 4 xonali tasdiqlash kodi taqdim etiladi.")
              : isRegistered
              ? (lang === 'ru'
                  ? `Здравствуйте, ${registeredUserName || 'пользователь'}! Введите 4-значный код для входа в систему:`
                  : `Assalomu alaykum, ${registeredUserName || 'foydalanuvchi'}! Tizimga kirish uchun 4 xonali kodni kiriting:`)
              : (lang === 'ru'
                  ? `Мы отправили код на номер ${phone}. Введите его и укажите ваше имя:`
                  : `${phone} raqamiga yuborilgan kodni kiriting va ismingizni ko'rsating:`)}
          </p>

          {/* Development Rejimidagi Maxsus Kod */}
          {devCode && step === 'OTP' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-300 dark:border-amber-700 text-left animate-in slide-in-from-top-2 duration-300 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{lang === 'ru' ? 'Тестовый режим (Development)' : "Sinov rejimi (Development)"}</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mb-2">
                {lang === 'ru'
                  ? 'Telegram бот находится в разработке. Ваш код подтверждения:'
                  : "Telegram bot ishlab chiqilmoqda. Sizning tasdiqlash kodingiz:"}
              </p>
              <div className="flex items-center justify-between bg-card p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-xl font-black tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                  {devCode}
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode(devCode)}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {lang === 'ru' ? 'Вставить код' : "Kodni qo'yish"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-qadam: Telefon raqam formasi */}
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {lang === 'ru' ? 'Номер телефона' : "Telefon raqamingiz"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    disabled={loading}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    <span>{lang === 'ru' ? 'Отправка кода...' : 'Kod yuborilmoqda...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{lang === 'ru' ? 'Получить код' : "Kodni olish"}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* 2-qadam: OTP kod va ism formasi */
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {lang === 'ru' ? '4-значный код из SMS/Бота' : "4 xonali tasdiqlash kodi"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    disabled={loading}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground text-base font-black tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Faqat YANGI foydalanuvchidan ism so'raladi */}
              {!isRegistered && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Ваше имя или название' : "Ismingiz yoki korxona nomi"} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
                    <input
                      type="text"
                      value={name}
                      disabled={loading}
                      required
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ru' ? 'Например: Уста Али' : "Masalan: Usta Ali"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all disabled:opacity-60"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {lang === 'ru' ? 'Будет отображаться в ваших объявлениях' : "E'lonlaringizda ushbu nom ko'rsatiladi"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length < 4 || (!isRegistered && !name.trim())}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>{lang === 'ru' ? 'Проверка...' : 'Tasdiqlanmoqda...'}</span>
                  </div>
                ) : isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{lang === 'ru' ? 'Войти в систему' : "Tizimga kirish"}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{lang === 'ru' ? 'Зарегистрироваться и войти' : "Ro'yxatdan o'tish va Kirish"}</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('PHONE');
                    setError(null);
                  }}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  {lang === 'ru' ? '← Изменить номер телефона' : "← Boshqa raqam kiritish"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              {lang === 'ru'
                ? 'Безопасная авторизация через одноразовый пароль'
                : "Bir martalik parol orqali xavfsiz avtorizatsiya"}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
