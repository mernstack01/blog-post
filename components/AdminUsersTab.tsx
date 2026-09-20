'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUsersAction,
  adminUpdateUserLimitAction,
  adminUpdateUserRoleAction,
} from '@/actions/admin-actions';
import { Role } from '@prisma/client';
import {
  Users,
  Search,
  ShieldCheck,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Minus,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminUsersTab() {
  const { lang } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [editLimits, setEditLimits] = useState<Record<string, number>>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminGetUsersAction();
      if (res.success && res.users) {
        setUsers(res.users);
        const limitsMap: Record<string, number> = {};
        res.users.forEach((u: any) => {
          limitsMap[u.id] = u.listingLimit ?? u.dailyLimit ?? 3;
        });
        setEditLimits(limitsMap);
      }
    } catch {
      setMessage({
        text: lang === 'ru' ? 'Ошибка загрузки пользователей' : 'Foydalanuvchilarni yuklashda xatolik',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLimitChange = (userId: string, delta: number) => {
    setEditLimits((prev) => {
      const current = prev[userId] ?? 3;
      const nextVal = Math.max(0, current + delta);
      return { ...prev, [userId]: nextVal };
    });
  };

  const handleSaveLimit = async (userId: string) => {
    setSavingUserId(userId);
    setMessage(null);
    const newLimit = editLimits[userId] ?? 3;

    try {
      const res = await adminUpdateUserLimitAction(userId, newLimit);
      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, listingLimit: newLimit, dailyLimit: newLimit } : u))
        );
      } else {
        setMessage({ text: res.message || (lang === 'ru' ? 'Ошибка' : 'Xatolik'), type: 'error' });
      }
    } catch {
      setMessage({
        text: lang === 'ru' ? 'Ошибка при обновлении лимита' : 'Limitni yangilashda xatolik yuz berdi',
        type: 'error',
      });
    } finally {
      setSavingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sarlavha va Qidiruv */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              CRUD
            </span>
            <span className="text-xs text-[#67625d] dark:text-zinc-400 font-medium">
              {lang === 'ru' ? 'Лимиты объявлений' : "E'lon Limitlari"}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#282624] dark:text-zinc-100 tracking-tight mt-1">
            {lang === 'ru'
              ? `Зарегистрированные специалисты (${users.length})`
              : `Ro'yxatdan o'tgan mutaxassislar (${users.length} nafar)`}
          </h2>
        </div>

        {/* Qidiruv */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#67625d] dark:text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ru' ? 'Поиск по имени или телефону...' : "Ism yoki telefon bo'yicha qidiruv..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm text-[#282624] dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Foydalanuvchilar Ro'yxati */}
      {loading ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-[#e6e0da] dark:border-zinc-800">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">
            {lang === 'ru' ? 'Загрузка списка специалистов...' : "Mutaxassislar ro'yxati yuklanmoqda..."}
          </p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((u) => {
            const currentLimit = editLimits[u.id] ?? u.dailyLimit ?? 3;
            const isSaving = savingUserId === u.id;
            const isChanged = currentLimit !== u.dailyLimit;

            return (
              <div
                key={u.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-[#e6e0da] dark:border-zinc-800 p-4 sm:p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/50 transition-all flex flex-col justify-between gap-4"
              >
                {/* Yuqori Qism: Ism, Telefon, Rol */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 shrink-0">
                      {u.name ? u.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#282624] dark:text-zinc-100 line-clamp-1">
                          {u.name}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          {u.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#67625d] dark:text-zinc-400 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{u.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistika nishonlari */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#67625d] dark:text-zinc-400 uppercase tracking-wider block">
                      {lang === 'ru' ? 'Всего объявлений' : "Jami E'lonlar"}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#282624] dark:text-zinc-100">
                      {u.totalListings} {lang === 'ru' ? 'объявл.' : 'ta'}
                    </span>
                  </div>
                </div>

                {/* Pastki Qism: Butun umrlik Limitni Boshqarish (CRUD) */}
                <div className="pt-3 border-t border-[#f6f3ef] dark:border-zinc-800 flex items-center justify-between gap-3 bg-[#f6f3ef]/40 dark:bg-zinc-800/30 p-3 rounded-2xl">
                  <div>
                    <span className="text-[11px] font-bold text-[#67625d] dark:text-zinc-400 block">
                      {lang === 'ru' ? 'Лимит на объявления:' : "E'lon Berish Limiti:"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'ru' ? 'Стандартно: 3 объявления' : "Standart: 3 ta e'lon"}
                    </span>
                  </div>

                  {/* Stepper va Saqlash */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-xl border border-[#e6e0da] dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleLimitChange(u.id, -1)}
                        className="p-1.5 hover:bg-[#f6f3ef] dark:hover:bg-zinc-700 text-[#67625d] dark:text-zinc-300 transition-colors cursor-pointer"
                        title={lang === 'ru' ? 'Уменьшить на 1' : "Limitni 1 taga kamaytirish"}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={currentLimit}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setEditLimits((prev) => ({ ...prev, [u.id]: val }));
                        }}
                        className="w-12 text-center text-xs font-black text-[#282624] dark:text-zinc-100 bg-transparent focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleLimitChange(u.id, 1)}
                        className="p-1.5 hover:bg-[#f6f3ef] dark:hover:bg-zinc-700 text-[#67625d] dark:text-zinc-300 transition-colors cursor-pointer"
                        title={lang === 'ru' ? 'Увеличить на 1' : "Limitni 1 taga oshirish"}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isSaving || !isChanged}
                      onClick={() => handleSaveLimit(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isChanged
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs animate-pulse'
                          : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 opacity-60 cursor-not-allowed'
                      }`}
                      title={lang === 'ru' ? 'Сохранить изменения' : "O'zgarishni saqlash"}
                    >
                      {isSaving ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      <span>{lang === 'ru' ? 'Сохранить' : 'Saqlash'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-[#e6e0da] dark:border-zinc-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#282624] dark:text-zinc-100">
            {lang === 'ru' ? 'Пользователи не найдены' : 'Foydalanuvchilar topilmadi'}
          </h3>
          <p className="text-xs text-[#67625d] dark:text-zinc-400 mt-1">
            {lang === 'ru' ? 'По вашему запросу специалисты не найдены.' : "Qidiruv so'rovingizga mos mutaxassis topilmadi."}
          </p>
        </div>
      )}

    </div>
  );
}
