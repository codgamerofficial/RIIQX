import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/lib/shopify/types';

interface WishlistStore {
    items: Product[];
    addItem: (item: Product) => void;
    removeItem: (itemId: string) => void;
    isInWishlist: (itemId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                if (!items.find((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
            },
            isInWishlist: (itemId) => {
                return !!get().items.find((item) => item.id === itemId);
            },
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'riiqx-mobile-wishlist',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
