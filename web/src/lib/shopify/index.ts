import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, CART_CREATE_MUTATION } from './queries';
import { Product, Connection, CartLineInput, Cart, Collection } from './types';

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
        throw new Error('Missing Shopify environment variables: SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
        cache: cache as any,
        ...(revalidate && { next: { revalidate } }),
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
    // Force en-IN for INR, otherwise use default
    const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0, // Common for INR to hide decimals if 0
        maximumFractionDigits: 2,
    }).format(parseFloat(amount));
};

/**
 * Fetch all collections.
 */
export async function getCollections(): Promise<Collection[]> {
    const res = await shopifyFetch<{ collections: Connection<Collection> }>({
        query: require('./queries').COLLECTIONS_QUERY,
        revalidate: 3600,
    });

    return removeEdgesAndNodes(res.collections);
}

/**
 * Fetch products for a specific collection.
 */
export async function getCollectionProducts({
    handle,
    sortKey,
    reverse,
    limit = 24,
    filters
}: {
    handle: string;
    sortKey?: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING';
    reverse?: boolean;
    limit?: number;
    filters?: any[];
}): Promise<{ products: Product[]; pageInfo: Connection<Product>['pageInfo'] }> {
    const res = await shopifyFetch<{ collection: { products: Connection<Product> } }>({
        query: require('./queries').COLLECTION_PRODUCTS_QUERY,
        variables: { handle, first: limit, sortKey, reverse, filters },
        revalidate: 60,
    });

    if (!res.collection) {
        return { products: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
    }

    return {
        products: removeEdgesAndNodes(res.collection.products),
        pageInfo: res.collection.products.pageInfo,
    };
}
