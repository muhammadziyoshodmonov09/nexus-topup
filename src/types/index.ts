/**
 * Shared Types — Butun loyihada ishlatiladigan umumiy tiplar.
 *
 * Bu fayl barcha model/entity tiplarini markazlashtirilgan holda saqlaydi.
 * Backend integratsiya qilinganda, bu tiplar API javoblariga mos kelishi kerak.
 */

// ═══════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════

/** Barcha API javoblari uchun umumiy wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/** Async operatsiya holati */
export interface AsyncState {
  isLoading: boolean;
  error: string | null;
}

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════

export type AuthProvider = 'telegram' | 'google';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  provider: AuthProvider;
  /** Provider-specific barqaror ID (Telegram user_id, Google sub) */
  providerId: string;
}

export interface AuthSession {
  user: User;
  /** VAQTINCHALIK: Mock token → backend qo'shilganda haqiqiy JWT */
  token: string;
  expiresAt: number;
}

// ═══════════════════════════════════════════════
// WALLET
// ═══════════════════════════════════════════════

export type TransactionType = 'topup' | 'purchase' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: TransactionStatus;
  /** Backend bilan bog'langan buyurtma ID (opsional) */
  orderId?: string;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
}

// ═══════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════

export type ProductType = 'game' | 'giftcard' | 'subscription';
export type GameTheme = 'pubg' | 'mlbb' | 'freefire' | 'genshin' | 'codm' | 'coc';

export interface GamePackage {
  id: string;
  amount: number | string;
  price: number;
  bonus?: number | string;
  tag?: 'popular' | 'best-value';
}

export interface Game {
  id: string;
  name: string;
  publisher: string;
  currency: string;
  theme: GameTheme;
  image: string;
  banner: string;
  packages: GamePackage[];
  regionType?: 'dropdown' | 'zoneId';
  regions?: string[];
}

export interface GiftCard {
  id: string;
  name: string;
  image: string;
  color: string;
  amounts: number[];
  regions?: string[];
  howToRedeem: string[];
}

export interface SubscriptionPackage {
  duration: string;
  price: number;
}

export interface Subscription {
  id: string;
  name: string;
  image: string;
  color: string;
  features: string[];
  packages: SubscriptionPackage[];
}

// ═══════════════════════════════════════════════
// ORDER / CHECKOUT
// ═══════════════════════════════════════════════

export type PaymentMethod = 'wallet' | 'payme' | 'click' | 'uzcard' | 'humo' | 'card' | 'paypal';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

/** Checkout sahifasiga yuborilgan xarid ma'lumotlari */
export interface CheckoutPayload {
  productType: ProductType;
  productId: string;
  productName: string;
  productDetail: string;
  productImage: string;
  price: number;
  recipient: string;
}

/** Buyurtma yaratish uchun backendga yuborilgan so'rov */
export interface CreateOrderRequest {
  productType: ProductType;
  productId: string;
  packageId?: string;
  amount?: number;
  recipient: string;
  paymentMethod: PaymentMethod;
  promoCode?: string;
}

/** Backend tomonidan qaytarilgan buyurtma natijasi */
export interface OrderResult {
  orderId: string;
  status: OrderStatus;
  productType: ProductType;
  productName: string;
  productDetail: string;
  productImage: string;
  price: number;
  recipient: string;
  /** Raqamli kod (giftcard, subscription uchun) */
  digitalCode?: string;
  createdAt: string;
}
