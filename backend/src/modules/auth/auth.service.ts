import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, authProviders, wallets } from '../../db/schema.js';
import { generateId } from '../../utils/id.js';
import type { TelegramUser } from '../../utils/telegram.js';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  role: string;
}

/**
 * Telegram user orqali foydalanuvchini topish yoki yangi yaratish.
 * Birinchi marta kirsa: users + auth_providers + wallets yaratiladi.
 */
export async function findOrCreateTelegramUser(tgUser: TelegramUser): Promise<AuthUser> {
  const providerId = String(tgUser.id);

  // Mavjud providerni qidirish
  const existing = await db
    .select({ userId: authProviders.userId })
    .from(authProviders)
    .where(eq(authProviders.providerId, providerId))
    .limit(1);

  if (existing.length > 0) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, existing[0].userId))
      .limit(1);
    if (user[0]) return toAuthUser(user[0]);
  }

  // Yangi user yaratish
  const userId = generateId();
  const displayName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ');
  const virtualEmail = `${tgUser.id}@uzpin.games`;

  await db.insert(users).values({
    id: userId,
    displayName,
    email: virtualEmail,
    avatarUrl: tgUser.photo_url ?? null,
    role: 'user',
    isActive: true,
  });

  await db.insert(authProviders).values({
    id: generateId(),
    userId,
    provider: 'telegram',
    providerId,
    providerData: JSON.stringify(tgUser),
  });

  // Wallet avtomatik yaratish
  await db.insert(wallets).values({
    id: generateId(),
    userId,
    balance: 0,
    currency: 'USD',
  });

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return toAuthUser(user[0]);
}

/**
 * Google user orqali foydalanuvchini topish yoki yangi yaratish.
 */
export async function findOrCreateGoogleUser(payload: {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<AuthUser> {
  const existing = await db
    .select({ userId: authProviders.userId })
    .from(authProviders)
    .where(eq(authProviders.providerId, payload.sub))
    .limit(1);

  if (existing.length > 0) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, existing[0].userId))
      .limit(1);
    if (user[0]) return toAuthUser(user[0]);
  }

  const userId = generateId();

  await db.insert(users).values({
    id: userId,
    displayName: payload.name,
    email: payload.email,
    avatarUrl: payload.picture ?? null,
    role: 'user',
    isActive: true,
  });

  await db.insert(authProviders).values({
    id: generateId(),
    userId,
    provider: 'google',
    providerId: payload.sub,
    providerData: JSON.stringify(payload),
  });

  await db.insert(wallets).values({
    id: generateId(),
    userId,
    balance: 0,
    currency: 'USD',
  });

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return toAuthUser(user[0]);
}

/** DB row ni API user formatiga o'tkazish */
function toAuthUser(row: typeof users.$inferSelect): AuthUser {
  return {
    id: row.id,
    displayName: row.displayName,
    email: row.email ?? null,
    avatarUrl: row.avatarUrl ?? null,
    role: row.role,
  };
}
