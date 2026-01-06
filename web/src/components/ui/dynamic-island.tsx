"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Wifi, Cloud, Sun, CloudRain, Moon, Music as MusicIcon, Clock, MapPin, Play, Pause, SkipForward, SkipBack, X, Volume2 } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

export function DynamicIsland() {
    const { isPlaying, currentTrack, currentTime, duration, togglePlay, nextTrack, prevTrack, seek, volume, setVolume, addTrack } = useMusic();
    const [mode, setMode] = useState<"idle" | "music" | "weather">("idle");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [weather, setWeather] = useState<{ temp: number; condition: string; location: string } | null>(null);
    const [isHoveringVolume, setIsHoveringVolume] = useState(false);

    // Clock
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Weather Fetcher
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`);
                    const data = await res.json();

                    const temp = Math.round(data.current.temperature_2m);
                    const code = data.current.weather_code;
                    let condition = "Clear";

                    if (code >= 1 && code <= 3) condition = "Cloudy";
                    if (code >= 51 && code <= 67) condition = "Rain";
                    if (code >= 71) condition = "Snow";
                    if (code >= 95) condition = "Storm";

                    const location = data.timezone.split("/")[1]?.replace("_", " ") || "Earth";

                    setWeather({ temp, condition, location });
                } catch (e) {
                    console.error("Weather fetch failed", e);
                }
            });
        }
    }, []);

    // Auto-switch logic: Removed to allow manual control, but maybe keep for initial play?
    // Let's rely on user click to expand for now, or we can keep it auto-expand on track change if desired.
    // For now, let's keep it manual/persistent to avoid annoyance.

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case "Cloudy": return <Cloud className="w-5 h-5 text-gray-400" />;
            case "Rain": return <CloudRain className="w-5 h-5 text-blue-400" />;
            case "Clear": return <Sun className="w-5 h-5 text-yellow-400" />;
            default: return <Sun className="w-5 h-5 text-yellow-400" />;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newTrack = {
                id: crypto.randomUUID(),
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                artist: "Local Upload",
                url: url
            };
            addTrack(newTrack);
        }
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="fixed z-[100] flex pointer-events-none bottom-4 left-4 right-4 justify-center md:bottom-6 md:right-6 md:left-auto md:justify-end md:w-auto">
            <motion.div
                layout
                initial={false}
                animate={{
                    width: isMobile ? "100%" : (mode === "idle" ? 300 : 480),
                    height: mode === "idle" ? 48 : 200,
                    borderRadius: 24,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-black/90 backdrop-blur-3xl border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.3)] overflow-hidden relative pointer-events-auto"
                onClick={(e) => {
                    // Prevent collapse when clicking controls
                    if (mode === "idle") setMode("music");
                }}
            >
                {/* IDLE STATE: Dock-like HUD */}
                {mode === "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-between px-6 cursor-pointer"
                        onClick={() => setMode(isPlaying ? "music" : "weather")}
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-base font-bold text-white tracking-wide">{time}</span>
                        </div>

                        {/* Center Indicator / Mini Vis */}
                        <div className="flex gap-1 items-end h-3 mx-4 opacity-50">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-white rounded-full"
                                    animate={{ height: isPlaying ? [4, 12, 4] : 4 }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, repeatType: "reverse" }}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Weather Widget (Exact Design) */}
                            <div className="flex items-center gap-2 pr-2">
                                {/* Icon + Badge */}
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                    <div className="z-10">{getWeatherIcon(weather?.condition || "Clear")}</div>
                                    {/* Notification Badge */}
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center border border-black z-20">
                                        <span className="text-[8px] font-bold text-black font-sans">9+</span>
                                    </div>
                                </div>

                                {/* Stacked Text */}
                                <div className="flex flex-col leading-none">
                                    <span className="text-sm font-bold text-white tracking-wide">{weather?.temp ?? "--"}°C</span>
                                    <span className="text-[10px] font-medium text-gray-400">{weather?.condition || "Clear"}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* EXPANDED CONTENT */}
                <AnimatePresence mode="wait">
                    {mode !== "idle" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 w-full h-full flex flex-col justify-between"
                        >
                            {/* Close Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setMode("idle"); }}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Top Row: System Status (Hidden in music mode to save space/focus) */}
                            {mode === "weather" && (
                                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{weather?.location || "Locating..."}</span>
                                    </div>
                                </div>
                            )}

                            {/* Middle: Main Content */}
                            <div className="flex-1 flex flex-col justify-center">
                                {mode === "music" ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            {/* Album Art / Visualizer */}
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-primary to-purple-800 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/20 group relative overflow-hidden">
                                                <MusicIcon className="w-8 h-8 text-white animate-pulse" />

                                                {/* Upload Overlay */}
                                                <div
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <span className="text-xs text-white font-bold">Upload</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="audio/*"
                                                    onChange={handleFileUpload}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-bold truncate text-lg">{currentTrack?.title || "No Track Selected"}</h3>
                                                <p className="text-white/60 text-sm truncate">{currentTrack?.artist || "Unknown Artist"}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1">
                                            <input
                                                type="range"
                                                min={0}
                                                max={duration || 100}
                                                value={currentTime}
                                                onChange={(e) => seek(Number(e.target.value))}
                                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
                                            />
                                            <div className="flex justify-between text-[10px] text-white/40 font-mono">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-between">
                                            {/* Volume */}
                                            <div className="flex items-center gap-2 group relative">
                                                <Volume2 className="w-5 h-5 text-white/70" />
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={1}
                                                    step={0.01}
                                                    value={volume}
                                                    onChange={(e) => setVolume(Number(e.target.value))}
                                                    className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary opacity-50 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>

                                            {/* Playback */}
                                            <div className="flex items-center gap-4">
                                                <button onClick={prevTrack} className="text-white/70 hover:text-white transition-colors">
                                                    <SkipBack className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={togglePlay}
                                                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                                >
                                                    {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black pl-1" />}
                                                </button>
                                                <button onClick={nextTrack} className="text-white/70 hover:text-white transition-colors">
                                                    <SkipForward className="w-6 h-6" />
                                                </button>
                                            </div>

                                            {/* Spacer to center controls strictly */}
                                            <div className="w-24"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Weather Layout */}
                                        <div className="flex items-center justify-between w-full px-2 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-5xl font-bold text-white tracking-tighter">{weather?.temp || "--"}°</span>
                                                <span className="text-lg text-white/60">{weather?.condition || "Loading..."}</span>
                                            </div>
                                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center">
                                                {getWeatherIcon(weather?.condition || "")}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
