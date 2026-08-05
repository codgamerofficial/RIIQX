'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  maxStock: number;
  image: string;
  qikinkVariantId?: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  shippingCost: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Calculations
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      shippingCost: 0,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === newItem.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQty = Math.min(
              currentItem.quantity + newItem.quantity,
              newItem.maxStock || 99
            );
            updatedItems[existingIndex] = { ...currentItem, quantity: newQty };
            return { items: updatedItems, isOpen: true };
          }

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: async (code) => {
        const uppercaseCode = code.toUpperCase().trim();
        // Server verification simulation or active coupon validation
        if (uppercaseCode === 'CYBER10' || uppercaseCode === 'RIIQX10') {
          set({
            appliedCoupon: {
              code: uppercaseCode,
              discountType: 'percentage',
              discountValue: 10,
            },
          });
          return true;
        } else if (uppercaseCode === 'FLAT1000' || uppercaseCode === 'RIIQX1000') {
          set({
            appliedCoupon: {
              code: uppercaseCode,
              discountType: 'flat',
              discountValue: 1000,
            },
          });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon || subtotal <= 0) return 0;

        if (coupon.discountType === 'percentage') {
          return Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          return Math.min(subtotal, coupon.discountValue);
        }
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().shippingCost;
        return Math.max(0, subtotal - discount + shipping);
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'riiqx_cart_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);

// SSR Hydration Safety Hook
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
