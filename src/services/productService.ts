/**
 * Product Service — Real Backend API
 *
 * Mahsulot ma'lumotlarini backend dan oladi.
 * GET /api/products va GET /api/products/:slug endpointlari ishlatiladi.
 */

import { config } from '../config';
import type { ApiResponse, ProductType } from '../types';

const API = config.apiBaseUrl;

/** Backend dan kelgan mahsulot formati */
interface BackendProduct {
  id: string;
  type: string;
  slug: string;
  name: string;
  publisher: string | null;
  currency: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  metadata: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface BackendPackage {
  id: string;
  productId: string;
  amount: string;
  price: number;
  bonus: string | null;
  tag: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface ProductWithPackages extends BackendProduct {
  packages: BackendPackage[];
}

/**
 * GET /products — Barcha mahsulotlar (ixtiyoriy type filter bilan)
 */
export async function getProducts(type?: string): Promise<ApiResponse<BackendProduct[]>> {
  try {
    const url = type ? `${API}/products?type=${type}` : `${API}/products`;
    const res = await fetch(url);
    return await res.json();
  } catch {
    return { success: false, data: null, error: 'Failed to load products' };
  }
}

/**
 * GET /products/:slug — Bitta mahsulot + paketlari
 */
export async function getProductBySlug(slug: string): Promise<ApiResponse<ProductWithPackages>> {
  try {
    const res = await fetch(`${API}/products/${slug}`);
    return await res.json();
  } catch {
    return { success: false, data: null, error: 'Failed to load product' };
  }
}

/**
 * Mahsulot nomini olish (slug asosida, cache qilmasdan)
 */
export function getProductName(productType: ProductType, productId: string): string {
  void productType;
  return productId;
}

/**
 * Qidiruv (hozircha frontend-side, kelajakda backend /products/search)
 */
export async function searchProducts(
  query: string
): Promise<ApiResponse<{ all: BackendProduct[] }>> {
  try {
    const res = await fetch(`${API}/products`);
    const result = await res.json();
    if (!result.success) return { success: false, data: null, error: result.error };
    const q = query.toLowerCase();
    const filtered = (result.data as BackendProduct[]).filter(p =>
      p.name.toLowerCase().includes(q)
    );
    return { success: true, data: { all: filtered }, error: null };
  } catch {
    return { success: false, data: null, error: 'Search failed' };
  }
}

// Re-export types for consumers
export type { BackendProduct, BackendPackage, ProductWithPackages };
