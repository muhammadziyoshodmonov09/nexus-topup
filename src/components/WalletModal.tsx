import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wallet, CreditCard, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

const TOPUP_AMOUNTS = [5, 10, 20, 50, 100];

export default function WalletModal() {
  const { isWalletModalOpen, closeWalletModal, balance, addBalance, transactions } = useWallet();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    if (!amount || amount <= 0) return;
    setIsProcessing(true);
    try {
      const ok = await addBalance(Number(amount));
      if (ok) {
        showToast(`$${amount} ${t.wallet.successMessage}`, 'success');
        setAmount('');
      } else {
        showToast('Top-up failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isWalletModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWalletModal}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-0 right-0 top-0 bottom-0 sm:left-1/2 sm:top-1/2 z-[101] w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 p-0 sm:p-4 flex flex-col justify-end sm:justify-center"
          >
            <div className="overflow-hidden rounded-t-3xl sm:rounded-3xl border-t sm:border border-border bg-bg-card shadow-2xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4 sm:p-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-text-main">{t.wallet.title}</h2>
                </div>
                <button
                  onClick={closeWalletModal}
                  className="rounded-full p-2 text-text-muted transition-colors active:bg-bg-base active:text-text-main"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar pb-safe">
                {/* Balance Display */}
                <div className="mb-6 sm:mb-8 rounded-2xl bg-bg-base border border-border p-5 sm:p-6 text-text-main shadow-sm">
                  <p className="text-sm font-medium text-text-muted">{t.wallet.currentBalance}</p>
                  <h3 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">${balance.toFixed(2)}</h3>
                </div>

                {/* Top Up Section */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="mb-3 sm:mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">{t.wallet.addBalance}</h4>
                  
                  <div className="mb-3 sm:mb-4 grid grid-cols-3 gap-2 sm:gap-3">
                    {TOPUP_AMOUNTS.map((val) => (
                      <button
                        key={val}
                        onClick={() => setAmount(val)}
                        className={cn(
                          "rounded-xl border py-3 text-sm font-medium transition-all active:scale-95",
                          amount === val
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-bg-base text-text-muted active:bg-bg-card-hover active:text-text-main"
                        )}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder={t.wallet.customAmount}
                      className="w-full rounded-xl border border-border bg-bg-base py-4 pl-8 pr-4 text-base text-text-main placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <button
                    onClick={handleTopUp}
                    disabled={!amount || amount <= 0 || isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-bold text-white transition-all active:scale-95 active:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {isProcessing ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        {t.wallet.topUpButton}
                      </>
                    )}
                  </button>
                </div>

                {/* Transaction History */}
                <div>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">{t.wallet.recentTransactions}</h4>
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {transactions.length === 0 ? (
                      <p className="text-center text-sm text-text-muted py-4">{t.wallet.noTransactions}</p>
                    ) : (
                      transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between rounded-xl border border-border bg-bg-base p-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg",
                              tx.type === 'topup' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                            )}>
                              {tx.type === 'topup' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-main">{tx.description}</p>
                              <p className="text-xs text-text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-sm font-bold",
                            tx.type === 'topup' ? "text-emerald-500" : "text-text-main"
                          )}>
                            {tx.type === 'topup' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
