import { create } from 'zustand';

export interface Track {
    id: string;
    title: string;
    artist: string;
    coverArt: string;
    src: string; // URL to audio file (blob or remote)
    duration: number;
}

type IslandState = 'idle' | 'compact' | 'expanded';

interface MusicState {
    isPlaying: boolean;
    currentTrack: Track | null;
    progress: number; // 0 to 100 or seconds
    currentTime: number;
    islandState: IslandState;

    // Actions
    play: () => void;
    pause: () => void;
    setTrack: (track: Track) => void;
    setProgress: (time: number, progress: number) => void;
    setIslandState: (state: IslandState) => void;
    togglePlay: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
    isPlaying: false,
    currentTrack: null,
    progress: 0,
    currentTime: 0,
    islandState: 'idle',

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),

    setTrack: (track) => set({
        currentTrack: track,
        isPlaying: true,
        islandState: 'compact', // Auto show island when track starts
        progress: 0,
        currentTime: 0
    }),

    setProgress: (time, progress) => set({ currentTime: time, progress }),

    setIslandState: (state) => set({ islandState: state }),

    togglePlay: () => {
        const { isPlaying, currentTrack } = get();
        if (currentTrack) {
            set({ isPlaying: !isPlaying });
        }
    }
}));
