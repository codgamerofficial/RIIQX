'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { MOCK_PRODUCTS, type Product } from '@/lib/mock/homepage';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export const WishlistGrid: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(MOCK_PRODUCTS.slice(0, 3));
  const addItem = useCartStore((state) => state.addItem);

  const handleRemove = (id: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMoveToCart = (product: Product) => {
    const variant = product.variants?.[0];
    if (!variant) return;

    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      color: variant.color,
      size: variant.size,
      price: variant.price_override ?? product.sale_price ?? product.base_price,
      quantity: 1,
      maxStock: variant.stock_quantity || 10,
      image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6',
    });

    handleRemove(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full p-12 rounded-md bg-charcoal-matte/50 backdrop-blur-md border border-glass-border-medium text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent-crimson/15 border border-accent-crimson flex items-center justify-center mx-auto text-accent-crimson">
          <Heart className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <Heading size="xl" font="display" className="text-white">
            YOUR TACTICAL WISHLIST IS EMPTY
          </Heading>
          <Text size="xs" variant="muted" className="max-w-xs mx-auto font-mono">
            Save technical streetwear items to your wishlist for quick reservation during drop releases.
          </Text>
        </div>
        <Link href="/collections/all">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            EXPLORE ALL DROPS
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((product) => (
        <div key={product.id} className="relative group">
          <ProductCard product={product} />

          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="cyan"
              size="sm"
              className="flex-1 font-mono text-xs"
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              onClick={() => handleMoveToCart(product)}
            >
              MOVE TO BAG
            </Button>
            <button
              onClick={() => handleRemove(product.id)}
              className="p-2 rounded-sm bg-charcoal-matte border border-glass-border-subtle hover:border-status-error text-riiqxText-muted hover:text-status-error transition-colors cursor-pointer"
              aria-label="Remove from Wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
