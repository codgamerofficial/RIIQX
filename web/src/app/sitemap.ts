import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify';
import { Product } from '@/lib/shopify/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://riiqx.com'; // Replace with actual domain

    // Static Routes
    const routes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/lookbook',
        '/collections/new-arrivals',
        '/collections/streetwear',
        '/auth',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Product Routes
    // Note: Fetching all products might be heavy for a large store, 
    // usually you'd paginate or use a separate sitemap index.
    let products: Product[] = [];
    try {
        const productsData = await getProducts({ limit: 100 }); // Fetch first 100 for now
        products = productsData.products;
    } catch (e) {
        console.error("Failed to generate product sitemap", e);
    }

    const productRoutes = products.map((product: Product) => ({
        url: `${baseUrl}/product/${product.handle}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...productRoutes];
}
