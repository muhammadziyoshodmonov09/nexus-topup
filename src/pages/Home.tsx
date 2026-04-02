import { Link } from 'react-router-dom';
import { games } from '../data/games';
import { giftCards } from '../data/giftCards';
import { subscriptions } from '../data/subscriptions';
import { ChevronRight, Zap, Flame, Gift, PlaySquare, Coins, Gem, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'motion/react';
import ProductIcon from '../components/ProductIcon';
import BannerCarousel from '../components/BannerCarousel';
import { useLanguage } from '../i18n/LanguageContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const hotDeals = [
  { id: 'pubg-660', gameId: 'pubg-mobile', name: '660 UC', price: '$9.99', icon: Coins, badge: 'popular' },
  { id: 'mlbb-257', gameId: 'mobile-legends', name: '257 Diamonds', price: '$4.99', icon: Gem, badge: 'bestValue' },
  { id: 'ff-1060', gameId: 'free-fire', name: '1060 Diamonds', price: '$9.99', icon: Gem, badge: 'hot' },
  { id: 'genshin-980', gameId: 'genshin-impact', name: '980 Crystals', price: '$14.99', icon: Sparkles, badge: '-15%' },
];

export default function Home() {
  const { t } = useLanguage();

  const getBadgeLabel = (badge: string) => {
    if (badge === 'popular') return t.home.popular;
    if (badge === 'bestValue') return t.home.bestValue;
    if (badge === 'hot') return t.home.hot;
    return badge;
  };

  return (
    <PageTransition>
      <div className="w-full text-text-main relative pb-24">
        {/* Banner */}
        <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
          <BannerCarousel />
        </section>

        {/* Popular Games */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <PlaySquare className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-text-main">{t.home.popularGames}</h2>
            </div>
            <Link to="/games" className="text-sm font-semibold text-accent active:text-accent-hover flex items-center gap-1 transition-colors group">
              {t.home.viewAll} <ChevronRight className="h-4 w-4 transition-transform group-active:translate-x-1" />
            </Link>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 lg:grid-cols-3"
          >
            {games.slice(0, 6).map((game) => (
              <motion.div key={game.id} variants={item} className="h-full">
                <Link
                  to={`/games/${game.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-200 active:scale-95 active:bg-bg-card-hover block h-full"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-base">
                    <img
                      src={game.banner || game.image}
                      alt={game.name}
                      className="h-full w-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent opacity-90" />
                    <div className="absolute -bottom-6 left-4 h-14 w-14 rounded-xl border-4 border-bg-card bg-bg-base overflow-hidden z-10">
                      <ProductIcon type="game" id={game.id} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="p-4 pt-8 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-text-main line-clamp-1">{game.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Zap className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-medium text-text-muted">{t.home.instantTopup}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Hot Deals */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Flame className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-text-main">{t.home.hotDeals}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
            {hotDeals.map((deal) => {
              const Icon = deal.icon;
              return (
                <Link key={deal.id} to={`/games/${deal.gameId}`} className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-4 transition-all active:scale-95 active:bg-bg-card-hover block h-full">
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {getBadgeLabel(deal.badge)}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-base border border-border">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-main line-clamp-1">{deal.name}</h4>
                      <p className="text-xs font-medium text-text-muted mt-0.5">{deal.price}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Gift Cards */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Gift className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-text-main">{t.home.giftCards}</h2>
            </div>
            <Link to="/gift-cards" className="text-sm font-semibold text-accent active:text-accent-hover flex items-center gap-1 transition-colors group">
              {t.home.viewAll} <ChevronRight className="h-4 w-4 transition-transform group-active:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {giftCards.slice(0, 4).map(card => (
              <Link key={card.id} to={`/gift-cards/${card.id}`} className="relative block overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-200 active:scale-95 active:bg-bg-card-hover min-h-[160px] h-full">
                <div className="absolute inset-0 w-full h-full opacity-40">
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-border bg-bg-base flex items-center justify-center">
                    <ProductIcon type="giftcard" id={card.id} className="h-6 w-6" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-base font-bold text-text-main mb-0.5">{card.name}</h3>
                    <p className="text-xs font-medium text-accent">{t.home.selectAmount}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subscriptions */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Zap className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-text-main">{t.home.subscriptions}</h2>
            </div>
            <Link to="/subscriptions" className="text-sm font-semibold text-accent flex items-center gap-1 transition-colors active:text-accent-hover group">
              {t.home.viewAll} <ChevronRight className="h-4 w-4 transition-transform group-active:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptions.slice(0, 4).map(sub => (
              <Link key={sub.id} to={`/subscriptions/${sub.id}`} className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-200 active:scale-95 active:bg-bg-card-hover min-h-[160px] h-full">
                <div className="absolute inset-0 w-full h-full opacity-40">
                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                <div className="relative z-10 flex h-full flex-col p-4">
                  <div className="mb-2 h-10 w-10 rounded-xl overflow-hidden border border-border bg-bg-base flex items-center justify-center">
                    <ProductIcon type="subscription" id={sub.id} className="h-6 w-6" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-base font-bold text-text-main line-clamp-1">{sub.name}</h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{sub.features[0]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
