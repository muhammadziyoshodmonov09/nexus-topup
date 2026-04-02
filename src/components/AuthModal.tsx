import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, ChevronRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../context/ToastContext';
import { config } from '../config';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithTelegram, loginWithDev, continueAsGuest, isLoading, isTelegramEnv } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const handleGoogleClick = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          showToast('Google login unavailable. Try Telegram.', 'error');
        }
      });
    } else {
      showToast('Google login is coming soon. Use Telegram for now.', 'info');
    }
  };

  /**
   * Telegram login handler — Telegram WebApp ichida bo'lsa avtomatik,
   * brauzerda bo'lsa Telegram Bot linkiga redirect qiladi.
   */
  const handleTelegramClick = () => {
    if (isTelegramEnv) {
      loginWithTelegram();
    } else {
      // Brauzerda: Telegram bot ga redirect
      const botUsername = config.telegramBotUsername || 'uzpinbot';
      window.open(`https://t.me/${botUsername}?start=login`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container — scroll qilsa bo'ladi */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed inset-0 z-[111] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          >
            <div
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-t sm:border border-border bg-bg-card shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-3">
                <button
                  onClick={closeAuthModal}
                  className="absolute right-4 top-4 rounded-full p-2 text-text-muted transition-colors hover:bg-bg-base hover:text-text-main z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-3">
                    <UserPlus className="h-7 w-7 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-text-main mb-1">{t.auth.title}</h2>
                  <p className="text-sm text-text-muted max-w-[280px]">{t.auth.subtitle}</p>
                </div>
              </div>

              {/* Auth Options */}
              <div className="px-6 pb-6 pb-safe space-y-2.5">

                {/* Telegram Login — DOIMO ko'rinadi */}
                <button
                  onClick={handleTelegramClick}
                  disabled={isLoading}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-[#29B6F6]/30 bg-[#29B6F6]/10 px-4 py-3.5 text-left transition-all active:scale-[0.98] hover:bg-[#29B6F6]/20 disabled:opacity-60 disabled:cursor-wait"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#29B6F6] text-white">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-text-main">{t.auth.telegramLogin}</span>
                    <span className="block text-xs text-text-muted truncate">{t.auth.telegramHint}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
                </button>

                {/* Google Login */}
                <button
                  onClick={handleGoogleClick}
                  disabled={isLoading}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-border bg-bg-base px-4 py-3.5 text-left transition-all active:scale-[0.98] hover:bg-bg-card-hover disabled:opacity-60 disabled:cursor-wait"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-text-main">{t.auth.googleLogin}</span>
                    <span className="block text-xs text-text-muted truncate">{t.auth.googleHint}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-0.5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-text-muted font-medium">{t.auth.or}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Guest Mode */}
                <button
                  onClick={continueAsGuest}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-medium text-text-muted transition-all active:scale-[0.98] hover:bg-bg-base hover:text-text-main disabled:opacity-60"
                >
                  {t.auth.guestMode}
                </button>

                {/* DEV LOGIN — faqat development */}
                {config.isDev && (
                  <button
                    onClick={loginWithDev}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-yellow-500/40 bg-yellow-500/5 px-5 py-2.5 text-xs font-mono font-medium text-yellow-400/80 transition-all hover:bg-yellow-500/10 disabled:opacity-60"
                  >
                    🛠 Dev Login (localhost only)
                  </button>
                )}

                <p className="text-center text-[11px] text-text-muted pt-1 leading-relaxed">
                  {t.auth.terms}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
