import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <PageTransition className="flex-1 flex items-center justify-center bg-bg-base text-text-main p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mb-6"
        >
          <AlertTriangle className="h-10 w-10 text-accent" />
        </motion.div>

        <h1 className="text-5xl font-extrabold text-text-main mb-2">404</h1>
        <h2 className="text-xl font-bold text-text-main mb-2">{t.notFound.title}</h2>
        <p className="text-sm text-text-muted mb-8">{t.notFound.subtitle}</p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition-all active:scale-95 active:bg-accent-hover"
        >
          <Home className="h-4 w-4" />
          {t.notFound.returnHome}
        </Link>
      </motion.div>
    </PageTransition>
  );
}
