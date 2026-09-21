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
  RefreshCw,
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
      // Agar mavjud user bo'lsa, nomini qayta yuborish shart emas
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

  // Admin PIN orqali kirish
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!adminPin.trim()) {
      setError(lang === 'ru' ? 'Введите PIN-код' : 'Iltimos, PIN-kodni kiriting');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLoginAction(adminPin);
      if (res.success) {
        onSuccess({ role: 'ADMIN', name: 'SuperAdmin' });
        if (onClose) onClose();
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.message || (lang === 'ru' ? 'Неверный PIN-код' : "Noto'g'ri PIN-kod"));
      }
    } catch (err: any) {
      setError(err?.message || (lang === 'ru' ? 'Ошибка входа' : "Kirishda xatolik yuz berdi"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl max-w-lg mx-auto my-6 text-center animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      
      {/* Yopish tugmasi (agar modal sifatida ochilgan bo'lsa) */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer z-10"
          title={lang === 'ru' ? "Закрыть" : "Yopish"}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Yuqori yuklanish (Loading) progress chizig'i */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-100 dark:bg-slate-800 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 animate-pulse" />
        </div>
      )}

      {/* Foydalanuvchi va Admin Tab Almashtirgich */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => {
            setAuthMode('USER');
            setError(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === 'USER'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Пользователь' : 'Foydalanuvchi'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('ADMIN');
            setError(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === 'ADMIN'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-500 hover:text-purple-600 dark:hover:text-purple-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      {authMode === 'ADMIN' ? (
        /* ================= ADMIN KIRISH QISMI ================= */
        <div>
          {/* Admin Nishon & Ikonka */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {lang === 'ru' ? 'Вход в панель администратора' : "Admin boshqaruviga kirish"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {lang === 'ru'
              ? 'Введите секретный PIN-код для входа в систему управления.'
              : "Sirdaryo Xizmatlari boshqaruv paneli uchun maxfiy PIN-kodni kiriting."}
          </p>

          {/* Xatolik xabari */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'ru' ? 'Секретный PIN-код' : "Admin Maxfiy PIN-kod"}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showAdminPin ? 'text' : 'password'}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPin(!showAdminPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md transition-colors"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 active:scale-95 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{lang === 'ru' ? 'Проверка PIN-кода...' : 'PIN-kod tekshirilmoqda...'}</span>
                </div>
              ) : (
                <>
                  <span>{lang === 'ru' ? 'Войти как администратор' : "Admin sifatida kirish"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Pastki xavfsizlik nishoni */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-purple-500" />
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
          {/* Yuqori Nishon & Ikonka */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {step === 'PHONE'
              ? (lang === 'ru' ? 'Вход / Регистрация' : "Kirish / Ro'yxatdan o'tish")
              : isRegistered
              ? (lang === 'ru' ? 'С возвращением!' : 'Xush kelibsiz!')
              : (lang === 'ru' ? 'Регистрация нового пользователя' : "Yangi hisob yaratish")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
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

          {/* Development Rejimidagi Maxsus Kod Bildirishnomasi */}
          {devCode && step === 'OTP' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-left animate-in slide-in-from-top-2 duration-300 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{lang === 'ru' ? 'Тестовый режим (Development)' : "Sinov rejimi (Development)"}</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mb-2">
                {lang === 'ru'
                  ? 'Telegram бот находится в разработке. Ваш код подтверждения:'
                  : "Telegram bot ishlab chiqilmoqda. Sizning tasdiqlash kodingiz:"}
              </p>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-xl font-black tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                  {devCode}
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode(devCode)}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'ru' ? 'Вставить код' : "Kodni qo'yish"}
                </button>
              </div>
            </div>
          )}

          {/* Xatolik xabari */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-qadam: Telefon raqam formasi */}
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ru' ? 'Номер телефона' : "Telefon raqamingiz"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    disabled={loading}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>{lang === 'ru' ? 'Отправка кода...' : 'Kod yuborilmoqda...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{lang === 'ru' ? 'Получить код' : "Kodni olish"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* 2-qadam: OTP kod va ism formasi */
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ru' ? '4-значный код из SMS/Бота' : "4 xonali tasdiqlash kodi"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    disabled={loading}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-black tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Faqat YANGI foydalanuvchidan ism so'raladi. Ro'yxatdan o'tgan foydalanuvchidan ISMI SO'RALMAYDI! */}
              {!isRegistered && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'ru' ? 'Ваше имя или название' : "Ismingiz yoki korxona nomi"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      disabled={loading}
                      required
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ru' ? 'Например: Уста Али' : "Masalan: Usta Ali"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    {lang === 'ru' ? 'Будет отображаться в ваших объявлениях' : "E'lonlaringizda ushbu nom ko'rsatiladi"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length < 4 || (!isRegistered && !name.trim())}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>{lang === 'ru' ? 'Проверка...' : 'Tasdiqlanmoqda...'}</span>
                  </div>
                ) : isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Войти в систему' : "Tizimga kirish"}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
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
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  {lang === 'ru' ? '← Изменить номер телефона' : "← Boshqa raqam kiritish"}
                </button>
              </div>
            </form>
          )}

          {/* Pastki xavfsizlik nishoni */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
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

