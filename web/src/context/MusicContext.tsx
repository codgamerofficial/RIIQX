"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
}

interface MusicContextType {
    isPlaying: boolean;
    currentTrack: Track | null;
    tracks: Track[];
    volume: number;
    isMuted: boolean;
    currentTime: number;
    duration: number;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    seek: (time: number) => void;
    toggleMute: () => void;
    setVolume: (vol: number) => void;
    addTrack: (track: Track) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [tracks, setTracks] = useState<Track[]>([
        {
            id: "default-1",
            title: "Cyberpunk City",
            artist: "RIIQX Beats",
            url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
        }
    ]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolumeState] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = tracks[currentTrackIndex];

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        // Event Listeners
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration || 0);
        const onEnded = () => nextTrack();

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", onEnded);
        };
    }, []);

    // Sync Audio State
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = currentTrack.url;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
            // Trigger Dynamic Island
            import("@/components/ui/DynamicIsland").then(({ useWebIslandStore }) => {
                useWebIslandStore.getState().startActivity({
                    id: currentTrack.id,
                    type: 'music',
                    title: currentTrack.title,
                    subtitle: currentTrack.artist
                });
            });
        }
    }, [currentTrackIndex, tracks]); // Re-run when track changes

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) audio.play().catch(() => setIsPlaying(false));
        else audio.pause();
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Controls
    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    const setVolume = (vol: number) => setVolumeState(vol);

    const addTrack = (track: Track) => {
        setTracks(prev => [...prev, track]);
        setCurrentTrackIndex(tracks.length); // Play new track
        setIsPlaying(true);
    };

    return (
        <MusicContext.Provider value={{
            isPlaying,
            currentTrack,
            tracks,
            volume,
            isMuted,
            currentTime,
            duration,
            togglePlay,
            nextTrack,
            prevTrack,
            seek,
            toggleMute,
            setVolume,
            addTrack
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
}
