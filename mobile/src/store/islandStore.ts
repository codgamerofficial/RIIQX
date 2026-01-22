
import { create } from 'zustand';

export type IslandState = 'idle' | 'compact' | 'expanded' | 'split' | 'peek';

export interface Activity {
    id: string;
    type: 'music' | 'timer' | 'navigation' | 'call' | 'upload' | 'payment' | 'drop' | 'cart' | 'checkout' | 'order' | 'delivery';
    title: string;
    subtitle?: string;
    icon?: string; // URL or icon name
    progress?: number; // 0-100
    priority?: number;
    meta?: any; // Extra data like duration, waveforms, etc.
}

interface IslandStore {
    islandState: IslandState;
    activeActivity: Activity | null;
    secondaryActivity: Activity | null; // For split mode

    setIslandState: (state: IslandState) => void;
    startActivity: (activity: Activity) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    endActivity: (id: string) => void;
    expand: () => void;
    collapse: () => void;
}

export const useIslandStore = create<IslandStore>((set, get) => ({
    islandState: 'idle',
    activeActivity: null,
    secondaryActivity: null,

    setIslandState: (state) => set({ islandState: state }),

    startActivity: (activity) => {
        // If something is already running, move it to secondary or just replace for now (simple logic)
        // For Split Mode: If activeActivity exists, move active to secondary? 
        // Implementing simpler logic first: Priority to new activity

        set({
            activeActivity: activity,
            islandState: 'compact' // auto show
        });
    },

    updateActivity: (id, updates) => {
        const { activeActivity } = get();
        if (activeActivity && activeActivity.id === id) {
            set({ activeActivity: { ...activeActivity, ...updates } });
        }
    },

    endActivity: (id) => {
        const { activeActivity } = get();
        if (activeActivity && activeActivity.id === id) {
            set({ activeActivity: null, islandState: 'idle' });
        }
    },

    expand: () => {
        if (get().activeActivity) {
            set({ islandState: 'expanded' });
        }
    },

    collapse: () => {
        if (get().activeActivity) {
            set({ islandState: 'compact' });
        }
    }
}));
