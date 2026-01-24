import { getProduct } from "@/lib/shopify";
import { getProducts } from "@/lib/shopify";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.handle);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The product you are looking for does not exist."
        };
    }

    const { url, altText } = product.featuredImage || product.images?.edges?.[0]?.node || {};

    return {
        title: product.title,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.substring(0, 160),
            images: [
                {
                    url: url,
                    width: 800,
                    height: 600,
                    alt: altText || product.title,
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description.substring(0, 160),
            images: [url],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const resolvedParams = await params;
    const { handle } = resolvedParams;
    const product = await getProduct(handle);

    if (!product) {
        return notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.featuredImage?.url,
        offers: {
            '@type': 'Offer',
            price: product.priceRange.minVariantPrice.amount,
            priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
    };

    const { products: relatedProducts } = await getProducts({ limit: 4 });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </>
    );
}
