// =============================================================================
// RIIQX Mobile 2.0 — Shared Audiophile Audio State & Playback Controller
// 320kbps Master Audio • Synced Lyrics • Fullscreen Immersion • Native Expo AV
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { getApiBaseUrl } from '../services/api';

export interface MobileTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  audioUrl: string;
  artworkUrl: string;
  year?: number;
  bitrateKbps: number;
  format: string;
  isFavorite?: boolean;
}

export interface RecentSearchItem {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl?: string;
}

export const INITIAL_MOBILE_TRACKS: MobileTrack[] = [
  {
    id: 'track_zulfein',
    title: 'Zulfein',
    artist: 'Mehul Mahesh & Dj AYnik',
    album: 'BEATOP RECORDS',
    durationMs: 197000,
    audioUrl: 'https://aac.saavncdn.com/437/a5bf59099a04ed7c10681a1aabfa5ea2_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
    year: 2026,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'track_uska_hi_banana',
    title: 'Uska Hi Banana',
    artist: 'Arijit Singh',
    album: '1920 Evil Returns',
    durationMs: 327000,
    audioUrl: 'https://aac.saavncdn.com/344/4e7a96829b1ab444247a2a8db16673a8_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/344/High-Rated-Gabru-Punjabi-2017-500x500.jpg',
    year: 2024,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'track_tinka',
    title: 'Tinka (Lofi Flip)',
    artist: 'Aditya Rikhari, VIBIE',
    album: 'Trending Lofi Songs',
    durationMs: 184000,
    audioUrl: 'https://aac.saavncdn.com/900/498f71ceaf0a2f974c39fb1f9f1da3ad_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
    year: 2024,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
  {
    id: 'track_sem_controle',
    title: 'SEM CONTROLE (Slowed)',
    artist: 'nightfxrce',
    album: 'Phonk Waves',
    durationMs: 142000,
    audioUrl: 'https://aac.saavncdn.com/344/4e7a96829b1ab444247a2a8db16673a8_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
    year: 2025,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
  {
    id: 'track_arcano',
    title: 'Arcano (Slowed)',
    artist: 'Flame Runner, Dj Samir',
    album: 'Arcano Phonk',
    durationMs: 165000,
    audioUrl: 'https://aac.saavncdn.com/900/498f71ceaf0a2f974c39fb1f9f1da3ad_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
    year: 2025,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
];

export const INITIAL_RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: 'rs_1',
    title: 'Trending Lofi Songs',
    subtitle: 'Album • Various Artists • 2024',
    artworkUrl: 'https://c.saavncdn.com/344/High-Rated-Gabru-Punjabi-2017-500x500.jpg',
  },
  {
    id: 'rs_2',
    title: 'High On Life (feat. Bonn)',
    subtitle: 'Martin Garrix',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
  },
  {
    id: 'rs_3',
    title: 'Real Love (Liva K Extended Remix)',
    subtitle: 'Martin Garrix, Lloyiso, Liva K',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
  },
  {
    id: 'rs_4',
    title: 'Virus (How About Now)',
    subtitle: 'Martin Garrix, MOTi',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
  },
  {
    id: 'rs_5',
    title: 'Animals',
    subtitle: 'Martin Garrix',
    artworkUrl: 'https://c.saavncdn.com/344/High-Rated-Gabru-Punjabi-2017-500x500.jpg',
  },
  {
    id: 'rs_6',
    title: 'KALYANI',
    subtitle: 'ARJN, KDS, FIFTY4, RONN',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
  },
  {
    id: 'rs_7',
    title: 'KALYANI (Remix)',
    subtitle: 'ARJN, KDS, FIFTY4, Shreya Ghoshal',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
  },
  {
    id: 'rs_8',
    title: 'PARIS',
    subtitle: 'Guru Randhawa, Gurjit Gill, Verse',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
  },
  {
    id: 'rs_9',
    title: 'Apon (Baba Tumi Amar)',
    subtitle: 'Tanveer Evan, Piran Khan',
    artworkUrl: 'https://c.saavncdn.com/344/High-Rated-Gabru-Punjabi-2017-500x500.jpg',
  },
  {
    id: 'rs_10',
    title: 'Aakhri Ishq (From "Dhurandhar The Rev..."',
    subtitle: 'Shashwat Sachdev, Jubin Nautiyal',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
  },
];

interface RiiqxAudioContextType {
  tracks: MobileTrack[];
  currentTrack: MobileTrack;
  isPlaying: boolean;
  currentTimeMs: number;
  durationMs: number;
  volume: number;
  setVolume: (v: number) => void;
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (open: boolean) => void;
  playTrack: (track: MobileTrack) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (positionMs: number) => void;
  toggleFavorite: (trackId: string) => void;
  recentSearches: RecentSearchItem[];
  clearRecentSearches: () => void;
  removeRecentSearch: (id: string) => void;
  addRecentSearch: (item: RecentSearchItem) => void;
  activeFilterTab: 'YouTube' | 'Library' | 'Addons';
  setActiveFilterTab: (tab: 'YouTube' | 'Library' | 'Addons') => void;
  directSourceStream: boolean;
  setDirectSourceStream: (enabled: boolean) => void;
  dolbyAtmos: boolean;
  setDolbyAtmos: (enabled: boolean) => void;
  wifiQuality: string;
  mobileDataQuality: string;
}

const RiiqxAudioContext = createContext<RiiqxAudioContextType | undefined>(undefined);

export function RiiqxAudioProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<MobileTrack[]>(INITIAL_MOBILE_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(20000); // 0:20 initial preview
  const [durationMs, setDurationMs] = useState<number>(197000); // 3:17
  const [volume, setVolume] = useState<number>(0.85);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);

  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(INITIAL_RECENT_SEARCHES);
  const [activeFilterTab, setActiveFilterTab] = useState<'YouTube' | 'Library' | 'Addons'>('YouTube');

  // Audio Settings
  const [directSourceStream, setDirectSourceStream] = useState<boolean>(false);
  const [dolbyAtmos, setDolbyAtmos] = useState<boolean>(true);
  const [wifiQuality, setWifiQuality] = useState<string>('Lossless');
  const [mobileDataQuality, setMobileDataQuality] = useState<string>('Lossless');

  const soundRef = useRef<Audio.Sound | null>(null);
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Set up audio mode on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playTrack = async (track: MobileTrack) => {
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    } else {
      setTracks((prev) => [track, ...prev]);
      setCurrentTrackIndex(0);
    }

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true, volume },
        (status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            setCurrentTimeMs(status.positionMillis);
            if (status.durationMillis) {
              setDurationMs(status.durationMillis);
            }
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              nextTrack();
            }
          }
        }
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch {
      // Fallback state simulation for UI previews
      setIsPlaying(true);
    }
  };

  const togglePlayPause = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync().catch(() => {});
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    playTrack(tracks[nextIdx]);
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    playTrack(tracks[prevIdx]);
  };

  const seekTo = async (posMs: number) => {
    setCurrentTimeMs(posMs);
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(posMs).catch(() => {});
    }
  };

  const toggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const removeRecentSearch = (id: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const addRecentSearch = (item: RecentSearchItem) => {
    setRecentSearches((prev) => [item, ...prev.filter((i) => i.title !== item.title)]);
  };

  return (
    <RiiqxAudioContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        currentTimeMs,
        durationMs,
        volume,
        setVolume,
        isFullscreenOpen,
        setIsFullscreenOpen,
        playTrack,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seekTo,
        toggleFavorite,
        recentSearches,
        clearRecentSearches,
        removeRecentSearch,
        addRecentSearch,
        activeFilterTab,
        setActiveFilterTab,
        directSourceStream,
        setDirectSourceStream,
        dolbyAtmos,
        setDolbyAtmos,
        wifiQuality,
        mobileDataQuality,
      }}
    >
      {children}
    </RiiqxAudioContext.Provider>
  );
}

export function useRiiqxAudio() {
  const context = useContext(RiiqxAudioContext);
  if (!context) {
    throw new Error('useRiiqxAudio must be used within a RiiqxAudioProvider');
  }
  return context;
}

