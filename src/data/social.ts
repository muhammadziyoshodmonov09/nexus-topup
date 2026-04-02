/**
 * [FUTURE EXPANSION] Social media products — not yet integrated into routing or UI.
 * These will be added as a new category when the social features section is built.
 */

export interface SocialProduct {
  id: string;
  name: string;
  image: string;
  color: string;
  description: string;
}

export const socialProducts: SocialProduct[] = [
  {
    id: 'tiktok',
    name: 'TikTok Coins',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=800&auto=format&fit=crop',
    color: 'from-pink-500 to-rose-500',
    description: 'Support your favorite creators with TikTok Coins.'
  },
  {
    id: 'bigo-live',
    name: 'Bigo Live Diamonds',
    image: 'https://images.unsplash.com/photo-1516280440502-61f53f39a134?q=80&w=800&auto=format&fit=crop',
    color: 'from-blue-400 to-cyan-400',
    description: 'Send gifts and stand out on Bigo Live.'
  },
  {
    id: 'twitch',
    name: 'Twitch Bits',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef43eeed7?q=80&w=800&auto=format&fit=crop',
    color: 'from-purple-500 to-indigo-500',
    description: 'Cheer for streamers and unlock badges.'
  },
  {
    id: 'likee',
    name: 'Likee Coins',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    color: 'from-pink-400 to-purple-500',
    description: 'Boost your presence and gift creators.'
  }
];
