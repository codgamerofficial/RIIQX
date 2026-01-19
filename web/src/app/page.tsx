import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NewDrops } from "@/components/home/NewDrops";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { TrendingCategories } from "@/components/home/TrendingCategories";
import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";
import { ShoppingBag } from "lucide-react";

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
      {/* Promotional Banner */}
      <PromotionalBanner
        message="2 Crore+ Customers Trust RIIQX"
        icon={<ShoppingBag className="w-5 h-5" />}
      />

      {/* 1. Adaptive Entry Point */}
      <AdaptiveHero />

      {/* 2. Trending Categories (Bewakoof-style) */}
      <TrendingCategories collections={collections} />

      {/* 3. Category Circles (Real Collections) */}
      <CategoryCircles collections={collections} />

      {/* 4. New Drops (Horizontal Scroll - First 8 products) */}
      <NewDrops products={newArrivalsProducts} />

      {/* 5. Featured Section (High Impact Grid - Next 4 products) */}
      <FeaturedSection products={featuredProducts} />

      {/* 6. Trending Grid (Bento Layout - Next 12 products) */}
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
