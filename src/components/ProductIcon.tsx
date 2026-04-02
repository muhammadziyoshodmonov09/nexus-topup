import { useState } from 'react';
import { cn } from '../lib/utils';
import { Gamepad2, Gift, Zap, Video, PenTool } from 'lucide-react';

interface ProductIconProps {
  type: 'game' | 'giftcard' | 'subscription' | 'social' | 'creator';
  id: string;
  className?: string;
}

export default function ProductIcon({ type, id, className }: ProductIconProps) {
  const [error, setError] = useState(false);

  if (error) {
    if (type === 'game') return <Gamepad2 className={cn("text-accent", className)} />;
    if (type === 'giftcard') return <Gift className={cn("text-emerald-500", className)} />;
    if (type === 'subscription') return <Zap className={cn("text-pink-500", className)} />;
    if (type === 'social') return <Video className={cn("text-blue-500", className)} />;
    if (type === 'creator') return <PenTool className={cn("text-purple-500", className)} />;
    return null;
  }

  let src = '';

  if (type === 'game') {
    if (id === 'pubg-mobile') src = '/assets/icons/pubg-uc.png';
    else if (id === 'mobile-legends') src = '/assets/icons/mlbb-diamond.png';
    else if (id === 'free-fire') src = '/assets/icons/freefire-diamond.png';
    else if (id === 'genshin-impact') src = '/assets/icons/genshin-crystal.png';
    else src = `/assets/icons/${id}.png`;
  } else if (type === 'giftcard') {
    if (id === 'google') src = '/assets/brands/google-play.svg';
    else if (id === 'psn') src = '/assets/brands/playstation.svg';
    else src = `/assets/brands/${id}.svg`;
  } else if (type === 'subscription') {
    src = `/assets/brands/${id}.svg`;
  } else if (type === 'social') {
    src = `/assets/brands/${id}.svg`;
  } else if (type === 'creator') {
    src = `/assets/brands/${id}.svg`;
  }

  if (!src) return null;

  return (
    <img 
      src={src} 
      alt={`${id} icon`} 
      className={cn("object-contain", className)} 
      onError={() => setError(true)}
    />
  );
}
