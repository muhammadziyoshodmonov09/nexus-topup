import { ShieldCheck, Zap, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../i18n/LanguageContext';

interface TrustBadgesProps {
  className?: string;
}

export default function TrustBadges({ className }: TrustBadgesProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-text-muted", className)}>
      <div className="flex items-center gap-1.5">
        <Zap className="h-4 w-4 text-accent" />
        <span>{t.trust.instantDelivery}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-accent" />
        <span>{t.trust.securePayment}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-accent" />
        <span>{t.trust.support247}</span>
      </div>
    </div>
  );
}
