import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/shopify/types';

interface WishlistItem {
    id: string; // Product ID
    handle: string;
    title: string;
    image: string;
    price: string;
    currencyCode: string;
    variantId?: string;
}

interface WishlistState {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const { items } = get();
                if (!items.find((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },
            isInWishlist: (id) => {
                return !!get().items.find((i) => i.id === id);
            },
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'riiqx-wishlist', // unique name
        }
    )
);
