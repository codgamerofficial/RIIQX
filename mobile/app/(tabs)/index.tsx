// =============================================================================
// RIIQX Mobile 2.0 — Master Audio & Agentic OS Command Center
// High-Fidelity 320kbps Music Streaming • Real-time Catalog Search • AI DJ Studio
// Deep Obsidian Aesthetic #0C0C0E • Crimson #FA243C • Primary Yellow #FFD43B
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { getApiBaseUrl } from '../../src/services/api';
import {
  getOfflineTracks,
  downloadTrackToDevice,
  deleteOfflineTrack,
  isTrackOffline,
  getOfflineStorageInfo,
  OfflineTrackMetadata,
} from '../../src/services/offlineStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MobileTrack {
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

const FALLBACK_ARTWORK =
  'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg';

const INITIAL_MOBILE_TRACKS: MobileTrack[] = [
  {
    id: 'saavn_lahore',
    title: 'Lahore',
    artist: 'Guru Randhawa',
    album: 'Lahore - Single',
    durationMs: 197000,
    audioUrl: 'https://aac.saavncdn.com/437/a5bf59099a04ed7c10681a1aabfa5ea2_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
    year: 2017,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'saavn_high_rated_gabru',
    title: 'High Rated Gabru',
    artist: 'Guru Randhawa',
    album: 'High Rated Gabru - Single',
    durationMs: 214000,
    audioUrl: 'https://aac.saavncdn.com/344/4e7a96829b1ab444247a2a8db16673a8_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/344/High-Rated-Gabru-Punjabi-2017-500x500.jpg',
    year: 2017,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'saavn_paris',
    title: 'PARIS',
    artist: 'Gurjit Gill, Verse',
    album: 'PARIS',
    durationMs: 119000,
    audioUrl: 'https://aac.saavncdn.com/900/498f71ceaf0a2f974c39fb1f9f1da3ad_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
    year: 2026,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
  {
    id: 'saavn_kesariya',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Arijit Singh Best Songs',
    durationMs: 268000,
    audioUrl: 'https://aac.saavncdn.com/423/852ad6cc81d7733c5e9bfc46d7b063e2_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/423/Arijit-Singh-All-Time-Best-Hindi-Hit-Love-Songs-Collection-Hindi-2026-20261008160834-500x500.jpg',
    year: 2026,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'saavn_ishare_tere',
    title: 'Ishare Tere',
    artist: 'Guru Randhawa & Dhvani Bhanushali',
    album: 'Ishare Tere',
    durationMs: 189000,
    audioUrl: 'https://aac.saavncdn.com/161/a58eb8752d5b6296df2a4ecb3f07be89_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/161/Ishare-Tere-Punjabi-2018-20180724123848-500x500.jpg',
    year: 2018,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
];

const MOBILE_STATIONS = [
  { id: 'punjabi', name: 'Punjabi Wave', emoji: '⚡', query: 'Guru Randhawa Diljit Dosanjh', color: '#FA243C' },
  { id: 'bollywood', name: 'Bollywood Romance', emoji: '🇮🇳', query: 'Arijit Singh Kesariya', color: '#F59E0B' },
  { id: 'lofi', name: 'Lo-Fi Chill & Study', emoji: '☕', query: 'Lofi Beats Chillhop', color: '#8B5CF6' },
  { id: 'gym', name: 'Gym & High BPM', emoji: '🏋️', query: 'Workout Electronic Bass', color: '#10B981' },
  { id: 'synth', name: 'Midnight Synthwave', emoji: '🌌', query: 'Retro Synthwave Neon', color: '#06B6D4' },
];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function MobileHomeScreen() {
  const router = useRouter();
  const {
    sendMessage,
    isGenerating,
    refreshAll,
    dashboardMetrics,
  } = useRiiqxMobile();

  // Music Player State
  const [tracks, setTracks] = useState<MobileTrack[]>(INITIAL_MOBILE_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(INITIAL_MOBILE_TRACKS[0].durationMs);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<MobileTrack[]>([]);

  // UI Modals & Navigation
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [fullscreenPlayerOpen, setFullscreenPlayerOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeStation, setActiveStation] = useState<string | null>(null);

  // Offline Caching & Cloud Sync & Car Mode State
  const [offlineTracks, setOfflineTracks] = useState<OfflineTrackMetadata[]>([]);
  const [offlineTrackIds, setOfflineTrackIds] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [offlineStorageInfo, setOfflineStorageInfo] = useState<{ count: number; formattedSize: string }>({ count: 0, formattedSize: '0 MB' });
  const [showOfflineOnly, setShowOfflineOnly] = useState<boolean>(false);
  const [carModeOpen, setCarModeOpen] = useState<boolean>(false);

  // Audio References: Native Expo Sound for Android/iOS background & Web Audio fallback
  const soundRef = useRef<Audio.Sound | null>(null);
  const webAudioRef = useRef<any>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Configure Native Background Audio Mode (Spotify/Apple Music grade background playback)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      }).catch((err) => {
        console.warn('Expo Audio background mode configuration error:', err);
      });
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      if (webAudioRef.current) {
        webAudioRef.current.pause();
      }
    };
  }, []);

  // Load trending tracks from API on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const baseUrl = getApiBaseUrl().replace('/api', '');
        const res = await fetch(`${baseUrl}/api/music/trending`);
        if (res.ok) {
          const data = await res.json();
          if (data.tracks && data.tracks.length > 0) {
            setTracks((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const newTracks = data.tracks.filter((t: MobileTrack) => !existingIds.has(t.id));
              return [...prev, ...newTracks];
            });
          }
        }
      } catch {}
    };
    fetchTrending();
  }, []);

  // Native Offline Tracks & Cloud Sync Initialization
  useEffect(() => {
    const loadOffline = async () => {
      try {
        const off = await getOfflineTracks();
        setOfflineTracks(off);
        setOfflineTrackIds(new Set(off.map((t) => t.id)));
        const info = await getOfflineStorageInfo();
        setOfflineStorageInfo({ count: info.count, formattedSize: info.formattedSize });
      } catch (e) {
        console.warn('Failed to load offline tracks:', e);
      }
    };
    loadOffline();

    const syncWithCloud = async () => {
      try {
        const baseUrl = getApiBaseUrl().replace('/api', '');
        const res = await fetch(`${baseUrl}/api/music/sync`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.favorites && Array.isArray(data.data.favorites)) {
            const favSet = new Set(data.data.favorites);
            setTracks((prev) =>
              prev.map((t) => (favSet.has(t.id) ? { ...t, isFavorite: true } : t))
            );
          }
        }
      } catch {}
    };
    syncWithCloud();
  }, []);

  // Download / Delete Track for 100% Offline Playback
  const handleDownloadTrack = async (track: MobileTrack) => {
    if (offlineTrackIds.has(track.id)) {
      await deleteOfflineTrack(track.id);
      setOfflineTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(track.id);
        return next;
      });
      const updated = await getOfflineTracks();
      setOfflineTracks(updated);
      const info = await getOfflineStorageInfo();
      setOfflineStorageInfo({ count: info.count, formattedSize: info.formattedSize });
    } else {
      try {
        setDownloadingId(track.id);
        setDownloadProgress(0);
        await downloadTrackToDevice(track, (prog) => setDownloadProgress(prog));
        setOfflineTrackIds((prev) => new Set([...prev, track.id]));
        const updated = await getOfflineTracks();
        setOfflineTracks(updated);
        const info = await getOfflineStorageInfo();
        setOfflineStorageInfo({ count: info.count, formattedSize: info.formattedSize });
      } catch (err) {
        console.warn('Download error:', err);
      } finally {
        setDownloadingId(null);
      }
    }
  };

  // Toggle Favorite with Cloud Sync
  const toggleFavoriteTrack = (trackId: string) => {
    setTracks((prev) => {
      const updated = prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t));
      const favIds = updated.filter((t) => t.isFavorite).map((t) => t.id);
      try {
        const baseUrl = getApiBaseUrl().replace('/api', '');
        fetch(`${baseUrl}/api/music/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorites: favIds }),
        }).catch(() => {});
      } catch {}
      return updated;
    });
  };

  // Playback status listener for Expo AV
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentTimeMs(status.positionMillis);
      if (status.durationMillis && !isNaN(status.durationMillis) && status.durationMillis > 0) {
        setDurationMs(status.durationMillis);
      }
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        handleNextTrack();
      }
    }
  };

  // Central master track player: plays full-length 320k audio with background playback & offline priority
  const loadAndPlayTrack = async (track: MobileTrack) => {
    const local = offlineTracks.find((o) => o.id === track.id);
    const audioUri = local ? local.localAudioUri : track.audioUrl;

    if (Platform.OS !== 'web') {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
      } catch (err) {
        console.warn('Native Audio play failed, falling back to simulated timer:', err);
      }
    } else if (typeof window !== 'undefined' && (window as any).Audio) {
      if (!webAudioRef.current) {
        const audio = new (window as any).Audio();
        audio.setAttribute('playsinline', 'true');
        audio.setAttribute('webkit-playsinline', 'true');
        audio.ontimeupdate = () => setCurrentTimeMs(audio.currentTime * 1000);
        audio.onloadedmetadata = () => {
          if (audio.duration && isFinite(audio.duration)) {
            setDurationMs(audio.duration * 1000);
          }
        };
        audio.onended = () => handleNextTrack();
        webAudioRef.current = audio;
      }
      webAudioRef.current.src = track.audioUrl;
      webAudioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const togglePlayPause = async () => {
    if (Platform.OS !== 'web' && soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
          return;
        }
      } catch (e) {
        console.warn('Toggle play error:', e);
      }
    }
    if (Platform.OS === 'web' && webAudioRef.current) {
      if (isPlaying) {
        webAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        webAudioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const playTrackAtIndex = (index: number) => {
    const target = tracks[index];
    if (!target) return;
    setCurrentTrackIndex(index);
    setCurrentTimeMs(0);
    setDurationMs(target.durationMs);
    loadAndPlayTrack(target);
  };

  const playDirectTrack = (track: MobileTrack) => {
    const existingIndex = tracks.findIndex((t) => t.id === track.id);
    if (existingIndex >= 0) {
      playTrackAtIndex(existingIndex);
    } else {
      setTracks([track, ...tracks]);
      setCurrentTrackIndex(0);
      setCurrentTimeMs(0);
      setDurationMs(track.durationMs);
      loadAndPlayTrack(track);
    }
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * tracks.length);
      playTrackAtIndex(randIdx);
    } else {
      const nextIdx = (currentTrackIndex + 1) % tracks.length;
      playTrackAtIndex(nextIdx);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrackAtIndex(prevIdx);
  };

  // Live Catalog Search
  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const baseUrl = getApiBaseUrl().replace('/api', '');
      const res = await fetch(`${baseUrl}/api/music/search?q=${encodeURIComponent(text.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tracks) {
          setSearchResults(data.tracks);
        }
      }
    } catch {
      // Local fallback
      const filtered = tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(text.toLowerCase()) ||
          t.artist.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setTimeout(() => setRefreshing(false), 500);
  };

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Global Command Bar */}
      <View style={styles.topGlobalBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconSquare}>
            <Ionicons name="musical-notes" size={16} color="#FFFFFF" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.brandTitle}>RIIQX</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO 320K</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>Audiophile Lossless Streamer</Text>
          </View>
        </View>

        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={styles.iconCircleButton}
            onPress={() => router.push('/(tabs)/chat' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={14} color="#FFD43B" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircleButton}
            onPress={() => router.push('/(tabs)/settings' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={14} color="#A1A1AA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Interactive Music Scroll Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FA243C" />}
      >
        {/* Global Live Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#71717A" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search millions of 320kbps songs, artists..."
            placeholderTextColor="#71717A"
            style={styles.searchInput}
          />
          {isSearching ? (
            <ActivityIndicator size="small" color="#FA243C" style={{ marginRight: 8 }} />
          ) : hasSearchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color="#71717A" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* SEARCH RESULTS VIEW */}
        {hasSearchQuery ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Results for <Text style={{ color: '#FA243C' }}>"{searchQuery}"</Text>
              </Text>
              <Text style={styles.sectionCount}>{searchResults.length} tracks</Text>
            </View>

            {searchResults.length > 0 ? (
              searchResults.map((track, idx) => {
                const isCurrent = currentTrack.title === track.title;
                return (
                  <TouchableOpacity
                    key={track.id || idx}
                    style={[styles.trackRow, isCurrent && styles.trackRowActive]}
                    onPress={() => playDirectTrack(track)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: track.artworkUrl || FALLBACK_ARTWORK }}
                      style={styles.trackThumb}
                    />
                    <View style={styles.trackInfo}>
                      <Text
                        style={[styles.trackTitle, isCurrent && { color: '#FA243C' }]}
                        numberOfLines={1}
                      >
                        {track.title}
                      </Text>
                      <Text style={styles.trackArtist} numberOfLines={1}>
                        {track.artist}
                      </Text>
                      <View style={styles.bitratePill}>
                        <Text style={styles.bitratePillText}>{track.format || '320kbps Master'}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.rowPlayButton}
                      onPress={() => playDirectTrack(track)}
                    >
                      <Ionicons
                        name={isCurrent && isPlaying ? 'pause' : 'play'}
                        size={14}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="musical-note" size={36} color="#3F3F46" />
                <Text style={styles.emptyText}>No tracks found for "{searchQuery}".</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* HERO NOW PLAYING CARD */}
            <View style={styles.heroCard}>
              <View style={styles.heroArtworkContainer}>
                <Image
                  source={{ uri: currentTrack.artworkUrl || FALLBACK_ARTWORK }}
                  style={styles.heroArtwork}
                />
                <TouchableOpacity
                  style={styles.heroPlayOverlay}
                  onPress={togglePlayPause}
                  activeOpacity={0.8}
                >
                  <View style={styles.heroBigPlayButton}>
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={24}
                      color="#FFFFFF"
                      style={!isPlaying ? { marginLeft: 2 } : {}}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.heroContent}>
                <View style={styles.nowStreamingRow}>
                  <View style={styles.liveRedDot} />
                  <Text style={styles.nowStreamingText}>NOW STREAMING MASTER 320K</Text>
                </View>

                <Text style={styles.heroTitle} numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.heroArtist} numberOfLines={1}>
                  {currentTrack.artist} • {currentTrack.album}
                </Text>

                {/* Progress Bar & Counter */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(
                            100,
                            (currentTimeMs / (durationMs || 1)) * 100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.timeCounterRow}>
                    <Text style={styles.timeText}>{formatTime(currentTimeMs)}</Text>
                    <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
                  </View>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.heroActionsRow}>
                  <TouchableOpacity
                    style={styles.heroActionBtn}
                    onPress={() => setFullscreenPlayerOpen(true)}
                  >
                    <Ionicons name="expand" size={14} color="#FFFFFF" />
                    <Text style={styles.heroActionBtnText}>Full</Text>
                  </TouchableOpacity>

                  {/* 1-Click Native Offline Download Button */}
                  <TouchableOpacity
                    style={[
                      styles.heroActionBtn,
                      offlineTrackIds.has(currentTrack.id) && { borderColor: '#10B981', backgroundColor: '#10B98120' },
                    ]}
                    onPress={() => handleDownloadTrack(currentTrack)}
                  >
                    {downloadingId === currentTrack.id ? (
                      <ActivityIndicator size="small" color="#10B981" />
                    ) : (
                      <Ionicons
                        name={offlineTrackIds.has(currentTrack.id) ? 'checkmark-circle' : 'cloud-download-outline'}
                        size={14}
                        color={offlineTrackIds.has(currentTrack.id) ? '#10B981' : '#FFFFFF'}
                      />
                    )}
                    <Text
                      style={[
                        styles.heroActionBtnText,
                        offlineTrackIds.has(currentTrack.id) && { color: '#10B981', fontWeight: '800' },
                      ]}
                    >
                      {offlineTrackIds.has(currentTrack.id) ? 'Saved' : 'Save'}
                    </Text>
                  </TouchableOpacity>

                  {/* Car Mode Driver Launch */}
                  <TouchableOpacity
                    style={[styles.heroActionBtn, { borderColor: '#F59E0B40', backgroundColor: '#F59E0B15' }]}
                    onPress={() => setCarModeOpen(true)}
                  >
                    <Ionicons name="car-sport" size={14} color="#F59E0B" />
                    <Text style={[styles.heroActionBtnText, { color: '#F59E0B' }]}>Car Mode</Text>
                  </TouchableOpacity>

                  {/* Cloud Synced Favorite Toggle */}
                  <TouchableOpacity
                    style={styles.heroActionBtn}
                    onPress={() => toggleFavoriteTrack(currentTrack.id)}
                  >
                    <Ionicons
                      name={currentTrack.isFavorite ? 'heart' : 'heart-outline'}
                      size={14}
                      color={currentTrack.isFavorite ? '#FA243C' : '#FFFFFF'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Offline vs All Tracks Toggle Pills */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setShowOfflineOnly(false)}
                style={[styles.filterPill, !showOfflineOnly && styles.filterPillActive]}
              >
                <Ionicons name="disc" size={13} color={!showOfflineOnly ? '#FFFFFF' : '#71717A'} />
                <Text style={[styles.filterPillText, !showOfflineOnly && styles.filterPillTextActive]}>
                  All Tracks ({tracks.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowOfflineOnly(true)}
                style={[styles.filterPill, showOfflineOnly && { backgroundColor: '#10B981', borderColor: '#10B981' }]}
              >
                <Ionicons name="cloud-offline" size={13} color={showOfflineOnly ? '#FFFFFF' : '#10B981'} />
                <Text style={[styles.filterPillText, showOfflineOnly && { color: '#FFFFFF', fontWeight: '800' }]}>
                  Offline Saved ({offlineTracks.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* CURATED STATIONS & VIBES */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="radio" size={16} color="#FA243C" />
                  <Text style={styles.sectionTitle}>Curated Stations &amp; Vibes</Text>
                </View>
                <Text style={styles.sectionCount}>Instant 320k Radio</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
              >
                {MOBILE_STATIONS.map((station) => (
                  <TouchableOpacity
                    key={station.id}
                    style={[
                      styles.stationCard,
                      { borderColor: station.color },
                      activeStation === station.id && { backgroundColor: `${station.color}22` },
                    ]}
                    onPress={() => {
                      setActiveStation(station.id);
                      handleSearch(station.query);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.stationEmoji}>{station.emoji}</Text>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationTag}>Tap to tune in</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* HEAVY ROTATION & TRENDING HITS */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="flame" size={16} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>Heavy Rotation &amp; Trending Hits</Text>
                </View>
                <Text style={styles.sectionCount}>Verified 320k</Text>
              </View>

              {tracks.map((track, idx) => {
                const isCurrent = currentTrack.id === track.id;
                return (
                  <TouchableOpacity
                    key={track.id || idx}
                    style={[styles.trackRow, isCurrent && styles.trackRowActive]}
                    onPress={() => playTrackAtIndex(idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.trackIndexText}>{idx + 1}</Text>
                    <Image
                      source={{ uri: track.artworkUrl || FALLBACK_ARTWORK }}
                      style={styles.trackThumb}
                    />
                    <View style={styles.trackInfo}>
                      <Text
                        style={[styles.trackTitle, isCurrent && { color: '#FA243C' }]}
                        numberOfLines={1}
                      >
                        {track.title}
                      </Text>
                      <Text style={styles.trackArtist} numberOfLines={1}>
                        {track.artist}
                      </Text>
                    </View>
                    <Text style={styles.durationText}>{formatTime(track.durationMs)}</Text>
                    <TouchableOpacity
                      style={styles.rowPlayButton}
                      onPress={() => playTrackAtIndex(idx)}
                    >
                      <Ionicons
                        name={isCurrent && isPlaying ? 'pause' : 'play'}
                        size={14}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* RIIQX AUTONOMOUS OS ENGINE CORE (Zero-Fabrication & Free-Tier Parity) */}
            <View style={styles.engineCard}>
              <View style={styles.engineHeader}>
                <Ionicons name="hardware-chip" size={16} color="#FFD43B" />
                <Text style={styles.engineTitle}>RIIQX AI CORE &bull; ₹0/mo FREE TIER</Text>
              </View>
              <Text style={styles.engineDesc}>
                Active models: Gemini 2.5 Flash, Groq Qwen 27B, AWS Bedrock. Autonomous music copilot,
                multimodal creator tools, and offline caching active.
              </Text>
              <View style={styles.engineActions}>
                <TouchableOpacity
                  style={styles.engineBtn}
                  onPress={() => router.push('/(tabs)/creator' as any)}
                >
                  <Text style={styles.engineBtnText}>Creator Studio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.engineBtn}
                  onPress={() => router.push('/(tabs)/autopilot' as any)}
                >
                  <Text style={styles.engineBtnText}>Autopilot</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.engineBtn}
                  onPress={() => router.push('/(tabs)/tasks' as any)}
                >
                  <Text style={styles.engineBtnText}>Tasks</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* DOCKED BOTTOM MINI-PLAYER */}
      <TouchableOpacity
        style={styles.bottomDockedPlayer}
        onPress={() => setFullscreenPlayerOpen(true)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: currentTrack.artworkUrl || FALLBACK_ARTWORK }}
          style={styles.dockedThumb}
        />
        <View style={styles.dockedInfo}>
          <Text style={styles.dockedTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.dockedArtist} numberOfLines={1}>
            {currentTrack.artist} • 320K Lossless
          </Text>
        </View>

        <View style={styles.dockedControls}>
          <TouchableOpacity onPress={handlePrevTrack} style={styles.dockedControlBtn}>
            <Ionicons name="play-skip-back" size={16} color="#A1A1AA" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={togglePlayPause}
            style={styles.dockedPlayBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={18}
              color="#FFFFFF"
              style={!isPlaying ? { marginLeft: 2 } : {}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextTrack} style={styles.dockedControlBtn}>
            <Ionicons name="play-skip-forward" size={16} color="#A1A1AA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCarModeOpen(true)} style={styles.dockedControlBtn}>
            <Ionicons name="car-sport" size={16} color="#F59E0B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* FULLSCREEN PLAYER & SYNCHRONIZED LYRICS MODAL */}
      <Modal
        visible={fullscreenPlayerOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setFullscreenPlayerOpen(false)}
      >
        <SafeAreaView style={styles.fullscreenModal}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setFullscreenPlayerOpen(false)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.modalHeaderTag}>PLAYING FROM CATALOG</Text>
              <Text style={styles.modalHeaderAlbum} numberOfLines={1}>
                {currentTrack.album}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/chat' as any)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="sparkles" size={18} color="#FFD43B" />
            </TouchableOpacity>
          </View>

          {/* Modal Artwork */}
          <View style={styles.modalArtworkContainer}>
            <Image
              source={{ uri: currentTrack.artworkUrl || FALLBACK_ARTWORK }}
              style={styles.modalArtwork}
            />
          </View>

          {/* Modal Metadata */}
          <View style={styles.modalMetaContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTrackTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.modalTrackArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <View style={styles.modalBitratePill}>
              <Text style={styles.modalBitrateText}>320K MASTER</Text>
            </View>
          </View>

          {/* Modal Progress Slider */}
          <View style={styles.modalProgressContainer}>
            <View style={styles.modalProgressTrack}>
              <View
                style={[
                  styles.modalProgressFill,
                  {
                    width: `${Math.min(
                      100,
                      (currentTimeMs / (durationMs || 1)) * 100
                    )}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.modalTimeRow}>
              <Text style={styles.modalTimeText}>{formatTime(currentTimeMs)}</Text>
              <Text style={styles.modalTimeText}>{formatTime(durationMs)}</Text>
            </View>
          </View>

          {/* Modal Transport Controls */}
          <View style={styles.modalTransport}>
            <TouchableOpacity
              onPress={() => setIsShuffle(!isShuffle)}
              style={styles.modalTransportBtn}
            >
              <Ionicons
                name="shuffle"
                size={22}
                color={isShuffle ? '#FA243C' : '#71717A'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePrevTrack} style={styles.modalTransportBtn}>
              <Ionicons name="play-skip-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.modalMainPlayBtn}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#FFFFFF"
                style={!isPlaying ? { marginLeft: 3 } : {}}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNextTrack} style={styles.modalTransportBtn}>
              <Ionicons name="play-skip-forward" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsRepeat(!isRepeat)}
              style={styles.modalTransportBtn}
            >
              <Ionicons
                name="repeat"
                size={22}
                color={isRepeat ? '#FA243C' : '#71717A'}
              />
            </TouchableOpacity>
          </View>

          {/* Modal Bottom Utility Bar: Offline Save, Car Mode, Favorite */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)' }}>
            <TouchableOpacity
              onPress={() => handleDownloadTrack(currentTrack)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Ionicons
                name={offlineTrackIds.has(currentTrack.id) ? 'checkmark-circle' : 'cloud-download-outline'}
                size={18}
                color={offlineTrackIds.has(currentTrack.id) ? '#10B981' : '#A1A1AA'}
              />
              <Text style={{ color: offlineTrackIds.has(currentTrack.id) ? '#10B981' : '#A1A1AA', fontSize: 12, fontWeight: '700' }}>
                {offlineTrackIds.has(currentTrack.id) ? 'Saved' : 'Download'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFullscreenPlayerOpen(false);
                setCarModeOpen(true);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Ionicons name="car-sport" size={18} color="#F59E0B" />
              <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: '700' }}>Car Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFavoriteTrack(currentTrack.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Ionicons
                name={currentTrack.isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={currentTrack.isFavorite ? '#FA243C' : '#A1A1AA'}
              />
              <Text style={{ color: currentTrack.isFavorite ? '#FA243C' : '#A1A1AA', fontSize: 12, fontWeight: '700' }}>
                Favorite
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* CAR MODE / DISTRACTION-FREE DRIVER COCKPIT MODAL */}
      <Modal
        visible={carModeOpen}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setCarModeOpen(false)}
      >
        <SafeAreaView style={styles.carModeContainer}>
          {/* Top Bar */}
          <View style={styles.carModeHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.carModeIcon}>
                <Ionicons name="car-sport" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.carModeTitle}>CAR & DRIVER MODE</Text>
                <Text style={styles.carModeSubtitle}>Safe Touch • 320k Master Stream</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setCarModeOpen(false)}
              style={styles.carModeExitBtn}
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
              <Text style={styles.carModeExitText}>Exit</Text>
            </TouchableOpacity>
          </View>

          {/* Center Content */}
          <View style={styles.carModeCenter}>
            <Image
              source={{ uri: currentTrack.artworkUrl || FALLBACK_ARTWORK }}
              style={styles.carArtwork}
            />
            <Text style={styles.carTrackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.carTrackArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>

            {/* Safe Touch Progress Line */}
            <View style={{ width: '85%', marginTop: 14 }}>
              <View style={{ width: '100%', height: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    backgroundColor: '#F59E0B',
                    width: `${Math.min(100, (currentTimeMs / (durationMs || 1)) * 100)}%`,
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ color: '#A1A1AA', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                  {formatTime(currentTimeMs)}
                </Text>
                <Text style={{ color: '#A1A1AA', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                  {formatTime(durationMs)}
                </Text>
              </View>
            </View>

            {/* Giant Safe Controls */}
            <View style={styles.carControlsRow}>
              <TouchableOpacity
                onPress={() => {
                  const target = Math.max(0, currentTimeMs - 10000);
                  setCurrentTimeMs(target);
                  if (Platform.OS !== 'web' && soundRef.current) {
                    soundRef.current.setPositionAsync(target).catch(() => {});
                  }
                }}
                style={styles.carSmallBtn}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '900' }}>-10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePrevTrack}
                style={styles.carSecondaryBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="play-skip-back" size={26} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={togglePlayPause}
                style={styles.carMainPlayBtn}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={42}
                  color="#FFFFFF"
                  style={!isPlaying ? { marginLeft: 4 } : {}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextTrack}
                style={styles.carSecondaryBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="play-skip-forward" size={26} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const target = Math.min(durationMs, currentTimeMs + 10000);
                  setCurrentTimeMs(target);
                  if (Platform.OS !== 'web' && soundRef.current) {
                    soundRef.current.setPositionAsync(target).catch(() => {});
                  }
                }}
                style={styles.carSmallBtn}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '900' }}>+10s</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Stations Row */}
          <View style={styles.carStationsRow}>
            {MOBILE_STATIONS.map((station) => (
              <TouchableOpacity
                key={station.id}
                onPress={() => {
                  handleSearch(station.query);
                  setActiveStation(station.id);
                }}
                style={[
                  styles.carStationPill,
                  activeStation === station.id && { backgroundColor: station.color },
                ]}
              >
                <Text style={styles.carStationText}>
                  {station.emoji} {station.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  topGlobalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0C0C0E',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  brandIconSquare: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FA243C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FA243C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  proBadge: {
    backgroundColor: 'rgba(250, 36, 60, 0.15)',
    borderColor: 'rgba(250, 36, 60, 0.3)',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FA243C',
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '500',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    padding: 14,
    gap: 12,
  },
  heroArtworkContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#18181B',
    position: 'relative',
  },
  heroArtwork: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBigPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FA243C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FA243C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  heroContent: {
    gap: 6,
  },
  nowStreamingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FA243C',
  },
  nowStreamingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FA243C',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroArtist: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 6,
    gap: 4,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FA243C',
    borderRadius: 2,
  },
  timeCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#71717A',
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  heroActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingVertical: 8,
  },
  heroActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionCount: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '600',
  },
  stationCard: {
    width: 130,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    gap: 4,
  },
  stationEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  stationName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stationTag: {
    fontSize: 9,
    color: '#A1A1AA',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
    marginBottom: 6,
  },
  trackRowActive: {
    backgroundColor: 'rgba(250, 36, 60, 0.12)',
    borderColor: 'rgba(250, 36, 60, 0.3)',
  },
  trackIndexText: {
    width: 18,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#71717A',
  },
  trackThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#18181B',
  },
  trackInfo: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trackArtist: {
    fontSize: 11,
    color: '#A1A1AA',
  },
  bitratePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
  },
  bitratePillText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#10B981',
  },
  durationText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#71717A',
  },
  rowPlayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FA243C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#71717A',
  },
  engineCard: {
    backgroundColor: 'rgba(255, 212, 59, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 212, 59, 0.15)',
    padding: 14,
    gap: 8,
    marginTop: 10,
  },
  engineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  engineTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFD43B',
    letterSpacing: 0.5,
  },
  engineDesc: {
    fontSize: 11,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  engineActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  engineBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  engineBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomDockedPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#121216',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dockedThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#18181B',
  },
  dockedInfo: {
    flex: 1,
    gap: 2,
  },
  dockedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dockedArtist: {
    fontSize: 11,
    color: '#A1A1AA',
  },
  dockedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dockedControlBtn: {
    padding: 6,
  },
  dockedPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FA243C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    padding: 20,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 1,
  },
  modalHeaderAlbum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  modalArtworkContainer: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_WIDTH - 60,
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FA243C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    backgroundColor: '#18181B',
  },
  modalArtwork: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTrackTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalTrackArtist: {
    fontSize: 14,
    color: '#A1A1AA',
    fontWeight: '600',
    marginTop: 4,
  },
  modalBitratePill: {
    backgroundColor: 'rgba(250, 36, 60, 0.15)',
    borderColor: 'rgba(250, 36, 60, 0.3)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalBitrateText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FA243C',
  },
  modalProgressContainer: {
    gap: 6,
  },
  modalProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#FA243C',
    borderRadius: 3,
  },
  modalTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTimeText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#71717A',
  },
  modalTransport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  modalTransportBtn: {
    padding: 10,
  },
  modalMainPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FA243C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FA243C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  carModeContainer: {
    flex: 1,
    backgroundColor: '#060608',
    justifyContent: 'space-between',
    padding: 24,
  },
  carModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  carModeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carModeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  carModeSubtitle: {
    fontSize: 11,
    color: '#A1A1AA',
    marginTop: 2,
  },
  carModeExitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  carModeExitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  carModeCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  carArtwork: {
    width: Math.min(SCREEN_WIDTH - 100, 240),
    height: Math.min(SCREEN_WIDTH - 100, 240),
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    marginBottom: 16,
  },
  carTrackTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '90%',
  },
  carTrackArtist: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 4,
    textAlign: 'center',
    width: '90%',
  },
  carControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 20,
  },
  carSecondaryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carSmallBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carMainPlayBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FA243C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FA243C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  carStationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  carStationPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  carStationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterPillActive: {
    backgroundColor: '#FA243C',
    borderColor: '#FA243C',
  },
  filterPillText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
