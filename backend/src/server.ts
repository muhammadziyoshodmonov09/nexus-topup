import Fastify from 'fastify';
import fjwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { config } from './config.js';

// DB init (import qilish jadvallarni yaratadi)
import './db/index.js';

// Route modullar
import authRoutes from './modules/auth/auth.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';
import productRoutes from './modules/products/products.routes.js';

const app = Fastify({ logger: true });

// ── Pluginlar ────────────────────────────────────
await app.register(cors, {
  origin: (origin, cb) => {
    // Development: barcha localhost portlarga ruxsat
    if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      cb(null, true);
      return;
    }
    // Production: faqat FRONTEND_URL
    if (origin === config.frontendUrl) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
});

await app.register(fjwt, {
  secret: config.jwt.secret,
});

// ── Route lar ────────────────────────────────────
await app.register(authRoutes, { prefix: '/api' });
await app.register(walletRoutes, { prefix: '/api' });
await app.register(orderRoutes, { prefix: '/api' });
await app.register(productRoutes, { prefix: '/api' });

// ── Health check ─────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  ts: new Date().toISOString(),
}));

// ── Server start ─────────────────────────────────
try {
  await app.listen({ port: config.port, host: config.host });
  console.log(`🚀 Server running at http://localhost:${config.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
