// =============================================================================
// RIIQX Mobile 2.0 — Home Screen (Master Stream Hub)
// Top Picks For You Carousel • Circular Multi-Artist Avatars • Recents Feed
// Matches User Design Screenshot 1 Exactly
// Infrastructure Guarantee: ₹0/mo FREE TIER • Gemini 2.5 Flash • Groq Qwen 27B
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
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxAudio, MobileTrack } from '../../src/context/RiiqxAudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { tracks, playTrack, currentTrack, toggleFavorite } = useRiiqxAudio();

  const handleCardPress = (trackIndex: number) => {
    if (tracks[trackIndex]) {
      playTrack(tracks[trackIndex]);
    }
  };

  const handleTrackOptions = (track: MobileTrack) => {
    Alert.alert(
      track.title,
      `${track.artist} • ${track.album}`,
      [
        {
          text: 'Play Track',
          onPress: () => playTrack(track),
        },
        {
          text: track.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
          onPress: () => toggleFavorite(track.id),
        },
        {
          text: 'Audio Info: 320kbps Master',
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const STATIONS = [
    { id: 'punjabi', title: 'Punjabi Wave', emoji: '⚡', subtitle: 'High energy beats', color: '#B45309', trackIdx: 4 },
    { id: 'bollywood', title: 'Bollywood Romance', emoji: '🇮🇳', subtitle: 'Soulful melodies', color: '#BE123C', trackIdx: 0 },
    { id: 'bengali', title: 'Bengali Melodies', emoji: '🎵', subtitle: 'Folk & acoustic warmth', color: '#047857', trackIdx: 1 },
    { id: 'lofi', title: 'Lo-Fi Chill & Study', emoji: '☕', subtitle: 'Deep focus beats', color: '#4338CA', trackIdx: 1 },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" backgroundColor="#000000" />

      {/* Top Header: 3-Wave Brand Mark + Glowing QX Avatar (Screenshot 1) */}
      <View style={styles.headerRow}>
        <View style={styles.brandIconContainer}>
          {/* RIIQX 3-Wave Brand Logo Icon */}
          <View style={styles.waveBar1} />
          <View style={styles.waveBar2} />
          <View style={styles.waveBar3} />
        </View>

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Top Picks for You (Screenshot 1) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Top Picks for You</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            snapToInterval={SCREEN_WIDTH * 0.72 + 14}
            decelerationRate="fast"
          >
            {/* Card 0: Anime / Lofi Card (Peek on Left) */}
            <TouchableOpacity
              style={[styles.heroCard, styles.animeCard]}
              activeOpacity={0.9}
              onPress={() => handleCardPress(1)}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80' }}
                style={styles.animeBackdrop}
              />
              <View style={styles.animeOverlay} />
              <View style={styles.cardTopRow}>
                <View style={styles.miniWaveContainer}>
                  <View style={[styles.miniWaveBar, { width: 14 }]} />
                  <View style={[styles.miniWaveBar, { width: 10 }]} />
                  <View style={[styles.miniWaveBar, { width: 16 }]} />
                </View>
              </View>
              <View>
                <Text style={styles.cardSubtitle}>Anime &amp; Lofi Chill</Text>
                <Text style={styles.cardTitle}>Late Night Flow</Text>
              </View>
            </TouchableOpacity>

            {/* Card 1: Featuring Arijit Singh & Similar Artists (Center Orange Card - Screenshot 1) */}
            <TouchableOpacity
              style={[styles.heroCard, styles.arijitCard]}
              activeOpacity={0.9}
              onPress={() => handleCardPress(0)}
            >
              <View style={styles.cardTopRow}>
                <View />
                {/* 3-Wave Logo on Top Right */}
                <View style={styles.miniWaveContainer}>
                  <View style={[styles.miniWaveBar, { width: 16 }]} />
                  <View style={[styles.miniWaveBar, { width: 12 }]} />
                  <View style={[styles.miniWaveBar, { width: 18 }]} />
                </View>
              </View>

              {/* Multi-Artist Circular Cutouts (Screenshot 1) */}
              <View style={styles.artistsCluster}>
                <View style={styles.bigArtistCircle}>
                  <Image
                    source={{ uri: 'https://c.saavncdn.com/192/1920-Evil-Returns-Hindi-2012-20221203061214-500x500.jpg' }}
                    style={styles.circleImage}
                  />
                </View>
                <View style={styles.smallArtistsRow}>
                  <View style={styles.smallArtistCircle}>
                    <Image
                      source={{ uri: 'https://c.saavncdn.com/955/Tinka-Lofi-Flip-Hindi-2023-20230509170258-500x500.jpg' }}
                      style={styles.circleImage}
                    />
                  </View>
                  <View style={styles.smallArtistCircle}>
                    <Image
                      source={{ uri: 'https://c.saavncdn.com/712/Zulfein-Hindi-2023-20230810143809-500x500.jpg' }}
                      style={styles.circleImage}
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.cardSubtitle}>Featuring Arijit Singh</Text>
                <Text style={styles.cardTitle}>Arijit Singh &amp; Similar Artists</Text>
              </View>
            </TouchableOpacity>

            {/* Card 2: New Release Mix (Deep Purple Card - Screenshot 1) */}
            <TouchableOpacity
              style={[styles.heroCard, styles.purpleCard]}
              activeOpacity={0.9}
              onPress={() => handleCardPress(4)}
            >
              <View style={styles.cardTopRow}>
                <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />
                <View style={styles.miniWaveContainer}>
                  <View style={[styles.miniWaveBar, { width: 16 }]} />
                  <View style={[styles.miniWaveBar, { width: 12 }]} />
                  <View style={[styles.miniWaveBar, { width: 18 }]} />
                </View>
              </View>

              <View style={styles.newReleaseTextCenter}>
                <Text style={styles.newReleaseBigHeading}>
                  New{'\n'}Release{'\n'}Mix
                </Text>
              </View>

              <View>
                <Text style={styles.cardSubtitle}>Made for you</Text>
                <Text style={styles.cardTitle}>New Releases</Text>
                <Text style={styles.cardArtistList} numberOfLines={1}>
                  Hiten, KITTU, Arijit, Karan Aujla
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Section: Curated Stations & Vibes (Screenshot 1 parity) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Curated Stations &amp; Vibes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stationsScrollContainer}
          >
            {STATIONS.map((station) => (
              <TouchableOpacity
                key={station.id}
                style={[styles.stationCard, { backgroundColor: station.color }]}
                activeOpacity={0.85}
                onPress={() => handleCardPress(station.trackIdx)}
              >
                <View style={styles.stationTopRow}>
                  <Text style={styles.stationEmoji}>{station.emoji}</Text>
                  <View style={styles.playDot}>
                    <Ionicons name="play" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <View>
                  <Text style={styles.stationTitle}>{station.title}</Text>
                  <Text style={styles.stationSubtitle}>{station.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section: Recents (Screenshot 1) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Recents</Text>

          <View style={styles.recentsList}>
            {tracks.map((track) => {
              const isCurrent = currentTrack.id === track.id;
              return (
                <TouchableOpacity
                  key={track.id}
                  style={styles.recentItemRow}
                  activeOpacity={0.7}
                  onPress={() => playTrack(track)}
                >
                  <Image
                    source={{ uri: track.artworkUrl }}
                    style={styles.recentThumbnail}
                  />

                  <View style={styles.recentItemInfo}>
                    <Text
                      style={[
                        styles.recentItemTitle,
                        isCurrent && { color: '#FA243C' },
                      ]}
                      numberOfLines={1}
                    >
                      {track.title}
                    </Text>
                    <Text style={styles.recentItemArtist} numberOfLines={1}>
                      {track.artist}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.moreOptionsButton}
                    onPress={(e: any) => {
                      e.stopPropagation();
                      handleTrackOptions(track);
                    }}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons name="ellipsis-vertical" size={16} color="#71717A" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
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
    paddingBottom: 16,
  },
  brandIconContainer: {
    gap: 4,
    paddingVertical: 2,
  },
  waveBar1: {
    width: 24,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-8deg' }],
  },
  waveBar2: {
    width: 28,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  waveBar3: {
    width: 22,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '8deg' }],
  },
  avatarGlowContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 2,
    backgroundColor: '#4C1D95', // Deep purple-blue border glow
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 170, // Space for floating mini player and bottom dock
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  carouselContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  heroCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 295,
    borderRadius: 28,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  arijitCard: {
    backgroundColor: '#DC5E12', // Warm vibrant orange from Screenshot 1
  },
  purpleCard: {
    backgroundColor: '#371A45', // Deep purple/magenta from Screenshot 1
  },
  animeCard: {
    backgroundColor: '#1E1B2E',
    position: 'relative',
  },
  animeBackdrop: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  animeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniWaveContainer: {
    gap: 2.5,
    alignItems: 'flex-end',
  },
  miniWaveBar: {
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  artistsCluster: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
  },
  bigArtistCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  smallArtistsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallArtistCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  newReleaseTextCenter: {
    marginVertical: 'auto',
  },
  newReleaseBigHeading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardArtistList: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  recentsList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  stationsScrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  stationCard: {
    width: 140,
    height: 100,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'space-between',
  },
  stationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationEmoji: {
    fontSize: 22,
  },
  playDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  stationSubtitle: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  recentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1E1E24',
    marginRight: 14,
  },
  recentItemInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  recentItemArtist: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 3,
  },
  moreOptionsButton: {
    padding: 8,
  },
});
