"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, ShoppingBag } from "lucide-react";
import { useIslandStore } from "@/store/islandStore"; // Need to ensure we share or recreate this store for web

// Leveraging the same logic store if possible, or creating a web version if it relies on RN specific imports.
// For now, I'll assume we need to replicate the store logic for web or ensure the existing one is platform agnostic.
// Since the existing store was in 'mobile/src/store', I'll assume I need to create/copy it for web or use a shared one.
// Let's create a local web version of the component assuming the store is ported.

// REPLICATING STORE FOR WEB CONTEXT (Quick Fix for isolation)
import { create } from 'zustand';

export type IslandState = 'idle' | 'compact' | 'expanded';

export interface Activity {
    id: string;
    type: 'music' | 'cart' | 'checkout';
    title: string;
    subtitle?: string;
}

interface IslandStore {
    islandState: IslandState;
    activeActivity: Activity | null;
    startActivity: (activity: Activity) => void;
    endActivity: (id: string) => void;
    expand: () => void;
    collapse: () => void;
}

// Global hook for Web
export const useWebIslandStore = create<IslandStore>((set, get) => ({
    islandState: 'idle',
    activeActivity: null,
    startActivity: (activity) => set({ activeActivity: activity, islandState: 'compact' }),
    endActivity: (id) => set({ activeActivity: null, islandState: 'idle' }),
    expand: () => set({ islandState: 'expanded' }),
    collapse: () => set({ islandState: 'compact' }),
}));


export function DynamicIsland() {
    const { islandState, activeActivity, expand, collapse, endActivity } = useWebIslandStore();

    if (!activeActivity) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
            <motion.div
                layout
                initial={{ width: 120, height: 36, borderRadius: 20, opacity: 0, y: -50 }}
                animate={{
                    width: islandState === 'expanded' ? 360 : 180,
                    height: islandState === 'expanded' ? 120 : 40,
                    borderRadius: islandState === 'expanded' ? 24 : 20,
                    opacity: 1,
                    y: 0
                }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-black/90 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl shadow-black/50"
                onClick={islandState === 'compact' ? expand : collapse}
            >
                <AnimatePresence mode="wait">
                    {islandState === 'compact' || !activeActivity ? (
                        <motion.div
                            key="compact"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex items-center justify-center px-4"
                        >
                            {activeActivity ? (
                                <>
                                    {activeActivity.type === 'music' && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
                                                <span className="text-xs font-bold text-white max-w-[100px] truncate">{activeActivity.title}</span>
                                            </div>
                                            <div className="w-4 h-4 bg-white/20 rounded-full" />
                                        </>
                                    )}
                                    {activeActivity.type === 'cart' && (
                                        <div className="flex items-center justify-center w-full gap-2">
                                            <ShoppingBag className="w-3 h-3 text-lime-400" />
                                            <span className="text-xs font-bold text-white">Added</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Idle State Content (Empty or subtle indicator) */
                                <div className="w-8 h-1 bg-white/10 rounded-full" />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full p-4 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{activeActivity.type}</span>
                                <button onClick={(e) => { e.stopPropagation(); endActivity(activeActivity.id); }}>
                                    <X className="w-4 h-4 text-white/50 hover:text-white" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                    {activeActivity.type === 'music' ? <Play className="w-5 h-5 text-white" /> : <ShoppingBag className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white leading-none mb-1">{activeActivity.title}</h4>
                                    <p className="text-xs text-white/50">{activeActivity.subtitle || 'Active'}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
