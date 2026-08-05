import type { Product, Category, ProductVariant } from '@/lib/mock/homepage';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock/homepage';

export interface FilterParams {
  categorySlug?: string;
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'bestselling';
  page?: number;
  pageSize?: number;
}

export interface CollectionResult {
  category: Category;
  products: Product[];
  totalProducts: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function fetchCollectionProducts(
  params: FilterParams
): Promise<CollectionResult> {
  const {
    categorySlug = 'all',
    colors = [],
    sizes = [],
    minPrice,
    maxPrice,
    inStockOnly = false,
    sort = 'featured',
    page = 1,
    pageSize = 8,
  } = params;

  let filtered = [...MOCK_PRODUCTS];

  let category: Category = {
    id: 'cat-all',
    name: 'ALL CAPSULE DROPS',
    slug: 'all',
    description: 'Explore the complete RIIQX dark-mode technical apparel lineup across all capsule releases.',
    image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1200',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (categorySlug !== 'all') {
    const foundCat = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
    category = foundCat || {
      id: `cat-${categorySlug}`,
      name: categorySlug.toUpperCase(),
      slug: categorySlug,
      description: `Collection of ${categorySlug} apparel drops.`,
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    filtered = filtered.filter((p) => p.category?.slug === categorySlug);
  }

  // Filter by Color
  if (colors.length > 0) {
    filtered = filtered.filter((p) =>
      p.variants?.some((v: ProductVariant) =>
        colors.some((c) => v.color.toLowerCase().includes(c.toLowerCase()))
      )
    );
  }

  // Filter by Size
  if (sizes.length > 0) {
    filtered = filtered.filter((p) =>
      p.variants?.some((v: ProductVariant) => sizes.includes(v.size))
    );
  }

  // Filter by Price Range
  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.sale_price ?? p.base_price) >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.sale_price ?? p.base_price) <= maxPrice);
  }

  // Filter by Stock Status
  if (inStockOnly) {
    filtered = filtered.filter((p) =>
      p.variants?.some((v: ProductVariant) => v.status === 'in_stock' && v.stock_quantity > 0)
    );
  }

  // Sort Logic
  if (sort === 'price_asc') {
    filtered.sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
  } else if (sort === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    category,
    products: paginatedProducts,
    totalProducts: totalCount,
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export const fetchCollectionData = fetchCollectionProducts;
