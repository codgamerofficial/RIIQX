import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { HomeClient } from "@/components/home/HomeClient";
import { getActiveDrop } from "@/lib/supabase/drops";

export default async function Home() {
  let newArrivals: any = { products: [] };
  let heroProducts: any = { products: [] };
  let activeDrop = null;

  try {
    const [newArrivalsData, heroData, dropData] = await Promise.all([
      getCollectionProducts({ handle: 'new-arrivals', limit: 8 }),
      getProducts({ limit: 6, sortKey: 'BEST_SELLING' }), // Fetch top products for 3D Hero
      getActiveDrop()
    ]);

    // Fallback if collection is empty or missing
    if (!newArrivalsData.products || newArrivalsData.products.length === 0) {
      console.log("Collection 'new-arrivals' not found, fetching latest products.");
      const fallbackData = await getProducts({ limit: 8, sortKey: 'CREATED_AT', reverse: true });
      newArrivals = fallbackData;
    } else {
      newArrivals = newArrivalsData;
    }

    heroProducts = heroData;
    activeDrop = dropData;
  } catch (e) {
    console.error("Fetch Error:", e);
  }

  return (
    <HomeClient
      newArrivals={newArrivals.products}
      heroProducts={heroProducts.products}
      activeDrop={activeDrop}
    />
  );
}
