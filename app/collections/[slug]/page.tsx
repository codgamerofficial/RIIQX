import React from 'react';
import type { Metadata } from 'next';
import { fetchCollectionData } from '@/lib/db/collection';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CollectionHero } from '@/components/collection/CollectionHero';
import { FilterSidebar } from '@/components/collection/FilterSidebar';
import { SortDropdown } from '@/components/collection/SortDropdown';
import { ProductGrid } from '@/components/collection/ProductGrid';
import { PaginationControls } from '@/components/collection/PaginationControls';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    color?: string;
    size?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'bestselling';
    page?: string;
  }>;
}

// 1. Dynamic Canonical SEO Metadata Generation
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug === 'all' ? 'All Cyber Drops' : slug.toUpperCase().replace(/-/g, ' ');

  return {
    title: `${categoryName} — RIIQX Technical Apparel Collection`,
    description: `Shop the official RIIQX ${categoryName} collection. Dark-mode luxury streetwear, 500 GSM organic cotton hoodies, Outerwear shells, and Cargos.`,
    openGraph: {
      title: `${categoryName} // RIIQX Catalog`,
      description: 'Futuristic technical streetwear collection drops.',
      type: 'website',
    },
  };
}

// 2. Server Component Page Render
export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const colors = resolvedSearchParams.color ? resolvedSearchParams.color.split(',') : [];
  const sizes = resolvedSearchParams.size ? resolvedSearchParams.size.split(',') : [];
  const minPrice = resolvedSearchParams.min_price ? Number(resolvedSearchParams.min_price) : undefined;
  const maxPrice = resolvedSearchParams.max_price ? Number(resolvedSearchParams.max_price) : undefined;
  const inStockOnly = resolvedSearchParams.in_stock === 'true';
  const sort = resolvedSearchParams.sort || 'newest';
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;

  const { products, totalCount, totalPages, currentPage, category } =
    await fetchCollectionData({
      categorySlug: slug,
      colors,
      sizes,
      minPrice,
      maxPrice,
      inStockOnly,
      sort,
      page,
      pageSize: 8,
    });

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 w-full flex-1">
        {/* Collection Hero Header */}
        <CollectionHero category={category} totalCount={totalCount} slug={slug} />

        {/* Catalog Control Toolbar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <span className="font-mono text-xs text-riiqxText-muted uppercase">
            SHOWING {products.length} OF {totalCount} UNITS
          </span>
          <SortDropdown currentSort={sort} />
        </div>

        {/* Main Faceted Grid Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Faceted Filter Sidebar */}
          <FilterSidebar currentCategorySlug={slug} />

          {/* Product Results Grid */}
          <div className="flex-1 w-full space-y-8">
            <ProductGrid products={products} currentCategorySlug={slug} />

            {/* Server-Side Pagination */}
            <PaginationControls currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
