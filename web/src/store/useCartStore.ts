import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PromoCode, calculateDiscount } from '@/lib/promo';

export interface CartItem {
    id: string; // product_id
    variantId?: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    color?: string;
    size?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    discount: PromoCode | null;
    addItem: (item: CartItem) => void;
    addItems: (items: CartItem[]) => void;
    removeItem: (id: string, variantId?: string) => void;
    updateQuantity: (id: string, variantId: string | undefined, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setCartOpen: (open: boolean) => void;
    getCartTotal: () => number;
    getDiscountAmount: () => number; // New selector
    getFinalTotal: () => number;     // New selector
    getItemCount: () => number;
    applyDiscount: (discount: PromoCode) => void;
    removeDiscount: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            discount: null,

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find(
                    (item) => item.id === newItem.id && item.variantId === newItem.variantId
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === newItem.id && item.variantId === newItem.variantId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true,
                    });
                } else {
                    set({ items: [...items, newItem], isOpen: true });
                }
            },

            addItems: (newItems) => {
                const { items } = get();
                const currentItems = [...items];

                newItems.forEach(newItem => {
                    const existingItemIndex = currentItems.findIndex(
                        (item) => item.id === newItem.id && item.variantId === newItem.variantId
                    );

                    if (existingItemIndex > -1) {
                        currentItems[existingItemIndex] = {
                            ...currentItems[existingItemIndex],
                            quantity: currentItems[existingItemIndex].quantity + newItem.quantity
                        };
                    } else {
                        currentItems.push(newItem);
                    }
                });

                set({ items: currentItems, isOpen: true });
            },

            removeItem: (id, variantId) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === id && item.variantId === variantId)
                    ),
                });
            },

            updateQuantity: (id, variantId, quantity) => {
                const { items } = get();
                if (quantity <= 0) {
                    get().removeItem(id, variantId);
                } else {
                    set({
                        items: items.map((item) =>
                            item.id === id && item.variantId === variantId
                                ? { ...item, quantity }
                                : item
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [], discount: null }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            setCartOpen: (open) => set({ isOpen: open }),

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getDiscountAmount: () => {
                const { discount, getCartTotal } = get();
                if (!discount) return 0;
                return calculateDiscount(getCartTotal(), discount);
            },

            getFinalTotal: () => {
                const total = get().getCartTotal();
                const discountAmount = get().getDiscountAmount();
                return Math.max(0, total - discountAmount);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },

            applyDiscount: (discount) => set({ discount }),

            removeDiscount: () => set({ discount: null }),
        }),
        {
            name: 'riiqx-cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items, discount: state.discount }), // Persist discount too
        }
    )
);
