/**
 * Order Context — Checkout/Success oqimini boshqarish.
 *
 * Bu context location.state ga bog'liqlikni kamaytiradi.
 * CheckoutPayload va OrderResult markazlashtirilgan holda saqlanadi.
 *
 * OQIM:
 * 1. Detail sahifasi → setCheckoutPayload() → navigate('/checkout')
 * 2. Checkout sahifasi → payload dan o'qiydi → to'lov → setOrderResult()
 * 3. Success sahifasi → orderResult dan o'qiydi
 * 4. Success sahifadan chiqqanda → clearOrder()
 *
 * VAQTINCHALIK: sessionStorage da saqlanadi (sahifa yangilanganda yo'qolmasligi uchun).
 * Backend qo'shilganda orderId asosida serverdan olinadi.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { config } from '../config';
import type { CheckoutPayload, OrderResult } from '../types';

interface OrderContextType {
  /** Checkout sahifasi uchun xarid ma'lumotlari */
  checkoutPayload: CheckoutPayload | null;
  /** To'lov muvaffaqiyatli bo'lgandan keyin buyurtma natijasi */
  orderResult: OrderResult | null;
  /** Detail sahifasida chaqiriladi — checkout ga o'tishdan oldin */
  setCheckoutPayload: (payload: CheckoutPayload) => void;
  /** Checkout sahifasida chaqiriladi — to'lov muvaffaqiyatli bo'lganda */
  setOrderResult: (result: OrderResult) => void;
  /** Success sahifasidan chiqqanda yoki bosh sahifaga qaytganda */
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const { storageKeys } = config;

function loadFromSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [checkoutPayload, setCheckoutPayloadState] = useState<CheckoutPayload | null>(
    () => loadFromSession(storageKeys.checkoutPayload)
  );

  const [orderResult, setOrderResultState] = useState<OrderResult | null>(
    () => loadFromSession(storageKeys.orderResult)
  );

  const setCheckoutPayload = useCallback((payload: CheckoutPayload) => {
    setCheckoutPayloadState(payload);
    sessionStorage.setItem(storageKeys.checkoutPayload, JSON.stringify(payload));
  }, []);

  const setOrderResult = useCallback((result: OrderResult) => {
    setOrderResultState(result);
    sessionStorage.setItem(storageKeys.orderResult, JSON.stringify(result));
    // Checkout payload endi kerak emas
    sessionStorage.removeItem(storageKeys.checkoutPayload);
  }, []);

  const clearOrder = useCallback(() => {
    setCheckoutPayloadState(null);
    setOrderResultState(null);
    sessionStorage.removeItem(storageKeys.checkoutPayload);
    sessionStorage.removeItem(storageKeys.orderResult);
  }, []);

  return (
    <OrderContext.Provider value={{ checkoutPayload, orderResult, setCheckoutPayload, setOrderResult, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
