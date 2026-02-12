import { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'https://riiqx.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { products } = await getProducts({ limit: 100 });
    const collections = await getCollections();

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.handle}`,
        lastModified: new Date(product.updatedAt || new Date().toISOString()),
    }));

    const collectionUrls = collections.map((collection) => ({
        url: `${baseUrl}/collections/${collection.handle}`,
        lastModified: new Date(collection.updatedAt || new Date().toISOString()),
    }));

    const staticRoutes = [
        '',
        '/shop',
        '/new-arrivals',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }));

    return [...staticRoutes, ...productUrls, ...collectionUrls];
}
