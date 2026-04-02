import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { db } from '../../db/index.js';
import { products, productPackages } from '../../db/schema.js';
import { ok, fail } from '../../utils/response.js';

export default async function productRoutes(app: FastifyInstance) {
  /**
   * GET /products
   * Barcha aktiv mahsulotlar ro'yxati.
   */
  app.get<{ Querystring: { type?: string } }>('/products', async (request, reply) => {
    const { type } = request.query;
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true));

    const filtered = type ? rows.filter(p => p.type === type) : rows;
    return reply.send(ok(filtered));
  });

  /**
   * GET /products/:slug
   * Bitta mahsulot + paketlari.
   */
  app.get<{ Params: { slug: string } }>('/products/:slug', async (request, reply) => {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, request.params.slug))
      .limit(1);

    if (!product[0]) return reply.code(404).send(fail('Product not found', 404));

    const pkgs = await db
      .select()
      .from(productPackages)
      .where(eq(productPackages.productId, product[0].id));

    return reply.send(ok({ ...product[0], packages: pkgs }));
  });
}
