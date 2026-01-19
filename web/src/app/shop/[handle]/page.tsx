import { getProduct, getProducts } from "@/lib/shopify";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
    const { products } = await getProducts({ limit: 50 });
    return products.map((product) => ({
        handle: product.handle,
    }));
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
