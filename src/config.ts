/**
 * App Config — Markazlashtirilgan konfiguratsiya.
 *
 * Environment o'zgaruvchilari Vite orqali import.meta.env dan o'qiladi.
 * .env faylida quyidagilar belgilanishi kerak:
 *
 *   VITE_API_BASE_URL=https://api.uzpin.games
 *   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
 *   VITE_TELEGRAM_BOT_USERNAME=uzpinbot
 *   VITE_ENABLE_GOOGLE_AUTH=true
 */

export const config = {
  /** Backend API ning asosiy URL manzili */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',

  /** Google OAuth client ID */
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',

  /** Telegram bot username (qo'llab-quvvatlash uchun) */
  telegramBotUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? 'uzpinbot',

  /** Development rejimida ekanligini aniqlash */
  isDev: import.meta.env.DEV === true,

  /** Feature flags */
  features: {
    /** Google auth yoqilganmi? */
    googleAuth: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',

    /** Wallet tizimi yoqilganmi? */
    wallet: true,

    /** Promo kodlar yoqilganmi? */
    promoCodes: true,
  },

  /** localStorage kalitlari — bir joyda boshqarish */
  storageKeys: {
    authSession: 'nexus_auth_session',
    walletBalance: 'nexus_wallet_balance',
    walletTransactions: 'nexus_wallet_transactions',
    language: 'nexus_language',
    /** Checkout uchun vaqtinchalik ma'lumot */
    checkoutPayload: 'nexus_checkout_payload',
    /** Buyurtma natijasi — Success sahifa uchun */
    orderResult: 'nexus_order_result',
  },
} as const;
