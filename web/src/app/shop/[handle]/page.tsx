import { getProduct, formatPrice } from "@/lib/shopify";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ShopifyAddToCartButton } from "@/components/shop/ShopifyAddToCartButton";

import { SizeGuide } from "@/components/product/SizeGuide";
import { ArrowLeft, Truck, ShieldCheck, ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WishlistButton } from "@/components/shop/WishlistButton";

export const revalidate = 60; // Cache for 1 minute

export default async function ProductDetailsPage({
    params
}: {
    params: Promise<{ handle: string }>
}) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        notFound();
    }

    const price = product.priceRange.minVariantPrice;
    const compareAtPrice = product.variants.edges[0]?.node.compareAtPrice;

    // Reshape images for gallery - simple string array
    const images = product.images.edges.map(edge => edge.node.url);
    if (!images.length && product.featuredImage) {
        images.push(product.featuredImage.url);
    }

    // Extract options
    const options = product.options.filter(o => o.name !== 'Title');

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/shop" className="inline-flex items-center space-x-2 text-white/50 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Shop</span>
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    {/* Left Column: Gallery (Takes up more space, Sticky enabled container) */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* We can use the existing ProductGallery or just render images here in a stack/grid for that "Big Image" feel */}
                        {/* Let's try a bold stack for the new design */}
                        <div className="flex flex-col gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden rounded-xl border border-white/5">
                                    <img
                                        src={img}
                                        alt={`${product.title} - View ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {idx === 0 && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary text-black font-black uppercase px-3 py-1 text-xs tracking-widest">
                                                New Drop
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info (Sticky) */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0" /> {/* Spacer column? no, just 7+5=12. Let's make it 5 col for info */}

                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32 space-y-8">
                            {/* Header */}
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-4">
                                    {product.title}
                                </h1>
                                <div className="flex items-end gap-4 border-b border-white/10 pb-6">
                                    <span className="text-3xl font-bold text-primary">
                                        {formatPrice(price.amount, price.currencyCode)}
                                    </span>
                                    {compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
                                        <span className="text-xl text-white/30 line-through mb-1">
                                            {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Options */}
                            {options.length > 0 && (
                                <div className="space-y-6">
                                    {options.map((option) => (
                                        <div key={option.id}>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-bold uppercase tracking-widest text-white/70">{option.name}</span>
                                                {option.name === 'Size' && <SizeGuide />}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {option.values.map((value) => (
                                                    <button
                                                        key={value}
                                                        className="min-w-[3rem] px-4 py-3 rounded-md border border-white/20 bg-white/5 text-white hover:border-primary hover:bg-primary/10 hover:text-primary transition-all font-bold text-sm uppercase"
                                                    >
                                                        {value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <ShopifyAddToCartButton product={product} />
                                </div>
                                <WishlistButton product={product} />
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/10">
                                <div className="flex items-center space-x-3 text-white/60">
                                    <Truck className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Free Shipping</span>
                                </div>
                                <div className="flex items-center space-x-3 text-white/60">
                                    <RefreshCw className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-wide">30 Day Returns</span>
                                </div>
                                <div className="flex items-center space-x-3 text-white/60">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Secure Checkout</span>
                                </div>
                            </div>

                            {/* Accordion-ish Details */}
                            <div className="space-y-4">
                                <details className="group border-b border-white/10 pb-4 cursor-pointer">
                                    <summary className="flex justify-between items-center font-bold text-lg uppercase tracking-wider list-none text-white/90 hover:text-primary transition-colors">
                                        <span>Description</span>
                                        <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div
                                        className="mt-4 text-white/60 leading-relaxed font-sans"
                                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                    />
                                </details>

                                <details className="group border-b border-white/10 pb-4 cursor-pointer">
                                    <summary className="flex justify-between items-center font-bold text-lg uppercase tracking-wider list-none text-white/90 hover:text-primary transition-colors">
                                        <span>Materials & Care</span>
                                        <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="mt-4 text-white/60 leading-relaxed font-sans">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Premium Heavyweight Cotton</li>
                                            <li>Double-stitched seams</li>
                                            <li>Machine wash cold, air dry</li>
                                            <li>Do not iron print</li>
                                        </ul>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
