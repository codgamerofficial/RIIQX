import { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify';

const baseUrl = 'https://riiqx.com'; // Replace with actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { products } = await getProducts({});
    const collections = await getCollections();

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.handle}`,
        lastModified: new Date(product.updatedAt),
    }));

    const collectionUrls = collections.map((collection) => ({
        url: `${baseUrl}/collections/${collection.handle}`,
        lastModified: new Date(collection.updatedAt),
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
