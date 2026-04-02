import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ArrowLeft, CreditCard, ShieldCheck, Loader2, Wallet, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import ProductIcon from '../components/ProductIcon';
import { useWallet } from '../context/WalletContext';
import { useOrder } from '../context/OrderContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../context/ToastContext';
import { createOrder, validatePromoCode } from '../services/orderService';
import type { PaymentMethod } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { balance, openWalletModal, refreshWallet } = useWallet();
  const { checkoutPayload, setOrderResult } = useOrder();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!checkoutPayload) navigate('/');
  }, [checkoutPayload, navigate]);

  if (!checkoutPayload) return null;

  const { productType, productId, productName, productDetail, price, recipient, productImage } = checkoutPayload;

  const handleApplyPromo = async () => {
    const result = await validatePromoCode(promoCode, productType, price);
    if (result.success && result.data) {
      setDiscount(price * (result.data.discountPercent / 100));
      setPromoApplied(true);
      showToast(`${result.data.discountPercent}% promo code applied!`, 'success');
    } else {
      showToast(t.checkout.invalidPromo, 'error');
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const finalPrice = Math.max(0, price - discount);
  const hasEnoughBalance = balance >= finalPrice;

  const handlePayment = async () => {
    setPaymentError('');
    setIsProcessing(true);

    try {
      // Backend createOrder — wallet balansni server tekshiradi va deduct qiladi
      const result = await createOrder('', {
        productType,
        productId,
        recipient,
        paymentMethod,
        amount: finalPrice,
        promoCode: promoApplied ? promoCode : undefined,
      });

      if (result.success && result.data) {
        // Wallet balansini server dan yangilash
        await refreshWallet();
        // OrderResult ni payload ma'lumotlari bilan to'ldirish
        setOrderResult({
          ...result.data,
          productName,
          productDetail,
          productImage,
          price: finalPrice,
        });
        navigate('/success');
      } else {
        setPaymentError(result.error ?? 'Payment failed');
      }
    } catch {
      setPaymentError('An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition className="text-text-main transition-colors duration-500 pb-40 lg:pb-12 bg-bg-base">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-text-muted active:text-text-main transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> {t.checkout.backToDetails}
        </button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main mb-2">{t.checkout.title}</h1>
          <p className="text-sm sm:text-base text-text-muted">{t.checkout.subtitle}</p>
        </div>

        <div className="w-full space-y-6">
          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rounded-3xl border border-border bg-bg-card p-5 sm:p-8">
            <h3 className="text-xl font-bold mb-6 text-text-main">{t.checkout.orderSummary}</h3>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="h-16 w-16 rounded-xl overflow-hidden border border-border flex-shrink-0 flex items-center justify-center bg-bg-base">
                <ProductIcon type={productType} id={productId} className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-text-main">{productName}</h4>
                <p className="text-sm text-text-muted">{productDetail}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-text-muted">{t.checkout.deliveryTo}</span>
                <span className="font-medium truncate max-w-[150px] text-right text-text-main">{recipient}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-text-muted">{t.checkout.subtotal}</span>
                <span className="font-medium text-text-main">${price.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-text-muted">{t.checkout.promoDiscount}</span>
                  <span className="font-medium text-green-500">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-text-muted">{t.checkout.processingFee}</span>
                <span className="font-medium text-green-500">{t.checkout.free}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-muted mb-2">{t.checkout.promoCode}</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder={t.checkout.promoPlaceholder} className="w-full bg-bg-base border border-border rounded-xl py-4 px-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 uppercase text-base" disabled={promoApplied} />
                <button onClick={handleApplyPromo} disabled={!promoCode || promoApplied} className="w-full sm:w-auto px-6 py-4 bg-bg-base border border-border active:scale-95 active:bg-bg-card-hover text-text-main rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-base">
                  {promoApplied ? t.checkout.applied : t.checkout.apply}
                </button>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex justify-between items-center">
                <span className="text-text-main font-medium text-lg">{t.checkout.total}</span>
                <span className="text-3xl font-bold text-accent">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-border bg-bg-card p-5 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <CreditCard className="h-5 w-5 text-accent" /> {t.checkout.paymentMethod}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <button onClick={() => setPaymentMethod('wallet')} className={cn("relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-200 col-span-2 sm:col-span-3 active:scale-95", paymentMethod === 'wallet' ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg-base active:border-accent/50 active:bg-bg-card-hover text-text-muted")}>
                <div className={cn("absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border transition-colors", paymentMethod === 'wallet' ? "border-accent bg-accent" : "border-border")}>
                  {paymentMethod === 'wallet' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent/20 p-2 text-accent"><Wallet className="h-6 w-6" /></div>
                  <div className="text-left">
                    <span className="block font-bold text-lg text-text-main">{t.checkout.payWithWallet}</span>
                    <span className="block text-sm text-text-muted">{t.checkout.balance}: <span className={cn("font-bold", hasEnoughBalance ? "text-green-500" : "text-red-500")}>${balance.toFixed(2)}</span></span>
                  </div>
                </div>
              </button>
              {([
                { id: 'payme' as const, name: 'Payme' }, { id: 'click' as const, name: 'Click' },
                { id: 'uzcard' as const, name: 'Uzcard' }, { id: 'humo' as const, name: 'Humo' },
                { id: 'card' as const, name: 'Visa / MC' }, { id: 'paypal' as const, name: 'PayPal' },
              ]).map((method) => (
                <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={cn("relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-200 active:scale-95", paymentMethod === method.id ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg-base active:border-accent/50 active:bg-bg-card-hover text-text-muted")}>
                  <div className={cn("absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border transition-colors", paymentMethod === method.id ? "border-current bg-current" : "border-border")}>
                    {paymentMethod === method.id && <div className="h-1.5 w-1.5 rounded-full bg-bg-base" />}
                  </div>
                  <span className="font-bold text-sm">{method.name}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === 'wallet' && !hasEnoughBalance && (
                <motion.div key="wallet-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                  <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                    <div className="flex items-center gap-3 text-red-400"><AlertCircle className="h-5 w-5 flex-shrink-0" /><p className="text-sm font-medium">{t.checkout.insufficientBalance}</p></div>
                    <button onClick={openWalletModal} className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 transition-colors active:bg-red-500/30">{t.checkout.topUp}</button>
                  </div>
                </motion.div>
              )}
              {paymentMethod === 'card' && (
                <motion.div key="card-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <div><label className="block text-sm font-medium text-text-muted mb-2">{t.checkout.cardNumber}</label><input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-bg-base border border-border rounded-xl py-3 px-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-text-muted mb-2">{t.checkout.expiryDate}</label><input type="text" placeholder="MM/YY" className="w-full bg-bg-base border border-border rounded-xl py-3 px-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" /></div>
                    <div><label className="block text-sm font-medium text-text-muted mb-2">{t.checkout.cvc}</label><input type="text" placeholder="123" className="w-full bg-bg-base border border-border rounded-xl py-3 px-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-text-muted mb-2">{t.checkout.cardholderName}</label><input type="text" placeholder="John Doe" className="w-full bg-bg-base border border-border rounded-xl py-3 px-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" /></div>
                </motion.div>
              )}
              {paymentMethod !== 'card' && paymentMethod !== 'wallet' && (
                <motion.div key="redirect-info" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="py-4 text-center overflow-hidden">
                  <p className="text-text-muted">{t.checkout.redirectNote}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bar */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }} className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-bg-base/95 backdrop-blur-xl border-t border-border z-50">
        <div className="mx-auto max-w-5xl flex flex-col gap-3">
          {paymentError && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-500 text-center">{paymentError}</div>}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-text-muted font-medium mb-0.5">{t.checkout.total}</p>
              <p className="text-xl font-bold text-accent">${finalPrice.toFixed(2)}</p>
            </div>
            <motion.button onClick={handlePayment} disabled={isProcessing || (paymentMethod === 'wallet' && !hasEnoughBalance)} whileTap={isProcessing || (paymentMethod === 'wallet' && !hasEnoughBalance) ? {} : { scale: 0.95 }} className={cn("flex-1 flex items-center justify-center gap-2 rounded-xl py-4 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-200", isProcessing ? "bg-accent/50 text-white/70 cursor-wait" : (paymentMethod === 'wallet' && !hasEnoughBalance) ? "bg-bg-card text-text-muted cursor-not-allowed" : "bg-accent active:bg-accent-hover text-white")}>
              {isProcessing ? (<><Loader2 className="h-4 w-4 animate-spin" /> {t.checkout.processing}</>) : (<><ShieldCheck className="h-4 w-4" /> {paymentMethod === 'wallet' ? t.checkout.payWithWallet : t.checkout.payNow}</>)}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
}
