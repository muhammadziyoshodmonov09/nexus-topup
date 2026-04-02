import { pgTable, text, doublePrecision, integer, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════
// USERS
// ═══════════════════════════════════════

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name').notNull(),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  role: text('role').notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════
// AUTH PROVIDERS
// ═══════════════════════════════════════

export const authProviders = pgTable('auth_providers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'telegram' | 'google'
  providerId: text('provider_id').notNull(),
  providerData: text('provider_data'), // JSON string
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('idx_auth_provider_unique').on(table.provider, table.providerId),
]);

// ═══════════════════════════════════════
// WALLETS
// ═══════════════════════════════════════

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id),
  balance: doublePrecision('balance').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════
// WALLET TRANSACTIONS
// ═══════════════════════════════════════

export const walletTransactions = pgTable('wallet_transactions', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull().references(() => wallets.id),
  type: text('type').notNull(), // 'topup' | 'purchase' | 'refund'
  amount: doublePrecision('amount').notNull(),
  balanceBefore: doublePrecision('balance_before').notNull(),
  balanceAfter: doublePrecision('balance_after').notNull(),
  status: text('status').notNull().default('completed'),
  description: text('description'),
  referenceId: text('reference_id'), // order_id
  idempotencyKey: text('idempotency_key').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_wallet_tx_wallet').on(table.walletId, table.createdAt),
]);

// ═══════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // 'game' | 'giftcard' | 'subscription'
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  publisher: text('publisher'),
  currency: text('currency'),
  imageUrl: text('image_url'),
  bannerUrl: text('banner_url'),
  metadata: text('metadata'), // JSON string
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════
// PRODUCT PACKAGES
// ═══════════════════════════════════════

export const productPackages = pgTable('product_packages', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  amount: text('amount').notNull(), // '660' yoki 'Monthly Pass'
  price: doublePrecision('price').notNull(),
  bonus: text('bonus'),
  tag: text('tag'), // 'popular' | 'best-value'
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => [
  index('idx_pkg_product').on(table.productId, table.sortOrder),
]);

// ═══════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
  packageId: text('package_id').references(() => productPackages.id),
  status: text('status').notNull().default('pending'), // pending | paid | completed | failed
  productType: text('product_type').notNull(),
  recipient: text('recipient').notNull(),
  subtotal: doublePrecision('subtotal').notNull(),
  discount: doublePrecision('discount').notNull().default(0),
  total: doublePrecision('total').notNull(),
  promoCode: text('promo_code'),
  paymentMethod: text('payment_method'),
  digitalCode: text('digital_code'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => [
  index('idx_order_user').on(table.userId, table.createdAt),
  index('idx_order_status').on(table.status),
]);
