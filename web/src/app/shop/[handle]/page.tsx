import { getProduct, getProducts } from "@/lib/shopify";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
    try {
        const { products } = await getProducts({ limit: 50 });
        return products.map((product) => ({
            handle: product.handle,
        }));
    } catch (error) {
        // If Shopify env vars are missing during build, return empty array
        // Pages will be generated on-demand instead
        console.warn('Failed to generate static params:', error);
        return [];
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}
