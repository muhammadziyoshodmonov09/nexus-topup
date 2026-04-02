import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { motion } from 'motion/react';
import { subscriptions } from '../data/subscriptions';
import ProductIcon from '../components/ProductIcon';
import { useLanguage } from '../i18n/LanguageContext';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Subscriptions() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full relative">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-text-main"
          >
            {t.subscriptions.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-muted max-w-2xl mx-auto"
          >
            {t.subscriptions.subtitle}
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {subscriptions.map((sub) => (
            <motion.div key={sub.id} variants={item} className="h-full">
              <Link
                to={`/subscriptions/${sub.id}`}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-200 active:scale-95 active:bg-bg-card-hover block aspect-[4/5] sm:aspect-auto sm:min-h-[200px] h-full"
              >
                <div className="absolute inset-0 w-full h-full">
                  <img src={sub.image} alt={sub.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
                  <div className="self-start rounded-xl bg-bg-base/80 p-2 sm:p-2.5 backdrop-blur-md border border-border">
                    <ProductIcon type="subscription" id={sub.id} className="h-5 w-5 sm:h-7 sm:w-7 text-text-main" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-[10px] sm:text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">{t.subscriptions.digitalCode}</p>
                    <h3 className="text-base sm:text-xl font-bold text-text-main line-clamp-2">{sub.name}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
