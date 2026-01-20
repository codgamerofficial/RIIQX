import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NewDrops } from "@/components/home/NewDrops";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { TrendingCategories } from "@/components/home/TrendingCategories";
import { CollectionSection } from "@/components/home/CollectionSection";
import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";
import { ShoppingBag } from "lucide-react";
import { DesignFearlessPromo } from "@/components/marketing/DesignFearlessPromo";
import { DesignNewArrivalsBanner } from "@/components/marketing/DesignNewArrivalsBanner";
import { DesignFeaturedStory } from "@/components/marketing/DesignFeaturedStory";

export default async function Home() {
  const collections = await getCollections();

  // 1. New Arrivals (Handle: new-arrivals) - Increased to 12
  const newArrivals = await getCollectionProducts({ handle: 'new-arrivals', limit: 12 });

  // 2. Best Sellers (Sorted by BEST_SELLING) - Increased to 16
  const bestSellers = await getProducts({ sortKey: 'BEST_SELLING', limit: 16 });

  // 3. Streetwear (Handle: streetwear) - Increased to 12
  const streetwear = await getCollectionProducts({ handle: 'streetwear', limit: 12 });

  // 4. Accessories (Handle: accessories) - Increased to 12
  const accessories = await getCollectionProducts({ handle: 'accessories', limit: 12 });

  // 5. Summer Collection (Handle: summer-collection) - Increased to 12
  const summer = await getCollectionProducts({ handle: 'summer-collection', limit: 12 });

  // 6. Limited Edition (Handle: limited-edition) - Increased to 12
  const limited = await getCollectionProducts({ handle: 'limited-edition', limit: 12 });

  // 7. Collaborations (Handle: collaboration) - Increased to 12
  const collaboration = await getCollectionProducts({ handle: 'collaboration', limit: 12 });


  // Featured Section Logic: Use specific products from 'frontpage' or 'featured' or just the first few best sellers
  // Increased to 6 for better showcase
  const featured = await getCollectionProducts({ handle: 'frontpage', limit: 6 });
  const featuredProducts = featured.products.length > 0 ? featured.products : bestSellers.products.slice(0, 6);

  // Trending Grid Logic: Use remaining best sellers or 'trending' collection
  // Increased to 16 for more variety
  const trending = await getCollectionProducts({ handle: 'trending', limit: 16 });
  const trendingProducts = trending.products.length > 0 ? trending.products : (await getProducts({ sortKey: 'BEST_SELLING', limit: 16 })).products;


  return (
    <main className="flex flex-col min-h-screen">
      {/* Promotional Banner */}
      <PromotionalBanner
        message="2 Crore+ Customers Trust RIIQX"
        icon={<ShoppingBag className="w-5 h-5" />}
      />

      {/* 1. Hero Carousel v2 - Premium Redesign */}
      <HeroCarousel />

      {/* [NEW] Design 4: Fearless Promo */}
      <DesignFearlessPromo />

      {/* 2. Trending Categories (Bewakoof-style) */}
      <TrendingCategories products={trendingProducts} />

      {/* 3. Category Circles (Real Collections) */}
      <CategoryCircles collections={collections} />

      {/* [NEW] Design 3: New Arrivals Banner */}
      <DesignNewArrivalsBanner />

      {/* 4. New Drops (Horizontal Parallax) - "New Arrivals" */}
      <NewDrops products={newArrivals.products} />

      {/* 5. Best Sellers (Collection Section) */}
      <CollectionSection
        title="Best Sellers"
        subtitle="Global Favorites"
        products={bestSellers.products}
        link="/best-sellers"
      />

      {/* [NEW] Design 1: Featured Story (Replaces old FeaturedSection) */}
      <DesignFeaturedStory />

      {/* 7. Accessories (Collection Section) */}
      <CollectionSection
        title="Accessories"
        subtitle="Loadout"
        products={accessories.products}
        link="/accessories"
        dark
      />

      {/* 8. Streetwear (Collection Section) */}
      <CollectionSection
        title="Streetwear"
        subtitle="Urban Ops"
        products={streetwear.products}
        link="/streetwear"
      />

      {/* 9. Summer Collection (Collection Section) */}
      {summer.products.length > 0 && (
        <CollectionSection
          title="Summer Collection"
          subtitle="Heat Wave"
          products={summer.products}
          link="/collections/summer-collection"
          dark
        />
      )}

      {/* 10. Trending Grid (Bento Layout) */}
      <TrendingGrid products={trendingProducts} />

      {/* 11. Limited Edition */}
      {limited.products.length > 0 && (
        <CollectionSection
          title="Limited Edition"
          subtitle="Secure The Bag"
          products={limited.products}
          link="/collections/limited-edition"
        />
      )}

      {/* 12. Collaborations */}
      {collaboration.products.length > 0 && (
        <CollectionSection
          title="Collaborations"
          subtitle="RIIQX x UNIVERSE"
          products={collaboration.products}
          link="/collections/collaboration"
          dark
        />
      )}

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
