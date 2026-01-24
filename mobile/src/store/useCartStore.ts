import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/lib/shopify/types';

export interface CartItem {
    id: string; // The merchandise ID (Variant ID)
    variantId: string;
    productId: string;
    title: string;
    price: string;
    image?: string;
    quantity: number;
    color?: string;
    size?: string;
    currencyCode: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string, color?: string, size?: string) => void;
    updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setOpen: (open: boolean) => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (newItem) => {


                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) =>
                            item.variantId === newItem.variantId &&
                            item.color === newItem.color &&
                            item.size === newItem.size
                    );

                    if (existingItemIndex > -1) {
                        const updatedItems = [...state.items];
                        updatedItems[existingItemIndex].quantity += newItem.quantity;
                        return { items: updatedItems, isOpen: true };
                    }

                    return { items: [...state.items, newItem], isOpen: true };
                });
            },
            removeItem: (id, color, size) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.variantId === id && item.color === color && item.size === size)
                    ),
                }));
            },
            updateQuantity: (id, quantity, color, size) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                (item) => !(item.variantId === id && item.color === color && item.size === size)
                            ),
                        };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.variantId === id && item.color === color && item.size === size
                                ? { ...item, quantity }
                                : item
                        ),
                    };
                });
            },
            clearCart: () => set({ items: [] }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            setOpen: (open) => set({ isOpen: open }),
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
            },
            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'riiqx-mobile-cart',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
