import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewDrops } from "@/components/home/NewDrops";
import { getCollectionProducts, getProducts } from "@/lib/shopify";

export default async function Home() {
  let newArrivals: any = { products: [] };
  let bestSellers: any = { products: [] };

  try {
    newArrivals = await getCollectionProducts({ handle: 'new-arrivals', limit: 4 });
  } catch (e) {
    console.error("Fetch Error:", e);
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0B0B0B] text-white">
      <HeroCarousel />

      <div className="space-y-0">
        <NewDrops products={newArrivals.products} />
      </div>

      {/* Footer is global layout */}
    </main>
  );
}
