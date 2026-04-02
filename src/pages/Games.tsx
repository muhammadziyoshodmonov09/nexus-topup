import { useState } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/games';
import PageTransition from '../components/PageTransition';
import { motion } from 'motion/react';
import ProductIcon from '../components/ProductIcon';
import { Search } from 'lucide-react';
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

export default function Games() {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full text-text-main pb-24">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2"
            >
              {t.games.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base text-text-muted max-w-2xl"
            >
              {t.games.subtitle}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full md:w-72"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.games.searchPlaceholder}
              className="w-full bg-bg-card border border-border rounded-xl py-4 pl-12 pr-4 text-base text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
            />
          </motion.div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <Search className="mx-auto h-12 w-12 text-text-muted mb-4" />
            <h3 className="text-xl font-medium text-text-main mb-2">{t.games.noResults}</h3>
            <p className="text-text-muted">"{searchQuery}" {t.games.noResultsHint}</p>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {filteredGames.map((game) => (
              <motion.div key={game.id} variants={item}>
              <Link
                to={`/games/${game.id}`}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-200 active:scale-95 active:bg-bg-card-hover block aspect-[4/5]"
              >
                <div className="absolute inset-0 w-full h-full opacity-40">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                
                <div className="relative z-10 flex h-full flex-col justify-between p-4">
                  <div className="self-start rounded-xl bg-bg-base border border-border p-2 flex items-center justify-center">
                    <ProductIcon type="game" id={game.id} className="h-6 w-6" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-[10px] font-medium text-text-muted mb-0.5 uppercase tracking-wider">{game.publisher}</p>
                    <h3 className="text-sm sm:text-base font-bold text-text-main line-clamp-2">
                      {game.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
