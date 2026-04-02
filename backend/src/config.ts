import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  host: process.env.HOST ?? '0.0.0.0',

  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  },

  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? '',
} as const;
