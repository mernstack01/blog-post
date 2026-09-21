'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserAction, logoutUserAction } from '@/actions/user-auth-actions';
import { useRouter } from 'next/navigation';
import AuthGateModal from '@/components/AuthGateModal';

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  role: string;
  listingLimit: number;
  totalUsed?: number;
  remaining?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  // Agar serverdan initialUser o'zgarsa (masalan router.refresh dan keyin)
  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    setIsAuthModalOpen(false);
    router.refresh();
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUserAction();
      setUser(null);
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user as AuthUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}

      {/* Global Kirish / Ro'yxatdan o'tish Modali */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={closeAuthModal}
        >
          <div className="w-full max-w-lg relative my-auto" onClick={(e) => e.stopPropagation()}>
            <AuthGateModal
              onSuccess={(u) => login(u)}
              onClose={closeAuthModal}
            />
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
