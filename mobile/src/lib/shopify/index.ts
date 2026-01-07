import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, CART_CREATE_MUTATION } from './queries';
import { Product, Connection, Cart, CartLineInput } from './types';

import { ShopifyFetchCache } from './types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ShopifyFetchParams = {
    query: string;
    variables?: Record<string, unknown>;
    cache?: ShopifyFetchCache;
    revalidate?: number;
};

type ShopifyResponse<T> = {
    data: T;
    errors?: unknown[];
};

/**
 * Core function to fetch data from Shopify's Storefront API.
 * Designed to be reusable across Web and Mobile.
 */
export async function shopifyFetch<T>({
    query,
    variables,
    cache = 'force-cache',
    revalidate,
}: ShopifyFetchParams): Promise<T> {
    if (!domain || !storefrontAccessToken) {
        console.error('Missing Shopify ENV vars:', { domain, storefrontAccessToken });
        // In dev, we might want to warn. In prod, this will fail.
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
        },
        body: JSON.stringify({ query, variables }),
        cache: cache as any, // Cast to any for React Native compatibility
        // revalidate is ignored in RN but kept for compatibility
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Shopify API Error (${response.status}): ${text}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid content-type from Shopify: ${contentType}. Body: ${text}`);
    }

    const body = (await response.json()) as ShopifyResponse<T>;

    if (body.errors) {
        throw new Error(`Shopify API Error: ${JSON.stringify(body.errors)}`);
    }

    return body.data;
}

/**
 * Formatting helper to flatten GraphQL "edges" and "nodes".
 */
export function removeEdgesAndNodes<T>(connection: Connection<T>): T[] {
    return connection.edges.map((edge) => edge.node);
}

/**
 * Fetch all products with optional sorting, querying, and pagination.
 */
export async function getProducts({
    sortKey,
    reverse,
    query,
    limit = 24, // Matches grid layout (2, 3, 4 divisible)
    after,
}: {
    sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';
    reverse?: boolean;
    query?: string;
    limit?: number;
    after?: string;
} = {}): Promise<{ products: Product[]; pageInfo: Connection<Product>['pageInfo'] }> {
    const res = await shopifyFetch<{ products: Connection<Product> }>({
        query: PRODUCTS_QUERY,
        variables: { sortKey, reverse, query, first: limit, after },
        revalidate: 60,
    });

    return {
        products: removeEdgesAndNodes(res.products),
        pageInfo: res.products.pageInfo,
    };
}

/**
 * Fetch a single product by its handle.
 */
export async function getProduct(handle: string): Promise<Product | undefined> {
    const res = await shopifyFetch<{ product: Product }>({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
        revalidate: 60,
    });

    return res.product;
}

/**
 * Create a cart and return the checkout URL.
 */
export async function createCart(lines: CartLineInput[]): Promise<Cart> {
    const res = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
        query: CART_CREATE_MUTATION,
        variables: { lines },
        cache: 'no-store', // Carts should not be cached
    });

    return res.cartCreate.cart;
}

// Utility to re-shape price for display
export const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(parseFloat(amount));
};
