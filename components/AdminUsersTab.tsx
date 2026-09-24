'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUsersAction,
  adminUpdateUserLimitAction,
  adminCreateUserAction,
  adminUpdateUserAction,
  adminDeleteUserAction,
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
  Edit2,
  Trash2,
  X,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Send,
  AlertTriangle,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface AdminUserItem {
  id: string;
  name: string;
  phone: string;
  role: 'USER' | 'SPECIALIST' | 'ADMIN' | string;
  listingLimit: number;
  dailyLimit?: number;
  telegram?: string | null;
  totalListings: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export default function AdminUsersTab() {
  const { lang } = useLanguage();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'SPECIALIST' | 'USER' | 'ADMIN'>('ALL');
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [editLimits, setEditLimits] = useState<Record<string, number>>({});

  // 1. Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    phone: '+998',
    role: 'SPECIALIST' as 'USER' | 'SPECIALIST' | 'ADMIN',
    listingLimit: 3,
    telegram: '',
  });

  // 2. Edit Modal State
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    role: 'SPECIALIST' as 'USER' | 'SPECIALIST' | 'ADMIN',
    listingLimit: 3,
    telegram: '',
  });

  // 3. Delete Modal State
  const [deletingUser, setDeletingUser] = useState<AdminUserItem | null>(null);
  const [deleteWithListings, setDeleteWithListings] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminGetUsersAction();
      if (res.success && res.users) {
        setUsers(res.users as AdminUserItem[]);
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

  // Quick Limit change
  const handleLimitChange = (userId: string, delta: number) => {
    setEditLimits((prev) => {
      const current = prev[userId] ?? 3;
      const nextVal = Math.max(0, current + delta);
      return { ...prev, [userId]: nextVal };
    });
  };

  // Quick Save Limit
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

  // --- CREATE USER ---
  const handleOpenCreate = () => {
    setCreateForm({
      name: '',
      phone: '+998',
      role: 'SPECIALIST',
      listingLimit: 3,
      telegram: '',
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || createForm.name.trim().length < 2) {
      setMessage({
        text: lang === 'ru' ? 'Имя должно содержать не менее 2 символов' : "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
        type: 'error',
      });
      return;
    }
    if (!createForm.phone.trim() || createForm.phone.replace(/[^\d]/g, '').length < 9) {
      setMessage({
        text: lang === 'ru' ? 'Введите корректный номер телефона' : "Telefon raqamini to'g'ri kiriting",
        type: 'error',
      });
      return;
    }

    setIsCreating(true);
    setMessage(null);

    try {
      const res = await adminCreateUserAction({
        name: createForm.name.trim(),
        phone: createForm.phone.trim(),
        role: createForm.role,
        listingLimit: Number(createForm.listingLimit) || 3,
        telegram: createForm.telegram ? createForm.telegram.trim() : null,
      });

      if (res.success && res.user) {
        setMessage({ text: res.message, type: 'success' });
        setUsers((prev) => [res.user as AdminUserItem, ...prev]);
        setEditLimits((prev) => ({ ...prev, [res.user!.id]: res.user!.listingLimit }));
        setIsCreateOpen(false);
      } else {
        setMessage({ text: res.message || (lang === 'ru' ? 'Ошибка создания' : 'Yaratishda xatolik'), type: 'error' });
      }
    } catch {
      setMessage({
        text: lang === 'ru' ? 'Ошибка при создании xodima' : "Xodim yaratishda xatolik yuz berdi",
        type: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // --- EDIT USER ---
  const handleOpenEdit = (user: AdminUserItem) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      role: (user.role as 'USER' | 'SPECIALIST' | 'ADMIN') || 'SPECIALIST',
      listingLimit: user.listingLimit ?? 3,
      telegram: user.telegram || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editForm.name.trim() || editForm.name.trim().length < 2) {
      setMessage({
        text: lang === 'ru' ? 'Имя должно содержать не менее 2 символов' : "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
        type: 'error',
      });
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await adminUpdateUserAction(editingUser.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        role: editForm.role,
        listingLimit: Number(editForm.listingLimit) || 0,
        telegram: editForm.telegram ? editForm.telegram.trim() : null,
      });

      if (res.success && res.user) {
        setMessage({ text: res.message, type: 'success' });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  name: res.user.name,
                  phone: res.user.phone,
                  role: res.user.role,
                  listingLimit: res.user.listingLimit,
                  dailyLimit: res.user.listingLimit,
                  telegram: res.user.telegram,
                }
              : u
          )
        );
        setEditLimits((prev) => ({ ...prev, [editingUser.id]: res.user.listingLimit }));
        setEditingUser(null);
      } else {
        setMessage({ text: res.message || (lang === 'ru' ? 'Ошибка обновления' : 'Yangilashda xatolik'), type: 'error' });
      }
    } catch {
      setMessage({
        text: lang === 'ru' ? 'Ошибка при обновлении данных' : "Ma'lumotlarni yangilashda xatolik yuz berdi",
        type: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // --- DELETE USER ---
  const handleOpenDelete = (user: AdminUserItem) => {
    setDeletingUser(user);
    setDeleteWithListings(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    setMessage(null);

    try {
      const res = await adminDeleteUserAction(deletingUser.id, {
        deleteListings: deleteWithListings,
      });

      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
        setDeletingUser(null);
      } else {
        setMessage({ text: res.message || (lang === 'ru' ? 'Ошибка удаления' : "O'chirishda xatolik"), type: 'error' });
      }
    } catch {
      setMessage({
        text: lang === 'ru' ? 'Ошибка при удалении' : "O'chirishda xatolik yuz berdi",
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.telegram && u.telegram.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateVal: string | Date | undefined) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Xabar bildirishnomasi */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            )}
            <span className="font-semibold">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sarlavha, Yangi qo'shish va Qidiruv bloki */}
      <div className="bg-card text-card-foreground p-5 sm:p-6 rounded-3xl border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                XODIMLAR CRUD
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {lang === 'ru' ? 'Управление сотрудниками' : "Xodimlar va Mutaxassislar Boshqaruvi"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mt-1">
              {lang === 'ru'
                ? `Зарегистрированные сотрудники (${users.length})`
                : `Ro'yxatdagi xodim va mutaxassislar (${users.length} nafar)`}
            </h2>
          </div>

          {/* Yangi Xodim Qo'shish Tugmasi */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreate}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span>{lang === 'ru' ? '+ Добавить сотрудника' : "+ Yangi Xodim Qo'shish"}</span>
            </button>
            <button
              onClick={fetchUsers}
              disabled={loading}
              type="button"
              className="p-2.5 rounded-2xl border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={lang === 'ru' ? 'Обновить список' : "Ro'yxatni yangilash"}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filtrlar va Qidiruv */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-border">
          {/* Rol bo'yicha filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === 'ALL'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang === 'ru' ? 'Все' : 'Barchasi'} ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('SPECIALIST')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === 'SPECIALIST'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang === 'ru' ? 'Специалисты' : 'Mutaxassislar'} (
              {users.filter((u) => u.role === 'SPECIALIST').length})
            </button>
            <button
              onClick={() => setRoleFilter('ADMIN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === 'ADMIN'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang === 'ru' ? 'Администраторы' : 'Adminlar'} (
              {users.filter((u) => u.role === 'ADMIN').length})
            </button>
            <button
              onClick={() => setRoleFilter('USER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === 'USER'
                  ? 'bg-zinc-700 text-white shadow-xs'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang === 'ru' ? 'Пользователи' : 'Foydalanuvchilar'} (
              {users.filter((u) => u.role === 'USER').length})
            </button>
          </div>

          {/* Qidiruv Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ru'
                  ? 'Поиск по имени, тел. или tg...'
                  : "Ism, telefon yoki telegram orqali..."
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Foydalanuvchilar Ro'yxati */}
      {loading ? (
        <div className="bg-card text-card-foreground rounded-3xl p-12 text-center border border-border">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
            {lang === 'ru' ? 'Загрузка списка специалистов...' : "Xodimlar ro'yxati yuklanmoqda..."}
          </p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUsers.map((u) => {
            const currentLimit = editLimits[u.id] ?? u.dailyLimit ?? 3;
            const isSaving = savingUserId === u.id;
            const isChanged = currentLimit !== (u.listingLimit ?? u.dailyLimit);

            // Role styling
            const isRoleAdmin = u.role === 'ADMIN';
            const isRoleSpecialist = u.role === 'SPECIALIST';

            return (
              <div
                key={u.id}
                className="bg-card text-card-foreground rounded-3xl border border-border p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between gap-4 relative group"
              >
                {/* 1. Yuqori Qism: Ism, Telefon, Rol va Action Tugmalar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md shrink-0 ${
                        isRoleAdmin
                          ? 'bg-rose-500 text-white shadow-rose-500/20'
                          : isRoleSpecialist
                          ? 'bg-primary text-primary-foreground shadow-primary/20'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {u.name ? u.name[0].toUpperCase() : 'U'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                          {u.name}
                        </h3>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${
                            isRoleAdmin
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : isRoleSpecialist
                              ? 'bg-primary/10 text-primary border-primary/20'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}
                        >
                          {isRoleAdmin ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : isRoleSpecialist ? (
                            <UserCheck className="w-3 h-3" />
                          ) : null}
                          <span>{u.role}</span>
                        </span>
                      </div>

                      {/* Telefon & Telegram */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap font-mono">
                        <a
                          href={`tel:${u.phone}`}
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{u.phone}</span>
                        </a>

                        {u.telegram && (
                          <a
                            href={`https://t.me/${u.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            <Send className="w-3 h-3 shrink-0" />
                            <span>@{u.telegram.replace('@', '')}</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 shrink-0 opacity-70" />
                        <span>Qo'shilgan: {formatDate(u.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Yuqori o'ng: E'lonlar soni va Asosiy Edit / Delete Tugmalari */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                        {lang === 'ru' ? 'Объявления' : "E'lonlar"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-lg bg-secondary text-foreground">
                        <FileText className="w-3 h-3 text-primary" />
                        <span>{u.totalListings} ta</span>
                      </span>
                    </div>

                    {/* CRUD Tugmalari: EDIT & DELETE */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border/60 hover:border-primary/30 text-xs font-bold transition-all cursor-pointer"
                        title={lang === 'ru' ? 'Редактировать сотрудника' : "Xodimni tahrirlash"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tahrirlash</span>
                      </button>

                      <button
                        onClick={() => handleOpenDelete(u)}
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border/60 hover:border-destructive/30 text-xs font-bold transition-all cursor-pointer"
                        title={lang === 'ru' ? 'Удалить сотрудника' : "Xodimni o'chirish"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">O'chirish</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Pastki Qism: E'lon berish limiti (tezkor boshqaruv) */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-foreground block truncate">
                      {lang === 'ru' ? 'Лимит на объявления:' : "E'lon Berish Limiti:"}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {lang === 'ru' ? 'Текущий лимит' : "Joriy limit: "}
                      <b className="text-foreground">{u.listingLimit ?? 3} ta</b>
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
                      <span>{lang === 'ru' ? 'Saqlash' : 'Saqlash'}</span>
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
            {lang === 'ru' ? 'Пользователи не найдены' : 'Xodimlar topilmadi'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === 'ru'
              ? 'По вашему запросу сотрудники не найдены.'
              : "Qidiruv so'rovingizga mos xodim yoki mutaxassis topilmadi."}
          </p>
        </div>
      )}

      {/* ========================================================
          1. MODAL: YANGI XODIM QO'SHISH (CREATE)
      ======================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {lang === 'ru' ? 'Добавить нового сотрудника' : "Yangi Xodim / Mutaxassis Qo'shish"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {lang === 'ru'
                    ? 'Создание нового специалиста с правами на публикацию'
                    : "E'lon berish va boshqarish huquqiga ega yangi xodim qo'shish"}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Ism */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {lang === 'ru' ? 'Ф.И.О. сотрудника' : 'Xodim Ism-familiyasi'}{' '}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              {/* Telefon & Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Номер телефона' : 'Telefon raqami'}{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+998901234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Telegram <span className="text-xs text-muted-foreground font-normal">(ixtiyoriy)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">@</span>
                    <input
                      type="text"
                      value={createForm.telegram}
                      onChange={(e) => setCreateForm({ ...createForm, telegram: e.target.value })}
                      placeholder="username"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Rol va E'lon Limiti */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Роль в системе' : 'Tizimdagi roli'}
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        role: e.target.value as 'USER' | 'SPECIALIST' | 'ADMIN',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                  >
                    <option value="SPECIALIST">Mutaxassis (SPECIALIST)</option>
                    <option value="USER">Oddiy Foydalanuvchi (USER)</option>
                    <option value="ADMIN">Administrator (ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Лимит объявлений' : "E'lon berish limiti"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={createForm.listingLimit}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        listingLimit: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>{lang === 'ru' ? 'Создать' : "Qo'shish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          2. MODAL: XODIMNI TAHRIRLASH (EDIT)
      ======================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {lang === 'ru' ? 'Редактировать сотрудника' : "Xodim Ma'lumotlarini Tahrirlash"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  ID: <span className="font-mono text-[11px]">{editingUser.id}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Ism */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {lang === 'ru' ? 'Ф.И.О. сотрудника' : 'Xodim Ism-familiyasi'}{' '}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              {/* Telefon & Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Номер телефона' : 'Telefon raqami'}{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+998901234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Telegram <span className="text-xs text-muted-foreground font-normal">(ixtiyoriy)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">@</span>
                    <input
                      type="text"
                      value={editForm.telegram}
                      onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value })}
                      placeholder="username"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Rol va E'lon Limiti */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Роль в системе' : 'Tizimdagi roli'}
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value as 'USER' | 'SPECIALIST' | 'ADMIN',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                  >
                    <option value="SPECIALIST">Mutaxassis (SPECIALIST)</option>
                    <option value="USER">Oddiy Foydalanuvchi (USER)</option>
                    <option value="ADMIN">Administrator (ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {lang === 'ru' ? 'Лимит объявлений' : "E'lon berish limiti"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={editForm.listingLimit}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        listingLimit: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{lang === 'ru' ? 'Сохранить изменения' : "Saqlash"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MODAL: XODIMNI O'CHIRISH (DELETE)
      ======================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-3xl border border-destructive/30 shadow-2xl p-6 relative">
            <button
              onClick={() => setDeletingUser(null)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {lang === 'ru' ? 'Удалить сотрудника?' : "Xodimni o'chirishni tasdiqlang"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {lang === 'ru' ? 'Действие необратимо' : "Bu amalni ortga qaytarib bo'lmaydi"}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border text-xs space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ism:</span>
                <span className="font-bold text-foreground">{deletingUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefon:</span>
                <span className="font-mono font-bold text-foreground">{deletingUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biriktirilgan e'lonlar:</span>
                <span className="font-black text-primary">{deletingUser.totalListings} ta</span>
              </div>
            </div>

            {/* E'lonlarni boshqarish opsiyasi */}
            {deletingUser.totalListings > 0 && (
              <div className="mb-5 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs space-y-2">
                <p className="font-bold text-amber-700 dark:text-amber-400">
                  {lang === 'ru'
                    ? `У сотрудника есть ${deletingUser.totalListings} объявлений:`
                    : `Ushbu xodim hisobida ${deletingUser.totalListings} ta e'lon mavjud:`}
                </p>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deleteOption"
                    checked={!deleteWithListings}
                    onChange={() => setDeleteWithListings(false)}
                    className="mt-0.5 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">
                      {lang === 'ru'
                        ? 'Сохранить объявления на сайте (рекомендуется)'
                        : "E'lonlarni saytda saqlab qolish (tavsiya etiladi)"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {lang === 'ru'
                        ? 'Объявления останутся активными как системные'
                        : "E'lonlar o'chmaydi, umumiy admin e'loni sifatida saytda qoladi"}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer pt-1 border-t border-amber-500/10">
                  <input
                    type="radio"
                    name="deleteOption"
                    checked={deleteWithListings}
                    onChange={() => setDeleteWithListings(true)}
                    className="mt-0.5 text-destructive focus:ring-destructive"
                  />
                  <div>
                    <span className="font-semibold text-destructive block">
                      {lang === 'ru'
                        ? 'Удалить все объявления сотрудника'
                        : "Xodimning barcha e'lonlarini ham o'chirish"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {lang === 'ru'
                        ? 'Все связанные объявления будут безвозвратно удалены'
                        : "Unga tegishli barcha e'lonlar bazadan to'liq o'chiriladi"}
                    </span>
                  </div>
                </label>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-xs sm:text-sm shadow-md shadow-destructive/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{lang === 'ru' ? 'Да, удалить' : "O'chirish"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

