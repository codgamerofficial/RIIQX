import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache for 60 seconds

export default async function ProductDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const supabase = await createClient();

    // Fetch Product
    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single() as any;

    if (error || !product) {
        notFound();
    }

    // Fetch Variants
    const { data: variants } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", id);

    // Extract unique colors/sizes
    // Extract unique colors/sizes
    const colors = Array.from(new Set((variants as any[])?.map((v: any) => v.color).filter(Boolean)));
    const sizes = Array.from(new Set((variants as any[])?.map((v: any) => v.size).filter(Boolean)));

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breacrumbs / Back */}
                <div className="mb-8">
                    <Link href="/shop" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Shop</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Gallery */}
                    <ProductGallery images={product.images || []} title={product.title} />

                    {/* Info */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-secondary font-medium tracking-wider text-sm mb-2 uppercase">
                                {product.category || "Apparel"}
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                                {product.title}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-white">
                                    ${product.selling_price.toFixed(2)}
                                </span>
                                {product.base_price > product.selling_price && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        ${product.base_price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-400 leading-relaxed text-lg">
                            {product.description || "No description available for this premium item."}
                        </p>

                        <div className="h-px bg-white/10" />

                        {/* Variants Selectors (Placeholder for functionality) */}
                        <div className="space-y-6">
                            {colors.length > 0 && (
                                <div>
                                    <span className="block text-sm font-medium text-white mb-3">Select Color</span>
                                    <div className="flex space-x-3">
                                        {colors.map((color: any) => (
                                            <button
                                                key={color}
                                                className="px-4 py-2 rounded-lg border border-white/20 bg-black/50 text-white hover:border-primary transition-colors text-sm"
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizes.length > 0 && (
                                <div>
                                    <span className="block text-sm font-medium text-white mb-3">Select Size</span>
                                    <div className="flex space-x-3">
                                        {sizes.map((size: any) => (
                                            <button
                                                key={size}
                                                className="w-12 h-12 flex items-center justify-center rounded-lg border border-white/20 bg-black/50 text-white hover:border-primary transition-colors text-sm font-medium"
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <AddToCartButton product={product} />

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <Truck className="w-4 h-4 text-primary" />
                                <span>Free Shipping over $100</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span>Premium Construction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
