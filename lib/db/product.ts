import { MOCK_PRODUCTS, type Product } from '@/lib/db/homepage';

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !product) {
      const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
      return mock || MOCK_PRODUCTS[0];
    }

    return product as Product;
  } catch {
    const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return mock || MOCK_PRODUCTS[0];
  }
}

export async function fetchRelatedProducts(
  categoryId?: string | null,
  currentProductId?: string
): Promise<Product[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_published', true)
      .limit(4);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: products } = await query;

    if (!products || products.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.id !== currentProductId).slice(0, 4);
    }

    return (products as Product[]).filter((p) => p.id !== currentProductId).slice(0, 4);
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.id !== currentProductId).slice(0, 4);
  }
}
