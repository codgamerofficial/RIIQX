import { HeroCarousel } from "@/components/home/HeroCarousel";
import { EditorialSection } from "@/components/home/EditorialSection";
import { BrandStory } from "@/components/home/BrandStory";
import { NewDrops } from "@/components/home/NewDrops";
import { getCollectionProducts } from "@/lib/shopify";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default async function Home() {
  let newArrivals: any = { products: [] };

  try {
    newArrivals = await getCollectionProducts({ handle: 'new-arrivals', limit: 8 });
  } catch (e) {
    console.error("Fetch Error:", e);
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0B0B0B] text-white overflow-hidden">
      <HeroCarousel />

      <BrandStory />

      <div className="relative z-10 bg-[#0B0B0B]">
        <NewDrops products={newArrivals.products} />
        <EditorialSection />
        <TestimonialsSection />
      </div>

      {/* Footer is global layout */}
    </main>
  );
}
