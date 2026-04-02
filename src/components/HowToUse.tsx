import { PlayCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

interface HowToUseProps {
  type: 'game' | 'giftcard' | 'subscription';
}

export default function HowToUse({ type }: HowToUseProps) {
  const { t } = useLanguage();

  const instructions = t.howToUse[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-3xl border border-border bg-bg-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/30">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold text-text-main">{t.howToUse.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-main mb-4">{t.howToUse.instructions}</h3>
          <ul className="space-y-3">
            {instructions.map((step: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-sm text-text-muted">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-text-main mb-4">{t.howToUse.videoGuide}</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-bg-base group cursor-pointer active:scale-95 transition-transform">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-base/60 transition-colors active:bg-bg-base/40 z-10">
              <PlayCircle className="h-12 w-12 text-accent mb-2 transition-transform group-active:scale-110" />
              <span className="text-sm font-medium text-text-muted">{t.howToUse.watchHow}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
