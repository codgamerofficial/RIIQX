'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ShoppingBag, Zap, CheckCircle2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { ProductVariant } from '@/components/product/VariantSelector';

export interface AddToCartSectionProps {
  productName: string;
  variant: ProductVariant | null;
  price: number;
  slug?: string;
  image?: string;
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  productName,
  variant,
  price,
  slug = 'heavyweight-tactical-hoodie',
  image = 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = !variant || variant.status === 'out_of_stock' || variant.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !variant) return;

    addItem({
      variantId: variant.id,
      productId: variant.product_id,
      name: productName,
      slug,
      color: variant.color,
      size: variant.size,
      price,
      quantity,
      maxStock: variant.stock_quantity || 10,
      image,
      qikinkVariantId: variant.qikink_variant_id || undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity & Add to Cart Row */}
      <div className="flex items-center gap-4">
        {/* Quantity Counter */}
        <div className="flex items-center rounded-sm bg-charcoal-matte border border-glass-border-medium p-1">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="w-9 h-9 rounded-sm flex items-center justify-center text-riiqxText-muted hover:text-white hover:bg-white/5 disabled:opacity-40 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono font-bold text-sm text-white">
            {quantity}
          </span>
          <button
            type="button"
            disabled={isOutOfStock || (variant && quantity >= variant.stock_quantity)}
            onClick={() => setQuantity((prev) => prev + 1)}
            className="w-9 h-9 rounded-sm flex items-center justify-center text-riiqxText-muted hover:text-white hover:bg-white/5 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Magnetic Add to Cart CTA */}
        <div className="flex-1">
          <MagneticButton className="w-full" onClick={handleAddToCart}>
            <Button
              variant={isAdded ? 'cyan' : 'primary'}
              size="lg"
              disabled={isOutOfStock}
              className="w-full py-3.5 shadow-glow-crimson font-mono text-sm"
              leftIcon={
                isAdded ? (
                  <CheckCircle2 className="w-4 h-4 text-obsidian-base" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )
              }
            >
              {isOutOfStock
                ? 'OUT OF STOCK'
                : isAdded
                ? 'ADDED TO BAG'
                : `ADD TO BAG // ₹${(price * quantity).toLocaleString('en-IN')}`}
            </Button>
          </MagneticButton>
        </div>
      </div>

      {/* Buy It Now Express Checkout */}
      {!isOutOfStock && (
        <Button
          variant="outline"
          size="lg"
          className="w-full py-3.5 font-mono text-xs border-accent-cyan/50 hover:border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10"
          leftIcon={<Zap className="w-4 h-4" />}
          onClick={handleBuyNow}
        >
          BUY IT NOW // EXPRESS CHECKOUT
        </Button>
      )}
    </div>
  );
};
