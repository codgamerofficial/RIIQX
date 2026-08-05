'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCartStore, useCartHydration } from '@/store/useCartStore';
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const isHydrated = useCartHydration();
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0C0B0A]/85 backdrop-blur-2xl border-b border-[#D4AF37]/15 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo & Telemetry */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#D4AF37] to-[#8B7321] flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform duration-200 font-mono font-black text-[#0C0B0A] text-lg border border-[#F3E5AB]/40">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-widest text-white group-hover:text-[#D4AF37] transition-colors duration-200">
                  RIIQX
                </span>
                <span className="font-mono text-[9px] text-[#D4AF37] tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#F3E5AB]" /> GOLDEN LUXURY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
              <Link
                href="/collections/all"
                className="text-riiqxText-secondary hover:text-[#D4AF37] transition-colors py-1"
              >
                COLLECTIONS
              </Link>
              <Link
                href="/collections/hoodies"
                className="text-riiqxText-secondary hover:text-[#D4AF37] transition-colors py-1"
              >
                HOODIES
              </Link>
              <Link
                href="/collections/outerwear"
                className="text-riiqxText-secondary hover:text-[#D4AF37] transition-colors py-1"
              >
                OUTERWEAR
              </Link>
              <Link
                href="/account/orders"
                className="text-riiqxText-secondary hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-1"
              >
                TRACKING <Badge variant="gold" shape="chamfer" className="py-0 px-1 text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">LIVE</Badge>
              </Link>
              <Link
                href="/design-system"
                className="text-riiqxText-muted hover:text-[#F3E5AB] transition-colors py-1 flex items-center gap-1"
              >
                <Sliders className="w-3 h-3 text-[#D4AF37]" /> SPEC
              </Link>
            </nav>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-sm bg-[#141312] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#9E9A93] hover:text-[#F3E5AB] transition-colors cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Indicator */}
            <Link
              href="/account/wishlist"
              className="relative p-2.5 rounded-sm bg-[#141312] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#9E9A93] hover:text-[#D4AF37] transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0C0B0A] font-mono text-[9px] font-extrabold flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Shopping Bag Trigger connected to Zustand */}
            <button
              onClick={openCart}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-sm bg-[#1C1B18] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-glow-gold transition-all duration-200 cursor-pointer font-mono text-xs font-bold uppercase tracking-wider text-white"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">BAG</span>
              <span className="px-1.5 py-0.5 rounded-sm bg-[#D4AF37]/20 text-[#D4AF37] text-[10px]">
                {isHydrated ? totalItems : 0}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-sm bg-[#141312] border border-[#D4AF37]/20 text-[#9E9A93] hover:text-white cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#D4AF37]/15 bg-[#141312]/95 backdrop-blur-2xl px-6 py-6 space-y-4 font-mono text-sm uppercase tracking-wider animate-fade-in-up">
            <Link
              href="/collections/all"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-riiqxText-primary hover:text-[#D4AF37] py-2 border-b border-white/5"
            >
              ALL COLLECTIONS
            </Link>
            <Link
              href="/collections/hoodies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-riiqxText-primary hover:text-[#D4AF37] py-2 border-b border-white/5"
            >
              HOODIES & FLEECE
            </Link>
            <Link
              href="/collections/outerwear"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-riiqxText-primary hover:text-[#D4AF37] py-2 border-b border-white/5"
            >
              OUTERWEAR & SHELLS
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[#D4AF37] py-2 border-b border-white/5"
            >
              LIVE ORDER TRACKING
            </Link>
            <Link
              href="/design-system"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[#F3E5AB] py-2"
            >
              GOLDEN DESIGN SPEC
            </Link>
          </div>
        )}
      </header>

      {/* QUICK SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0C0B0A]/90 backdrop-blur-xl flex items-start justify-center pt-24 px-6">
          <div className="w-full max-w-2xl bg-[#141312]/95 border border-[#D4AF37]/30 rounded-md p-6 shadow-glass-lg relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-riiqxText-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest block mb-2">
              SEARCH RIIQX GOLDEN CATALOG
            </span>
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-riiqxText-muted absolute left-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, SKU (e.g. RIIQX-HD), or product name..."
                className="w-full bg-[#0C0B0A] border border-[#D4AF37]/30 rounded-sm pl-10 pr-4 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-riiqxText-muted">POPULAR:</span>
              {['HEAVYWEIGHT HOODIE', 'BOMBER JACKET', 'CARGO PANTS', 'GOLDEN DROP'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-sm bg-white/5 border border-[#D4AF37]/20 text-riiqxText-secondary hover:text-[#D4AF37]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PERSISTENT ZUSTAND CART DRAWER */}
      <CartDrawer />
    </>
  );
};
