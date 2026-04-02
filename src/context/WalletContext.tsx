/**
 * Wallet Context — Real Backend API
 *
 * Balans va tranzaksiyalar backend dan olinadi.
 * addBalance → POST /api/wallet/topup/test (dev)
 * deductBalance → buyurtma orqali backend da bajariladi (Order flow)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { config } from '../config';
import type { Transaction } from '../types';

export type { Transaction };

const API = config.apiBaseUrl;

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  /** Dev: test top-up */
  addBalance: (amount: number) => Promise<boolean>;
  /** Checkout da backend order yaratiladi — bu local fallback */
  deductBalance: (amount: number, description: string) => boolean;
  refreshWallet: () => Promise<void>;
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

/** localStorage da token saqlangan key */
const SESSION_KEY = config.storageKeys.authSession;

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token ?? null;
  } catch {
    return null;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  /** Backend dan wallet ma'lumotlarini yuklash */
  const refreshWallet = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const [walletRes, txRes] = await Promise.all([
        fetch(`${API}/wallet`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/wallet/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (walletRes.ok) {
        const w = await walletRes.json();
        if (w.success) setBalance(w.data.balance ?? 0);
      }

      if (txRes.ok) {
        const t = await txRes.json();
        if (t.success && Array.isArray(t.data)) {
          setTransactions(
            t.data.map((tx: Record<string, unknown>) => ({
              id: String(tx.id),
              type: tx.type as 'topup' | 'purchase' | 'refund',
              amount: Number(tx.amount),
              date: String(tx.createdAt ?? new Date().toISOString()),
              description: String(tx.description ?? ''),
              status: (tx.status as 'completed' | 'pending' | 'failed') ?? 'completed',
              orderId: tx.referenceId ? String(tx.referenceId) : undefined,
            }))
          );
        }
      }
    } catch {
      // Network xatosi — silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login bo'lganda wallet yuklash
  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  /** Dev top-up: POST /wallet/topup/test */
  const addBalance = useCallback(async (amount: number): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const res = await fetch(`${API}/wallet/topup/test`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const json = await res.json();
      if (json.success) {
        setBalance(json.data.balance);
        await refreshWallet();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [refreshWallet]);

  /**
   * deductBalance — local fallback.
   * Haqiqiy to'lov backend order flow orqali bajariladi (Checkout.tsx → createOrder).
   * Bu faqat UI ga optimistik aks etish uchun saqlanadi.
   */
  const deductBalance = useCallback((amount: number, _description: string): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  }, [balance]);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  return (
    <WalletContext.Provider value={{
      balance, transactions, isLoading,
      addBalance, deductBalance, refreshWallet,
      isWalletModalOpen, openWalletModal, closeWalletModal,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
