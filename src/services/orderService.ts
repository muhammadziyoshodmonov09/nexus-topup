/**
 * Order Service — Real Backend API
 *
 * POST /api/orders         — buyurtma yaratish (wallet to'lov)
 * GET  /api/orders/:id     — buyurtma holati
 * GET  /api/orders/history — tarix
 */

import { config } from '../config';
import type { ApiResponse, CreateOrderRequest, OrderResult, ProductType } from '../types';

const API = config.apiBaseUrl;

/** localStorage dan JWT token olish */
function getToken(): string {
  try {
    const raw = localStorage.getItem(config.storageKeys.authSession);
    return raw ? (JSON.parse(raw)?.token ?? '') : '';
  } catch {
    return '';
  }
}

/**
 * POST /orders — Yangi buyurtma yaratish.
 * Backend wallet balansni tekshirib, to'lovni amalga oshiradi.
 */
export async function createOrder(
  _token: string,
  request: CreateOrderRequest
): Promise<ApiResponse<OrderResult>> {
  const token = getToken();
  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productSlug: request.productId, // productId = slug
        packageId: undefined,           // kelajakda packageId qo'shiladi
        recipient: request.recipient,
        paymentMethod: request.paymentMethod,
        promoCode: request.promoCode,
      }),
    });

    const json = await res.json();
    if (!json.success) {
      return { success: false, data: null, error: json.error ?? 'Order failed' };
    }

    const o = json.data;
    const result: OrderResult = {
      orderId: o.id,
      status: o.status,
      productType: o.productType as ProductType,
      productName: '',    // Checkout context dan to'ldiriladi
      productDetail: '',
      productImage: '',
      price: o.total,
      recipient: o.recipient,
      digitalCode: o.digitalCode ?? undefined,
      createdAt: o.createdAt,
    };

    return { success: true, data: result, error: null };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}

/**
 * GET /orders/:id — Buyurtma holati.
 */
export async function getOrder(
  _token: string,
  orderId: string
): Promise<ApiResponse<OrderResult>> {
  const token = getToken();
  try {
    const res = await fetch(`${API}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) return { success: false, data: null, error: json.error };

    const o = json.data;
    return {
      success: true,
      data: {
        orderId: o.id,
        status: o.status,
        productType: o.productType as ProductType,
        productName: '',
        productDetail: '',
        productImage: '',
        price: o.total,
        recipient: o.recipient,
        digitalCode: o.digitalCode ?? undefined,
        createdAt: o.createdAt,
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}

/**
 * Promo kod tekshirish — hozircha frontend mock (kelajakda backend endpoint).
 */
export async function validatePromoCode(
  code: string,
  _productType: ProductType,
  _amount: number
): Promise<ApiResponse<{ discountPercent: number }>> {
  await new Promise(r => setTimeout(r, 300));
  if (code.toLowerCase() === 'uzpin') {
    return { success: true, data: { discountPercent: 10 }, error: null };
  }
  return { success: false, data: null, error: 'Invalid promo code' };
}

/** verifyPayment — kelajakda Click/Payme webhook dan keyin */
export async function verifyPayment(
  _token: string,
  _orderId: string,
  _paymentData: Record<string, unknown>
): Promise<ApiResponse<OrderResult>> {
  return { success: false, data: null, error: 'Not implemented yet' };
}
