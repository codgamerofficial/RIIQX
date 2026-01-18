import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NewDrops } from "@/components/home/NewDrops";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { getCollectionProducts, getCollections } from "@/lib/shopify";

export default async function Home() {
  const collections = await getCollections();
  const fashionData = await getCollectionProducts({ handle: 'fashion', limit: 3 });
  const electronicsData = await getCollectionProducts({ handle: 'electronics', limit: 10 });

  const fashionProducts = fashionData.products;
  const electronicsProducts = electronicsData.products;

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Adaptive Entry Point - Starts Mixed/Electronics */}
      <AdaptiveHero />

      {/* 2. Category Circles (Real Data) */}
      <CategoryCircles collections={collections} />

      {/* 3. New Drops (Horizontal Scroll) */}
      <NewDrops products={fashionProducts} />

      {/* 3. Trending Grid (Bento Layout) */}
      <TrendingGrid products={electronicsProducts} />

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
