import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Wallet, Search, Globe, User, LogOut, ChevronDown } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import type { Language } from '../i18n/translations';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const { balance, openWalletModal } = useWallet();
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /** Email yoki ismni qisqartirish (mobil uchun) */
  const getDisplayLabel = (): string => {
    if (!user) return '';
    if (user.displayName && user.displayName.length <= 12) return user.displayName;
    if (user.displayName) return user.displayName.split(' ')[0];
    // Email qisqartirish: user@domain.com → user
    const emailLocal = user.email.split('@')[0];
    return emailLocal.length > 10 ? emailLocal.slice(0, 10) + '…' : emailLocal;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-bg-base/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-transform active:scale-95">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-main">
            Nexus
          </span>
        </Link>

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Button */}
          <button
            onClick={onSearchOpen}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-border bg-bg-card text-text-muted transition-all active:scale-95 active:bg-bg-card-hover"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 h-9 rounded-full border border-border bg-bg-card px-2 text-sm font-medium text-text-muted transition-all active:scale-95 active:bg-bg-card-hover"
              aria-label="Language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase">{lang}</span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl border border-border bg-bg-card shadow-xl min-w-[130px] z-50"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        lang === l.code
                          ? 'bg-accent/10 text-accent font-semibold'
                          : 'text-text-muted active:bg-bg-card-hover'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wallet Button */}
          <button
            onClick={openWalletModal}
            className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-2.5 py-1.5 text-sm font-semibold text-text-main transition-all active:scale-95 active:bg-bg-card-hover"
          >
            <Wallet className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">${balance.toFixed(2)}</span>
            <span className="sm:hidden">${balance.toFixed(0)}</span>
          </button>

          {/* User / Auth Button */}
          {isLoggedIn && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card pl-1.5 pr-2 py-1 text-sm transition-all active:scale-95 active:bg-bg-card-hover"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-text-main max-w-[80px] truncate">
                  {getDisplayLabel()}
                </span>
                <ChevronDown className="h-3 w-3 text-text-muted" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl border border-border bg-bg-card shadow-xl min-w-[180px] z-50"
                  >
                    {/* User info */}
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-xs font-medium text-text-muted mb-0.5">{t.auth.loggedInAs}</p>
                      <p className="text-sm font-semibold text-text-main truncate">{user.displayName}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    {/* Logout */}
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 transition-colors active:bg-bg-card-hover"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.auth.signOut}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-all active:scale-95 active:bg-accent-hover"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.auth.signIn}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
