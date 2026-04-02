import { createHmac } from 'crypto';
import { config } from '../config.js';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

/**
 * Telegram initData ni bot token bilan verify qilish.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(initData: string): TelegramUser | null {
  try {
    if (!config.telegram.botToken) return null;

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return null;

    // auth_date tekshirish — 24 soatdan eski bo'lmasin
    const authDate = parseInt(params.get('auth_date') ?? '0', 10);
    if (Date.now() / 1000 - authDate > 86400) return null;

    // data-check-string: hash ni olib, alifbo tartibida saralash
    params.delete('hash');
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    // HMAC-SHA256 hisoblash
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(config.telegram.botToken)
      .digest();
    const expectedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (expectedHash !== hash) return null;

    // User ma'lumotlarini olish
    const userStr = params.get('user');
    if (!userStr) return null;
    return JSON.parse(userStr) as TelegramUser;
  } catch {
    return null;
  }
}
