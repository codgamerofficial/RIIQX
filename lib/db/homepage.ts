export type { Category, ProductVariant, ProductImage, Product } from '@/lib/mock/homepage';
export { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock/homepage';
import type { Category, Product } from '@/lib/mock/homepage';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock/homepage';

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_published', true)
      .limit(6);

    if (products && products.length > 0) {
      return products as unknown as Product[];
    }
  } catch {
    // Fallback
  }
  return MOCK_PRODUCTS;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('*');
    if (categories && categories.length > 0) {
      return categories as Category[];
    }
  } catch {
    // Fallback
  }
  return MOCK_CATEGORIES;
}
