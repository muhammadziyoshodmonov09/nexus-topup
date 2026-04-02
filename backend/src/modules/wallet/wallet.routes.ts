import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middleware/auth.js';
import {
  getWallet,
  getTransactions,
  topUpWallet,
} from './wallet.service.js';
import { ok, fail } from '../../utils/response.js';

interface JwtPayload { userId: string; role: string }

export default async function walletRoutes(app: FastifyInstance) {
  /**
   * GET /wallet
   * Foydalanuvchi hamyoni: balans va valyuta.
   */
  app.get('/wallet', { preHandler: requireAuth }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    const wallet = await getWallet(userId);
    if (!wallet) return reply.code(404).send(fail('Wallet not found', 404));
    return reply.send(ok({
      id: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
      updatedAt: wallet.updatedAt,
    }));
  });

  /**
   * GET /wallet/transactions
   * Tranzaksiyalar tarixi (oxirgi 20 ta).
   */
  app.get('/wallet/transactions', { preHandler: requireAuth }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    const txs = await getTransactions(userId);
    return reply.send(ok(txs));
  });

  /**
   * POST /wallet/topup/test
   * DEV ONLY: Click/Payme integratsiya qilinguncha manual top-up.
   * Production da bu route o'chiriladi.
   */
  app.post<{ Body: { amount: number; description?: string } }>(
    '/wallet/topup/test',
    { preHandler: requireAuth },
    async (request, reply) => {
      const { userId } = request.user as JwtPayload;
      const { amount, description } = request.body ?? {};

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return reply.code(400).send(fail('amount must be a positive number'));
      }
      if (amount > 10000) {
        return reply.code(400).send(fail('Max test top-up is $10,000'));
      }

      try {
        const result = await topUpWallet(userId, amount, description ?? 'Test Top-up');
        return reply.send(ok({
          balance: result.wallet.balance,
          transaction: result.transaction,
        }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Top-up failed';
        return reply.code(400).send(fail(msg));
      }
    }
  );
}
