'use server';

import { getProducts } from "@/lib/shopify";

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return { products: [] };

    try {
        const { products } = await getProducts({ query, limit: 6 });
        return { products };
    } catch (error) {
        console.error("Search error:", error);
        return { products: [] };
    }
}
