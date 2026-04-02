import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middleware/auth.js';
import { createOrder, getOrderById, getUserOrders } from './orders.service.js';
import { ok, fail } from '../../utils/response.js';

interface JwtPayload { userId: string; role: string }

export default async function orderRoutes(app: FastifyInstance) {
  /**
   * POST /orders
   * Yangi buyurtma yaratish.
   * Wallet to'lovi bo'lsa — darhol to'lanadi.
   */
  app.post<{
    Body: {
      productSlug: string;
      packageId?: string;
      recipient: string;
      paymentMethod: string;
      promoCode?: string;
    };
  }>('/orders', { preHandler: requireAuth }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    const body = request.body ?? {};

    if (!body.productSlug) return reply.code(400).send(fail('productSlug required'));
    if (!body.recipient) return reply.code(400).send(fail('recipient required'));
    if (!body.paymentMethod) return reply.code(400).send(fail('paymentMethod required'));

    try {
      const order = await createOrder({ userId, ...body });
      return reply.code(201).send(ok(order));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order creation failed';
      return reply.code(400).send(fail(msg));
    }
  });

  /**
   * GET /orders/:id
   * Bitta buyurtma tafsilotlari.
   */
  app.get<{ Params: { id: string } }>(
    '/orders/:id',
    { preHandler: requireAuth },
    async (request, reply) => {
      const { userId } = request.user as JwtPayload;
      const order = await getOrderById(request.params.id);

      if (!order) return reply.code(404).send(fail('Order not found', 404));
      // Faqat o'z buyurtmasini ko'rishi mumkin
      if (order.userId !== userId) return reply.code(403).send(fail('Forbidden', 403));

      return reply.send(ok(order));
    }
  );

  /**
   * GET /orders/history
   * Foydalanuvchi buyurtmalar tarixi.
   */
  app.get('/orders/history', { preHandler: requireAuth }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    const history = await getUserOrders(userId);
    return reply.send(ok(history));
  });
}
