"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Upload, Volume2, VolumeX, Minimize2, Music } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

export function MusicPlayer() {
    const [isOpen, setIsOpen] = useState(false);

    // Consume Context
    const {
        isPlaying,
        currentTrack,
        volume,
        isMuted,
        currentTime,
        duration,
        togglePlay,
        nextTrack,
        prevTrack,
        toggleMute,
        addTrack
    } = useMusic();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newTrack = {
                id: `upload-${Date.now()}`,
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: "You",
                url: url
            };
            addTrack(newTrack);
            setIsOpen(true);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Audio logic is now in MusicProvider */}

            <div className="pointer-events-auto">
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-black/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 w-80 shadow-[0_0_30px_rgba(124,58,237,0.3)] relative overflow-hidden"
                        >
                            {/* Visualizer Background Effect */}
                            <div className="absolute inset-0 z-0 opacity-20 flex items-end justify-center gap-1 pointer-events-none">
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-4 bg-primary rounded-t-sm"
                                        animate={{
                                            height: isPlaying ? ["20%", "80%", "30%"] : "10%",
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: i * 0.1,
                                            repeatType: "reverse"
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Now Playing</span>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                        <Minimize2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Track Info */}
                                <div className="mb-6">
                                    <h3 className="text-white font-bold text-lg truncate">{currentTrack?.title || "No Track"}</h3>
                                    <p className="text-muted-foreground text-sm truncate">{currentTrack?.artist || "Unknown"}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-100"
                                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-6">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>

                                {/* Controls */}
                                <div className="flex justify-between items-center">
                                    <label className="cursor-pointer group relative">
                                        <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                                        <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </label>

                                    <div className="flex items-center gap-4">
                                        <button onClick={prevTrack} className="text-white hover:text-primary transition-colors">
                                            <SkipBack className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={togglePlay}
                                            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/80 hover:scale-105 transition-all shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                                        >
                                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                        </button>
                                        <button onClick={nextTrack} className="text-white hover:text-primary transition-colors">
                                            <SkipForward className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <button onClick={toggleMute} className="text-muted-foreground hover:text-white transition-colors">
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="collapsed"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            onClick={() => setIsOpen(true)}
                            className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-xl border border-primary/50 text-primary flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-110 transition-transform group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/20 animate-ping rounded-full" />
                            {isPlaying ? (
                                <div className="flex gap-1 h-4 items-end">
                                    <motion.div className="w-1 bg-primary" animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.5, repeat: Infinity }} />
                                    <motion.div className="w-1 bg-primary" animate={{ height: ["60%", "30%", "60%"] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }} />
                                    <motion.div className="w-1 bg-primary" animate={{ height: ["30%", "80%", "30%"] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                                </div>
                            ) : (
                                <Music className="w-8 h-8" />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
