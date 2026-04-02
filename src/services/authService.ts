/**
 * Auth Service — Real Backend API
 *
 * Backend endpointlari:
 * POST /api/auth/telegram — Telegram login
 * POST /api/auth/google  — Google login
 * GET  /api/auth/me       — Joriy foydalanuvchi
 * POST /api/auth/logout   — Chiqish
 */

import { config } from '../config';
import type { ApiResponse, User, AuthSession } from '../types';

export type { User as AuthUser, AuthSession };

const API = config.apiBaseUrl;

/**
 * POST /auth/telegram — Telegram initData ni backendga yuboradi.
 * Backend HMAC-SHA256 bilan verify qiladi.
 */
export async function authWithTelegram(
  initData: string,
  _user: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string }
): Promise<ApiResponse<AuthSession>> {
  try {
    const res = await fetch(`${API}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });
    const json = await res.json();
    if (!json.success) return { success: false, data: null, error: json.error ?? 'Telegram auth failed' };

    // Backend {user, token} qaytaradi — AuthSession formatiga o'tkazish
    const { user, token } = json.data;
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email ?? '',
          displayName: user.displayName,
          avatar: user.avatarUrl ?? null,
          provider: 'telegram',
          providerId: user.id,
        },
        token,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 min (JWT expiry)
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}

/**
 * POST /auth/google — Google credential ni backendga yuboradi.
 * Backend google-auth-library bilan verify qiladi.
 */
export async function authWithGoogle(
  credential: string
): Promise<ApiResponse<AuthSession>> {
  try {
    const res = await fetch(`${API}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const json = await res.json();
    if (!json.success) return { success: false, data: null, error: json.error ?? 'Google auth failed' };

    const { user, token } = json.data;
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email ?? '',
          displayName: user.displayName,
          avatar: user.avatarUrl ?? null,
          provider: 'google',
          providerId: user.id,
        },
        token,
        expiresAt: Date.now() + 15 * 60 * 1000,
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}

/**
 * GET /auth/me — JWT token orqali joriy foydalanuvchini tekshirish.
 */
export async function getAuthSession(
  token: string
): Promise<ApiResponse<{ user: User }>> {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) return { success: false, data: null, error: json.error };

    const u = json.data;
    return {
      success: true,
      data: {
        user: {
          id: u.id,
          email: u.email ?? '',
          displayName: u.displayName,
          avatar: u.avatarUrl ?? null,
          provider: 'telegram',
          providerId: u.id,
        },
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}

/**
 * POST /auth/logout — Sessiyani tugatish.
 */
export async function logoutAuth(
  token: string
): Promise<ApiResponse<null>> {
  try {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return { success: true, data: null, error: null };
  } catch {
    return { success: true, data: null, error: null };
  }
}

/**
 * POST /auth/dev-login — FAQAT DEVELOPMENT UCHUN.
 * Test user yaratadi va JWT qaytaradi.
 */
export async function devLogin(): Promise<ApiResponse<AuthSession>> {
  try {
    const res = await fetch(`${API}/auth/dev-login`, { method: 'POST' });
    const json = await res.json();
    if (!json.success) return { success: false, data: null, error: json.error ?? 'Dev login failed' };

    const { user, token } = json.data;
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email ?? 'dev@uzpin.games',
          displayName: user.displayName,
          avatar: user.avatarUrl ?? null,
          provider: 'telegram',
          providerId: user.id,
        },
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 kun
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}
