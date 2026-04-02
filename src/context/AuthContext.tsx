import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authWithTelegram, authWithGoogle, getAuthSession, logoutAuth, devLogin } from '../services/authService';
import { config } from '../config';
import type { User, AuthSession } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
}

interface AuthContextType extends AuthState {
  loginWithTelegram: () => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithDev: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isTelegramEnv: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = config.storageKeys.authSession;

function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

function detectTelegramEnv(): boolean {
  try {
    return !!(window.Telegram?.WebApp?.initDataUnsafe?.user);
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isTelegramEnv = detectTelegramEnv();

  const [state, setState] = useState<AuthState>(() => {
    const saved = loadSession();
    return {
      user: saved?.user ?? null,
      isLoggedIn: !!saved?.user,
      isLoading: false,
      isAuthModalOpen: false,
    };
  });

  /**
   * Ilova ochilganda saqlangan tokenni backend bilan tekshirish.
   * Token eskirgan yoki noto'g'ri bo'lsa sessiya o'chiriladi.
   */
  useEffect(() => {
    const session = loadSession();
    if (!session?.token) return;

    getAuthSession(session.token).then((result) => {
      if (result.success && result.data?.user) {
        setState(prev => ({ ...prev, user: result.data!.user, isLoggedIn: true }));
      } else {
        // Token yaroqsiz — tozalash
        clearSession();
        setState(prev => ({ ...prev, user: null, isLoggedIn: false }));
      }
    });
  }, []);

  // Telegram muhitida avtomatik login urinishi va UI sozlamalari
  useEffect(() => {
    if (isTelegramEnv) {
      // WebApp ni yarim ekrandan to'liq ekranga yoyish
      window.Telegram?.WebApp?.expand();
      // WebApp tayyor ekanligini Telegram ga bildirish
      window.Telegram?.WebApp?.ready();
      
      if (!state.isLoggedIn) {
        loginWithTelegram();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Telegram orqali login — initData backendga yuboriladi */
  const loginWithTelegram = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const tg = window.Telegram?.WebApp;
      const user = tg?.initDataUnsafe?.user;
      const initData = tg?.initData ?? '';

      if (!user) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const result = await authWithTelegram(initData, {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
      });

      if (result.success && result.data) {
        saveSession(result.data);
        setState(prev => ({
          ...prev,
          user: result.data!.user,
          isLoggedIn: true,
          isLoading: false,
          isAuthModalOpen: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Google orqali login — credential (ID token) backendga yuboriladi.
   * credential → Google Identity Services SDK dan keladi.
   */
  const loginWithGoogle = useCallback(async (credential: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authWithGoogle(credential);

      if (result.success && result.data) {
        saveSession(result.data);
        setState(prev => ({
          ...prev,
          user: result.data!.user,
          isLoggedIn: true,
          isLoading: false,
          isAuthModalOpen: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /** DEV ONLY: test user login */
  const loginWithDev = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await devLogin();
      if (result.success && result.data) {
        saveSession(result.data);
        setState(prev => ({
          ...prev,
          user: result.data!.user,
          isLoggedIn: true,
          isLoading: false,
          isAuthModalOpen: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setState(prev => ({ ...prev, isAuthModalOpen: false }));
  }, []);

  const logout = useCallback(async () => {
    const session = loadSession();
    if (session?.token) {
      await logoutAuth(session.token).catch(() => {});
    }
    clearSession();
    setState({ user: null, isLoggedIn: false, isLoading: false, isAuthModalOpen: false });
  }, []);

  const openAuthModal = useCallback(() => {
    setState(prev => ({ ...prev, isAuthModalOpen: true }));
  }, []);

  const closeAuthModal = useCallback(() => {
    setState(prev => ({ ...prev, isAuthModalOpen: false }));
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      loginWithTelegram,
      loginWithGoogle,
      loginWithDev,
      continueAsGuest,
      logout,
      openAuthModal,
      closeAuthModal,
      isTelegramEnv,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
