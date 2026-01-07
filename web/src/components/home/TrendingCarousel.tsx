import { getProducts } from "@/lib/shopify";
import { TrendingCarouselClient } from "./TrendingCarouselClient";

export async function TrendingCarousel() {
    // Fetch best selling products (or default sort)
    const { products } = await getProducts({
        sortKey: 'BEST_SELLING',
        limit: 4
    });

    return <TrendingCarouselClient products={products} />;
}
