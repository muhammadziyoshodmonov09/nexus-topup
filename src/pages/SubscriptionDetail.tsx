import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscriptions } from '../data/subscriptions';
import { cn } from '../lib/utils';
import { Check, ShieldCheck, ArrowLeft, Mail, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'motion/react';
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

export default function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setCheckoutPayload } = useOrder();
  const sub = subscriptions.find(s => s.id === id);

  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!sub) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center bg-bg-base text-text-main">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t.games.noResults}</h2>
            <button onClick={() => navigate('/subscriptions')} className="text-accent active:underline">{t.notFound.returnHome}</button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const isEmailValid = email.trim() !== '' && email.includes('@');
  const canPurchase = isEmailValid && selectedPackage !== null;

  const handleCheckout = () => {
    if (!canPurchase || selectedPackage === null) return;
    const pkg = sub.packages[selectedPackage];
    setCheckoutPayload({
      productType: 'subscription',
      productId: sub.id,
      productName: `${sub.name} Gift Code`,
      productDetail: pkg.duration,
      price: pkg.price,
      recipient: email,
      productImage: sub.image,
    });
    navigate('/checkout');
  };

  return (
    <PageTransition className="text-text-main transition-colors duration-300 pb-40 lg:pb-12 bg-bg-base">
      {/* Banner */}
      <div className="relative h-[30vh] sm:h-[40vh] w-full overflow-hidden">
        <motion.img initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={{ duration: 1.5, ease: "easeOut" }} src={sub.image} alt={sub.name} className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-0 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-sm font-medium text-text-muted active:text-text-main transition-colors bg-bg-base/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-border active:bg-bg-card">
            <ArrowLeft className="h-4 w-4" /> {t.gameDetail.back}
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-end gap-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border border-border flex items-center justify-center bg-bg-card backdrop-blur-md">
              <ProductIcon type="subscription" id={sub.id} className="h-12 w-12 sm:h-16 sm:w-16 text-text-main" />
            </div>
            <div className="pb-2">
              <p className="text-sm font-bold uppercase tracking-wider mb-1 text-text-muted">{t.subscriptions.digitalCode}</p>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-main">{sub.name}</h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="space-y-6">
            {/* Email */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-3xl border border-border bg-bg-card p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-lg">1</div>
                <h2 className="text-xl font-bold">{t.subscriptionDetail.deliveryEmail}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">{t.subscriptionDetail.emailLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-text-muted" /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.subscriptionDetail.emailPlaceholder} className="w-full bg-bg-base border border-border rounded-xl py-4 pl-12 pr-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all" />
                  </div>
                  <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> {t.subscriptionDetail.emailNote}</p>
                </div>
              </div>
            </motion.div>

            {/* Duration */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="rounded-3xl border border-border bg-bg-card p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-lg">2</div>
                <h2 className="text-xl font-bold">{t.subscriptionDetail.selectDuration}</h2>
              </div>
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sub.packages.map((pkg, idx) => (
                  <motion.button key={idx} variants={item} onClick={() => setSelectedPackage(idx)} className={cn("relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 group", selectedPackage === idx ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-border bg-bg-base active:border-accent/50 active:bg-bg-card-hover")}>
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mt-1"><ProductIcon type="subscription" id={sub.id} className="h-6 w-6 text-accent" /></div>
                        <div>
                          <p className={cn("font-bold text-lg mb-1 transition-colors", selectedPackage === idx ? "text-accent" : "text-text-muted")}>{pkg.duration}</p>
                          <p className="text-2xl font-bold text-text-main">${pkg.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className={cn("flex h-6 w-6 items-center justify-center rounded-full border transition-colors", selectedPackage === idx ? "border-accent bg-accent text-white" : "border-border text-transparent")}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
            <HowToUse type="subscription" />
          </div>
        </div>
      </div>

      {/* Sticky Bar */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.7 }} className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-bg-base/95 backdrop-blur-xl border-t border-border z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-text-muted font-medium mb-0.5">{t.gameDetail.total}</p>
            <p className="text-xl font-bold text-accent">{selectedPackage !== null ? `$${sub.packages[selectedPackage].price.toFixed(2)}` : '$0.00'}</p>
          </div>
          <motion.button onClick={handleCheckout} whileTap={!canPurchase ? {} : { scale: 0.95 }} disabled={!canPurchase} className={cn("flex-1 flex items-center justify-center gap-2 rounded-xl py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed", !canPurchase ? "bg-bg-card text-text-muted" : "bg-accent active:bg-accent-hover text-white")}>
            <Zap className="h-4 w-4" />
            {t.subscriptionDetail.getCodeInstantly}
          </motion.button>
        </div>
      </motion.div>
    </PageTransition>
  );
}
