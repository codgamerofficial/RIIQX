'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, useCartHydration } from '@/store/useCartStore';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag, Heart, Search, Sparkles, Sliders } from 'lucide-react';

export interface UniversalHeaderProps {
  cartItemCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
}

export const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  cartItemCount: propCartCount,
  wishlistCount = 2,
  onOpenCart,
}) => {
  const router = useRouter();
  const isHydrated = useCartHydration();
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cartCount = propCartCount !== undefined ? propCartCount : isHydrated ? totalItems : 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      openCart();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/all?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-[#0C0B0A] border-b border-[#D4AF37]/15 sticky top-0 z-40 backdrop-blur-2xl">
      {/* 1. Top Offer Ticker (Bewakoof Style High-Converting Banner) */}
      <div className="bg-[#141312] py-1.5 px-4 text-center border-b border-[#D4AF37]/10 flex items-center justify-center gap-2 font-mono text-[11px] text-[#D4AF37] tracking-wider uppercase">
        <Sparkles className="w-3 h-3 text-[#F3E5AB] animate-pulse" />
        <span>⚡ EXTRA 10% OFF ON PREPAID ORDERS // FREE EXPRESS AIR SHIPPING ALL OVER INDIA 🇮🇳</span>
      </div>

      {/* 2. Main Luxury Header Bar (Zara / Nike High-Fashion Typography) */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group">
          <span className="font-display font-black text-2xl tracking-[0.25em] text-white group-hover:text-[#D4AF37] transition-colors duration-200">
            RIIQX
          </span>
          <span className="font-mono text-[8px] text-[#D4AF37] tracking-[0.2em] uppercase -mt-1">
            HAUTE STREETWEAR
          </span>
        </Link>

        {/* Dynamic Category Links (Desktop Web) */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <Link href="/collections/hoodies" className="text-[#F7F7F7] hover:text-[#D4AF37] transition-colors">
            HOODIES
          </Link>
          <Link href="/collections/outerwear" className="text-[#F7F7F7] hover:text-[#D4AF37] transition-colors">
            OUTERWEAR
          </Link>
          <Link href="/collections/cargos" className="text-[#F7F7F7] hover:text-[#D4AF37] transition-colors">
            CARGOS
          </Link>
          <Link href="/account/orders" className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-1">
            LOOKBOOK <Badge variant="gold" shape="chamfer" className="py-0 px-1 text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">DROP 001</Badge>
          </Link>
        </nav>

        {/* Action Controls & Interactive Search */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#9E9A93] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hoodies, tees, cargos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`bg-[#141312] border border-[#D4AF37]/20 rounded-sm pl-9 pr-3 py-1.5 font-sans text-xs text-[#F7F7F7] focus:outline-none focus:border-[#D4AF37] transition-all duration-300 ${
                isSearchFocused ? 'w-48 sm:w-64' : 'w-36 sm:w-48'
              }`}
            />
          </form>

          {/* Wishlist Icon Button */}
          <Link
            href="/account/wishlist"
            className="relative p-2 rounded-sm bg-[#141312] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#9E9A93] hover:text-[#D4AF37] transition-colors"
            aria-label="View Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF003C] text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag Icon Button */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#1C1B18] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-glow-gold transition-all duration-200 cursor-pointer font-mono text-xs font-bold uppercase tracking-wider text-white"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">BAG</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-sm bg-[#D4AF37] text-[#0C0B0A] text-[10px] font-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
