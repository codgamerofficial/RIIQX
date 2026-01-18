import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
    session: Session | null;
    user: User | null;
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    setSession: (session) => set({ session, user: session?.user ?? null }),
    setUser: (user) => set({ user }),
    checkSession: async () => {
        // We will implement the actual check in the Supabase Init or Layout
    }
}));
