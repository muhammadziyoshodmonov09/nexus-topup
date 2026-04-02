export type GameTheme = 'pubg' | 'mlbb' | 'freefire' | 'genshin' | 'codm' | 'coc';

export interface Package {
  id: string;
  amount: number | string;
  price: number;
  bonus?: number | string;
  tag?: 'popular' | 'best-value';
}

export interface Game {
  id: string;
  name: string;
  publisher: string;
  currency: string;
  theme: GameTheme;
  image: string;
  banner: string;
  packages: Package[];
  regionType?: 'dropdown' | 'zoneId';
  regions?: string[];
}

export const games: Game[] = [
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    publisher: 'Tencent Games',
    currency: 'UC',
    theme: 'pubg',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    packages: [
      { id: 'p1', amount: 60, price: 0.99 },
      { id: 'p2', amount: 325, price: 4.99, bonus: 25 },
      { id: 'p3', amount: 660, price: 9.99, bonus: 60, tag: 'popular' },
      { id: 'p4', amount: 1800, price: 24.99, bonus: 300 },
      { id: 'p5', amount: 3850, price: 49.99, bonus: 850 },
      { id: 'p6', amount: 8100, price: 99.99, bonus: 2100, tag: 'best-value' },
    ],
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    publisher: 'Moonton',
    currency: 'Diamonds',
    theme: 'mlbb',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop',
    regionType: 'zoneId',
    packages: [
      { id: 'm1', amount: 86, price: 1.50 },
      { id: 'm2', amount: 172, price: 3.00 },
      { id: 'm3', amount: 257, price: 4.50, bonus: 25, tag: 'popular' },
      { id: 'm4', amount: 344, price: 6.00, bonus: 34 },
      { id: 'm5', amount: 429, price: 7.50, bonus: 42 },
      { id: 'm6', amount: 'Weekly Pass', price: 1.99, tag: 'best-value' },
      { id: 'm7', amount: 'Monthly Pass', price: 7.99 },
      { id: 'm8', amount: 'Starlight Member', price: 9.99 },
      { id: 'm9', amount: 'Twilight Pass', price: 9.99 },
    ],
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    publisher: 'Garena',
    currency: 'Diamonds',
    theme: 'freefire',
    image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=800&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1986&auto=format&fit=crop',
    packages: [
      { id: 'f1', amount: 100, price: 0.99 },
      { id: 'f2', amount: 310, price: 2.99, bonus: 31, tag: 'popular' },
      { id: 'f3', amount: 520, price: 4.99, bonus: 52 },
      { id: 'f4', amount: 1060, price: 9.99, bonus: 106, tag: 'best-value' },
    ],
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    publisher: 'HoYoverse',
    currency: 'Genesis Crystals',
    theme: 'genshin',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2184&auto=format&fit=crop',
    regionType: 'dropdown',
    regions: ['America', 'Europe', 'Asia', 'TW/HK/MO'],
    packages: [
      { id: 'g1', amount: 60, price: 0.99 },
      { id: 'g2', amount: 300, price: 4.99, bonus: 30 },
      { id: 'g3', amount: 980, price: 14.99, bonus: 110, tag: 'popular' },
      { id: 'g4', amount: 1980, price: 29.99, bonus: 260 },
      { id: 'g5', amount: 3280, price: 49.99, bonus: 600 },
      { id: 'g6', amount: 6480, price: 99.99, bonus: 1600 },
      { id: 'g7', amount: 'Welkin Moon', price: 4.99, tag: 'best-value' },
    ],
  },
  {
    id: 'cod-mobile',
    name: 'Call of Duty Mobile',
    publisher: 'Activision',
    currency: 'CP',
    theme: 'codm',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000&auto=format&fit=crop',
    packages: [
      { id: 'c1', amount: 80, price: 0.99 },
      { id: 'c2', amount: 420, price: 4.99, tag: 'popular' },
      { id: 'c3', amount: 880, price: 9.99 },
      { id: 'c4', amount: 2400, price: 24.99, tag: 'best-value' },
    ],
  },
  {
    id: 'clash-of-clans',
    name: 'Clash of Clans',
    publisher: 'Supercell',
    currency: 'Gems',
    theme: 'coc',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2000&auto=format&fit=crop',
    packages: [
      { id: 'cl1', amount: 80, price: 0.99 },
      { id: 'cl2', amount: 500, price: 4.99, tag: 'popular' },
      { id: 'cl3', amount: 1200, price: 9.99 },
      { id: 'cl4', amount: 2500, price: 19.99, tag: 'best-value' },
    ],
  },
];
