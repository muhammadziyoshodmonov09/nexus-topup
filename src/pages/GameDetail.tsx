import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { games, type GameTheme } from '../data/games';
import { cn } from '../lib/utils';
import { Check, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import HowToUse from '../components/HowToUse';
import ProductIcon from '../components/ProductIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { useOrder } from '../context/OrderContext';

// Base theme shared by all games — extend per gameId in future for visual differences
const baseTheme = {
  bg: 'bg-bg-base',
  accent: 'text-accent',
  border: 'border-accent/30',
  ring: 'ring-accent',
  button: 'bg-accent text-white active:bg-accent-hover',
  glow: '',
  stepBg: 'bg-accent/10 text-accent',
  cardHover: 'active:border-accent/50 active:bg-bg-card-hover',
  selectedBg: 'bg-accent/10',
};

// Per-game theme mapping — easy to customize later
const themeConfig: Record<GameTheme, typeof baseTheme> = {
  pubg: { ...baseTheme },
  mlbb: { ...baseTheme },
  freefire: { ...baseTheme },
  genshin: { ...baseTheme },
  codm: { ...baseTheme },
  coc: { ...baseTheme },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setCheckoutPayload } = useOrder();
  const game = games.find((g) => g.id === id);
  
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [region, setRegion] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!game) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center bg-bg-base text-text-main">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t.games.noResults}</h2>
            <button onClick={() => navigate('/')} className="text-accent active:underline">
              {t.notFound.returnHome}
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const theme = themeConfig[game.theme];

  const isAccountValid = playerId.trim() !== '' && 
    (game.regionType === 'zoneId' ? zoneId.trim() !== '' : true) &&
    (game.regionType === 'dropdown' ? region.trim() !== '' : true);

  const canPurchase = isAccountValid && selectedPackage;

  const handleCheckout = () => {
    if (!canPurchase || !selectedPackage) return;
    
    const pkg = game.packages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    let recipient = `Player ID: ${playerId}`;
    if (game.regionType === 'zoneId' && zoneId) recipient += ` (${zoneId})`;
    if (game.regionType === 'dropdown' && region) recipient += ` (${region})`;

    setCheckoutPayload({
      productType: 'game',
      productId: game.id,
      productName: game.name,
      productDetail: `${pkg.amount} ${game.currency}`,
      price: pkg.price,
      recipient,
      productImage: game.image,
    });
    navigate('/checkout');
  };

  return (
    <PageTransition className={cn("text-text-main transition-colors duration-500 pb-40 lg:pb-0", theme.bg)}>
      {/* Banner */}
      <div className="relative h-[30vh] sm:h-[40vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={game.banner} 
          alt={game.name} 
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 to-transparent" />
        
        <div className="absolute inset-0 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-sm font-medium text-text-muted active:text-text-main transition-colors bg-bg-card/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-border active:bg-bg-card"
          >
            <ArrowLeft className="h-4 w-4" /> {t.gameDetail.back}
          </button>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-end gap-6"
          >
            <div className={cn("h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border-2 flex items-center justify-center bg-bg-card backdrop-blur-md", theme.border, theme.glow)}>
              <ProductIcon type="game" id={game.id} className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <div className="pb-2">
              <p className={cn("text-sm font-bold uppercase tracking-wider mb-1", theme.accent)}>{game.publisher}</p>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main">
                {game.name}
              </h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="space-y-6">
            
            {/* Step 1: Player ID */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative rounded-3xl border border-border bg-bg-card p-5 sm:p-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg", theme.stepBg)}>
                  1
                </div>
                <h2 className="text-xl font-bold text-text-main">{t.gameDetail.accountDetails}</h2>
              </div>
              
              <div className="space-y-4">
                <div className={cn("grid gap-4", game.regionType === 'zoneId' ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                  <div>
                    <label htmlFor="playerId" className="block text-sm font-medium text-text-muted mb-2">
                      {t.gameDetail.enterPlayerId}
                    </label>
                    <input
                      type="text"
                      id="playerId"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      placeholder={t.gameDetail.playerIdPlaceholder}
                      className={cn(
                        "block w-full rounded-xl border border-border bg-bg-base px-5 py-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 transition-all text-lg",
                        theme.ring,
                        playerId ? "border-accent/50" : ""
                      )}
                    />
                  </div>
                  {game.regionType === 'zoneId' && (
                    <div>
                      <label htmlFor="zoneId" className="block text-sm font-medium text-text-muted mb-2">
                        {t.gameDetail.zoneId}
                      </label>
                      <input
                        type="text"
                        id="zoneId"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        placeholder={t.gameDetail.zoneIdPlaceholder}
                        className={cn(
                          "block w-full rounded-xl border border-border bg-bg-base px-5 py-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 transition-all text-lg",
                          theme.ring,
                          zoneId ? "border-accent/50" : ""
                        )}
                      />
                    </div>
                  )}
                </div>
                
                {game.regionType === 'dropdown' && game.regions && (
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-text-muted mb-2">
                      {t.gameDetail.selectServer}
                    </label>
                    <div className="relative">
                      <select
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={cn(
                          "block w-full rounded-xl border border-border bg-bg-base px-5 py-4 text-text-main focus:outline-none focus:ring-2 transition-all text-lg appearance-none",
                          theme.ring,
                          region ? "border-accent/50" : ""
                        )}
                      >
                        <option value="" disabled className="bg-bg-base">{t.gameDetail.selectServerPlaceholder}</option>
                        {game.regions.map(r => (
                          <option key={r} value={r} className="bg-bg-base">{r}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-text-muted">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-text-muted flex items-center gap-1.5 mt-4">
                <ShieldCheck className="h-4 w-4" /> {t.gameDetail.secureId}
              </p>
            </motion.section>

            {/* Step 2: Select Package */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative rounded-3xl border border-border bg-bg-card p-5 sm:p-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg", theme.stepBg)}>
                  2
                </div>
                <h2 className="text-xl font-bold text-text-main">{t.gameDetail.select} {game.currency}</h2>
              </div>

              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4"
              >
                {game.packages.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;

                  return (
                    <motion.button
                      variants={item}
                      whileTap={{ scale: 0.95 }}
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border p-4 transition-colors duration-200 min-h-[120px]",
                        isSelected 
                          ? cn(theme.border, "ring-2", theme.ring, theme.selectedBg, "z-10") 
                          : cn("border-border bg-bg-base active:bg-bg-card", theme.cardHover),
                        pkg.tag ? "pt-8" : ""
                      )}
                    >
                      {pkg.tag && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap bg-accent text-white">
                          {pkg.tag === 'popular' ? t.gameDetail.mostPopular : t.gameDetail.bestValue}
                        </div>
                      )}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className={cn("absolute -top-3 -right-3 rounded-full p-1.5", theme.button)}
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center gap-1.5 mb-2">
                        <ProductIcon type="game" id={game.id} className={cn("h-6 w-6", theme.accent)} />
                        <span className="text-2xl font-bold text-text-main">{pkg.amount}</span>
                      </div>
                      {pkg.bonus && (
                        <span className={cn("text-[10px] sm:text-xs font-bold mb-2 sm:mb-3 px-1.5 sm:px-2 py-0.5 rounded-full bg-accent/10", theme.accent)}>
                          +{pkg.bonus} {t.gameDetail.bonus}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-text-muted font-medium mt-auto">
                        ${pkg.price.toFixed(2)}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.section>

            <HowToUse type="game" />
          </div>
        </div>
      </div>

      {/* Sticky Checkout Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-bg-base/95 backdrop-blur-xl border-t border-border z-50"
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-text-muted font-medium mb-0.5">{t.gameDetail.total}</p>
            <p className={cn("text-xl font-bold", theme.accent)}>
              {selectedPackage 
                ? `$${game.packages.find(p => p.id === selectedPackage)?.price.toFixed(2)}`
                : '$0.00'}
            </p>
          </div>
          <motion.button
            onClick={handleCheckout}
            whileTap={!canPurchase ? {} : { scale: 0.95 }}
            disabled={!canPurchase}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              theme.button,
              !canPurchase ? "bg-bg-card text-text-muted" : ""
            )}
          >
            <Zap className="h-4 w-4" />
            {t.gameDetail.topUpInstantly}
          </motion.button>
        </div>
      </motion.div>
    </PageTransition>
  );
}
