import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { ParallaxShowcase } from "@/components/home/ParallaxShowcase";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getCollections } from "@/lib/shopify";

export default async function Home() {
  const collections = await getCollections();
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />

      <ParallaxShowcase />

      <FeaturedCategories collections={collections} />

      <TrendingCarousel />

      <NewsletterSection />

      {/* Brand Statement / Spacer */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white/50 tracking-wider">
          ENGINEERED FOR THE EXTRAORDINARY
        </h2>
      </section>
    </main>
  );
}
