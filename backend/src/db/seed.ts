/**
 * Seed: Dastlabki mahsulotlar va paketlar bazaga yoziladi.
 * Ishlatish: npm run seed
 */
import '../db/index.js'; // DB init
import { db } from '../db/index.js';
import { products, productPackages } from '../db/schema.js';
import { generateId } from '../utils/id.js';
import { eq } from 'drizzle-orm';

interface SeedProduct {
  type: string; slug: string; name: string;
  publisher?: string; currency?: string;
  imageUrl: string; bannerUrl: string;
  metadata?: Record<string, unknown>;
  packages: { amount: string; price: number; bonus?: string; tag?: string }[];
}

const seedData: SeedProduct[] = [
  {
    type: 'game', slug: 'pubg-mobile', name: 'PUBG Mobile',
    publisher: 'Tencent Games', currency: 'UC',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070',
    metadata: { theme: 'pubg' },
    packages: [
      { amount: '60', price: 0.99 },
      { amount: '325', price: 4.99, bonus: '25' },
      { amount: '660', price: 9.99, bonus: '60', tag: 'popular' },
      { amount: '1800', price: 24.99, bonus: '300' },
      { amount: '3850', price: 49.99, bonus: '850' },
      { amount: '8100', price: 99.99, bonus: '2100', tag: 'best-value' },
    ],
  },
  {
    type: 'game', slug: 'mobile-legends', name: 'Mobile Legends',
    publisher: 'Moonton', currency: 'Diamonds',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165',
    metadata: { theme: 'mlbb', regionType: 'zoneId' },
    packages: [
      { amount: '86', price: 1.50 },
      { amount: '172', price: 3.00 },
      { amount: '257', price: 4.50, bonus: '25', tag: 'popular' },
    ],
  },
  {
    type: 'game', slug: 'free-fire', name: 'Free Fire',
    publisher: 'Garena', currency: 'Diamonds',
    imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1986',
    metadata: { theme: 'freefire' },
    packages: [
      { amount: '100', price: 0.99 },
      { amount: '310', price: 2.99, bonus: '31', tag: 'popular' },
      { amount: '520', price: 4.99, bonus: '52' },
      { amount: '1060', price: 9.99, bonus: '106', tag: 'best-value' },
    ],
  },
  {
    type: 'giftcard', slug: 'steam', name: 'Steam Wallet',
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800',
    metadata: { color: 'from-blue-600 to-blue-900', regions: ['Global', 'US', 'EU'] },
    packages: [
      { amount: '5', price: 5 }, { amount: '10', price: 10 },
      { amount: '25', price: 25, tag: 'popular' },
      { amount: '50', price: 50 }, { amount: '100', price: 100, tag: 'best-value' },
    ],
  },
  {
    type: 'subscription', slug: 'discord-nitro', name: 'Discord Nitro Gift Code',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800',
    metadata: { color: 'from-indigo-500 to-purple-600' },
    packages: [
      { amount: '1 Month', price: 9.99 },
      { amount: '1 Year', price: 99.99, tag: 'best-value' },
    ],
  },
  {
    type: 'subscription', slug: 'spotify-premium', name: 'Spotify Premium Gift Code',
    imageUrl: 'https://images.unsplash.com/photo-1614680376408-14e34b0b894f?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1614680376408-14e34b0b894f?q=80&w=800',
    metadata: { color: 'from-green-500 to-emerald-600' },
    packages: [
      { amount: '1 Month', price: 10.99 },
      { amount: '3 Months', price: 32.99, tag: 'popular' },
      { amount: '1 Year', price: 99.99, tag: 'best-value' },
    ],
  },
];

async function seed() {
  console.log('🌱 Seeding products...');
  for (const item of seedData) {
    const existing = await db.select().from(products).where(eq(products.slug, item.slug)).limit(1);
    if (existing.length > 0) {
      console.log(`  ⏭️  Skipped (exists): ${item.name}`);
      continue;
    }
    const productId = generateId();
    await db.insert(products).values({
      id: productId,
      type: item.type,
      slug: item.slug,
      name: item.name,
      publisher: item.publisher ?? null,
      currency: item.currency ?? null,
      imageUrl: item.imageUrl,
      bannerUrl: item.bannerUrl,
      metadata: item.metadata ? JSON.stringify(item.metadata) : null,
      isActive: true,
      sortOrder: seedData.indexOf(item),
    });
    for (let i = 0; i < item.packages.length; i++) {
      const pkg = item.packages[i];
      await db.insert(productPackages).values({
        id: generateId(),
        productId,
        amount: pkg.amount,
        price: pkg.price,
        bonus: pkg.bonus ?? null,
        tag: pkg.tag ?? null,
        isActive: true,
        sortOrder: i,
      });
    }
    console.log(`  ✅ Seeded: ${item.name} (${item.packages.length} packages)`);
  }
  console.log('✅ Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
