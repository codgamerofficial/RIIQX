"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, BatteryCharging, Wifi, WifiOff, Cloud, Sun, CloudRain, Moon, Music as MusicIcon, Clock, MapPin, Play, Pause, SkipForward, SkipBack, X, Volume2, Bell, Globe, Signal } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

// Types for Battery API
interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | EventListenerOptions): void;
}

type NavigatorWithBattery = Navigator & {
    getBattery: () => Promise<BatteryManager>;
    connection?: {
        effectiveType: string;
        rtt: number;
        downlink: number;
        saveData: boolean;
        type?: string;
    };
};

export function DynamicIsland() {
    const { isPlaying, currentTrack, currentTime, duration, togglePlay, nextTrack, prevTrack, seek, volume, setVolume, addTrack } = useMusic();
    const [mode, setMode] = useState<"idle" | "music" | "weather" | "system">("idle");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [weather, setWeather] = useState<{ temp: number; condition: string; location: string } | null>(null);
    const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
    const [language, setLanguage] = useState({ code: "ENG", region: "IN" });
    const [network, setNetwork] = useState<{ type: string; online: boolean }>({ type: "Fi", online: true });

    // Languages available
    const languages = [
        { code: "ENG", region: "IN" },
        { code: "ENG", region: "US" },
        { code: "ESP", region: "ES" },
        { code: "FRA", region: "FR" },
        { code: "DEU", region: "DE" },
    ];

    const cycleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = languages.findIndex(l => l.code === language.code && l.region === language.region);
        const nextIndex = (currentIndex + 1) % languages.length;
        setLanguage(languages[nextIndex]);
    };

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

    // Battery API
    useEffect(() => {
        const nav = navigator as NavigatorWithBattery;
        if (nav.getBattery) {
            nav.getBattery().then((batt) => {
                const updateBattery = () => {
                    setBattery({
                        level: Math.round(batt.level * 100),
                        charging: batt.charging
                    });
                };
                updateBattery();
                batt.addEventListener("levelchange", updateBattery);
                batt.addEventListener("chargingchange", updateBattery);
                return () => {
                    batt.removeEventListener("levelchange", updateBattery);
                    batt.removeEventListener("chargingchange", updateBattery);
                };
            });
        }
    }, []);

    // Network Status
    useEffect(() => {
        const updateNetwork = () => {
            const nav = navigator as NavigatorWithBattery;
            // @ts-ignore - connection is experimental
            const conn = nav.connection;
            const type = conn ? (conn.type === 'cellular' ? '5G' : 'WiFi') : 'WiFi';
            setNetwork({
                type: type,
                online: navigator.onLine
            });
        };

        window.addEventListener('online', updateNetwork);
        window.addEventListener('offline', updateNetwork);
        updateNetwork();

        return () => {
            window.removeEventListener('online', updateNetwork);
            window.removeEventListener('offline', updateNetwork);
        };
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
                    width: isMobile ? "100%" : (mode === "idle" ? "auto" : 480),
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
                        onClick={() => setMode(isPlaying ? "music" : "system")}
                    >
                        {/* LEFT: Language (Interactive) */}
                        <div
                            className="flex flex-col items-center leading-none mr-4 min-w-[30px] cursor-create hover:text-primary transition-colors"
                            onClick={cycleLanguage}
                            title="Click to change language"
                        >
                            <span className="text-[10px] font-bold text-white tracking-widest">{language.code}</span>
                            <span className="text-[10px] font-bold text-white/50 tracking-widest">{language.region}</span>
                        </div>

                        {/* CENTER: System Icons */}
                        <div className="flex items-center gap-3 mr-4">
                            {/* Wifi */}
                            <div className="relative group" title={network.online ? `Connected: ${network.type}` : "Offline"}>
                                {network.online ? <Wifi className="w-4 h-4 text-white" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                                {network.online && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                            </div>

                            {/* Volume */}
                            <div onClick={(e) => { e.stopPropagation(); setVolume(volume === 0 ? 1 : 0); }} className="cursor-pointer hover:text-primary transition-colors">
                                {volume === 0 ? <Volume2 className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-white" />}
                            </div>

                            {/* Battery */}
                            <div className="flex items-center gap-1">
                                {battery ? (
                                    <>
                                        <div className="relative">
                                            {battery.charging ? <BatteryCharging className="w-4 h-4 text-green-400" /> : <Battery className={`w-4 h-4 ${battery.level < 20 ? 'text-red-500' : 'text-white'}`} />}
                                        </div>
                                        <span className="text-[10px] font-mono text-white/80">{battery.level}%</span>
                                    </>
                                ) : (
                                    <Battery className="w-4 h-4 text-white/50" />
                                )}
                            </div>
                        </div>

                        {/* Weather Widget (Compact) */}
                        <div className="flex items-center gap-2 mr-4 pr-4 border-r border-white/10" onClick={(e) => { e.stopPropagation(); setMode("weather"); }} >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                <div className="z-10">{getWeatherIcon(weather?.condition || "Clear")}</div>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xs font-bold text-white">{weather?.temp ?? "--"}°</span>
                                <span className="text-[9px] font-medium text-white/50">{weather?.condition || "Clear"}</span>
                            </div>
                        </div>

                        {/* RIGHT: Clock & Notifications */}
                        <div className="flex items-center gap-4">
                            {/* Stacked Clock */}
                            <div className="flex flex-col items-end leading-none min-w-[60px]">
                                <span className="text-sm font-medium text-white tracking-wide">{time.slice(0, 5)}</span>
                                <span className="text-[10px] text-white/60">{date}</span>
                            </div>

                            {/* Notification Bell */}
                            <div className="relative cursor-pointer group">
                                <Bell className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black rounded-full flex items-center justify-center text-[8px] font-bold border border-black">
                                    3
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

                            {/* Middle: Main Content */}
                            <div className="flex-1 flex flex-col justify-center">
                                {/* SYSTEM INFO MODE */}
                                {mode === "system" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                                            <div className="text-white/50 text-xs uppercase tracking-widest">Network</div>
                                            <Wifi className="w-8 h-8 text-green-400" />
                                            <div className="text-lg font-bold text-white">System WiFi</div>
                                            <div className="text-xs text-white/50">{network.online ? "Connected" : "Offline"}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                                            <div className="text-white/50 text-xs uppercase tracking-widest">Battery</div>
                                            {battery?.charging ? <BatteryCharging className="w-8 h-8 text-green-400" /> : <Battery className="w-8 h-8 text-white" />}
                                            <div className="text-lg font-bold text-white">{battery?.level ?? "--"}%</div>
                                            <div className="text-xs text-white/50">{battery?.charging ? "Charging" : "Discharging"}</div>
                                        </div>
                                    </div>
                                )}

                                {/* WEATHER MODE */}
                                {mode === "weather" && (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-2 text-white/50 mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span className="uppercase tracking-widest text-sm">{weather?.location || "Locating..."}</span>
                                        </div>
                                        <div className="flex items-center justify-between w-full px-8">
                                            <div className="flex flex-col items-start">
                                                <span className="text-7xl font-black text-white tracking-tighter">{weather?.temp ?? "--"}°</span>
                                                <span className="text-xl text-white/60">{weather?.condition || "Loading..."}</span>
                                            </div>
                                            <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-3xl flex items-center justify-center shadow-2xl">
                                                {/* Large Icon */}
                                                <div className="transform scale-[2.5]">
                                                    {getWeatherIcon(weather?.condition || "Clear")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === "music" && (
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
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
