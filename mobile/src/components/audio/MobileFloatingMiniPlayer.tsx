// =============================================================================
// RIIQX Mobile 2.0 — Floating Audiophile Mini Player Dock
// Persistent Pill Dock • Apple Music / RiMusic Native Hybrid • Zero Jank
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqxAudio } from '../../context/RiiqxAudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function MobileFloatingMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    nextTrack,
    setIsFullscreenOpen,
  } = useRiiqxAudio();

  if (!currentTrack) return null;

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.92}
        onPress={() => setIsFullscreenOpen(true)}
      >
        {/* Left: Square Album Artwork */}
        <View style={styles.artContainer}>
          <Image
            source={{ uri: currentTrack.artworkUrl }}
            style={styles.artwork}
          />
        </View>

        {/* Center: Track Title & Artist */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        {/* Right: Play/Pause & Next Button */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e: any) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e: any) => {
              e.stopPropagation();
              nextTrack();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name="play-skip-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 84, // Directly above the floating bottom dock
    left: 12,
    right: 12,
    zIndex: 40,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 24, 0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  artContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E24',
    marginRight: 12,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  artist: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 4,
  },
  controlButton: {
    padding: 4,
  },
});
