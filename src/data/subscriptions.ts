export interface SubscriptionPackage {
  duration: string;
  price: number;
}

export interface Subscription {
  id: string;
  name: string;
  image: string;
  color: string;
  features: string[];
  packages: SubscriptionPackage[];
}

export const subscriptions: Subscription[] = [
  {
    id: 'discord',
    name: 'Discord Nitro Gift Code',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop',
    color: 'from-indigo-500 to-purple-600',
    features: ['Custom emojis anywhere', 'HD video streaming', '2 Server Boosts', 'Larger file uploads'],
    packages: [
      { duration: '1 Month', price: 9.99 },
      { duration: '1 Year', price: 99.99 }
    ]
  },
  {
    id: 'spotify',
    name: 'Spotify Premium Gift Code',
    image: 'https://images.unsplash.com/photo-1614680376408-14e34b0b894f?q=80&w=800&auto=format&fit=crop',
    color: 'from-green-500 to-emerald-600',
    features: ['Ad-free music listening', 'Play anywhere - even offline', 'On-demand playback', 'High audio quality'],
    packages: [
      { duration: '1 Month', price: 10.99 },
      { duration: '3 Months', price: 32.99 },
      { duration: '6 Months', price: 59.99 },
      { duration: '1 Year', price: 99.99 }
    ]
  },
  {
    id: 'netflix',
    name: 'Netflix Premium Gift Code',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    color: 'from-red-600 to-rose-700',
    features: ['Unlimited ad-free movies', 'Watch on 4 supported devices', 'Ultra HD available', 'Download to watch offline'],
    packages: [
      { duration: '1 Month', price: 22.99 },
      { duration: '3 Months', price: 68.99 },
      { duration: '6 Months', price: 137.99 }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube Premium Gift Code',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    color: 'from-red-500 to-red-800',
    features: ['Ad-free videos', 'Background play', 'YouTube Music Premium', 'Download videos'],
    packages: [
      { duration: '1 Month', price: 13.99 },
      { duration: '1 Year', price: 139.99 }
    ]
  },
  {
    id: 'telegram',
    name: 'Telegram Premium Gift Code',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop',
    color: 'from-blue-400 to-blue-600',
    features: ['Doubled limits', '4GB file uploads', 'Faster downloads', 'Exclusive stickers'],
    packages: [
      { duration: '3 Months', price: 11.99 },
      { duration: '6 Months', price: 19.99 },
      { duration: '1 Year', price: 39.99 }
    ]
  }
];
