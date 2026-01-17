"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicStore } from "@/store/music-store";
import { IslandWaveform } from "./IslandWaveform";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipForward, SkipBack, X, Upload } from "lucide-react";

export function DynamicIsland() {
    const {
        islandState,
        setIslandState,
        currentTrack,
        isPlaying,
        togglePlay,
        currentTime,
        setTrack
    } = useMusicStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Audio Element Management
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        if (currentTrack) {
            if (audio.src !== currentTrack.src) {
                audio.src = currentTrack.src;
                if (isPlaying) audio.play();
            } else {
                if (isPlaying) audio.play();
                else audio.pause();
            }
        }

        return () => {
            // cleanup if needed
        };
    }, [currentTrack, isPlaying]);


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setTrack({
                id: Date.now().toString(),
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: "Local Upload",
                coverArt: "", // Could generate a placeholder or extract id3
                src: url,
                duration: 0
            });
        }
    };


    // Physics Constants (Apple Spring)
    const springTransition = {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
    };

    // State Logic
    const isExpanded = islandState === 'expanded';
    const isCompact = islandState === 'compact';
    const isIdle = islandState === 'idle';

    return (
        <>
            {/* Hidden File Input for Uploads */}
            <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
            />

            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex justify-center items-start pointer-events-none">

                {/* The Island Pill */}
                <motion.div
                    layout
                    initial={false}
                    animate={{
                        width: isExpanded ? 350 : isCompact ? 180 : 120,
                        height: isExpanded ? 180 : 36,
                        borderRadius: isExpanded ? 40 : 24
                    }}
                    style={{ maxWidth: '92vw' }} // Safety cap for mobile
                    transition={springTransition}
                    onMouseEnter={() => {
                        if (currentTrack && !isExpanded) setIslandState('compact');
                    }}
                    onClick={() => {
                        if (currentTrack && !isExpanded) setIslandState('expanded');
                        // If idle, maybe trigger upload?
                        if (isIdle && !currentTrack) fileInputRef.current?.click();
                    }}
                    className={cn(
                        "bg-black relative overflow-hidden pointer-events-auto shadow-2xl shadow-black/50 border border-white/5 cursor-pointer backdrop-blur-2xl",
                        isIdle && "hover:scale-105 active:scale-95 transition-transform"
                    )}
                >

                    {/* IDLE / EMPTY STATE */}
                    <AnimatePresence>
                        {isIdle && !currentTrack && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center gap-2 text-white/50 text-xs font-medium"
                            >
                                <Upload size={12} />
                                <span>Play Music</span>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* COMPACT STATE */}
                    <AnimatePresence>
                        {isCompact && currentTrack && !isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 flex items-center justify-between px-3"
                            >
                                {/* Small Art/Icon */}
                                <div className="size-5 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden">
                                    {currentTrack.coverArt ? (
                                        <img src={currentTrack.coverArt} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="size-2 bg-secondary rounded-full animate-pulse" />
                                    )}
                                </div>

                                {/* Waveform Visualization */}
                                <IslandWaveform />

                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EXPANDED STATE (Full Controls) */}
                    <AnimatePresence>
                        {isExpanded && currentTrack && (
                            <motion.div
                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(10px)" }} // Quick vanish
                                transition={{ delay: 0.1 }} // Slight delay to let size catch up
                                className="absolute inset-0 p-6 flex flex-col justify-between"
                            >
                                {/* Top Row: Artist/Title + Waveform */}
                                <div className="flex items-start justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-xl bg-neutral-800 overflow-hidden shadow-lg">
                                            {currentTrack.coverArt ? (
                                                <img src={currentTrack.coverArt} alt="Cover" className="size-full object-cover" />
                                            ) : (
                                                <div className="size-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                                                    <span className="text-white font-bold text-xl">♪</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-lg leading-tight line-clamp-1">{currentTrack.title}</span>
                                            <span className="text-white/50 text-sm leading-tight">{currentTrack.artist}</span>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        <IslandWaveform />
                                    </div>
                                </div>

                                {/* Scrubber (Mock for now, visual only) */}
                                <div className="w-full h-1 bg-white/20 rounded-full mt-4 overflow-hidden relative">
                                    <motion.div
                                        className="absolute left-0 top-0 bottom-0 bg-white"
                                        style={{ width: '30%' }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                                    <span>1:23</span>
                                    <span>-2:45</span>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-8 mt-2">
                                    <button className="text-white/60 hover:text-white transition-colors">
                                        <SkipBack size={24} fill="currentColor" />
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                        className="size-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                                    >
                                        {isPlaying ? (
                                            <Pause size={28} fill="currentColor" />
                                        ) : (
                                            <Play size={28} fill="currentColor" className="ml-1" />
                                        )}
                                    </button>

                                    <button className="text-white/60 hover:text-white transition-colors">
                                        <SkipForward size={24} fill="currentColor" />
                                    </button>
                                </div>

                                {/* Collapse Click Area (Invisible overlay to close expanded on outside click if we wanted, but for now just click anywhere on island to not interfere, actually let's add a close button or rely on click anywhere empty) */}
                                {/* For realistic island, tapping empty space usually brings you to app, but here we can just toggle back to compact */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIslandState('compact'); }}
                                    className="absolute top-4 right-4 text-white/20 hover:text-white/50"
                                >
                                    <X size={16} />
                                </button>

                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </div>
        </>
    );
}
