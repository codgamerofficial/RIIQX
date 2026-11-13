// =============================================================================
// RIIQX Mobile 2.0 — Library Screen (Playlists • Favorites • Offline Downloads)
// High-Fidelity Lossless Collection • Native Offline Synchronization
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxAudio } from '../../src/context/RiiqxAudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LibraryScreen() {
  const router = useRouter();
  const { tracks, playTrack, currentTrack, toggleFavorite } = useRiiqxAudio();
  const [activeTab, setActiveTab] = useState<'Playlists' | 'Favorites' | 'Downloads'>('Favorites');

  const favoriteTracks = tracks.filter((t) => t.isFavorite);
  const displayedTracks = activeTab === 'Favorites' ? (favoriteTracks.length > 0 ? favoriteTracks : tracks) : tracks;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Library</Text>

        <TouchableOpacity
          style={styles.avatarGlowContainer}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>QX</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Library Subtabs: Favorites • Playlists • Downloads */}
      <View style={styles.tabsRow}>
        {(['Favorites', 'Playlists', 'Downloads'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabPillText, isActive && styles.tabPillTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.countRow}>
          <Text style={styles.countText}>{displayedTracks.length} items</Text>
        </View>

        <View style={styles.trackList}>
          {displayedTracks.map((track) => {
            const isCurrent = currentTrack.id === track.id;
            return (
              <TouchableOpacity
                key={track.id}
                style={styles.trackRow}
                activeOpacity={0.7}
                onPress={() => playTrack(track)}
              >
                <Image source={{ uri: track.artworkUrl }} style={styles.trackThumbnail} />

                <View style={styles.trackInfo}>
                  <Text
                    style={[styles.trackTitle, isCurrent && { color: '#FA243C' }]}
                    numberOfLines={1}
                  >
                    {track.title}
                  </Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>
                    {track.artist} &bull; {track.album}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={(e: any) => {
                    e.stopPropagation();
                    toggleFavorite(track.id);
                  }}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons
                    name={track.isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={track.isFavorite ? '#FA243C' : '#71717A'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  avatarGlowContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 2,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F43F5E',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#18181C',
  },
  tabPillActive: {
    backgroundColor: '#353540',
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 170, // Space for mini player and bottom tab dock
  },
  countRow: {
    paddingVertical: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
  },
  trackList: {
    gap: 14,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1E1E24',
    marginRight: 14,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  trackArtist: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 8,
  },
});
