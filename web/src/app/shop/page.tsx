import { getProducts } from "@/lib/shopify";
import { CollectionClient } from "@/components/shop/CollectionClient";

export const metadata = {
    title: 'Shop All',
    description: 'Browse the full RIIQX collection.',
};

export default async function ShopPage() {
    const { products } = await getProducts({ limit: 100, sortKey: 'CREATED_AT', reverse: true });

    return <CollectionClient products={products} category="All Products" />;
}
