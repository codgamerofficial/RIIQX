import { getProduct, formatPrice } from "@/lib/shopify";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ShopifyAddToCartButton } from "@/components/shop/ShopifyAddToCartButton";
import { ModelViewer } from "@/components/product/ModelViewer";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

    // Reshape images for gallery
    const images = product.images.edges.map(edge => edge.node.url);
    if (!images.length && product.featuredImage) {
        images.push(product.featuredImage.url);
    }

    // Extract options
    const options = product.options.filter(o => o.name !== 'Title'); // 'Title' is default for single variant

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs / Back */}
                <div className="mb-8">
                    <Link href="/shop" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Shop</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Gallery or Model */}
                    <div className="relative">
                        {product.media?.edges.find(e => e.node.mediaContentType === 'MODEL_3D') ? (
                            <div className="space-y-4">
                                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg">
                                    <ModelViewer
                                        src={(product.media.edges.find(e => e.node.mediaContentType === 'MODEL_3D')?.node as any).sources[0]?.url || ''}
                                        poster={product.featuredImage?.url}
                                        alt={product.title}
                                    />
                                </div>
                                {/* Thumbnails to switch back to images (Optional simplified version) */}
                                <div className="grid grid-cols-4 gap-2">
                                    {images.slice(0, 4).map((img, i) => (
                                        <div key={i} className="aspect-square rounded-lg bg-white/5 overflow-hidden border border-white/5">
                                            <img src={img} alt="" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <ProductGallery images={images} title={product.title} />
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-secondary font-medium tracking-wider text-sm mb-2 uppercase">
                                {/* Tag or Type if available, else just 'Shopify' or empty */}
                                Premium Collection
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                                {product.title}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-white">
                                    {formatPrice(price.amount, price.currencyCode)}
                                </span>
                                {compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div
                            className="text-gray-400 leading-relaxed text-lg prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                        />

                        <div className="h-px bg-white/10" />

                        {/* Variants Selectors (Visual only for now, logic in button defaults to first) */}
                        <div className="space-y-6">
                            {options.map((option) => (
                                <div key={option.id}>
                                    <span className="block text-sm font-medium text-white mb-3">{option.name}</span>
                                    <div className="flex flex-wrap gap-3">
                                        {option.values.map((value) => (
                                            <button
                                                key={value}
                                                className="px-4 py-2 rounded-lg border border-white/20 bg-black/50 text-white hover:border-primary transition-colors text-sm"
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <ShopifyAddToCartButton product={product} />

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <Truck className="w-4 h-4 text-primary" />
                                <span className="text-xs sm:text-sm">Fast Global Shipping</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-xs sm:text-sm">Authenticity Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
