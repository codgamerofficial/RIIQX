import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductMediaGallery } from '@/components/product/ProductMediaGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/db/product';
import type { ProductImage, ProductVariant } from '@/lib/db/homepage';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found // RIIQX',
      description: 'The requested technical apparel drop does not exist in the catalog.',
    };
  }

  const primaryImage = product.images?.[0]?.url;

  return {
    title: `${product.name} // RIIQX`,
    description: product.description || 'Cybernetic dark-mode luxury streetwear apparel.',
    openGraph: {
      title: `${product.name} // RIIQX`,
      description: product.description || 'Cybernetic dark-mode luxury streetwear apparel.',
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} // RIIQX`,
      description: product.description || 'Cybernetic dark-mode luxury streetwear apparel.',
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product || !product.is_published) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product.category_id, product.id);

  // Schema.org Product JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((i: ProductImage) => i.url) || [],
    description: product.description,
    sku: product.variants?.[0]?.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'RIIQX',
    },
    offers: {
      '@type': 'Offer',
      url: `https://riiqx.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.sale_price || product.base_price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.variants?.some((v: ProductVariant) => v.stock_quantity > 0)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white flex flex-col justify-between">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-16 w-full flex-1">
        {/* Main 2-Column Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Gallery & 360° Rotator (Sticky on Desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <ProductMediaGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Right Column: Interactive Buy Box & Info */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Bottom Section: Related Category Recommendations */}
        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}
