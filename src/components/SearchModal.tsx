import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Gamepad2, CreditCard, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { games } from '../data/games';
import { giftCards } from '../data/giftCards';
import { subscriptions } from '../data/subscriptions';
import ProductIcon from './ProductIcon';
import { useLanguage } from '../i18n/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredGames = games.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
  const filteredGiftCards = giftCards.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
  const filteredSubscriptions = subscriptions.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  const hasResults = query.length > 0 && (filteredGames.length > 0 || filteredGiftCards.length > 0 || filteredSubscriptions.length > 0);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 top-0 sm:left-1/2 sm:top-[10%] z-[101] w-full sm:max-w-2xl sm:-translate-x-1/2 p-4"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl max-h-[80vh] flex flex-col">
              <div className="relative flex items-center border-b border-border px-4 shrink-0">
                <Search className="h-5 w-5 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search.placeholder}
                  className="w-full bg-transparent py-4 pl-3 pr-10 text-text-main placeholder-text-muted focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 rounded-full p-1.5 text-text-muted active:bg-bg-base active:text-text-main transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query.length === 0 ? (
                  <div className="p-8 text-center text-text-muted">
                    <Search className="mx-auto mb-3 h-8 w-8 opacity-20" />
                    <p>{t.search.startTyping}</p>
                  </div>
                ) : !hasResults ? (
                  <div className="p-8 text-center text-text-muted">
                    <p>"{query}" {t.search.noResults}</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {filteredGames.length > 0 && (
                      <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                          <Gamepad2 className="h-3.5 w-3.5" /> {t.search.games}
                        </h3>
                        <div className="space-y-1">
                          {filteredGames.map(game => (
                            <button
                              key={game.id}
                              onClick={() => handleSelect(`/games/${game.id}`)}
                              className="flex w-full items-center gap-3 rounded-xl p-2 text-left active:bg-bg-card-hover transition-colors group"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-base border border-border">
                                <ProductIcon type="game" id={game.id} className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-text-main group-active:text-accent transition-colors">{game.name}</p>
                                <p className="text-xs text-text-muted">{game.publisher}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredGiftCards.length > 0 && (
                      <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5" /> {t.search.giftCards}
                        </h3>
                        <div className="space-y-1">
                          {filteredGiftCards.map(card => (
                            <button
                              key={card.id}
                              onClick={() => handleSelect(`/gift-cards/${card.id}`)}
                              className="flex w-full items-center gap-3 rounded-xl p-2 text-left active:bg-bg-card-hover transition-colors group"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-base border border-border">
                                <ProductIcon type="giftcard" id={card.id} className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-text-main group-active:text-accent transition-colors">{card.name}</p>
                                <p className="text-xs text-text-muted">{t.giftCards.giftCard}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredSubscriptions.length > 0 && (
                      <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                          <MonitorPlay className="h-3.5 w-3.5" /> {t.search.subscriptions}
                        </h3>
                        <div className="space-y-1">
                          {filteredSubscriptions.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => handleSelect(`/subscriptions/${sub.id}`)}
                              className="flex w-full items-center gap-3 rounded-xl p-2 text-left active:bg-bg-card-hover transition-colors group"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-base border border-border">
                                <ProductIcon type="subscription" id={sub.id} className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-text-main group-active:text-accent transition-colors">{sub.name}</p>
                                <p className="text-xs text-text-muted">{t.search.subscriptions}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
