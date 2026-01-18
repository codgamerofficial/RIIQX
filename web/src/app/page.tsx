import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NewDrops } from "@/components/home/NewDrops";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { getCollectionProducts, getCollections } from "@/lib/shopify";

export default async function Home() {
  const collections = await getCollections();

  // Confirmed Handles: new-arrivals, featured, streetwear
  const newArrivalsData = await getCollectionProducts({ handle: 'new-arrivals', limit: 8 });
  const featuredData = await getCollectionProducts({ handle: 'featured', limit: 4 });
  const streetwearData = await getCollectionProducts({ handle: 'streetwear', limit: 30 }); // Using streetwear as "Trending" source for now

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Adaptive Entry Point */}
      <AdaptiveHero />

      {/* 2. Category Circles (Real Collections) */}
      <CategoryCircles collections={collections} />

      {/* 3. New Drops (Horizontal Scroll from 'new-arrivals') */}
      <NewDrops products={newArrivalsData.products} />

      {/* 4. Featured Section (High Impact Grid from 'featured') */}
      <FeaturedSection products={featuredData.products} />

      {/* 5. Trending Grid (Bento Layout from 'streetwear' or fallback) */}
      {/* If 'streetwear' is large, we can use it here, or distinct 'trending' if available */}
      <TrendingGrid products={streetwearData.products} />

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
