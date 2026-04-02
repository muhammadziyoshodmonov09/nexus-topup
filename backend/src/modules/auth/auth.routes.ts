import type { FastifyInstance } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { verifyTelegramInitData } from '../../utils/telegram.js';
import { findOrCreateTelegramUser, findOrCreateGoogleUser } from './auth.service.js';
import { ok, fail } from '../../utils/response.js';
import { config } from '../../config.js';
import { requireAuth } from '../../middleware/auth.js';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

const googleClient = new OAuth2Client(config.google.clientId);

/** JWT payload strukturasi */
interface JwtPayload {
  userId: string;
  role: string;
}

export default async function authRoutes(app: FastifyInstance) {
  /**
   * POST /auth/telegram
   * Telegram Mini App initData ni verify qilib, JWT qaytaradi.
   */
  app.post<{ Body: { initData: string } }>('/auth/telegram', async (request, reply) => {
    const { initData } = request.body ?? {};
    if (!initData) return reply.code(400).send(fail('initData required'));

    const tgUser = verifyTelegramInitData(initData);

    // Dev rejim: bot token bo'lmasa, initDataUnsafe dan to'g'ridan parse
    let user;
    if (!tgUser && !config.telegram.botToken) {
      try {
        const params = new URLSearchParams(initData);
        const userStr = params.get('user');
        const parsed = userStr ? JSON.parse(userStr) : null;
        if (!parsed?.id) return reply.code(401).send(fail('Invalid Telegram data'));
        user = await findOrCreateTelegramUser(parsed);
      } catch {
        return reply.code(401).send(fail('Invalid Telegram data'));
      }
    } else {
      if (!tgUser) return reply.code(401).send(fail('Invalid Telegram initData'));
      user = await findOrCreateTelegramUser(tgUser);
    }

    const payload: JwtPayload = { userId: user.id, role: user.role };
    const token = app.jwt.sign(payload, { expiresIn: config.jwt.expiresIn });

    return reply.send(ok({ user, token }));
  });

  /**
   * POST /auth/google
   * Google credential (ID token) ni verify qilib, JWT qaytaradi.
   */
  app.post<{ Body: { credential: string } }>('/auth/google', async (request, reply) => {
    const { credential } = request.body ?? {};
    if (!credential) return reply.code(400).send(fail('credential required'));

    if (!config.google.clientId) {
      return reply.code(503).send(fail('Google auth not configured'));
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.google.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.sub) return reply.code(401).send(fail('Invalid Google token'));

      const user = await findOrCreateGoogleUser({
        sub: payload.sub,
        email: payload.email ?? '',
        name: payload.name ?? 'Google User',
        picture: payload.picture,
      });

      const jwtPayload: JwtPayload = { userId: user.id, role: user.role };
      const token = app.jwt.sign(jwtPayload, { expiresIn: config.jwt.expiresIn });

      return reply.send(ok({ user, token }));
    } catch {
      return reply.code(401).send(fail('Google verification failed'));
    }
  });

  /**
   * GET /auth/me
   * JWT token orqali joriy foydalanuvchini qaytaradi.
   */
  app.get('/auth/me', { preHandler: requireAuth }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) return reply.code(404).send(fail('User not found', 404));
    return reply.send(ok({
      id: user[0].id,
      displayName: user[0].displayName,
      email: user[0].email,
      avatarUrl: user[0].avatarUrl,
      role: user[0].role,
    }));
  });

  /**
   * POST /auth/logout
   * Frontend token ni o'chiradi (stateless JWT — backend da hech narsa yo'q).
   */
  app.post('/auth/logout', { preHandler: requireAuth }, async (_request, reply) => {
    return reply.send(ok({ message: 'Logged out' }));
  });

  /**
   * POST /auth/dev-login
   * FAQAT DEVELOPMENT UCHUN — production da bu route o'chiriladi.
   * Test foydalanuvchi yaratadi yoki topadi, JWT qaytaradi.
   */
  if (process.env.NODE_ENV !== 'production') {
    app.post('/auth/dev-login', async (_request, reply) => {
      const { generateId } = await import('../../utils/id.js');
      const { wallets } = await import('../../db/schema.js');

      const DEV_EMAIL = 'dev@uzpin.games';

      // Mavjud dev userni topish
      let existing = await db
        .select()
        .from(users)
        .where(eq(users.email, DEV_EMAIL))
        .limit(1);

      let userId: string;

      if (existing.length > 0) {
        userId = existing[0].id;
      } else {
        // Yangi dev user yaratish
        userId = generateId();
        await db.insert(users).values({
          id: userId,
          displayName: 'Dev User',
          email: DEV_EMAIL,
          avatarUrl: null,
          role: 'user',
          isActive: true,
        });
      }

      // Wallet mavjudligini tekshirish — yo'q bo'lsa yaratish
      const existingWallet = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .limit(1);

      if (existingWallet.length === 0) {
        await db.insert(wallets).values({
          id: generateId(),
          userId,
          balance: 0,
          currency: 'USD',
        });
      }

      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const payload: JwtPayload = { userId, role: 'user' };
      const token = app.jwt.sign(payload, { expiresIn: '7d' }); // Dev uchun uzoqroq

      return reply.send(ok({
        user: {
          id: user[0].id,
          displayName: user[0].displayName,
          email: user[0].email,
          avatarUrl: user[0].avatarUrl,
          role: user[0].role,
        },
        token,
      }));
    });
  }
}
