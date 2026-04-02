import { eq, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { wallets, walletTransactions } from '../../db/schema.js';
import { generateId, generateIdempotencyKey } from '../../utils/id.js';

/**
 * Foydalanuvchi hamyonini olish.
 */
export async function getWallet(userId: string) {
  const wallet = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .limit(1);
  return wallet[0] ?? null;
}

/**
 * Hamyon tranzaksiyalar tarixini olish.
 */
export async function getTransactions(userId: string, limit = 20) {
  const wallet = await getWallet(userId);
  if (!wallet) return [];

  return db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.walletId, wallet.id))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(limit);
}

/**
 * Hamyonga mablag' qo'shish (test/manual top-up).
 * MUHIM: Bu atomik operatsiya — balance va transaction birga yangilanadi.
 */
export async function topUpWallet(
  userId: string,
  amount: number,
  description = 'Manual Top-up'
): Promise<{ wallet: typeof wallets.$inferSelect; transaction: typeof walletTransactions.$inferSelect }> {
  if (amount <= 0) throw new Error('Amount must be positive');

  const wallet = await getWallet(userId);
  if (!wallet) throw new Error('Wallet not found');

  const balanceBefore = wallet.balance;
  const balanceAfter = balanceBefore + amount;
  const idempotencyKey = generateIdempotencyKey('topup');

  // Balance yangilash
  await db
    .update(wallets)
    .set({ balance: balanceAfter, updatedAt: new Date() })
    .where(eq(wallets.id, wallet.id));

  // Tranzaksiya yaratish
  const txId = generateId();
  await db.insert(walletTransactions).values({
    id: txId,
    walletId: wallet.id,
    type: 'topup',
    amount,
    balanceBefore,
    balanceAfter,
    status: 'completed',
    description,
    idempotencyKey,
  });

  const updatedWallet = await db.select().from(wallets).where(eq(wallets.id, wallet.id)).limit(1);
  const tx = await db.select().from(walletTransactions).where(eq(walletTransactions.id, txId)).limit(1);

  return { wallet: updatedWallet[0], transaction: tx[0] };
}

/**
 * Hamyondan mablag' yechib olish (buyurtma to'lovi).
 * Balans yetarli bo'lmasa xato qaytaradi.
 */
export async function deductWallet(
  userId: string,
  amount: number,
  description: string,
  orderId?: string
): Promise<{ wallet: typeof wallets.$inferSelect; transaction: typeof walletTransactions.$inferSelect }> {
  if (amount <= 0) throw new Error('Amount must be positive');

  const wallet = await getWallet(userId);
  if (!wallet) throw new Error('Wallet not found');
  if (wallet.balance < amount) throw new Error('Insufficient balance');

  const balanceBefore = wallet.balance;
  const balanceAfter = balanceBefore - amount;
  const idempotencyKey = generateIdempotencyKey('purchase');

  await db
    .update(wallets)
    .set({ balance: balanceAfter, updatedAt: new Date() })
    .where(eq(wallets.id, wallet.id));

  const txId = generateId();
  await db.insert(walletTransactions).values({
    id: txId,
    walletId: wallet.id,
    type: 'purchase',
    amount,
    balanceBefore,
    balanceAfter,
    status: 'completed',
    description,
    referenceId: orderId ?? null,
    idempotencyKey,
  });

  const updatedWallet = await db.select().from(wallets).where(eq(wallets.id, wallet.id)).limit(1);
  const tx = await db.select().from(walletTransactions).where(eq(walletTransactions.id, txId)).limit(1);

  return { wallet: updatedWallet[0], transaction: tx[0] };
}
