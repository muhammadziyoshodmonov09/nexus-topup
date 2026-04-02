import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { giftCards } from '../data/giftCards';
import { cn } from '../lib/utils';
import { Check, ShieldCheck, ArrowLeft, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import HowToUse from '../components/HowToUse';
import ProductIcon from '../components/ProductIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { useOrder } from '../context/OrderContext';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function GiftCardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setCheckoutPayload } = useOrder();
  const card = giftCards.find((g) => g.id === id);
  
  const [region, setRegion] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!card) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center bg-bg-base text-text-main">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t.games.noResults}</h2>
            <button onClick={() => navigate('/gift-cards')} className="text-accent active:underline">
              {t.notFound.returnHome}
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const isAccountValid = card.regions ? region.trim() !== '' : true;
  const canPurchase = isAccountValid && selectedAmount;

  const handleCheckout = () => {
    if (!canPurchase || !selectedAmount) return;
    let recipient = 'Digital Delivery';
    if (card.regions && region) recipient += ` (${region})`;
    setCheckoutPayload({
      productType: 'giftcard',
      productId: card.id,
      productName: card.name,
      productDetail: `$${selectedAmount} Gift Card`,
      price: selectedAmount,
      recipient,
      productImage: card.image,
    });
    navigate('/checkout');
  };

  return (
    <PageTransition className="text-text-main transition-colors duration-300 pb-40 lg:pb-12 bg-bg-base">
      {/* Banner */}
      <div className="relative h-[30vh] sm:h-[40vh] w-full overflow-hidden">
        <motion.img initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={{ duration: 1.5, ease: "easeOut" }} src={card.image} alt={card.name} className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-0 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-sm font-medium text-text-muted active:text-text-main transition-colors bg-bg-base/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-border active:bg-bg-card">
            <ArrowLeft className="h-4 w-4" /> {t.gameDetail.back}
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-end gap-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border border-border flex items-center justify-center bg-bg-card backdrop-blur-md">
              <ProductIcon type="giftcard" id={card.id} className="h-12 w-12 sm:h-16 sm:w-16 text-text-main" />
            </div>
            <div className="pb-2">
              <p className="text-sm font-bold uppercase tracking-wider mb-1 text-text-muted">{t.giftCardDetail.digitalCode}</p>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-main">{card.name}</h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="space-y-6">
            {/* Region */}
            {card.regions && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative rounded-3xl border border-border bg-bg-card p-5 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg bg-accent/10 text-accent">1</div>
                  <h2 className="text-xl font-bold">{t.giftCardDetail.selectRegion}</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-text-muted mb-2">{t.giftCardDetail.accountRegion}</label>
                    <div className="relative">
                      <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className={cn("block w-full rounded-xl border border-border bg-bg-base px-5 py-4 text-text-main focus:outline-none focus:ring-1 transition-all text-lg appearance-none ring-accent", region ? "border-accent/50" : "")}>
                        <option value="" disabled className="bg-bg-base text-text-muted">{t.giftCardDetail.selectRegionPlaceholder}</option>
                        {card.regions.map(r => (<option key={r} value={r} className="bg-bg-base">{r}</option>))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-text-muted">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> {t.giftCardDetail.regionNote}</p>
                </div>
              </motion.section>
            )}

            {/* Amount */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="relative rounded-3xl border border-border bg-bg-card p-5 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg bg-accent/10 text-accent">{card.regions ? '2' : '1'}</div>
                <h2 className="text-xl font-bold">{t.giftCardDetail.selectAmount}</h2>
              </div>
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {card.amounts.map((amount) => {
                  const isSelected = selectedAmount === amount;
                  return (
                    <motion.button variants={item} whileTap={{ scale: 0.95 }} key={amount} onClick={() => setSelectedAmount(amount)} className={cn("relative flex flex-col items-center justify-center rounded-2xl border p-4 transition-colors duration-200", isSelected ? "border-accent ring-1 ring-accent bg-accent/10 z-10" : "border-border bg-bg-base active:border-accent/50 active:bg-bg-card-hover")}>
                      <AnimatePresence>
                        {isSelected && (<motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute -top-3 -right-3 rounded-full p-1.5 bg-accent text-white"><Check className="h-4 w-4" /></motion.div>)}
                      </AnimatePresence>
                      <div className="flex items-center gap-2 mb-2 text-accent">
                        <ProductIcon type="giftcard" id={card.id} className="h-6 w-6" />
                        <span className="text-3xl font-bold">{amount}</span>
                      </div>
                      <span className="text-sm text-text-muted font-medium mt-auto">${amount.toFixed(2)}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.section>
            <HowToUse type="giftcard" />
          </div>
        </div>
      </div>

      {/* Sticky Bar */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.7 }} className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-bg-base/95 backdrop-blur-xl border-t border-border z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-text-muted font-medium mb-0.5">{t.gameDetail.total}</p>
            <p className="text-xl font-bold text-accent">{selectedAmount ? `$${selectedAmount.toFixed(2)}` : '$0.00'}</p>
          </div>
          <motion.button onClick={handleCheckout} whileTap={!canPurchase ? {} : { scale: 0.95 }} disabled={!canPurchase} className={cn("flex-1 flex items-center justify-center gap-2 rounded-xl py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed", !canPurchase ? "bg-bg-card text-text-muted" : "bg-accent active:bg-accent-hover text-white")}>
            <Zap className="h-4 w-4" />
            {t.giftCardDetail.getCodeInstantly}
          </motion.button>
        </div>
      </motion.div>
    </PageTransition>
  );
}
