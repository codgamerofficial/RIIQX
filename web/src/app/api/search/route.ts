import { getProducts } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ products: [] });
    }

    try {
        const { products } = await getProducts({
            query,
            limit: 10,
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ products: [], error: "Search failed" }, { status: 500 });
    }
}
