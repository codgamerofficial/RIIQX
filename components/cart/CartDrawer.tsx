'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useCartHydration } from '@/store/useCartStore';
import { FreeShippingBar } from '@/components/cart/FreeShippingBar';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import { ShoppingBag, X, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const isHydrated = useCartHydration();

  const {
    items,
    isOpen,
    appliedCoupon,
    shippingCost,
    closeCart,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getGrandTotal,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isHydrated) return null;

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    closeCart();
    window.location.href = '/checkout';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop Blur Underlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-obsidian-base/80 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md ml-auto h-full bg-charcoal-elevated/95 backdrop-blur-2xl border-l border-glass-border-medium shadow-glass-lg flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-glass-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent-crimson" />
                <div>
                  <h3 className="font-display font-extrabold text-base text-white tracking-wider">
                    YOUR TACTICAL BAG
                  </h3>
                  <span className="font-mono text-[10px] text-accent-cyan tracking-widest uppercase block">
                    {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'} RESERVED
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCart}
                className="p-2 rounded-sm bg-white/5 border border-glass-border-subtle hover:border-accent-crimson text-riiqxText-muted hover:text-accent-crimson transition-colors cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="px-5 pt-4">
                <FreeShippingBar subtotal={subtotal} />
              </div>
            )}

            {/* Cart Items Scroll Container or Empty State */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-charcoal-matte border border-glass-border-medium flex items-center justify-center text-riiqxText-muted">
                    <ShoppingBag className="w-8 h-8 text-accent-cyan" />
                  </div>
                  <div className="space-y-1">
                    <Heading size="lg" font="display" className="text-white">
                      YOUR TACTICAL BAG IS EMPTY
                    </Heading>
                    <Text size="xs" variant="muted" className="max-w-xs mx-auto">
                      Explore our Batch 004 drop releases and add technical streetwear to your reservation.
                    </Text>
                  </div>
                  <Link href="/collections/all" onClick={closeCart}>
                    <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      EXPLORE ALL DROPS
                    </Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemRow
                    key={item.variantId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {/* Summary & Checkout Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-glass-border-subtle bg-charcoal-matte/90">
                <CartSummary
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  shippingCost={shippingCost}
                  grandTotal={grandTotal}
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={applyCoupon}
                  onRemoveCoupon={removeCoupon}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
