import { randomBytes } from 'crypto';

/** Unique ID yaratish — UUID format */
export function generateId(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/** Idempotency key — wallet tranzaksiyalari uchun */
export function generateIdempotencyKey(prefix: string): string {
  return `${prefix}_${Date.now()}_${randomBytes(8).toString('hex')}`;
}

/** Order ID — insonga o'qilishi oson format: ORD-ABC123 */
export function generateOrderId(): string {
  return `ORD-${randomBytes(4).toString('hex').toUpperCase()}`;
}
