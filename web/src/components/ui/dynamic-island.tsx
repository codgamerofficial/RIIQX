"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Wifi, Cloud, Sun, CloudRain, Moon, Music as MusicIcon, Clock, MapPin } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

export function DynamicIsland() {
    const { isPlaying, currentTrack, currentTime, duration } = useMusic();
    const [mode, setMode] = useState<"idle" | "music" | "weather">("idle");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [weather, setWeather] = useState<{ temp: number; condition: string; location: string } | null>(null);

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

    // Auto-switch to music mode when playing
    useEffect(() => {
        if (isPlaying) {
            setMode("music");
        } else if (mode === "music" && !isPlaying) {
            const timeout = setTimeout(() => setMode("idle"), 2000);
            return () => clearTimeout(timeout);
        }
    }, [isPlaying]);

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case "Cloudy": return <Cloud className="w-5 h-5 text-gray-400" />;
            case "Rain": return <CloudRain className="w-5 h-5 text-blue-400" />;
            case "Clear": return <Sun className="w-5 h-5 text-yellow-400" />;
            default: return <Sun className="w-5 h-5 text-yellow-400" />;
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full pointer-events-none">
            <motion.div
                layout
                initial={false}
                animate={{
                    width: mode === "idle" ? 300 : 420,
                    height: mode === "idle" ? 48 : 160,
                    borderRadius: 24,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-black/90 backdrop-blur-3xl border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.3)] overflow-hidden relative pointer-events-auto"
                onClick={() => setMode(mode === "idle" ? (isPlaying ? "music" : "weather") : "idle")}
            >
                {/* IDLE STATE: Dock-like HUD */}
                {mode === "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-between px-6"
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
                            <span className="text-xs font-medium text-white/50">{date}</span>
                            <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
                                <Wifi className="w-3.5 h-3.5 text-white/70" />
                                <Battery className="w-3.5 h-3.5 text-green-500" />
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
                            className="p-5 w-full h-full flex flex-col justify-between"
                        >
                            {/* Top Row: System Status */}
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{weather?.location || "Locating..."}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wifi className="w-3 h-3" />
                                    <Battery className="w-3 h-3" />
                                </div>
                            </div>

                            {/* Middle: Main Content */}
                            <div className="flex items-center gap-4 flex-1">
                                {mode === "music" ? (
                                    <>
                                        {/* Album Art / Visualizer */}
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-purple-800 flex items-center justify-center shrink-0">
                                            <MusicIcon className="w-6 h-6 text-white animate-pulse" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-bold truncate text-sm">{currentTrack?.title}</h3>
                                            <p className="text-white/60 text-xs truncate">{currentTrack?.artist}</p>

                                            {/* Mini Progress */}
                                            <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Weather Layout */}
                                        <div className="flex items-center justify-between w-full px-2">
                                            <div className="flex flex-col">
                                                <span className="text-4xl font-bold text-white">{weather?.temp || "--"}°</span>
                                                <span className="text-sm text-white/60">{weather?.condition || "Loading..."}</span>
                                            </div>
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
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
