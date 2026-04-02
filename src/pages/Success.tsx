import { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Home, ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'motion/react';
import ProductIcon from '../components/ProductIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useOrder } from '../context/OrderContext';

export default function Success() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { orderResult, clearOrder } = useOrder();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!orderResult) navigate('/');
  }, [orderResult, navigate]);

  // Raqamli kodni bir marta generatsiya qilish (har render da yangilanmasligi uchun)
  const generatedCode = useMemo(() => {
    if (!orderResult) return null;
    // Backend qo'shilganda orderResult.digitalCode ishlatiladi
    if (orderResult.digitalCode) return orderResult.digitalCode;
    if (orderResult.productType !== 'game') {
      return `${rand4()}-${rand4()}-${rand4()}`;
    }
    return null;
  }, [orderResult]);

  if (!orderResult) return null;

  const { orderId, productType, productName, productDetail, price, recipient, productImage } = orderResult;

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      showToast(t.success.codeCopied, 'success');
    }
  };

  const handleReturnHome = () => {
    clearOrder();
  };

  return (
    <PageTransition className="flex-1 flex items-center justify-center bg-bg-base text-text-main p-4 py-12 sm:py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-md w-full rounded-3xl border border-border bg-bg-card p-5 sm:p-8 text-center relative overflow-hidden"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-6 relative z-10"
        >
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main mb-2 relative z-10">
          {t.success.title}
        </h1>
        <p className="text-sm sm:text-base text-text-muted mb-6 sm:mb-8 relative z-10">
          {t.success.orderProcessed} <span className="text-text-main font-medium">#{orderId}</span>
        </p>

        <div className="rounded-2xl bg-bg-base border border-border p-5 sm:p-6 mb-6 sm:mb-8 text-left relative z-10">
          <div className="flex items-center gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-border">
            <div className="h-12 w-12 rounded-lg overflow-hidden border border-border flex-shrink-0 flex items-center justify-center bg-bg-card">
              {orderResult.productType ? (
                <ProductIcon type={productType} id={orderResult.orderId.slice(0, 4)} className="h-6 w-6" />
              ) : (
                <img src={productImage} alt={productName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-text-main text-sm">{productName}</h4>
              <p className="text-xs text-text-muted">{productDetail}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">{t.success.amountPaid}</span><span className="font-bold text-text-main">${price?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">{t.success.deliveryTo}</span><span className="font-medium text-text-main truncate max-w-[150px]">{recipient}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">{t.success.status}</span><span className="font-medium text-green-500">{t.success.completed}</span></div>
          </div>
        </div>

        {generatedCode && (
          <div className="mb-8 relative z-10">
            <p className="text-sm font-medium text-text-muted mb-3">{t.success.digitalCode}</p>
            <div className="flex items-center justify-between bg-bg-base border border-border rounded-xl p-4">
              <span className="font-mono text-xl font-bold tracking-widest text-text-main">{generatedCode}</span>
              <button onClick={handleCopy} className="p-2 active:bg-bg-card rounded-lg transition-colors text-text-muted active:text-text-main" title="Copy Code">
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" /> {t.success.codeSentEmail}
            </p>
          </div>
        )}

        {productType === 'game' && (
          <div className="mb-8 relative z-10">
            <p className="text-sm text-text-muted bg-bg-base border border-border rounded-xl p-4">{t.success.topUpProcessing}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 relative z-10">
          <Link to="/" onClick={handleReturnHome} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-base py-4 text-sm font-bold text-text-main transition-all active:scale-95 active:bg-bg-card">
            <Home className="h-4 w-4" /> {t.success.returnHome}
          </Link>
          {generatedCode && (
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-sm font-bold text-white transition-all active:scale-95 active:bg-accent-hover">
              <ExternalLink className="h-4 w-4" /> {t.success.activateNow}
            </button>
          )}
        </div>
      </motion.div>
    </PageTransition>
  );
}

function rand4(): string {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
}
