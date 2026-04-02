/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import Subscriptions from './pages/Subscriptions';
import SubscriptionDetail from './pages/SubscriptionDetail';
import GiftCards from './pages/GiftCards';
import GiftCardDetail from './pages/GiftCardDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import TelegramSupport from './components/TelegramSupport';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import { WalletProvider } from './context/WalletContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import WalletModal from './components/WalletModal';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans flex flex-col">
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <AnimatedRoutes />
      </main>
      <MobileNav />
      <TelegramSupport />
      <WalletModal />
      <AuthModal />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* @ts-expect-error - key is a valid React prop but TS complains with RoutesProps */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/gift-cards/:id" element={<GiftCardDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Provider tartibi (tashqaridan ichkariga):
 * Language → Auth → Wallet → Order → Toast → Router
 */
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WalletProvider>
          <OrderProvider>
            <ToastProvider>
              <Router>
                <AppContent />
              </Router>
            </ToastProvider>
          </OrderProvider>
        </WalletProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
