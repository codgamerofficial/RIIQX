'use client';

// =============================================================================
// RIIQX MUSIC — Pro Audiophile & AI Music Streaming Platform
// Apple Music Aesthetic • 320kbps Master Decryption • Real-time FFT Visualizer • AI DJ
// MediaSession System Controls • 1-Click 320k Download • Sleep Timer • Playlist Manager
// =============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
  Sliders,
  ListMusic,
  ListPlus,
  Heart,
  Search,
  Upload,
  Radio,
  Sparkles,
  Music2,
  Disc3,
  X,
  FileAudio,
  Loader2,
  Flame,
  Bot,
  Send,
  Video,
  Languages,
  BookOpen,
  Download,
  Moon,
  Plus,
  FolderPlus,
  Check,
  Infinity as InfinityIcon,
  HelpCircle,
  Mic,
  Tv,
  Trash2,
  Headphones,
  CheckCircle2,
  Settings,
  HardDriveDownload,
  MicOff,
  Car,
} from 'lucide-react';
import { Track, Playlist, Lyrics, EqualizerSettings } from '@/types/music';
import { INITIAL_TRACKS, INITIAL_PLAYLISTS, FALLBACK_VINYL_ARTWORK } from '@/lib/music/mock-tracks';
import { WebAudioEngine, EQUALIZER_PRESETS } from '@/lib/music/audio-engine';
import { fetchLyrics } from '@/lib/music/lyrics-service';
import { useRiiqx } from '@/context/RiiqxContext';
import { AudioVisualizer } from './AudioVisualizer';
import { RiiqxLogo } from '@/components/ui/RiiqxLogo';
import { AIThinkingOrb } from '@/components/riiqx/ai/AIThinkingOrb';
import { AIVideoStudioView } from '@/components/video/AIVideoStudioView';
import {
  saveTrackOffline,
  isTrackSavedOffline,
  getAllOfflineTracks,
  deleteOfflineTrack,
  getOfflineStorageUsage,
  clearAllOfflineTracks,
  getOfflineTrackAudioUrl,
} from '@/lib/music/offline-storage';
import { VoiceRecognitionController, ParsedVoiceCommand } from '@/lib/music/voice-assistant';

const FALLBACK_ARTWORK = FALLBACK_VINYL_ARTWORK;

export interface Station {
  id: string;
  name: string;
  emoji: string;
  query: string;
  subtitle: string;
  badge: string;
  gradient: string;
}

export const STATIONS: Station[] = [
  {
    id: 'punjabi',
    name: 'Punjabi Wave',
    emoji: '⚡',
    query: 'Guru Randhawa Diljit Dosanjh AP Dhillon Karan Aujla',
    subtitle: 'High energy beats & Punjabi chartbusters',
    badge: 'TRENDING #1',
    gradient: 'from-amber-600/30 to-red-600/30',
  },
  {
    id: 'bollywood',
    name: 'Bollywood Romance',
    emoji: '🇮🇳',
    query: 'Arijit Singh Kesariya Shreya Ghoshal Atif Aslam',
    subtitle: 'Soulful Bollywood romantic melodies',
    badge: 'POPULAR',
    gradient: 'from-rose-600/30 to-pink-600/30',
  },
  {
    id: 'bengali',
    name: 'Bengali Melodies & Folk',
    emoji: '🎵',
    query: 'Arijit Singh Bengali Anupam Roy Fossils Mohiner Ghoraguli',
    subtitle: 'Bengali modern, folk & acoustic favorites',
    badge: 'LOCAL ROOTS',
    gradient: 'from-emerald-600/30 to-teal-600/30',
  },
  {
    id: 'global',
    name: 'Global Billboard 100',
    emoji: '🌍',
    query: 'The Chainsmokers Taylor Swift The Weeknd Dua Lipa',
    subtitle: 'International pop & dancefloor hits',
    badge: 'GLOBAL',
    gradient: 'from-blue-600/30 to-indigo-600/30',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Chill & Study',
    emoji: '☕',
    query: 'Lofi chill hip hop study beats rain',
    subtitle: 'Relaxing ambient beats for study & focus',
    badge: 'FOCUS',
    gradient: 'from-purple-600/30 to-violet-600/30',
  },
  {
    id: 'gym',
    name: 'Gym & High BPM Hype',
    emoji: '🏋️',
    query: 'workout edm high bpm gym bass boost',
    subtitle: 'Heavy bass & driving rhythms for max energy',
    badge: 'WORKOUT',
    gradient: 'from-orange-600/30 to-amber-600/30',
  },
  {
    id: 'synthwave',
    name: 'Midnight Synthwave',
    emoji: '🌌',
    query: 'synthwave retrowave 80s electronic night drive',
    subtitle: 'Retro neon synths and driving basslines',
    badge: 'NIGHT DRIVE',
    gradient: 'from-cyan-600/30 to-blue-600/30',
  },
];

