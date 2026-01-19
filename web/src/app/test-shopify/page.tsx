import { getCollections, getProducts, getCollectionProducts } from "@/lib/shopify";

export default async function TestShopifyPage() {
    // Fetch all collections
    const collections = await getCollections();

    // Fetch all products
    const allProducts = await getProducts({ limit: 50 });

    // Try to fetch specific collections
    const newArrivals = await getCollectionProducts({ handle: 'new-arrivals', limit: 10 });
    const featured = await getCollectionProducts({ handle: 'featured', limit: 10 });
    const streetwear = await getCollectionProducts({ handle: 'streetwear', limit: 10 });

    return (
        <div className="p-8 bg-black text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Shopify Data Test</h1>

            {/* Collections */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Collections ({collections.length})</h2>
                <div className="space-y-2">
                    {collections.map(col => (
                        <div key={col.id} className="p-4 bg-gray-900 rounded">
                            <p><strong>Title:</strong> {col.title}</p>
                            <p><strong>Handle:</strong> {col.handle}</p>
                            <p><strong>Description:</strong> {col.description || 'N/A'}</p>
                            <p><strong>Has Image:</strong> {col.image ? 'Yes' : 'No'}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* All Products */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-green-400">All Products ({allProducts.products.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allProducts.products.map(product => (
                        <div key={product.id} className="p-4 bg-gray-900 rounded">
                            {product.featuredImage && (
                                <img src={product.featuredImage.url} alt={product.title} className="w-full h-48 object-cover mb-2" />
                            )}
                            <p><strong>{product.title}</strong></p>
                            <p className="text-sm text-gray-400">{product.handle}</p>
                            <p className="text-sm">Type: {product.productType || 'N/A'}</p>
                            <p className="text-sm">Price: {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* New Arrivals Collection */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">New Arrivals Collection ({newArrivals.products.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newArrivals.products.map(product => (
                        <div key={product.id} className="p-4 bg-gray-900 rounded">
                            {product.featuredImage && (
                                <img src={product.featuredImage.url} alt={product.title} className="w-full h-48 object-cover mb-2" />
                            )}
                            <p><strong>{product.title}</strong></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Collection */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">Featured Collection ({featured.products.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.products.map(product => (
                        <div key={product.id} className="p-4 bg-gray-900 rounded">
                            {product.featuredImage && (
                                <img src={product.featuredImage.url} alt={product.title} className="w-full h-48 object-cover mb-2" />
                            )}
                            <p><strong>{product.title}</strong></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Streetwear Collection */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Streetwear Collection ({streetwear.products.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {streetwear.products.map(product => (
                        <div key={product.id} className="p-4 bg-gray-900 rounded">
                            {product.featuredImage && (
                                <img src={product.featuredImage.url} alt={product.title} className="w-full h-48 object-cover mb-2" />
                            )}
                            <p><strong>{product.title}</strong></p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
