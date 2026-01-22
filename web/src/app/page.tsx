import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewDrops } from "@/components/home/NewDrops";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { CollectionSection } from "@/components/home/CollectionSection";
import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Home() {
  let collections: any = [], newArrivals: any = { products: [] }, bestSellers: any = { products: [] }, streetwear: any = { products: [] };
  let errorMsg = null;

  try {
    collections = await getCollections();
    newArrivals = await getCollectionProducts({ handle: 'new-arrivals', limit: 12 });
    bestSellers = await getProducts({ sortKey: 'BEST_SELLING', limit: 12 });
    streetwear = await getCollectionProducts({ handle: 'streetwear', limit: 12 });
  } catch (e: any) {
    console.error("Shopify Fetch Error:", e);
    errorMsg = e.message;
    // Fallback data to prevent crash
    collections = [];
    newArrivals = { products: [] };
    bestSellers = { products: [] };
    streetwear = { products: [] };
  }

  return (
    <main className="flex flex-col min-h-screen bg-rich-black text-white">


      {/* Hero Section - Full-screen Carousel */}
      <HeroCarousel />

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 p-4 m-4 rounded text-red-500 font-mono text-sm">
          <strong>System Error:</strong> {errorMsg}
        </div>
      )}

      {/* Trending & Curated Collections */}
      <section className="py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-display text-white uppercase tracking-wider">Trending <span className="text-outline-gold">Streetwear</span></h2>
          <Link href="/streetwear" className="text-gold text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">View All &rarr;</Link>
        </div>
        <NewDrops products={streetwear.products} />
      </section>

      {/* New Arrivals (Darker Section) */}
      <section className="py-12 px-4 bg-white/5 border-y border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-display text-white uppercase tracking-wider">New <span className="text-cherry-red">Drops</span></h2>
        </div>
        <NewDrops products={newArrivals.products} />
      </section>

      <section className="py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-display text-gold uppercase tracking-wider">Best <span className="text-white">Sellers</span></h2>
        </div>
        <NewDrops products={bestSellers.products} />
      </section>

      {/* Category Cards */}
      <section className="py-12">
        <CategoryCircles collections={collections} />
      </section>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-rich-black/90 backdrop-blur-lg border-t border-gold/20 p-4 z-50">
        <Button className="w-full bg-gradient-to-r from-cherry-red to-gold hover:from-red-600 hover:to-yellow-500 text-black font-black uppercase tracking-widest py-6 text-lg shadow-[0_0_20px_rgba(227,28,121,0.4)]">
          <ShoppingBag className="w-5 h-5 mr-3" />
          Shop the Drop
        </Button>
      </div>

      {/* Spacer for fixed CTA */}
      <div className="h-24"></div>
    </main>
  );
}
