import { create } from 'zustand';

type RealityMode = 'fashion' | 'electronics' | 'mixed';

interface RealityState {
    mode: RealityMode;
    setMode: (mode: RealityMode) => void;
    toggleMode: () => void;
}

export const useRealityStore = create<RealityState>((set) => ({
    mode: 'mixed', // Default starting state
    setMode: (mode) => set({ mode }),
    toggleMode: () => set((state) => ({
        mode: state.mode === 'fashion' ? 'electronics' : 'fashion'
    })),
}));
