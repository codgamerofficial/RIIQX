'use server';

import { getPredictiveSearchResults, getProducts } from "@/lib/shopify";

export async function searchProducts(query: string) {
    const { products } = await getProducts({ query, limit: 10 });
    return { products };
}

export async function predictiveSearchAction(query: string) {
    try {
        const results = await getPredictiveSearchResults(query);
        return results;
    } catch (error) {
        console.error("Predictive search failed:", error);
        return { products: [], collections: [], queries: [] };
    }
}
