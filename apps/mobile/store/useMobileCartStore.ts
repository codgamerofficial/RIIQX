import { create } from 'zustand';

export interface MobileCartItem {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
}

interface MobileCartState {
  items: MobileCartItem[];
  addItem: (item: Omit<MobileCartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useMobileCartStore = create<MobileCartState>((set, get) => ({
  items: [
    {
      variantId: 'var-001',
      productId: 'prod-001',
      name: 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
      slug: 'heavyweight-tactical-hoodie',
      color: 'OBSIDIAN BLACK',
      size: 'L',
      price: 12999,
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
      quantity: 1,
    },
  ],

  addItem: (newItem, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.variantId === newItem.variantId);
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += quantity;
        return { items: updated };
      }
      return { items: [...state.items, { ...newItem, quantity }] };
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
      items: state.items.map((i) =>
        i.variantId === variantId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));
