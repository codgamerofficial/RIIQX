import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NewDrops } from "@/components/home/NewDrops";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";

export default async function Home() {
  const collections = await getCollections();

  // Since specific collections are empty, fetch from frontpage and all products
  // Fetch more products to fill all sections
  const frontpageData = await getCollectionProducts({ handle: 'frontpage', limit: 50 });
  const allProductsData = await getProducts({ limit: 50 });

  // Use frontpage products if available, otherwise use all products
  const availableProducts = frontpageData.products.length > 0
    ? frontpageData.products
    : allProductsData.products;

  // Distribute products across sections
  const newArrivalsProducts = availableProducts.slice(0, 8);
  const featuredProducts = availableProducts.slice(8, 12);
  const trendingProducts = availableProducts.slice(12); // All remaining products

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Adaptive Entry Point */}
      <AdaptiveHero />

      {/* 2. Category Circles (Real Collections) */}
      <CategoryCircles collections={collections} />

      {/* 3. New Drops (Horizontal Scroll - First 8 products) */}
      <NewDrops products={newArrivalsProducts} />

      {/* 4. Featured Section (High Impact Grid - Next 4 products) */}
      <FeaturedSection products={featuredProducts} />

      {/* 5. Trending Grid (Bento Layout - Next 12 products) */}
      <TrendingGrid products={trendingProducts} />

      <NewsletterSection />

      {/* Brand Statement / Spacer */}
      <section className="py-24 px-4 text-center bg-black">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
          Rule the <span className="text-outline text-transparent stroke-white" style={{ WebkitTextStroke: "1px white" }}>Digital</span> Streets
        </h2>
      </section>
    </main>
  );
}
