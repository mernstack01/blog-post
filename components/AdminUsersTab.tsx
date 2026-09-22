'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUsersAction,
  adminUpdateUserLimitAction,
} from '@/actions/admin-actions';
import {
  Users,
  Search,
  Phone,
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
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sarlavha va Qidiruv */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card text-card-foreground p-4 sm:p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
              CRUD
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {lang === 'ru' ? 'Лимиты объявлений' : "E'lon Limitlari"}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mt-1">
            {lang === 'ru'
              ? `Зарегистрированные специалисты (${users.length})`
              : `Ro'yxatdan o'tgan mutaxassislar (${users.length} nafar)`}
          </h2>
        </div>

        {/* Qidiruv */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ru' ? 'Поиск по имени или телефону...' : "Ism yoki telefon bo'yicha qidiruv..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Foydalanuvchilar Ro'yxati */}
      {loading ? (
        <div className="bg-card text-card-foreground rounded-3xl p-12 text-center border border-border">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
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
                className="bg-card text-card-foreground rounded-3xl border border-border p-4 sm:p-5 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between gap-4"
              >
                {/* Yuqori Qism: Ism, Telefon, Rol */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-md shadow-primary/20 shrink-0">
                      {u.name ? u.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                          {u.name}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                          {u.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{u.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistika nishonlari */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      {lang === 'ru' ? 'Всего объявлений' : "Jami E'lonlar"}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-foreground">
                      {u.totalListings} {lang === 'ru' ? 'объявл.' : 'ta'}
                    </span>
                  </div>
                </div>

                {/* Pastki Qism: Butun umrlik Limitni Boshqarish (CRUD) */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-foreground block truncate">
                      {lang === 'ru' ? 'Лимит на объявления:' : "E'lon Berish Limiti:"}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {lang === 'ru' ? 'Стандартно: 3 объявления' : "Standart: 3 ta e'lon"}
                    </span>
                  </div>

                  {/* Stepper va Saqlash */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleLimitChange(u.id, -1)}
                        className="p-1.5 hover:bg-muted text-muted-foreground transition-colors cursor-pointer shrink-0"
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
                        className="w-12 text-center text-xs font-black text-foreground bg-transparent focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleLimitChange(u.id, 1)}
                        className="p-1.5 hover:bg-muted text-muted-foreground transition-colors cursor-pointer shrink-0"
                        title={lang === 'ru' ? 'Увеличить на 1' : "Limitni 1 taga oshirish"}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isSaving || !isChanged}
                      onClick={() => handleSaveLimit(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                        isChanged
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs animate-pulse'
                          : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                      }`}
                      title={lang === 'ru' ? 'Сохранить изменения' : "O'zgarishni saqlash"}
                    >
                      {isSaving ? (
                        <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                      ) : (
                        <Save className="w-3 h-3 shrink-0" />
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
        <div className="bg-card text-card-foreground rounded-3xl p-12 text-center border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">
            {lang === 'ru' ? 'Пользователи не найдены' : 'Foydalanuvchilar topilmadi'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === 'ru' ? 'По вашему запросу специалисты не найдены.' : "Qidiruv so'rovingizga mos mutaxassis topilmadi."}
          </p>
        </div>
      )}

    </div>
  );
}
