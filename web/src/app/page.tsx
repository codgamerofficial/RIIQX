import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { HomeClient } from "@/components/home/HomeClient";

export default async function Home() {
  let newArrivals: any = { products: [] };
  let heroProducts: any = { products: [] };

  try {
    const [newArrivalsData, heroData] = await Promise.all([
      getCollectionProducts({ handle: 'new-arrivals', limit: 8 }),
      getProducts({ limit: 6, sortKey: 'BEST_SELLING' }) // Fetch top products for 3D Hero
    ]);
    newArrivals = newArrivalsData;
    heroProducts = heroData;
  } catch (e) {
    console.error("Fetch Error:", e);
  }

  return (
    <HomeClient
      newArrivals={newArrivals.products}
      heroProducts={heroProducts.products}
    />
  );
}
