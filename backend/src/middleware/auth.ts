import type { FastifyRequest, FastifyReply } from 'fastify';

/** Route ni himoyalash — valid JWT talab qiladi */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ success: false, data: null, error: 'Unauthorized' });
  }
}
