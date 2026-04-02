import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, CreditCard, Gift } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

export default function MobileNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t.nav.home, path: '/' },
    { icon: Gamepad2, label: t.nav.games, path: '/games' },
    { icon: CreditCard, label: t.nav.subs, path: '/subscriptions' },
    { icon: Gift, label: t.nav.cards, path: '/gift-cards' },
  ];

  // Hide mobile nav on checkout and success pages
  if (location.pathname === '/checkout' || location.pathname === '/success') {
    return null;
  }

  // Hide mobile nav on detail pages (they have their own sticky bottom bar)
  const isDetailPage = 
    location.pathname.startsWith('/games/') || 
    location.pathname.startsWith('/subscriptions/') || 
    location.pathname.startsWith('/gift-cards/');

  if (isDetailPage) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-base/95 backdrop-blur-xl border-t border-border pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-12 active:scale-95 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 bg-bg-card rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-colors relative z-10",
                  isActive ? "text-accent" : "text-text-muted"
                )} 
              />
              <span 
                className={cn(
                  "text-[10px] font-medium transition-colors relative z-10",
                  isActive ? "text-text-main" : "text-text-muted"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
