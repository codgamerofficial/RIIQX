import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
    addItem: (item: CartItem) => void;
    removeItem: (id: string, variantId?: string) => void;
    updateQuantity: (id: string, variantId: string | undefined, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setCartOpen: (open: boolean) => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

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

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            setCartOpen: (open) => set({ isOpen: open }),

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'riiqx-cart-storage',
            storage: createJSONStorage(() => localStorage),
            // We don't persist isOpen state usually
            partialize: (state) => ({ items: state.items }),
        }
    )
);
