// =============================================================================
// RIIQX Mobile 2.0 — Fullscreen Audiophile Player Modal
// Deep Crimson Ambient Blur • Synced Lyrics • High Quality Badge • Apple Music Immersion
// Matches User Design Screenshot 4 Exactly
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqxAudio } from '../../context/RiiqxAudioContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function MobileFullscreenPlayerModal() {
  const {
    currentTrack,
    isPlaying,
    currentTimeMs,
    durationMs,
    volume,
    setVolume,
    isFullscreenOpen,
    setIsFullscreenOpen,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    toggleFavorite,
  } = useRiiqxAudio();

  const [showFullLyrics, setShowFullLyrics] = useState(false);

  if (!currentTrack) return null;

  const progressRatio = Math.min(1, Math.max(0, currentTimeMs / (durationMs || 1)));
  const remainingMs = Math.max(0, durationMs - currentTimeMs);

  return (
    <Modal
      visible={isFullscreenOpen}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setIsFullscreenOpen(false)}
    >
      <View style={styles.container}>
        {/* Dynamic Ambient Background Blur */}
        <Image
          source={{ uri: currentTrack.artworkUrl }}
          style={styles.ambientBackdrop}
          blurRadius={60}
        />
        <View style={styles.backdropOverlay} />

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Top Bar: Drag indicator + Center Label + Minimize */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => setIsFullscreenOpen(false)}
            >
              <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topBarCenter}>
              <View style={styles.dragPill} />
              <Text style={styles.recordLabel} numberOfLines={1}>
                {currentTrack.album || 'BEATOP RECORDS'}
              </Text>
              <Text style={styles.playingFromText}>Playing from Search</Text>
            </View>

            <View style={styles.topBarSpacer} />
          </View>

          {/* Large Hero Artwork */}
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: currentTrack.artworkUrl }}
              style={styles.heroArtwork}
            />
          </View>

          {/* Track Info & Actions (Favorite Star, 3-dots) */}
          <View style={styles.metaRow}>
            <View style={styles.metaTextContainer}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>

            <View style={styles.metaActionsRow}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => toggleFavorite(currentTrack.id)}
              >
                <Ionicons
                  name={currentTrack.isFavorite ? 'star' : 'star-outline'}
                  size={18}
                  color={currentTrack.isFavorite ? '#F59E0B' : '#FFFFFF'}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Synced Lyrics Snippet Preview Bar */}
          <TouchableOpacity
            style={styles.lyricsPill}
            onPress={() => setShowFullLyrics(!showFullLyrics)}
            activeOpacity={0.8}
          >
            <Text style={styles.lyricsText} numberOfLines={1}>
              तेरे गालों पे बिखरी हैं ज़ुल्फ़ें बनके बादल
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Timeline Scrubber */}
          <View style={styles.scrubberContainer}>
            <View style={styles.scrubberTrack}>
              <View style={[styles.scrubberFill, { width: `${progressRatio * 100}%` }]} />
              <View style={[styles.scrubberThumb, { left: `${progressRatio * 100}%` }]} />
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatDuration(currentTimeMs)}</Text>
              <View style={styles.audioBadgePill}>
                <Ionicons name="headset-outline" size={10} color="#E5E7EB" style={{ marginRight: 3 }} />
                <Text style={styles.audioBadgeText}>High quality</Text>
              </View>
              <Text style={styles.timeText}>-{formatDuration(remainingMs)}</Text>
            </View>
          </View>

          {/* Playback Controls (Previous, Large Play/Pause, Next) */}
          <View style={styles.transportRow}>
            <TouchableOpacity
              style={styles.transportButton}
              onPress={prevTrack}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playPauseCircle}
              onPress={togglePlayPause}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#000000"
                style={!isPlaying ? { marginLeft: 3 } : {}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.transportButton}
              onPress={nextTrack}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-forward" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Volume Slider Bar */}
          <View style={styles.volumeRow}>
            <Ionicons name="volume-low-outline" size={16} color="#9CA3AF" />
            <View style={styles.volumeTrack}>
              <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
            </View>
            <Ionicons name="volume-high-outline" size={16} color="#9CA3AF" />
          </View>

          {/* Bottom Actions Bar (Lyrics, Cast, Queue) & Device Name */}
          <View style={styles.bottomBarContainer}>
            <View style={styles.bottomIconsRow}>
              <TouchableOpacity style={styles.bottomIconBtn}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#D1D5DB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomIconBtn}>
                <Ionicons name="tv-outline" size={20} color="#D1D5DB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomIconBtn}>
                <Ionicons name="list-outline" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            <Text style={styles.deviceNameText}>RIIQX's Phone</Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E0A10', // Deep crimson fallback
  },
  ambientBackdrop: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: SCREEN_WIDTH + 100,
    height: SCREEN_HEIGHT + 100,
    opacity: 0.75,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 4, 8, 0.72)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  topBarButton: {
    padding: 6,
  },
  topBarCenter: {
    alignItems: 'center',
  },
  dragPill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 8,
  },
  recordLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  playingFromText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  topBarSpacer: {
    width: 36,
  },
  artworkContainer: {
    width: SCREEN_WIDTH - 44,
    height: SCREEN_WIDTH - 44,
    maxHeight: SCREEN_HEIGHT * 0.42,
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E0508',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 20,
    marginVertical: 10,
  },
  heroArtwork: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  trackArtist: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 3,
  },
  metaActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lyricsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 10,
  },
  lyricsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F3F4F6',
    flex: 1,
    marginRight: 8,
  },
  scrubberContainer: {
    width: '100%',
    marginVertical: 4,
  },
  scrubberTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  scrubberFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  scrubberThumb: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginLeft: -5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  audioBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  audioBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
    marginVertical: 8,
  },
  transportButton: {
    padding: 8,
  },
  playPauseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    marginVertical: 6,
  },
  volumeTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bottomBarContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  bottomIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 6,
  },
  bottomIconBtn: {
    padding: 6,
  },
  deviceNameText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
  },
});
