/**
 * Wallet Service — Backend-Ready API Layer
 *
 * Hozircha barcha operatsiyalar frontendda localStorage da bajariladi.
 * Backend qo'shilganda bu funksiyalar haqiqiy API chaqiruvlari bilan almashtiriladi.
 */

import { config } from '../config';
import type { ApiResponse, WalletState, Transaction } from '../types';

const { apiBaseUrl } = config;

/**
 * GET /wallet — Foydalanuvchi hamyonini olish.
 *
 * Backend: Autentifikatsiya qilingan foydalanuvchining balans va
 * tranzaksiyalar tarixini qaytaradi.
 */
export async function getWallet(token: string): Promise<ApiResponse<WalletState>> {
  /**
   * TODO: Backend integratsiya
   *
   * const res = await fetch(`${apiBaseUrl}/wallet`, {
   *   headers: { 'Authorization': `Bearer ${token}` },
   * });
   * return res.json();
   */
  void token;
  void apiBaseUrl;
  return { success: false, data: null, error: 'Requires backend' };
}

/**
 * POST /wallet/topup — Hamyonga mablag' qo'shish.
 *
 * Backend: To'lov tizimi orqali mablag' qo'shadi va yangi balansni qaytaradi.
 */
export async function topUpWallet(
  token: string,
  amount: number,
  paymentMethod: string
): Promise<ApiResponse<{ balance: number; transaction: Transaction }>> {
  /**
   * TODO: Backend integratsiya
   *
   * const res = await fetch(`${apiBaseUrl}/wallet/topup`, {
   *   method: 'POST',
   *   headers: {
   *     'Authorization': `Bearer ${token}`,
   *     'Content-Type': 'application/json',
   *   },
   *   body: JSON.stringify({ amount, paymentMethod }),
   * });
   * return res.json();
   */
  void token;
  void paymentMethod;

  // Mock: frontendda bajariladi
  const mockTx: Transaction = {
    id: `tx_${Date.now()}`,
    type: 'topup',
    amount,
    date: new Date().toISOString(),
    description: 'Balance Top-up',
    status: 'completed',
  };

  await new Promise(r => setTimeout(r, 500));
  return { success: true, data: { balance: amount, transaction: mockTx }, error: null };
}

/**
 * POST /wallet/pay — Hamyondan to'lov qilish.
 *
 * Backend: Buyurtma bilan bog'liq to'lovni amalga oshiradi.
 */
export async function payWithWallet(
  token: string,
  amount: number,
  orderId: string
): Promise<ApiResponse<{ balance: number; transaction: Transaction }>> {
  /**
   * TODO: Backend integratsiya
   *
   * const res = await fetch(`${apiBaseUrl}/wallet/pay`, {
   *   method: 'POST',
   *   headers: {
   *     'Authorization': `Bearer ${token}`,
   *     'Content-Type': 'application/json',
   *   },
   *   body: JSON.stringify({ amount, orderId }),
   * });
   * return res.json();
   */
  void token;

  const mockTx: Transaction = {
    id: `tx_${Date.now()}`,
    type: 'purchase',
    amount,
    date: new Date().toISOString(),
    description: `Order #${orderId}`,
    status: 'completed',
    orderId,
  };

  await new Promise(r => setTimeout(r, 300));
  return { success: true, data: { balance: 0, transaction: mockTx }, error: null };
}

/**
 * GET /wallet/transactions — Tranzaksiyalar tarixini olish.
 */
export async function getTransactions(
  token: string,
  limit?: number
): Promise<ApiResponse<Transaction[]>> {
  /**
   * TODO: Backend integratsiya
   *
   * const params = limit ? `?limit=${limit}` : '';
   * const res = await fetch(`${apiBaseUrl}/wallet/transactions${params}`, {
   *   headers: { 'Authorization': `Bearer ${token}` },
   * });
   * return res.json();
   */
  void token;
  void limit;
  return { success: false, data: null, error: 'Requires backend' };
}
