import { eq, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { orders, products, productPackages } from '../../db/schema.js';
import { generateId, generateOrderId } from '../../utils/id.js';
import { deductWallet } from '../wallet/wallet.service.js';

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'failed';

export interface CreateOrderInput {
  userId: string;
  productSlug: string;
  packageId?: string;
  recipient: string;
  paymentMethod: string;
  promoCode?: string;
}

/**
 * Yangi buyurtma yaratish.
 * Wallet to'lovi bo'lsa, darhol balansni yechib PAID statusiga o'tkazadi.
 */
export async function createOrder(input: CreateOrderInput) {
  // Mahsulotni topish
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, input.productSlug))
    .limit(1);

  if (!product[0]) throw new Error('Product not found');
  if (!product[0].isActive) throw new Error('Product is not available');

  // Paketni topish
  let pkg: typeof productPackages.$inferSelect | undefined;
  if (input.packageId) {
    const found = await db
      .select()
      .from(productPackages)
      .where(eq(productPackages.id, input.packageId))
      .limit(1);
    pkg = found[0];
    if (!pkg) throw new Error('Package not found');
  }

  const subtotal = pkg?.price ?? 0;
  const discount = 0; // Promo kodni keyinroq qo'shiladi
  const total = Math.max(0, subtotal - discount);

  const orderId = generateOrderId();

  // Buyurtmani yaratish (PENDING)
  await db.insert(orders).values({
    id: orderId,
    userId: input.userId,
    productId: product[0].id,
    packageId: pkg?.id ?? null,
    status: 'pending',
    productType: product[0].type,
    recipient: input.recipient,
    subtotal,
    discount,
    total,
    promoCode: input.promoCode ?? null,
    paymentMethod: input.paymentMethod,
  });

  // Wallet to'lovi — darhol
  if (input.paymentMethod === 'wallet') {
    try {
      await deductWallet(
        input.userId,
        total,
        `Order ${orderId}: ${product[0].name}`,
        orderId
      );
      // Status → PAID → COMPLETED (fulfillment yo'q, MVP da shunday)
      await db
        .update(orders)
        .set({
          status: 'completed',
          updatedAt: new Date(),
          completedAt: new Date(),
        })
        .where(eq(orders.id, orderId));
    } catch (err) {
      // Balans yetarli emas → FAILED
      await db
        .update(orders)
        .set({ status: 'failed', updatedAt: new Date() })
        .where(eq(orders.id, orderId));
      throw err;
    }
  }

  return getOrderById(orderId);
}

/**
 * Buyurtmani ID orqali olish.
 */
export async function getOrderById(orderId: string) {
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  return order[0] ?? null;
}

/**
 * Foydalanuvchi buyurtmalar tarixi.
 */
export async function getUserOrders(userId: string, limit = 20) {
  return db
    .select({
      id: orders.id,
      status: orders.status,
      productType: orders.productType,
      recipient: orders.recipient,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      completedAt: orders.completedAt,
      productName: products.name,
      productImage: products.imageUrl,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}
