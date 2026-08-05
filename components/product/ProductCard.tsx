'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Heart, Check, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/mock/homepage';

export interface ProductCardProps {
  product: Product;
  aspectRatio?: 'square' | 'portrait';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'portrait',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800';

  const categoryName = product.category?.name || 'HAUTE COUTURE';

  const isPreOrder = product.variants?.some((v) => v.status === 'preorder');
  const isOutOfStock = product.variants?.every((v) => v.status === 'out_of_stock');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#141312] border border-[#D4AF37]/20 rounded-md overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-glow-gold transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative w-full overflow-hidden bg-[#060605]">
        <div
          className={`w-full ${
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          } relative overflow-hidden`}
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
        </div>

        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.sale_price && (
            <Badge variant="gold" shape="chamfer" className="bg-[#D4AF37] text-[#0C0B0A] font-bold">
              GOLD OFFER // ₹{(product.base_price - product.sale_price).toLocaleString('en-IN')} OFF
            </Badge>
          )}

          {isPreOrder && (
            <Badge variant="gold" shape="chamfer" dot className="bg-[#1C1B18] text-[#F3E5AB] border-[#D4AF37]/40">
              DROP 001 // PRE-ORDER
            </Badge>
          )}

          {isOutOfStock && (
            <Badge variant="neutral" shape="chamfer" className="bg-[#24221E] text-riiqxText-muted">
              RE-SUPPLY IN PROGRESS
            </Badge>
          )}
        </div>

        {/* Floating Wishlist Trigger */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`w-9 h-9 rounded-sm flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isWishlisted
                ? 'bg-[#D4AF37] text-[#0C0B0A] shadow-glow-gold'
                : 'bg-[#0C0B0A]/70 text-[#9E9A93] hover:text-[#D4AF37] hover:bg-[#0C0B0A] border border-[#D4AF37]/20'
            }`}
            aria-label="Wishlist item"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick Add CTA Overlay on Hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="gold"
            size="sm"
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B38F28] text-[#0C0B0A] font-bold shadow-glow-gold font-mono text-xs py-2.5"
            onClick={handleQuickAdd}
            leftIcon={
              isAddedToCart ? (
                <Check className="w-3.5 h-3.5 text-[#0C0B0A]" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )
            }
          >
            {isAddedToCart ? 'ADDED TO BAG' : 'QUICK ADD // BAG'}
          </Button>
        </div>
      </Link>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase text-[#D4AF37] tracking-widest block flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#F3E5AB]" /> {categoryName}
          </span>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-sans font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing Matrix */}
        <div className="flex items-baseline justify-between pt-2 border-t border-[#D4AF37]/15 font-mono">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-white">
              ₹{(product.sale_price || product.base_price).toLocaleString('en-IN')}
            </span>

            {product.sale_price && (
              <span className="text-xs text-riiqxText-muted line-through">
                ₹{product.base_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="text-[10px] text-riiqxText-muted uppercase">
            INCL. TAXES
          </span>
        </div>
      </div>
    </div>
  );
};