function formatDuration(ms: number): string {
  if (!ms || isNaN(ms)) return '0:00';
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const POPULAR_SUGGESTIONS = [
  'Guru Randhawa',
  'Paris',
  'Arijit Singh',
  'High Rated Gabru',
  'Diljit Dosanjh',
  'Taylor Swift',
  'The Chainsmokers',
];

const AI_VIBE_PROMPTS = [
  '🔥 High-energy Punjabi party bangers like High Rated Gabru',
  '✨ Romantic evening soul music like Kesariya',
  '🌙 Late-night deep synthwave & electronic flow',
  '☕ Acoustic coffeehouse indie ballads',
];

export function RiiqxMusicView() {
  const {
    activeTab: contextActiveTab,
    setActiveTab: setContextActiveTab,
    openVideoStudioForTrack,
    videoStudioTrack,
  } = useRiiqx();

  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('riiqx_user_playlists');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_PLAYLISTS;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(INITIAL_TRACKS[0].durationMs);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState<boolean>(true);

  // Tab routing
  const activeTab = useMemo(() => {
    if (contextActiveTab === 'ai_dj') return 'ai_dj';
    if (contextActiveTab === 'video_studio') return 'video_studio';
    if (contextActiveTab === 'browse') return 'browse';
    if (contextActiveTab === 'offline') return 'offline';
    if (contextActiveTab === 'playlists') return 'playlists';
    if (contextActiveTab === 'favorites') return 'favorites';
    if (contextActiveTab === 'equalizer') return 'equalizer';
    if (contextActiveTab === 'settings') return 'settings';
    return 'listen_now';
  }, [contextActiveTab]);

  // AI Voice Assistant State
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<{ message: string; type: 'info' | 'success' | 'action' } | null>(null);
  const voiceControllerRef = useRef<VoiceRecognitionController | null>(null);

  // Offline Music Caching State (IndexedDB)
  const [offlineTracks, setOfflineTracks] = useState<Track[]>([]);
  const [offlineStorageInfo, setOfflineStorageInfo] = useState<{ count: number; formattedSize: string }>({ count: 0, formattedSize: '0 MB' });
  const [offlineTrackIds, setOfflineTrackIds] = useState<Set<string>>(new Set());
  const [isDownloadingOfflineId, setIsDownloadingOfflineId] = useState<string | null>(null);

  // Real-time Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  // AI DJ Studio State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiGeneratedPlaylist, setAiGeneratedPlaylist] = useState<{
    commentary: string;
    tracks: Track[];
  } | null>(null);

  // Right Side Panel Drawer: 'lyrics' | 'queue' | null
  const [rightPanelTab, setRightPanelTab] = useState<'lyrics' | 'queue' | null>(null);
  const isLyricsOpen = rightPanelTab === 'lyrics';
  const isQueueOpen = rightPanelTab === 'queue';

  // Lyrics & AI Scholar State
  const [lyricsData, setLyricsData] = useState<Lyrics | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);
  const [aiLyricsExplanation, setAiLyricsExplanation] = useState<string | null>(null);
  const [isExplainingLyrics, setIsExplainingLyrics] = useState<boolean>(false);

  // YouTube Video Modal & Floating PiP State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isVideoFloating, setIsVideoFloating] = useState<boolean>(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);

  // Genre / Mood Station State
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [isStationLoading, setIsStationLoading] = useState<boolean>(false);

  // AI DJ Radio Host State
  const [isDjSpeaking, setIsDjSpeaking] = useState<boolean>(false);
  const [isDjLoading, setIsDjLoading] = useState<boolean>(false);
  const [djSpeechText, setDjSpeechText] = useState<string | null>(null);

  // Audio Stream Quality Setting ('320k' | '160k')
  const [streamingQuality, setStreamingQuality] = useState<'320k' | '160k'>('320k');
  const [crossfadeSeconds, setCrossfadeSeconds] = useState<number>(3);

  // Sleep Timer State
  const [isSleepTimerModalOpen, setIsSleepTimerModalOpen] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemainingSeconds, setSleepTimerRemainingSeconds] = useState<number | null>(null);

  // Car Mode / Minimal Driver Mode State
  const [isCarModeOpen, setIsCarModeOpen] = useState<boolean>(false);
  const [carClockTime, setCarClockTime] = useState<string>('12:00 PM');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCarClockTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Custom Playlist Creator Modal State
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState<boolean>(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState<string>('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState<string>('');
  const [activePlaylistDetail, setActivePlaylistDetail] = useState<Playlist | null>(null);

  // Equalizer & Fullscreen Player
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [isFullscreenPlayer, setIsFullscreenPlayer] = useState<boolean>(false);
  const [eqSettings, setEqSettings] = useState<EqualizerSettings>({
    preset: 'Balanced',
    bassBoostLevel: 30,
    playbackSpeed: 1.0,
  });

  // 3D Spatial Audio Virtual Soundstage
  const [spatialAudioMode, setSpatialAudioMode] = useState<'stereo' | 'stage3d' | 'binaural'>('stage3d');

  const audioEngineRef = useRef<WebAudioEngine | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize Web Audio Engine
  useEffect(() => {
    const engine = new WebAudioEngine();
    audioEngineRef.current = engine;
    const audio = engine.getAudioElement();

    if (audio) {
      audio.volume = volume;

      const handleTimeUpdate = () => {
        setCurrentTimeMs(audio.currentTime * 1000);
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDurationMs(audio.duration * 1000);
        }
      };

      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDurationMs(audio.duration * 1000);
        }
      };

      const handleEnded = () => {
        handleTrackEnded();
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      // Load initial track
      engine.loadTrack(currentTrack.audioUrl);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.pause();
      };
    }
  }, []);

  // Fetch real trending 320kbps tracks on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/music/trending')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.tracks && data.tracks.length > 0) {
          setTracks((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const newTracks = data.tracks.filter((t: Track) => !existingIds.has(t.id));
            return [...prev, ...newTracks];
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // System Media Session API Integration (Hardware Keys, Lock Screen & Background Playback)
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: [
          { src: currentTrack.artworkUrl || FALLBACK_ARTWORK, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.artworkUrl || FALLBACK_ARTWORK, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.artworkUrl || FALLBACK_ARTWORK, sizes: '192x192', type: 'image/jpeg' },
          { src: currentTrack.artworkUrl || FALLBACK_ARTWORK, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.artworkUrl || FALLBACK_ARTWORK, sizes: '384x384', type: 'image/jpeg' },
          { src: currentTrack.artworkUrl || FALLBACK_ARTWORK, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      if ('setPositionState' in navigator.mediaSession && durationMs > 0) {
        try {
          navigator.mediaSession.setPositionState({
            duration: Math.max(1, durationMs / 1000),
            playbackRate: 1.0,
            position: Math.max(0, Math.min(durationMs / 1000, currentTimeMs / 1000)),
          });
        } catch {}
      }

      navigator.mediaSession.setActionHandler('play', () => {
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePrevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNextTrack();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          handleSeek(details.seekTime * 1000);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        handleSeek(Math.min(durationMs, currentTimeMs + (details.seekOffset || 10) * 1000));
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        handleSeek(Math.max(0, currentTimeMs - (details.seekOffset || 10) * 1000));
      });
    }
  }, [currentTrack, isPlaying, durationMs, currentTimeMs]);

  // Keep screen wake lock active during playback so background audio is protected
  useEffect(() => {
    let wakeLockSentinel: any = null;
    if ('wakeLock' in navigator && isPlaying) {
      (navigator as any).wakeLock
        .request('screen')
        .then((sentinel: any) => {
          wakeLockSentinel = sentinel;
        })
        .catch(() => {});
    }
    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [isPlaying]);

  // Global Keyboard Shortcuts (Space, Arrows, M, L, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentTimeMs - 5000));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(durationMs, currentTimeMs + 5000));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.05));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.05));
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      } else if (e.key.toLowerCase() === 'l') {
        setRightPanelTab((prev) => (prev === 'lyrics' ? null : 'lyrics'));
      } else if (e.key.toLowerCase() === 'q') {
        setRightPanelTab((prev) => (prev === 'queue' ? null : 'queue'));
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreenPlayer((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTimeMs, durationMs, volume]);

  // Sleep Timer Countdown & Volume Fade-out
  useEffect(() => {
    if (!sleepTimerRemainingSeconds) return;

    const interval = setInterval(async () => {
      setSleepTimerRemainingSeconds((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          setSleepTimerMinutes(null);
          // Gently fade out volume
          audioEngineRef.current?.fadeVolumeOut(3000);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerRemainingSeconds]);

  // Sync Equalizer Settings
  useEffect(() => {
    if (audioEngineRef.current) {
      audioEngineRef.current.applyEqualizer(eqSettings);
    }
  }, [eqSettings]);

  // Live Music Search with Debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(trimmed)}&limit=30`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (data.success && Array.isArray(data.tracks)) {
          setSearchResults(data.tracks);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Online search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch LRCLIB synchronized lyrics whenever the active track changes
  useEffect(() => {
    let isCancelled = false;
    setAiLyricsExplanation(null);

    async function loadLyrics() {
      setIsLoadingLyrics(true);
      try {
        const lyrics = await fetchLyrics(
          currentTrack.id,
          currentTrack.title,
          currentTrack.artist,
          currentTrack.album,
          currentTrack.durationMs / 1000
        );
        if (!isCancelled) {
          setLyricsData(lyrics);
        }
      } catch (e) {
        console.warn('Lyrics load failed:', e);
      } finally {
        if (!isCancelled) setIsLoadingLyrics(false);
      }
    }

    loadLyrics();
    return () => {
      isCancelled = true;
    };
  }, [currentTrack]);

  // Auto-scroll lyrics to match playback
  useEffect(() => {
    if (activeLyricRef.current && isLyricsOpen) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTimeMs, isLyricsOpen]);

  // Load offline downloaded tracks and storage stats from IndexedDB
  const refreshOfflineLibrary = async () => {
    try {
      const stored = await getAllOfflineTracks();
      setOfflineTracks(stored);
      setOfflineTrackIds(new Set(stored.map((t) => t.id)));
      const stats = await getOfflineStorageUsage();
      setOfflineStorageInfo({ count: stats.count, formattedSize: stats.formattedSize });
    } catch (e) {
      console.warn('Failed to refresh offline library:', e);
    }
  };

  useEffect(() => {
    refreshOfflineLibrary();
  }, []);

  // Offline Caching Toggle Handler
  const handleToggleSaveOffline = async (track: Track) => {
    const isSaved = offlineTrackIds.has(track.id);
    if (isSaved) {
      await deleteOfflineTrack(track.id);
      await refreshOfflineLibrary();
      setVoiceFeedback({ message: `Removed "${track.title}" from offline storage`, type: 'info' });
      setTimeout(() => setVoiceFeedback(null), 3500);
    } else {
      setIsDownloadingOfflineId(track.id);
      setVoiceFeedback({ message: `Caching "${track.title}" offline for 320kbps playback...`, type: 'info' });
      const ok = await saveTrackOffline(track);
      setIsDownloadingOfflineId(null);
      if (ok) {
        await refreshOfflineLibrary();
        setVoiceFeedback({ message: `"${track.title}" saved offline! Ready for zero-buffering playback.`, type: 'success' });
      } else {
        setVoiceFeedback({ message: `Failed to cache "${track.title}" offline.`, type: 'info' });
      }
      setTimeout(() => setVoiceFeedback(null), 4000);
    }
  };

  const handleClearAllOffline = async () => {
    if (confirm('Are you sure you want to remove all offline downloaded tracks from this device?')) {
      await clearAllOfflineTracks();
      await refreshOfflineLibrary();
      setVoiceFeedback({ message: 'All offline music wiped from local storage.', type: 'info' });
      setTimeout(() => setVoiceFeedback(null), 3000);
    }
  };

  // AI Voice Assistant Controller
  const toggleVoiceAssistant = () => {
    if (isVoiceListening) {
      voiceControllerRef.current?.stopListening();
      setIsVoiceListening(false);
      setVoiceFeedback(null);
      return;
    }

    if (!voiceControllerRef.current) {
      voiceControllerRef.current = new VoiceRecognitionController();
    }

    if (!voiceControllerRef.current.isSupported()) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Android.');
      return;
    }

    setIsVoiceListening(true);
    setVoiceFeedback({ message: '🎙️ Listening... Speak a song name or command (e.g. "Play Guru Randhawa", "Pause", "Bass boost")', type: 'info' });

    voiceControllerRef.current.startListening(
      async (cmd: ParsedVoiceCommand) => {
        setIsVoiceListening(false);
        await executeVoiceCommand(cmd);
      },
      (err: string) => {
        setIsVoiceListening(false);
        console.warn('Voice error:', err);
        setVoiceFeedback({ message: `Voice error: ${err}`, type: 'info' });
        setTimeout(() => setVoiceFeedback(null), 3000);
      },
      () => {
        setIsVoiceListening(false);
      }
    );
  };

  const executeVoiceCommand = async (cmd: ParsedVoiceCommand) => {
    switch (cmd.intent) {
      case 'pause':
        audioEngineRef.current?.pause();
        setVoiceFeedback({ message: '⏸️ Paused playback', type: 'action' });
        break;
      case 'resume':
        audioEngineRef.current?.play();
        setVoiceFeedback({ message: '▶️ Resumed music', type: 'action' });
        break;
      case 'next':
        handleNextTrack();
        setVoiceFeedback({ message: '⏭️ Skipping to next song', type: 'action' });
        break;
      case 'prev':
        handlePrevTrack();
        setVoiceFeedback({ message: '⏮️ Playing previous song', type: 'action' });
        break;
      case 'volume_up': {
        const newVol = Math.min(1, volume + 0.15);
        handleVolumeChange(newVol);
        setVoiceFeedback({ message: `🔊 Volume: ${Math.round(newVol * 100)}%`, type: 'action' });
        break;
      }
      case 'volume_down': {
        const newVol = Math.max(0, volume - 0.15);
        handleVolumeChange(newVol);
        setVoiceFeedback({ message: `🔉 Volume: ${Math.round(newVol * 100)}%`, type: 'action' });
        break;
      }
      case 'mute':
        toggleMute();
        setVoiceFeedback({ message: isMuted ? '🔊 Unmuted' : '🔇 Muted', type: 'action' });
        break;
      case 'toggle_lyrics':
        setRightPanelTab(rightPanelTab === 'lyrics' ? null : 'lyrics');
        setVoiceFeedback({ message: '✨ Toggled Synced Lyrics', type: 'action' });
        break;
      case 'bass_boost':
        setEqSettings((prev) => ({ ...prev, bassBoostLevel: 80 }));
        setVoiceFeedback({ message: '⚡ Bass Boost DSP set to 80%', type: 'action' });
        break;
      case 'light_mode':
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
        setVoiceFeedback({ message: '☀️ Switched to Light Mode', type: 'action' });
        break;
      case 'dark_mode':
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
        setVoiceFeedback({ message: '🌙 Switched to Dark Mode', type: 'action' });
        break;
      case 'open_offline':
        setContextActiveTab('offline' as any);
        setVoiceFeedback({ message: '💾 Opened Offline Music Library', type: 'action' });
        break;
      case 'play':
      case 'search':
        if (cmd.query) {
          setSearchQuery(cmd.query);
          setVoiceFeedback({ message: `🔍 Finding & playing "${cmd.query}"...`, type: 'action' });
          try {
            const res = await fetch(`/api/music/search?q=${encodeURIComponent(cmd.query)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.tracks) && data.tracks.length > 0) {
              await playDirectTrack(data.tracks[0]);
              setVoiceFeedback({ message: `▶️ Now Playing: ${data.tracks[0].title}`, type: 'success' });
            }
          } catch (e) {
            console.warn('Voice play fetch failed:', e);
          }
        }
        break;
    }
    setTimeout(() => setVoiceFeedback(null), 3500);
  };

  // Play / Pause Toggle
  const togglePlayPause = async () => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.pause();
    } else {
      try {
        await engine.play();
      } catch (err) {
        console.warn('Audio play error:', err);
      }
    }
  };

  const playTrackAtIndex = async (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    const targetTrack = tracks[index];
    setCurrentTrackIndex(index);
    setDurationMs(targetTrack.durationMs);
    setCurrentTimeMs(0);

    let audioUrl = targetTrack.audioUrl;
    // If it's an offline track, retrieve the blob object URL
    if (!audioUrl || offlineTrackIds.has(targetTrack.id)) {
      const offlineUrl = await getOfflineTrackAudioUrl(targetTrack.id);
      if (offlineUrl) audioUrl = offlineUrl;
    }

    const engine = audioEngineRef.current;
    if (engine) {
      try {
        if (crossfadeSeconds > 0 && isPlaying) {
          await engine.crossfadeTo(audioUrl, crossfadeSeconds, volume);
        } else {
          engine.loadTrack(audioUrl);
          await engine.play();
        }
      } catch (e) {
        console.warn('Play error:', e);
      }
    }
  };

  const playDirectTrack = async (track: Track) => {
    let resolvedAudioUrl = track.audioUrl;
    if (!resolvedAudioUrl || offlineTrackIds.has(track.id)) {
      const offlineUrl = await getOfflineTrackAudioUrl(track.id);
      if (offlineUrl) resolvedAudioUrl = offlineUrl;
    }

    const resolvedTrack = { ...track, audioUrl: resolvedAudioUrl };
    const existingIndex = tracks.findIndex((t) => t.id === track.id || (resolvedAudioUrl && t.audioUrl === resolvedAudioUrl));
    if (existingIndex >= 0) {
      playTrackAtIndex(existingIndex);
    } else {
      const updatedQueue = [resolvedTrack, ...tracks];
      setTracks(updatedQueue);
      setCurrentTrackIndex(0);
      setDurationMs(resolvedTrack.durationMs);
      setCurrentTimeMs(0);

      const engine = audioEngineRef.current;
      if (engine) {
        try {
          if (crossfadeSeconds > 0 && isPlaying) {
            await engine.crossfadeTo(resolvedAudioUrl, crossfadeSeconds, volume);
          } else {
            engine.loadTrack(resolvedAudioUrl);
            await engine.play();
          }
        } catch (e) {
          console.warn('Play direct track error:', e);
        }
      }
    }
  };

  // Smart Track Ended Handler (Repeats or Autoplays with Infinite Radio)
  const handleTrackEnded = async () => {
    if (isRepeat) {
      handleSeek(0);
      audioEngineRef.current?.play();
      return;
    }

    // Check if next song exists in queue
    const nextIdx = currentTrackIndex + 1;
    if (nextIdx < tracks.length) {
      playTrackAtIndex(nextIdx);
      return;
    }

    // If queue ended and Autoplay is enabled: Fetch acoustically matching song!
    if (isAutoplayOn && currentTrack) {
      try {
        const res = await fetch(
          `/api/music/similar?artist=${encodeURIComponent(currentTrack.artist)}&title=${encodeURIComponent(
            currentTrack.title
          )}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.tracks) && data.tracks.length > 0) {
          const newTrack = data.tracks[0];
          playDirectTrack(newTrack);
          return;
        }
      } catch (e) {
        console.warn('Autoplay fetch failed:', e);
      }
    }

    // Fallback loop back to start
    playTrackAtIndex(0);
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * tracks.length);
      playTrackAtIndex(nextIdx);
    } else {
      const nextIdx = (currentTrackIndex + 1) % tracks.length;
      playTrackAtIndex(nextIdx);
    }
  };

  const handlePrevTrack = () => {
    if (currentTimeMs > 3000) {
      handleSeek(0);
    } else {
      const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      playTrackAtIndex(prevIdx);
    }
  };

  const handleSeek = (newTimeMs: number) => {
    setCurrentTimeMs(newTimeMs);
    const engine = audioEngineRef.current;
    if (engine) {
      engine.seek(newTimeMs / 1000);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    audioEngineRef.current?.setVolume(newVol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngineRef.current?.setVolume(volume || 0.85);
    } else {
      setIsMuted(true);
      audioEngineRef.current?.setVolume(0);
    }
  };

  // Initial Cloud Sync with cross-device sync engine
  useEffect(() => {
    fetch('/api/music/sync')
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.favorites && Array.isArray(data.data.favorites)) {
          const favSet = new Set(data.data.favorites);
          setTracks((prev) =>
            prev.map((t) => (favSet.has(t.id) ? { ...t, isFavorite: true } : t))
          );
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = (trackId: string) => {
    setTracks((prev) => {
      const updated = prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t));
      const favIds = updated.filter((t) => t.isFavorite).map((t) => t.id);
      fetch('/api/music/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites: favIds }),
      }).catch(() => {});
      return updated;
    });
  };

  // Sleep Timer Setter
  const setTimerDuration = (mins: number | null) => {
    if (mins === null) {
      setSleepTimerMinutes(null);
      setSleepTimerRemainingSeconds(null);
    } else {
      setSleepTimerMinutes(mins);
      setSleepTimerRemainingSeconds(mins * 60);
    }
    setIsSleepTimerModalOpen(false);
  };

  // Custom Playlist Creator
  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return;
    const newPl: Playlist = {
      id: `custom_${Date.now()}`,
      title: newPlaylistTitle.trim(),
      description: newPlaylistDesc.trim() || 'Curated user mix',
      coverUrl: currentTrack.artworkUrl || FALLBACK_ARTWORK,
      tracks: [currentTrack],
    };

    const updated = [newPl, ...playlists];
    setPlaylists(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('riiqx_user_playlists', JSON.stringify(updated));
    }
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setIsCreatePlaylistModalOpen(false);
  };

  const handleAddTrackToPlaylist = (playlistId: string, trackToAdd: Track) => {
    const updated = playlists.map((pl) => {
      if (pl.id === playlistId) {
        const alreadyIn = pl.tracks.some((t) => t.id === trackToAdd.id);
        return alreadyIn ? pl : { ...pl, tracks: [...pl.tracks, trackToAdd] };
      }
      return pl;
    });
    setPlaylists(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('riiqx_user_playlists', JSON.stringify(updated));
    }
  };

  // AI DJ Generator
  const handleGenerateAiPlaylist = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim()) return;

    setIsAiLoading(true);
    setAiGeneratedPlaylist(null);

    try {
      const res = await fetch('/api/music/ai-dj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend, mode: 'playlist' }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.tracks)) {
        setAiGeneratedPlaylist({
          commentary: data.commentary,
          tracks: data.tracks,
        });
      }
    } catch (err) {
      console.error('AI DJ generation error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Lyrics Explanation & Meaning
  const handleExplainLyricsWithAi = async () => {
    setIsExplainingLyrics(true);
    try {
      const lyricsText =
        lyricsData?.plainLyrics ||
        lyricsData?.syncedLyrics.map((l) => l.text).join('\n') ||
        '';

      const res = await fetch('/api/music/ai-dj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'lyrics',
          currentTrackTitle: currentTrack.title,
          currentTrackArtist: currentTrack.artist,
          lyricsText,
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setAiLyricsExplanation(data.explanation);
      }
    } catch (err) {
      console.error('AI lyrics explanation error:', err);
    } finally {
      setIsExplainingLyrics(false);
    }
  };

  // Open YouTube Official Video
  const handleOpenYouTubeVideo = async () => {
    setIsLoadingVideo(true);
    setIsVideoModalOpen(true);
    setIsVideoFloating(false);
    setYoutubeVideoId(null);

    try {
      const res = await fetch(
        `/api/music/youtube?title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(
          currentTrack.artist
        )}`
      );
      const data = await res.json();
      if (data.success && data.videoId) {
        setYoutubeVideoId(data.videoId);
      }
    } catch (err) {
      console.error('YouTube video fetch error:', err);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  // Up Next Queue Helpers
  const upcomingQueue = useMemo(() => {
    return tracks.slice(currentTrackIndex + 1);
  }, [tracks, currentTrackIndex]);

  const handlePlayNext = (trackToInsert: Track) => {
    const updated = [...tracks];
    updated.splice(currentTrackIndex + 1, 0, trackToInsert);
    setTracks(updated);
  };

  const handleAddToQueue = (trackToAppend: Track) => {
    setTracks((prev) => [...prev, trackToAppend]);
  };

  const handleRemoveFromUpcoming = (upcomingIdx: number) => {
    const absIdx = currentTrackIndex + 1 + upcomingIdx;
    setTracks((prev) => prev.filter((_, idx) => idx !== absIdx));
  };

  const handleClearUpcoming = () => {
    setTracks((prev) => prev.slice(0, currentTrackIndex + 1));
  };

  const handleShuffleUpcoming = () => {
    const pastAndCurrent = tracks.slice(0, currentTrackIndex + 1);
    const upcoming = [...tracks.slice(currentTrackIndex + 1)];
    for (let i = upcoming.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
    }
    setTracks([...pastAndCurrent, ...upcoming]);
  };

  // Genre / Mood Station Selection
  const handleSelectStation = async (station: Station) => {
    setActiveStation(station);
    setIsStationLoading(true);
    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(station.query)}&limit=25`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tracks) && data.tracks.length > 0) {
        setTracks(data.tracks);
        setCurrentTrackIndex(0);
        setDurationMs(data.tracks[0].durationMs);
        setCurrentTimeMs(0);
        const engine = audioEngineRef.current;
        if (engine) {
          engine.loadTrack(data.tracks[0].audioUrl);
          try {
            await engine.play();
          } catch (e) {
            console.warn('Play station track error:', e);
          }
        }
      }
    } catch (err) {
      console.warn('Station load error:', err);
    } finally {
      setIsStationLoading(false);
    }
  };

  // AI DJ Radio Host Intro Voice (Live Charismatic DJ)
  const triggerAiDjHostIntro = async () => {
    if (isDjSpeaking || isDjLoading) return;
    setIsDjLoading(true);
    try {
      const res = await fetch('/api/music/ai-dj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'radio_host',
          currentTrackTitle: currentTrack.title,
          currentTrackArtist: currentTrack.artist,
        }),
      });
      const data = await res.json();
      if (data.success && data.speechText) {
        setDjSpeechText(data.speechText);
        await audioEngineRef.current?.duckVolume(0.2, 350);

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.speechText);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Online') ||
                v.name.includes('Samantha') ||
                v.name.includes('Daniel'))
          );
          if (preferredVoice) utterance.voice = preferredVoice;

          setIsDjSpeaking(true);
          utterance.onend = () => {
            setIsDjSpeaking(false);
            audioEngineRef.current?.restoreVolume(400);
            setTimeout(() => setDjSpeechText(null), 5000);
          };
          utterance.onerror = () => {
            setIsDjSpeaking(false);
            audioEngineRef.current?.restoreVolume(400);
          };
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => {
            audioEngineRef.current?.restoreVolume(400);
            setDjSpeechText(null);
          }, 4500);
        }
      }
    } catch (err) {
      console.warn('AI DJ Host error:', err);
      audioEngineRef.current?.restoreVolume(300);
    } finally {
      setIsDjLoading(false);
    }
  };

  // Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

    const newTrack: Track = {
      id: `local_${Date.now()}`,
      title: nameWithoutExt,
      artist: 'Local Audio File',
      album: 'Imported Library',
      durationMs: 180000,
      audioUrl: objectUrl,
      artworkUrl: FALLBACK_ARTWORK,
      format: file.type || 'AUDIO/LOCAL',
      bitrateKbps: 320,
      isFavorite: true,
    };

    setTracks((prev) => [newTrack, ...prev]);
    playTrackAtIndex(0);
  };

  // Active lyric index
  const activeLyricIndex = useMemo(() => {
    if (!lyricsData || !lyricsData.syncedLyrics.length) return -1;
    const synced = lyricsData.syncedLyrics;
    for (let i = synced.length - 1; i >= 0; i--) {
      if (currentTimeMs >= synced[i].timestampMs) {
        return i;
      }
    }
    return -1;
  }, [lyricsData, currentTimeMs]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#f8f9fa] dark:bg-[#0a0a0c] text-zinc-900 dark:text-white overflow-hidden select-none transition-colors duration-200">
      {/* Dynamic Ambient Blurred Backdrop */}
      {currentTrack.artworkUrl && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-25 filter blur-[120px] scale-125 transition-all duration-1000 -z-10"
          style={{
            backgroundImage: `url(${currentTrack.artworkUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}

      {/* Top Navigation Filter Pills & Unified Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-6 py-2.5 border-b border-zinc-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#07070a]/80 backdrop-blur-xl shrink-0 z-10 gap-3">
        {/* Apple Music & Spotify Style Clean Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setContextActiveTab('music')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'listen_now'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'bg-white/[0.06] text-zinc-400 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            All Music
          </button>
          <button
            onClick={() => setContextActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'bg-white/[0.06] text-zinc-400 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setContextActiveTab('ai_dj')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_dj'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'bg-white/[0.06] text-zinc-400 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#FA243C]" />
            <span>AI DJ</span>
          </button>
          <button
            onClick={() => setContextActiveTab('video_studio')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'video_studio'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'bg-white/[0.06] text-zinc-400 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            <Video className="w-3 h-3 text-[#FA243C]" />
            <span>Lyric Studio</span>
          </button>
        </div>

        {/* Global Live Music Search Input & Quick Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 sm:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Guru Randhawa, Paris, Arijit, any song..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.12] rounded-full py-2 pl-10 pr-9 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] focus:bg-white dark:focus:bg-white/[0.1] transition-all shadow-inner"
            />
            {isSearching ? (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FA243C] animate-spin" />
            ) : hasSearchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* AI Voice Assistant & Speech Search Button */}
          <button
            onClick={toggleVoiceAssistant}
            className={`p-2 rounded-full border transition-all shrink-0 flex items-center justify-center cursor-pointer ${
              isVoiceListening
                ? 'bg-rose-500/20 text-[#FA243C] border-[#FA243C] shadow-lg shadow-[#FA243C]/40 ring-4 ring-[#FA243C]/20'
                : 'bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-white/[0.08]'
            }`}
            title={isVoiceListening ? 'Listening to your voice... Speak song name or command' : 'AI Voice Search & Voice Copilot (Click to Speak)'}
          >
            {isVoiceListening ? <AIThinkingOrb state="listening" size={18} neuralActivity={false} /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Sleep Timer Indicator Button */}
          <button
            onClick={() => setIsSleepTimerModalOpen(true)}
            className={`p-2 rounded-full border transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
              sleepTimerRemainingSeconds
                ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/40'
                : 'bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-white/[0.08]'
            }`}
            title="Sleep Timer"
          >
            <Moon className="w-4 h-4" />
            {sleepTimerRemainingSeconds && (
              <span className="text-[10px] font-mono font-bold pr-1">
                {Math.floor(sleepTimerRemainingSeconds / 60)}m
              </span>
            )}
          </button>

          <label className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.12] border border-zinc-200 dark:border-white/[0.1] text-xs font-semibold text-zinc-700 dark:text-zinc-200 cursor-pointer transition-all shrink-0">
            <Upload className="w-3.5 h-3.5 text-orange-500" />
            <span>Drop File</span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Floating Voice Assistant Feedback Banner */}
      {voiceFeedback && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/95 dark:bg-zinc-800/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 text-xs font-semibold">
          {isVoiceListening && <span className="w-2.5 h-2.5 rounded-full bg-[#FA243C] animate-ping" />}
          <span>{voiceFeedback.message}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Content View Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {/* SEARCH RESULTS VIEW (Activates when user types) */}
          {hasSearchQuery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>Results for</span>
                    <span className="text-[#FA243C]">"{searchQuery}"</span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isSearching
                      ? 'Connecting to high-fidelity music catalog...'
                      : `${searchResults.length} full-length 320kbps tracks ready to play`}
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.15] text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-transparent transition-colors"
                >
                  Clear Search
                </button>
              </div>

              {/* Quick suggestion pills */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] text-zinc-500 font-medium">Try searching:</span>
                {POPULAR_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.1] border border-zinc-200 dark:border-white/[0.06] text-[11px] text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#FA243C] animate-spin" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Streaming results for "{searchQuery}"...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl p-2 sm:p-3 shadow-sm space-y-1">
                  {/* Subtle Table Header */}
                  <div className="hidden sm:flex items-center justify-between px-3 py-2 text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase border-b border-zinc-100 dark:border-white/[0.04]">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="w-7 text-center">#</span>
                      <span>Track Title &amp; Artist</span>
                    </div>
                    <span className="hidden md:block w-44 lg:w-56">Album</span>
                    <div className="flex items-center gap-3 w-32 justify-end pr-2">
                      <span>Time</span>
                      <span className="w-16 text-center">Actions</span>
                    </div>
                  </div>

                  {/* Sleek Modern Track Rows */}
                  {searchResults.map((track, idx) => {
                    const isCurrent = currentTrack.title === track.title && currentTrack.artist === track.artist;
                    return (
                      <div
                        key={track.id}
                        onClick={() => playDirectTrack(track)}
                        className={`group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FA243C]/10 text-zinc-900 dark:text-white ring-1 ring-[#FA243C]/30 shadow-sm'
                            : 'hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {/* Left: Index / Play Icon + Artwork + Title + Artist */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          {/* Index or Animated Waves / Play icon on hover */}
                          <div className="w-7 text-center shrink-0 flex items-center justify-center">
                            {isCurrent && isPlaying ? (
                              <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
                                <span className="w-0.5 bg-[#FA243C] h-3.5 rounded-full animate-pulse" />
                                <span className="w-0.5 bg-[#FA243C] h-2 rounded-full animate-pulse delay-75" />
                                <span className="w-0.5 bg-[#FA243C] h-3 rounded-full animate-pulse delay-150" />
                              </div>
                            ) : (
                              <>
                                <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 group-hover:hidden">
                                  {idx + 1}
                                </span>
                                <Play className="w-3.5 h-3.5 text-zinc-800 dark:text-white fill-current hidden group-hover:block translate-x-0.5" />
                              </>
                            )}
                          </div>

                          {/* High-res Artwork */}
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm shrink-0 bg-zinc-800 ring-1 ring-black/5 dark:ring-white/10 group-hover:shadow-md transition-shadow">
                            <img
                              src={track.artworkUrl || FALLBACK_ARTWORK}
                              alt={track.title}
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_ARTWORK;
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-3.5 h-3.5 text-white fill-current translate-x-0.5" />
                            </div>
                          </div>

                          {/* Titles */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold truncate ${
                                isCurrent ? 'text-[#FA243C]' : 'text-zinc-900 dark:text-white group-hover:text-[#FA243C] transition-colors'
                              }`}>
                                {track.title}
                              </span>
                              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                320K
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                              <span className="hover:text-zinc-900 dark:hover:text-zinc-200">{track.artist}</span>
                              {track.album && (
                                <>
                                  <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
                                  <span className="truncate hidden sm:inline">{track.album}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Middle: Album Name (Desktop) */}
                        <div className="hidden md:block w-44 lg:w-56 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {track.album}
                        </div>

                        {/* Right: Duration + Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 w-10 text-right">
                            {formatDuration(track.durationMs)}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openVideoStudioForTrack(track)}
                              title="Make Animated Lyric Video (Pro)"
                              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-purple-500 transition-colors cursor-pointer"
                            >
                              <Video className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddToQueue(track)}
                              title="Add to Up Next Queue"
                              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                            >
                              <ListPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleSaveOffline(track)}
                              disabled={isDownloadingOfflineId === track.id}
                              title={offlineTrackIds.has(track.id) ? 'Cached Offline' : 'Save for Offline Zero-Buffering Playback'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                offlineTrackIds.has(track.id)
                                  ? 'text-emerald-500 bg-emerald-500/10'
                                  : 'hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-emerald-500'
                              }`}
                            >
                              {isDownloadingOfflineId === track.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                              ) : (
                                <HardDriveDownload className="w-4 h-4" />
                              )}
                            </button>
                            <a
                              href={`/api/music/download?url=${encodeURIComponent(track.audioUrl)}&name=${encodeURIComponent(
                                `${track.artist} - ${track.title}`
                              )}`}
                              download
                              title="Download 320kbps MP3"
                              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors hidden sm:block"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => playDirectTrack(track)}
                              className="w-8 h-8 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white flex items-center justify-center shadow-md shadow-[#FA243C]/20 transition-transform hover:scale-105 cursor-pointer ml-1"
                            >
                              {isCurrent && isPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-400 space-y-3">
                  <FileAudio className="w-10 h-10 mx-auto opacity-40 text-zinc-500" />
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No results found for "{searchQuery}".</p>
                  <p className="text-xs text-zinc-500">Check spelling or try searching another popular artist.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* AI MUSIC DJ & STUDIO TAB */}
              {activeTab === 'ai_dj' && (
                <div className="space-y-6">
                  {/* AI DJ Hero Banner (Apple Music + Spotify Minimalist Aesthetic) */}
                  <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] backdrop-blur-2xl p-6 md:p-8 shadow-sm space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.1] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        <AIThinkingOrb state={isAiLoading ? 'generating' : 'idle'} size={38} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                          <span>RIIQX AI Music DJ</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/15">
                            LLM CURATED
                          </span>
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Powered by high-speed neural models to generate instant mood playlists and acoustic deep dives.
                        </p>
                      </div>
                    </div>

                    {/* AI Prompt Input Bar */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiPlaylist()}
                        placeholder="Tell the AI DJ what vibe or mood you want (e.g. 'Punjabi party like High Rated Gabru', 'sad acoustic hindi', 'coding lofi')..."
                        className="flex-1 bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] rounded-2xl py-3 px-4 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] transition-all shadow-inner"
                      />
                      <button
                        onClick={() => handleGenerateAiPlaylist()}
                        disabled={isAiLoading || !aiPrompt.trim()}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FA243C] hover:bg-[#ff3b50] text-white font-semibold text-xs shadow-md shadow-[#FA243C]/20 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>Spin Mix</span>
                      </button>
                    </div>

                    {/* Preset vibe buttons */}
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      {AI_VIBE_PROMPTS.map((promptText) => (
                        <button
                          key={promptText}
                          onClick={() => {
                            setAiPrompt(promptText);
                            handleGenerateAiPlaylist(promptText);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Generated Playlist Results */}
                  {aiGeneratedPlaylist && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#FA243C]" />
                            <span>AI Curated Mix</span>
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{aiGeneratedPlaylist.commentary}</p>
                        </div>
                        <button
                          onClick={() => {
                            setTracks([...aiGeneratedPlaylist.tracks, ...tracks]);
                            playTrackAtIndex(0);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white font-bold text-xs shadow-md shadow-[#FA243C]/20 transition-all cursor-pointer"
                        >
                          Play Full Mix
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aiGeneratedPlaylist.tracks.map((track) => (
                          <div
                            key={track.id}
                            onClick={() => playDirectTrack(track)}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-zinc-50 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/[0.06] shadow-sm transition-all cursor-pointer group"
                          >
                            <img
                              src={track.artworkUrl || FALLBACK_ARTWORK}
                              alt={track.title}
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_ARTWORK;
                              }}
                              className="w-14 h-14 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-900 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{track.title}</h4>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{track.artist}</p>
                              <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {track.format || '320kbps Master'}
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#FA243C] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0 shadow-md">
                              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI VIDEO STUDIO (PRO) TAB */}
              {activeTab === 'video_studio' && (
                <AIVideoStudioView currentPlayingTrack={videoStudioTrack || currentTrack} />
              )}

              {/* DEFAULT VIEW: LISTEN NOW */}
              {activeTab === 'listen_now' && (
                <div className="space-y-6">
                  {/* Featured Album Hero */}
                  <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/[0.1] bg-gradient-to-r from-zinc-100 via-rose-50/40 to-white dark:from-red-950/40 dark:via-zinc-900/60 dark:to-black/80 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-md dark:shadow-2xl">
                    <div className="relative w-44 h-44 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl shrink-0 group bg-zinc-100 dark:bg-zinc-900">
                      <img
                        src={currentTrack.artworkUrl || FALLBACK_ARTWORK}
                        alt={currentTrack.title}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_ARTWORK;
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={togglePlayPause}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-[#FA243C] flex items-center justify-center text-white shadow-xl shadow-[#FA243C]/40">
                          {isPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current translate-x-0.5" />
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="flex-1 space-y-3 text-center md:text-left">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-white/[0.1] text-zinc-700 dark:text-zinc-300">
                          NOW STREAMING
                        </span>
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {currentTrack.format || '320KBPS MASTER'}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-heading">
                        {currentTrack.title}
                      </h2>
                      <p className="text-base text-zinc-600 dark:text-zinc-300 font-medium">
                        {currentTrack.artist} &bull; <span className="text-zinc-500 dark:text-zinc-400">{currentTrack.album}</span>
                      </p>

                      <div className="flex items-center gap-2.5 justify-center md:justify-start pt-2 flex-wrap">
                        <button
                          onClick={togglePlayPause}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white font-bold text-sm shadow-md shadow-[#FA243C]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          <span>{isPlaying ? 'Pause' : 'Play Now'}</span>
                        </button>
                        <button
                          onClick={() => setRightPanelTab(rightPanelTab === 'lyrics' ? null : 'lyrics')}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-semibold text-xs transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FA243C]" />
                          <span>Lyrics</span>
                        </button>
                        <button
                          onClick={() => setRightPanelTab(rightPanelTab === 'queue' ? null : 'queue')}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-semibold text-xs transition-all cursor-pointer"
                        >
                          <ListMusic className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Queue ({upcomingQueue.length})</span>
                        </button>
                        <button
                          onClick={() => openVideoStudioForTrack(currentTrack)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-semibold text-xs transition-all cursor-pointer"
                          title="Generate 9:16 / 16:9 Animated Lyric Video (Pro)"
                        >
                          <Video className="w-3.5 h-3.5 text-[#FA243C]" />
                          <span>Lyric Studio</span>
                          <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded bg-white/20 text-white">
                            PRO
                          </span>
                        </button>
                        <button
                          onClick={triggerAiDjHostIntro}
                          disabled={isDjSpeaking || isDjLoading}
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                          title="AI DJ Radio Host Voice Intro"
                        >
                          {isDjLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FA243C]" />
                          ) : isDjSpeaking ? (
                            <AIThinkingOrb state="generating" size={14} neuralActivity={false} />
                          ) : (
                            <Mic className="w-3.5 h-3.5 text-zinc-400" />
                          )}
                          <span>{isDjSpeaking ? 'Speaking...' : 'DJ Intro'}</span>
                        </button>
                        <button
                          onClick={handleOpenYouTubeVideo}
                          className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
                          title="Watch Official Video"
                        >
                          <Video className="w-3.5 h-3.5 text-red-500" />
                        </button>
                        <a
                          href={`/api/music/download?url=${encodeURIComponent(currentTrack.audioUrl)}&name=${encodeURIComponent(
                            `${currentTrack.artist} - ${currentTrack.title}`
                          )}`}
                          download
                          title="Download 320kbps MP3"
                          className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setIsFullscreenPlayer(true)}
                          className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
                          title="Fullscreen Immersion"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Curated Stations & Music Vibes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[#FA243C]" />
                        <span>Curated Stations &amp; Vibes</span>
                      </h3>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Instant 320k radio stations</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {STATIONS.map((station) => {
                        const isCurrentStation = activeStation?.id === station.id;
                        return (
                          <div
                            key={station.id}
                            onClick={() => handleSelectStation(station)}
                            className={`group p-4 rounded-2xl border transition-all cursor-pointer bg-gradient-to-br ${station.gradient} hover:scale-[1.02] relative overflow-hidden shadow-sm ${
                              isCurrentStation
                                ? 'border-[#FA243C] ring-2 ring-[#FA243C]/40 shadow-xl'
                                : 'border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.2]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{station.emoji}</span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/[0.2] dark:bg-white/[0.15] text-white">
                                {station.badge}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white group-hover:text-white transition-colors">
                              {station.name}
                            </h4>
                            <p className="text-[11px] text-zinc-100/90 dark:text-zinc-300/80 mt-1 line-clamp-1">
                              {station.subtitle}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-white/80">
                                {isStationLoading && isCurrentStation ? 'Loading...' : 'Play Station'}
                              </span>
                              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Heavy Rotation Carousel */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>Heavy Rotation &amp; Trending Hits</span>
                      </h3>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Guru Randhawa, Chainsmokers, Arijit</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {tracks.map((track, idx) => {
                        const isCurrent = idx === currentTrackIndex;
                        return (
                          <div
                            key={track.id}
                            onClick={() => playTrackAtIndex(idx)}
                            className={`group relative rounded-2xl p-3 bg-white dark:bg-white/[0.03] hover:bg-zinc-50 dark:hover:bg-white/[0.08] border transition-all cursor-pointer shadow-sm ${
                              isCurrent
                                ? 'border-[#FA243C]/50 bg-rose-50/50 dark:bg-white/[0.06] shadow-lg shadow-[#FA243C]/10'
                                : 'border-zinc-200 dark:border-white/[0.06]'
                            }`}
                          >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-900">
                              <img
                                src={track.artworkUrl || FALLBACK_ARTWORK}
                                alt={track.title}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_ARTWORK;
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-[#FA243C] flex items-center justify-center text-white shadow-lg">
                                  {isCurrent && isPlaying ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <h4 className="font-semibold text-xs text-zinc-900 dark:text-white truncate">{track.title}</h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{track.artist}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* All Tracks Table View */}
              {(activeTab === 'browse' || activeTab === 'favorites') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                      {activeTab === 'favorites' ? 'Favorite Songs' : 'All Tracks'}
                    </h3>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{tracks.length} items</span>
                  </div>

                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl p-2 sm:p-3 shadow-sm space-y-1">
                    {/* Subtle Table Header */}
                    <div className="hidden sm:flex items-center justify-between px-3 py-2 text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase border-b border-zinc-100 dark:border-white/[0.04]">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="w-7 text-center">#</span>
                        <span>Title &amp; Artist</span>
                      </div>
                      <span className="hidden md:block w-44 lg:w-56">Album</span>
                      <div className="flex items-center gap-3 w-32 justify-end pr-2">
                        <span>Time</span>
                        <span className="w-16 text-center">Actions</span>
                      </div>
                    </div>

                    {/* Sleek Modern Track Rows */}
                    {tracks.map((track, idx) => {
                      const isCurrent = track.id === currentTrack.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => playTrackAtIndex(idx)}
                          className={`group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                            isCurrent
                              ? 'bg-[#FA243C]/10 text-zinc-900 dark:text-white ring-1 ring-[#FA243C]/30 shadow-sm'
                              : 'hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {/* Left: Index / Play Icon + Artwork + Title + Artist */}
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div className="w-7 text-center shrink-0 flex items-center justify-center">
                              {isCurrent && isPlaying ? (
                                <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
                                  <span className="w-0.5 bg-[#FA243C] h-3.5 rounded-full animate-pulse" />
                                  <span className="w-0.5 bg-[#FA243C] h-2 rounded-full animate-pulse delay-75" />
                                  <span className="w-0.5 bg-[#FA243C] h-3 rounded-full animate-pulse delay-150" />
                                </div>
                              ) : (
                                <>
                                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 group-hover:hidden">
                                    {idx + 1}
                                  </span>
                                  <Play className="w-3.5 h-3.5 text-zinc-800 dark:text-white fill-current hidden group-hover:block translate-x-0.5" />
                                </>
                              )}
                            </div>

                            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm shrink-0 bg-zinc-800 ring-1 ring-black/5 dark:ring-white/10 group-hover:shadow-md transition-shadow">
                              <img
                                src={track.artworkUrl || FALLBACK_ARTWORK}
                                alt={track.title}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_ARTWORK;
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-3.5 h-3.5 text-white fill-current translate-x-0.5" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold truncate ${
                                  isCurrent ? 'text-[#FA243C]' : 'text-zinc-900 dark:text-white group-hover:text-[#FA243C] transition-colors'
                                }`}>
                                  {track.title}
                                </span>
                                <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {track.format || '320K'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                <span className="hover:text-zinc-900 dark:hover:text-zinc-200">{track.artist}</span>
                                {track.album && (
                                  <>
                                    <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
                                    <span className="truncate hidden sm:inline">{track.album}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Middle: Album Name */}
                          <div className="hidden md:block w-44 lg:w-56 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {track.album}
                          </div>

                          {/* Right: Duration + Actions */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 w-10 text-right">
                              {formatDuration(track.durationMs)}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openVideoStudioForTrack(track)}
                                title="Make Animated Lyric Video (Pro)"
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-purple-500 transition-colors cursor-pointer"
                              >
                                <Video className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAddToQueue(track)}
                                title="Add to Up Next Queue"
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <ListPlus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleSaveOffline(track)}
                                disabled={isDownloadingOfflineId === track.id}
                                title={offlineTrackIds.has(track.id) ? 'Cached Offline (Click to remove)' : 'Save for Offline Zero-Buffering Playback'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  offlineTrackIds.has(track.id)
                                    ? 'text-emerald-500 bg-emerald-500/10'
                                    : 'hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-emerald-500'
                                }`}
                              >
                                {isDownloadingOfflineId === track.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                ) : (
                                  <HardDriveDownload className="w-4 h-4" />
                                )}
                              </button>
                              <a
                                href={`/api/music/download?url=${encodeURIComponent(track.audioUrl)}&name=${encodeURIComponent(
                                  `${track.artist} - ${track.title}`
                                )}`}
                                download
                                title="Download 320kbps MP3"
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors hidden sm:block"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => toggleFavorite(track.id)}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-400 hover:text-[#FA243C] transition-colors cursor-pointer"
                                title={track.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                              >
                                <Heart
                                  className={`w-4 h-4 ${track.isFavorite ? 'fill-[#FA243C] text-[#FA243C]' : ''}`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Downloaded & Offline Tracks Tab View */}
              {activeTab === 'offline' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <HardDriveDownload className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                          Downloaded &amp; Offline Music
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                          ZERO BUFFERING
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {offlineTracks.length} tracks cached on this device &bull; {offlineStorageInfo.formattedSize} storage used (IndexedDB)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {offlineTracks.length > 0 && (
                        <>
                          <button
                            onClick={() => {
                              setTracks([...offlineTracks, ...tracks]);
                              playTrackAtIndex(0);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white font-bold text-xs shadow-md shadow-[#FA243C]/20 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play All Offline</span>
                          </button>
                          <button
                            onClick={handleClearAllOffline}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-100 dark:bg-white/[0.06] hover:bg-rose-500/10 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 text-xs font-semibold border border-zinc-200 dark:border-white/[0.08] transition-all cursor-pointer"
                            title="Delete all cached offline tracks"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear Cache</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {offlineTracks.length === 0 ? (
                    <div className="text-center py-20 text-zinc-400 dark:text-zinc-500 space-y-3 bg-white dark:bg-white/[0.02] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-8">
                      <HardDriveDownload className="w-12 h-12 mx-auto opacity-30 text-emerald-500" />
                      <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Offline Tracks Cached Yet</h4>
                      <p className="text-xs max-w-md mx-auto text-zinc-500">
                        Click the download/hard-drive icon on any track in Search or Browse to store full 320kbps audio files directly on your device. You can then play them anytime, even without an internet connection!
                      </p>
                      <button
                        onClick={() => setContextActiveTab('browse' as any)}
                        className="mt-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.15] text-xs font-semibold text-zinc-800 dark:text-white transition-all cursor-pointer"
                      >
                        Explore Music Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="border border-zinc-200 dark:border-white/[0.08] rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-zinc-200 dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 font-semibold bg-zinc-50/50 dark:bg-transparent">
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            <th className="py-3 px-4">Title &amp; Artist</th>
                            <th className="py-3 px-4 hidden md:table-cell">Album</th>
                            <th className="py-3 px-4 hidden sm:table-cell">Status</th>
                            <th className="py-3 px-4 text-right">Time</th>
                            <th className="py-3 px-4 w-28 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offlineTracks.map((track, idx) => {
                            const isCurrent = currentTrack.id === track.id;
                            return (
                              <tr
                                key={track.id}
                                onClick={() => playDirectTrack(track)}
                                className={`border-b border-zinc-100 dark:border-white/[0.04] hover:bg-zinc-50 dark:hover:bg-white/[0.06] cursor-pointer transition-colors ${
                                  isCurrent ? 'bg-rose-50/60 dark:bg-white/[0.08] text-zinc-900 dark:text-white font-medium' : 'text-zinc-700 dark:text-zinc-300'
                                }`}
                              >
                                <td className="py-3 px-4 text-center text-zinc-400 dark:text-zinc-500">
                                  {isCurrent && isPlaying ? (
                                    <div className="w-3 h-3 mx-auto rounded-full bg-[#FA243C] animate-pulse" />
                                  ) : (
                                    idx + 1
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={track.artworkUrl || FALLBACK_ARTWORK}
                                      alt={track.title}
                                      onError={(e) => {
                                        e.currentTarget.src = FALLBACK_ARTWORK;
                                      }}
                                      className="w-10 h-10 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <div className={`font-semibold truncate ${isCurrent ? 'text-[#FA243C]' : 'text-zinc-900 dark:text-white'}`}>
                                        {track.title}
                                      </div>
                                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{track.artist}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 hidden md:table-cell truncate max-w-[200px]">{track.album}</td>
                                <td className="py-3 px-4 hidden sm:table-cell">
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Cached Offline</span>
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right text-zinc-500 dark:text-zinc-400 font-mono">
                                  {formatDuration(track.durationMs)}
                                </td>
                                <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => playDirectTrack(track)}
                                      className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-300 hover:text-[#FA243C] transition-colors cursor-pointer"
                                      title="Play Track"
                                    >
                                      <Play className="w-4 h-4 fill-current" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleSaveOffline(track)}
                                      className="p-1.5 rounded-full hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                      title="Remove from Offline Storage"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Curated Playlists Tab */}
              {activeTab === 'playlists' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Your Playlists</h3>
                    <button
                      onClick={() => setIsCreatePlaylistModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Playlist</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((pl) => (
                      <div
                        key={pl.id}
                        className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all cursor-pointer group shadow-sm"
                      >
                        <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-900">
                          <img
                            src={pl.coverUrl || FALLBACK_ARTWORK}
                            alt={pl.title}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_ARTWORK;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="font-bold text-base text-zinc-900 dark:text-white">{pl.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{pl.description}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                          <span>{pl.tracks.length} tracks</span>
                          <button
                            onClick={() => {
                              if (pl.tracks.length > 0) {
                                setTracks([...pl.tracks, ...tracks]);
                                playTrackAtIndex(0);
                              }
                            }}
                            className="px-3 py-1 rounded-full bg-[#FA243C] text-white font-semibold text-xs shadow-md shadow-[#FA243C]/20 cursor-pointer"
                          >
                            Play All
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audiophile Equalizer Studio Tab */}
              {activeTab === 'equalizer' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <Sliders className="w-6 h-6 text-[#FA243C]" />
                        <span>Audiophile Equalizer &amp; DSP Studio</span>
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Precision BiquadFilter DSP &bull; 64-Band FFT Spectrum &bull; Lossless Analog Simulation
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AudioVisualizer engine={audioEngineRef.current} isPlaying={isPlaying} barCount={12} height={18} />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        DSP ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Presets Grid */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Acoustic Sound Profiles
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {[
                        'Balanced',
                        'Bass Booster',
                        'Electronic',
                        'Acoustic',
                        'Rock',
                        'Vocal Booster',
                        'Hip Hop',
                        'Chill & Lo-Fi',
                        'Club / Dance',
                      ].map((presetName) => (
                        <button
                          key={presetName}
                          onClick={() => setEqSettings((prev) => ({ ...prev, preset: presetName as any }))}
                          className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                            eqSettings.preset === presetName
                              ? 'bg-gradient-to-br from-[#FA243C] to-orange-600 text-white border-transparent shadow-lg shadow-[#FA243C]/20 scale-[1.02]'
                              : 'bg-white dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-100 dark:hover:bg-white/[0.08]'
                          }`}
                        >
                          <span className="text-[10px] opacity-70">PRESET</span>
                          <span className="text-sm font-extrabold truncate">{presetName}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bass Boost DSP Slider & Gauges */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <span>Low-Frequency Bass Boost DSP</span>
                          <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                            +{Math.round((eqSettings.bassBoostLevel / 100) * 10)} dB Peak
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          120Hz LowShelf analog warmth filter with dynamic resonance control
                        </p>
                      </div>
                      <span className="text-xl font-black font-mono text-zinc-900 dark:text-white">{eqSettings.bassBoostLevel}%</span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={eqSettings.bassBoostLevel}
                      onChange={(e) =>
                        setEqSettings((prev) => ({ ...prev, bassBoostLevel: Number(e.target.value) }))
                      }
                      className="w-full h-2 bg-zinc-200 dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-[#FA243C]"
                    />
                  </div>

                  {/* Playback Speed & Crossfade Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        Playback Speed
                      </label>
                      <div className="flex items-center gap-2">
                        {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setEqSettings((prev) => ({ ...prev, playbackSpeed: spd }))}
                            className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                              eqSettings.playbackSpeed === spd
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-md'
                                : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        Track Crossfade Transition
                      </label>
                      <div className="flex items-center gap-2">
                        {[0, 3, 5, 8].map((sec) => (
                          <button
                            key={sec}
                            onClick={() => setCrossfadeSeconds(sec)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              crossfadeSeconds === sec
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-md'
                                : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                            }`}
                          >
                            {sec === 0 ? 'Off' : `${sec}s`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio & Streaming Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-4">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
                      <Settings className="w-6 h-6 text-[#FA243C]" />
                      <span>Audio &amp; Streaming Preferences</span>
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Configure bitrates, audio caching, hardware integrations and shortcuts
                    </p>
                  </div>

                  {/* Streaming Bitrate Quality */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Streaming Audio Quality</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Select preferred audio streaming resolution and compression
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {streamingQuality === '320k' ? 'Lossless AAC Master' : 'Data Saver'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => setStreamingQuality('320k')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          streamingQuality === '320k'
                            ? 'bg-[#FA243C]/10 border-[#FA243C] text-zinc-900 dark:text-white'
                            : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs text-zinc-900 dark:text-white">320kbps Master (Recommended)</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Full dynamic range, crisp highs &amp; punchy sub-bass</div>
                      </button>

                      <button
                        onClick={() => setStreamingQuality('160k')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          streamingQuality === '160k'
                            ? 'bg-[#FA243C]/10 border-[#FA243C] text-zinc-900 dark:text-white'
                            : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs text-zinc-900 dark:text-white">160kbps High Quality</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Optimized for mobile data savings</div>
                      </button>
                    </div>
                  </div>

                  {/* Keyboard Shortcuts Sheet */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Keyboard Shortcuts</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Play / Pause</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">Space</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Seek &minus;5s / +5s</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">&larr; / &rarr;</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Volume &plusmn;5%</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">&uarr; / &darr;</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Mute Toggle</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">M</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Lyrics Drawer</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">L</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Up Next Queue</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">Q</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04]">
                        <span className="text-zinc-600 dark:text-zinc-400">Fullscreen Player</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">F</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Real-time Synchronized Lyrics & Playing Queue Side Panel */}
        {rightPanelTab && (
          <div className="fixed inset-y-14 right-0 z-40 w-full sm:w-96 border-l border-zinc-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-2xl flex flex-col shadow-2xl text-zinc-900 dark:text-white animate-in slide-in-from-right duration-200">
            {/* Panel Header Switcher */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-white/[0.08] shrink-0">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.06] p-0.5 rounded-xl border border-zinc-200 dark:border-white/[0.06]">
                <button
                  onClick={() => setRightPanelTab('lyrics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === 'lyrics'
                      ? 'bg-[#FA243C] text-white shadow-md'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lyrics</span>
                </button>
                <button
                  onClick={() => setRightPanelTab('queue')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === 'queue'
                      ? 'bg-[#FA243C] text-white shadow-md'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>Queue ({upcomingQueue.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {rightPanelTab === 'lyrics' && (
                  <button
                    onClick={handleExplainLyricsWithAi}
                    disabled={isExplainingLyrics}
                    title="Explain Lyrics Story with AI"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/25 text-xs font-semibold border border-orange-500/30 transition-colors cursor-pointer"
                  >
                    {isExplainingLyrics ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                    <span>AI Story</span>
                  </button>
                )}
                <button
                  onClick={() => setRightPanelTab(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* QUEUE TAB CONTENT */}
            {rightPanelTab === 'queue' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {/* Now Playing card */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                    Now Playing
                  </span>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.05] border border-zinc-200 dark:border-[#FA243C]/30 shadow-sm">
                    <img
                      src={currentTrack.artworkUrl || FALLBACK_ARTWORK}
                      alt={currentTrack.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK_ARTWORK; }}
                      className="w-12 h-12 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{currentTrack.title}</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{currentTrack.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {currentTrack.format || '320kbps Master'}
                        </span>
                        <AudioVisualizer engine={audioEngineRef.current} isPlaying={isPlaying} barCount={6} height={10} />
                      </div>
                    </div>
                    <button
                      onClick={togglePlayPause}
                      className="w-8 h-8 rounded-full bg-[#FA243C] text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
                    </button>
                  </div>
                </div>

                {/* Up Next List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Up Next ({upcomingQueue.length})
                    </span>
                    {upcomingQueue.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleShuffleUpcoming}
                          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                          title="Shuffle Upcoming Tracks"
                        >
                          <Shuffle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleClearUpcoming}
                          className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
                          title="Clear Upcoming Queue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {upcomingQueue.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 space-y-2">
                      <ListMusic className="w-8 h-8 mx-auto opacity-40" />
                      <p className="text-xs">No upcoming tracks in queue.</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-600">
                        {isAutoplayOn ? 'Autoplay radio will find matching tracks when this ends.' : 'Add songs from search or library.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {upcomingQueue.map((track, idx) => (
                        <div
                          key={`${track.id}_${idx}`}
                          className="group flex items-center gap-3 p-2 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.04] transition-colors"
                        >
                          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 w-5 text-center">
                            {idx + 1}
                          </span>
                          <img
                            src={track.artworkUrl || FALLBACK_ARTWORK}
                            alt={track.title}
                            onError={(e) => { e.currentTarget.src = FALLBACK_ARTWORK; }}
                            className="w-9 h-9 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0"
                          />
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => playTrackAtIndex(currentTrackIndex + 1 + idx)}
                          >
                            <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-zinc-900 dark:group-hover:text-white">
                              {track.title}
                            </h5>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{track.artist}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => playTrackAtIndex(currentTrackIndex + 1 + idx)}
                              className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                              title="Play Now"
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                            <button
                              onClick={() => handleRemoveFromUpcoming(idx)}
                              className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-500 dark:text-zinc-400 hover:text-rose-500 cursor-pointer"
                              title="Remove from Queue"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LYRICS TAB CONTENT */}
            {rightPanelTab === 'lyrics' && (
              <>
                {/* AI Meaning Explanation Modal/Drawer if activated */}
                {aiLyricsExplanation && (
                  <div className="p-4 m-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/30 text-xs text-zinc-800 dark:text-zinc-200 overflow-y-auto max-h-48 custom-scrollbar">
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-orange-200 dark:border-orange-500/20">
                      <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>AI Story &amp; Cultural Meaning</span>
                      </span>
                      <button onClick={() => setAiLyricsExplanation(null)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed space-y-2">
                      {aiLyricsExplanation}
                    </div>
                  </div>
                )}

                <div
                  ref={lyricsContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-5 text-center custom-scrollbar"
                >
                  {isLoadingLyrics ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 space-y-2">
                      <div className="w-6 h-6 border-2 border-[#FA243C] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Fetching lyrics from LRCLIB...</span>
                    </div>
                  ) : lyricsData && lyricsData.syncedLyrics.length > 0 ? (
                    lyricsData.syncedLyrics.map((line, idx) => {
                      const isActive = idx === activeLyricIndex;
                      return (
                        <div
                          key={idx}
                          ref={isActive ? activeLyricRef : null}
                          onClick={() => handleSeek(line.timestampMs)}
                          className={`cursor-pointer transition-all duration-300 py-1.5 px-3 rounded-xl ${
                            isActive
                              ? 'text-zinc-900 dark:text-white text-lg font-extrabold scale-105 bg-zinc-100 dark:bg-white/[0.08] shadow-sm'
                              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm font-semibold'
                          }`}
                        >
                          {line.text}
                        </div>
                      );
                    })
                  ) : lyricsData?.plainLyrics ? (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed text-left">
                      {lyricsData.plainLyrics}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 space-y-2">
                      <FileAudio className="w-8 h-8 opacity-40" />
                      <span className="text-xs">No synchronized lyrics available for this track.</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Persistent End-to-End Audiophile Player Bar (100% Full Width Edge-to-Edge) */}
      <div className="fixed bottom-0 inset-x-0 w-full z-40 border-t border-zinc-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#090a10]/95 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] text-zinc-900 dark:text-white transition-all select-none">
        {/* Ambient Subtle Acoustic Aura Glow */}
        <div className="absolute left-1/3 -top-6 w-96 h-10 bg-gradient-to-r from-[#FA243C]/10 via-purple-500/5 to-transparent blur-2xl pointer-events-none" />

        {/* MOBILE COMPACT PLAYER (Screens < sm) */}
        <div className="sm:hidden flex items-center justify-between px-3.5 py-2.5 h-16 gap-3 w-full">
          <div
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            onClick={() => setIsFullscreenPlayer(true)}
          >
            <div className="relative w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] rounded-xl overflow-hidden shadow-sm bg-zinc-800 shrink-0 ring-1 ring-white/10">
              <img
                src={currentTrack.artworkUrl || FALLBACK_ARTWORK}
                alt={currentTrack.title}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_ARTWORK;
                }}
                className="w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] object-cover rounded-xl"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                {currentTrack.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {currentTrack.artist}
                </span>
                <span className="text-[8px] font-mono font-bold text-zinc-400 px-1 py-0.5 rounded bg-white/5 border border-white/10">
                  LOSSLESS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevTrack}
              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white flex items-center justify-center shadow-md shadow-[#FA243C]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Play/Pause"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>
            <button
              onClick={handleNextTrack}
              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Next"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setIsFullscreenPlayer(true)}
              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DESKTOP FULL-WIDTH END-TO-END COCKPIT (Screens >= sm) */}
        <div className="hidden sm:flex items-center justify-between px-5 lg:px-8 py-2 h-20 w-full gap-4">
          {/* Left: Track Details & Artwork */}
          <div className="flex items-center gap-3.5 w-[260px] max-w-[280px] shrink-0 min-w-0">
            <div
              className="relative w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl overflow-hidden shadow-md shadow-black/40 shrink-0 bg-zinc-800 ring-1 ring-white/10 group cursor-pointer"
              onClick={() => setIsFullscreenPlayer(true)}
            >
              <img
                src={currentTrack.artworkUrl || FALLBACK_ARTWORK}
                alt={currentTrack.title}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_ARTWORK;
                }}
                className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <h4
                className="text-sm font-semibold text-zinc-900 dark:text-white truncate cursor-pointer hover:text-[#FA243C] transition-colors leading-tight"
                onClick={() => setIsFullscreenPlayer(true)}
                title={currentTrack.title}
              >
                {currentTrack.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FA243C]" />
                  {currentTrack.format || 'LOSSLESS • 320K'}
                </span>
                {spatialAudioMode !== 'stereo' && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FA243C]/15 text-[#FA243C] border border-[#FA243C]/20 uppercase">
                    {spatialAudioMode === 'stage3d' ? '3D Stage' : 'Binaural'}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-400 hover:text-[#FA243C] transition-colors shrink-0 cursor-pointer"
              title={currentTrack.isFavorite ? 'In Favorites' : 'Add to Favorites'}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-125 ${currentTrack.isFavorite ? 'fill-[#FA243C] text-[#FA243C]' : ''}`} />
            </button>
          </div>

          {/* Center: Playback Controls & Precision Scrubber */}
          <div className="flex flex-col items-center justify-center gap-1.5 flex-1 min-w-[320px] max-w-xl lg:max-w-2xl px-2">
            {/* Playback Action Buttons */}
            <div className="flex items-center gap-4 lg:gap-6">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isShuffle ? 'text-[#FA243C]' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={isShuffle ? 'Shuffle: ON' : 'Shuffle: OFF'}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrevTrack}
                className="p-1.5 text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Previous Track (J)"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md shadow-[#FA243C]/30 transition-all cursor-pointer shrink-0"
                title="Play / Pause (Space)"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                )}
              </button>
              <button
                onClick={handleNextTrack}
                className="p-1.5 text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Next Track (K)"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isRepeat ? 'text-[#FA243C]' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={isRepeat ? 'Repeat: ON' : 'Repeat: OFF'}
              >
                <Repeat className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAutoplayOn(!isAutoplayOn)}
                className={`p-1.5 rounded-full transition-colors hidden md:block cursor-pointer ${
                  isAutoplayOn
                    ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10'
                    : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={isAutoplayOn ? 'Infinite Autoplay Radio: ON' : 'Infinite Autoplay Radio: OFF'}
              >
                <InfinityIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Precision Interactive Timeline Scrubber */}
            <div className="flex items-center gap-3 w-full text-[11px] font-mono select-none group/timeline">
              <span className="w-9 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                {formatDuration(currentTimeMs)}
              </span>
              <div
                className="relative flex-1 h-1 group-hover/timeline:h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full cursor-pointer transition-all duration-150 py-2 -my-2 flex items-center"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleSeek(ratio * (durationMs || 1));
                }}
              >
                <div className="w-full h-full bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-zinc-800 dark:bg-white group-hover/timeline:bg-[#FA243C] rounded-full transition-all duration-75"
                    style={{ width: `${Math.min(100, Math.max(0, (currentTimeMs / (durationMs || 1)) * 100))}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md shadow-black/40 opacity-0 group-hover/timeline:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `calc(${Math.min(100, Math.max(0, (currentTimeMs / (durationMs || 1)) * 100))}% - 6px)` }}
                />
              </div>
              <span className="w-9 text-left tabular-nums text-zinc-500 dark:text-zinc-400">
                {formatDuration(durationMs)}
              </span>
            </div>
          </div>

          {/* Right: Audio Utilities, Spatial, Lyrics, Queue, Volume */}
          <div className="flex items-center gap-1.5 lg:gap-2 shrink-0 justify-end">
            {/* 3D Spatial Audio Stage Toggle */}
            <button
              onClick={() => {
                const nextMode =
                  spatialAudioMode === 'stereo'
                    ? 'stage3d'
                    : spatialAudioMode === 'stage3d'
                    ? 'binaural'
                    : 'stereo';
                setSpatialAudioMode(nextMode);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                spatialAudioMode !== 'stereo'
                  ? 'text-[#FA243C] bg-[#FA243C]/10 border border-[#FA243C]/20 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
              }`}
              title={`Spatial Audio: ${spatialAudioMode === 'stage3d' ? '3D Stage (Active)' : spatialAudioMode === 'binaural' ? 'Binaural (Active)' : 'Stereo (Off)'}`}
            >
              <Headphones className="w-4 h-4" />
            </button>

            {/* Synced Lyrics Toggle Button (Apple Music Glowing Style) */}
            <button
              onClick={() => setRightPanelTab(rightPanelTab === 'lyrics' ? null : 'lyrics')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                rightPanelTab === 'lyrics'
                  ? 'bg-[#FA243C] text-white shadow-sm shadow-[#FA243C]/30'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
              }`}
              title="Synced Lyrics (L)"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Up Next Queue Toggle Button */}
            <button
              onClick={() => setRightPanelTab(rightPanelTab === 'queue' ? null : 'queue')}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                rightPanelTab === 'queue'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
              }`}
              title="Up Next Queue (Q)"
            >
              <ListMusic className="w-4 h-4" />
              {upcomingQueue.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#FA243C] text-[9px] font-bold text-white flex items-center justify-center">
                  {upcomingQueue.length}
                </span>
              )}
            </button>

            {/* Equalizer & Sound FX */}
            <button
              onClick={() => setIsEqualizerOpen(true)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors hidden sm:block cursor-pointer"
              title="Equalizer & Sound FX"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Volume Control with Custom Smooth Bar */}
            <div className="hidden md:flex items-center gap-1.5 group/volume pl-1">
              <button
                onClick={toggleMute}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer p-1"
                title={isMuted ? 'Unmute' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <div
                className="relative w-16 xl:w-20 h-1 group-hover/volume:h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full cursor-pointer transition-all duration-150 py-2 -my-2 flex items-center"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleVolumeChange(val);
                }}
              >
                <div className="w-full h-full bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-zinc-800 dark:bg-white group-hover/volume:bg-[#FA243C] rounded-full transition-all duration-75"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Launch Lyric Video Studio (Pro) */}
            <button
              onClick={() => openVideoStudioForTrack(currentTrack)}
              className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors hidden 2xl:block cursor-pointer"
              title="Create 9:16 / 16:9 Lyric Video (Pro)"
            >
              <Video className="w-4 h-4" />
            </button>

            {/* 1-Click Save Offline Button */}
            <button
              onClick={() => handleToggleSaveOffline(currentTrack)}
              disabled={isDownloadingOfflineId === currentTrack.id}
              className={`p-2 rounded-xl transition-colors hidden 2xl:block cursor-pointer ${
                offlineTrackIds.has(currentTrack.id)
                  ? 'text-emerald-500 bg-emerald-500/10'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-emerald-500'
              }`}
              title={offlineTrackIds.has(currentTrack.id) ? 'Cached Offline' : 'Cache for Offline Playback'}
            >
              {isDownloadingOfflineId === currentTrack.id ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              ) : (
                <HardDriveDownload className="w-4 h-4" />
              )}
            </button>

            {/* Car Mode */}
            <button
              onClick={() => setIsCarModeOpen(true)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-colors hidden 2xl:block cursor-pointer"
              title="Car Mode (Driving Interface)"
            >
              <Car className="w-4 h-4" />
            </button>

            {/* Fullscreen Player Expand */}
            <button
              onClick={() => setIsFullscreenPlayer(true)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Fullscreen Player (F)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sleep Timer Modal */}
      {isSleepTimerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#121216] border border-zinc-200 dark:border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Sleep Timer</h3>
              </div>
              <button onClick={() => setIsSleepTimerModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Music will automatically fade out and pause when the timer completes.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerDuration(mins)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    sleepTimerMinutes === mins
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>

            {sleepTimerMinutes !== null && (
              <button
                onClick={() => setTimerDuration(null)}
                className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel Timer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {isCreatePlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#121216] border border-zinc-200 dark:border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#FA243C]" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">New Playlist</h3>
              </div>
              <button onClick={() => setIsCreatePlaylistModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="e.g. Late Night Coding, Gym Bangers"
                  className="w-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-300 dark:border-white/[0.12] rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#FA243C] placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="What's this mix about?"
                  className="w-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-300 dark:border-white/[0.12] rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#FA243C] placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistTitle.trim()}
              className="w-full py-2.5 rounded-xl bg-[#FA243C] hover:bg-[#ff3b50] text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              Create Playlist
            </button>
          </div>
        </div>
      )}

      {/* YouTube Official Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl space-y-4 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                  Official Music Video &bull; {currentTrack.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    setIsVideoFloating(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.15] text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  title="Minimize to Floating Video (PiP)"
                >
                  <Tv className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span>Mini Player</span>
                </button>
                <button onClick={() => setIsVideoModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="aspect-video w-full bg-black flex items-center justify-center">
              {isLoadingVideo ? (
                <div className="flex flex-col items-center gap-2 text-zinc-400 text-xs">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  <span>Searching official music video on YouTube...</span>
                </div>
              ) : youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1`}
                  title={currentTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="text-zinc-500 text-xs">No official music video found for this track.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Mini Video Player (Picture-in-Picture - Desktop only, never blocks mobile) */}
      {isVideoFloating && youtubeVideoId && (
        <div className="hidden md:block fixed bottom-28 right-6 z-40 w-80 rounded-2xl overflow-hidden shadow-2xl border border-zinc-300 dark:border-white/20 bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <Video className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[11px] font-bold text-zinc-900 dark:text-white truncate max-w-[170px]">
                {currentTrack.title}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setIsVideoFloating(false);
                  setIsVideoModalOpen(true);
                }}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                title="Expand to Full Video"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsVideoFloating(false);
                  setYoutubeVideoId(null);
                }}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                title="Close Video"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1`}
              title={currentTrack.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Equalizer & Audio FX Modal */}
      {isEqualizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#121216] border border-zinc-200 dark:border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-6 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Audiophile Equalizer</h3>
              </div>
              <button
                onClick={() => setIsEqualizerOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Sound Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'Balanced',
                  'Bass Booster',
                  'Electronic',
                  'Acoustic',
                  'Rock',
                  'Vocal Booster',
                  'Hip Hop',
                  'Chill & Lo-Fi',
                  'Club / Dance',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setEqSettings((prev) => ({ ...prev, preset: preset as any }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      eqSettings.preset === preset
                        ? 'bg-[#FA243C] text-white border-[#FA243C]'
                        : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Bass Boost Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Bass Boost DSP</span>
                <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">{eqSettings.bassBoostLevel}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={eqSettings.bassBoostLevel}
                onChange={(e) =>
                  setEqSettings((prev) => ({ ...prev, bassBoostLevel: Number(e.target.value) }))
                }
                className="w-full h-1.5 bg-zinc-200 dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Playback Speed
              </label>
              <div className="flex items-center gap-2">
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setEqSettings((prev) => ({ ...prev, playbackSpeed: spd }))}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      eqSettings.playbackSpeed === spd
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent'
                        : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsEqualizerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-white/[0.1] dark:hover:bg-white/[0.15] dark:text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Player Modal with Real-time Spectrum Visualizer */}
      {isFullscreenPlayer && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#070709] p-6 md:p-8 overflow-hidden select-none">
          {/* Ambient blurred glow */}
          {currentTrack.artworkUrl && (
            <div
              className="absolute inset-0 pointer-events-none opacity-30 filter blur-[140px] scale-150 -z-10"
              style={{
                backgroundImage: `url(${currentTrack.artworkUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
          )}

          {/* Top Bar */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                RIIQX Ultra Audio
              </span>
              <AudioVisualizer engine={audioEngineRef.current} isPlaying={isPlaying} barCount={20} height={16} />
            </div>
            <button
              onClick={() => setIsFullscreenPlayer(false)}
              className="p-2 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center Stage */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto w-full my-auto">
            {/* Spinning Artwork Vinyl */}
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/[0.1] group bg-zinc-900 shrink-0">
              <img
                src={currentTrack.artworkUrl || FALLBACK_ARTWORK}
                alt={currentTrack.title}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_ARTWORK;
                }}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>

            {/* Lyrics or Track Details */}
            <div className="flex-1 max-w-md w-full space-y-5 md:space-y-6 text-center md:text-left">
              <div>
                <span className="text-xs font-bold text-[#FA243C] uppercase tracking-wider">
                  {currentTrack.album}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1 truncate">
                  {currentTrack.title}
                </h2>
                <p className="text-base md:text-lg text-zinc-400 font-medium mt-1 truncate">{currentTrack.artist}</p>
              </div>

              {/* Scrubber */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={durationMs || 1}
                  value={currentTimeMs}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/[0.15] rounded-lg appearance-none cursor-pointer accent-[#FA243C]"
                />
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>{formatDuration(currentTimeMs)}</span>
                  <span>{formatDuration(durationMs)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center md:justify-start gap-6">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 transition-colors ${
                    isShuffle ? 'text-[#FA243C]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                <button onClick={handlePrevTrack} className="text-white hover:text-zinc-300">
                  <SkipBack className="w-7 h-7 fill-current" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  )}
                </button>
                <button onClick={handleNextTrack} className="text-white hover:text-zinc-300">
                  <SkipForward className="w-7 h-7 fill-current" />
                </button>
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-2 transition-colors ${
                    isRepeat ? 'text-[#FA243C]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Car Mode / Distraction-Free Driver Cockpit Modal (Apple CarPlay & Spotify Hybrid) */}
      {isCarModeOpen && (
        <div className="fixed inset-0 z-50 bg-[#050508]/98 backdrop-blur-3xl flex flex-col justify-between overflow-hidden p-4 sm:p-6 md:p-8 text-white select-none animate-in fade-in duration-200">
          {/* Dynamic Ambient Blur Glow from Album Art */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 filter blur-3xl scale-125 transition-all duration-700"
            style={{
              backgroundImage: `url(${currentTrack.artworkUrl || FALLBACK_ARTWORK})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#050508]/70 via-[#050508]/90 to-[#050508]" />

          {/* Top HUD Bar */}
          <div className="relative z-10 h-14 shrink-0 flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-3">
              <RiiqxLogo size="sm" variant="icon" animated={true} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-heading">
                    CAR MODE
                  </h2>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/15">
                    320K LOSSLESS
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Driver Cockpit HUD &bull; Audiophile DSP Engine
                </p>
              </div>
            </div>

            {/* Center Live Cockpit Clock */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-mono font-bold text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-[#FA243C] animate-pulse" />
              <span>{carClockTime}</span>
            </div>

            <button
              onClick={() => setIsCarModeOpen(false)}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-white/[0.1] hover:bg-white/[0.18] active:scale-95 border border-white/[0.15] text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" />
              <span>Exit Car Mode</span>
            </button>
          </div>

          {/* Center Stage: Hero Track & Giant Tactile Transport */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-4 w-full max-w-4xl mx-auto min-h-0 overflow-y-auto no-scrollbar">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 w-full">
              {/* Artwork & Spectrum Visualizer */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/15">
                    <img
                      src={currentTrack.artworkUrl || FALLBACK_ARTWORK}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-[#FA243C] text-white font-bold text-[10px] shadow-lg uppercase tracking-wider">
                    MASTER AUDIO
                  </div>
                </div>

                {/* Real-Time Spectrum Visualizer */}
                <div className="mt-3 flex items-center justify-center">
                  <AudioVisualizer engine={audioEngineRef.current} isPlaying={isPlaying} barCount={16} height={16} />
                </div>
              </div>

              {/* Track Metadata, Scrubber & Giant Controls */}
              <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-6 w-full max-w-lg md:max-w-none">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-heading truncate">
                    {currentTrack.title}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-zinc-300 font-semibold mt-1 truncate">
                    {currentTrack.artist}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate">
                    {currentTrack.album}
                  </p>
                </div>

                {/* Safe Scrub Line */}
                <div className="space-y-1.5">
                  <div
                    className="w-full h-3 sm:h-3.5 bg-white/[0.1] rounded-full overflow-hidden cursor-pointer relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      handleSeek(ratio * durationMs);
                    }}
                  >
                    <div
                      className="h-full bg-[#FA243C] rounded-full transition-all duration-150"
                      style={{ width: `${(currentTimeMs / (durationMs || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-400 px-1">
                    <span>{formatDuration(currentTimeMs)}</span>
                    <span>{formatDuration(durationMs)}</span>
                  </div>
                </div>

                {/* Giant Safe-Touch Primary Controls */}
                <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-4 lg:gap-5 pt-1">
                  {/* -10s */}
                  <button
                    onClick={() => handleSeek(Math.max(0, currentTimeMs - 10000))}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 border border-white/[0.1] flex items-center justify-center text-white text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
                    title="Rewind 10s"
                  >
                    -10s
                  </button>

                  {/* Prev */}
                  <button
                    onClick={handlePrevTrack}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.1] hover:bg-white/[0.18] active:scale-95 border border-white/[0.15] flex items-center justify-center text-white transition-all cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                  </button>

                  {/* Massive Play/Pause Circle */}
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-[#FA243C]/30 transition-all cursor-pointer shrink-0"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                    )}
                  </button>

                  {/* Next */}
                  <button
                    onClick={handleNextTrack}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.1] hover:bg-white/[0.18] active:scale-95 border border-white/[0.15] flex items-center justify-center text-white transition-all cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                  </button>

                  {/* +10s */}
                  <button
                    onClick={() => handleSeek(Math.min(durationMs, currentTimeMs + 10000))}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 border border-white/[0.1] flex items-center justify-center text-white text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
                    title="Forward 10s"
                  >
                    +10s
                  </button>

                  {/* Heart Favorite */}
                  <button
                    onClick={() => toggleFavorite(currentTrack.id)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 border border-white/[0.1] flex items-center justify-center transition-all cursor-pointer"
                    title="Favorite"
                  >
                    <Heart
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        currentTrack.isFavorite ? 'text-[#FA243C] fill-current' : 'text-zinc-300'
                      }`}
                    />
                  </button>

                  {/* AI Voice Copilot */}
                  <button
                    onClick={toggleVoiceAssistant}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isVoiceListening
                        ? 'bg-[#FA243C]/20 text-[#FA243C] border-[#FA243C] ring-4 ring-[#FA243C]/20'
                        : 'bg-white/[0.08] hover:bg-white/[0.15] border-white/[0.1] text-zinc-300'
                    }`}
                    title="Voice Copilot"
                  >
                    {isVoiceListening ? (
                      <AIThinkingOrb state="listening" size={22} neuralActivity={false} />
                    ) : (
                      <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Vehicle Preset Stations Bar */}
          <div className="relative z-10 shrink-0 border-t border-white/[0.08] pt-3 pb-1 w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                PRESET STATIONS (P1 - P5)
              </span>
              <span className="text-[10px] text-zinc-400 font-mono font-medium">1-TAP SWITCH</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {STATIONS.map((station, idx) => {
                const isCurrent = activeStation?.id === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => handleSelectStation(station)}
                    className={`h-11 sm:h-12 px-3 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                      isCurrent
                        ? 'bg-[#FA243C] text-white shadow-md shadow-[#FA243C]/20 border border-[#FA243C]'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center text-[10px] font-mono text-zinc-300 shrink-0">
                      P{idx + 1}
                    </span>
                    <span className="truncate">{station.emoji} {station.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
