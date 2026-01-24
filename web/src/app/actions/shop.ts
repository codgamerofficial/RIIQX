'use server';

import { getCollectionProducts } from "@/lib/shopify";

export async function fetchMoreCollectionProducts({
    handle,
    after
}: {
    handle: string;
    after: string;
}) {
    const { products, pageInfo } = await getCollectionProducts({
        handle,
        after,
        limit: 24, // Consistent batch size
    });

    return { products, pageInfo };
}
