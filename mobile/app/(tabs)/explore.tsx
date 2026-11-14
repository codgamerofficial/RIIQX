// =============================================================================
// RIIQX Mobile 2.0 — Explore Screen (12 Curated Moods & Occasions)
// 2-Column Rounded Atmospheric Category Tiles • One-Tap Instant Playback
// Matches User Design Screenshot 2 Exactly
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRiiqxAudio } from '../../src/context/RiiqxAudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;

interface ExploreCategory {
  title: string;
  subtitle: string;
  bgColor: string;
  query: string;
}

const EXPLORE_MOODS: ExploreCategory[] = [
  { title: 'Chill', subtitle: 'Coffee Shop\nBlend', bgColor: '#4A6B82', query: 'lofi chill coffee' },
  { title: 'Commute', subtitle: 'Feel-Good\nHip Hop', bgColor: '#C28B1E', query: 'drake hip hop drive' },
  { title: 'Diwali', subtitle: 'Bollywood Party', bgColor: '#4A4642', query: 'bollywood party dance' },
  { title: 'Energize', subtitle: 'pump-up\npop', bgColor: '#8D7B27', query: 'workout pop energy' },
  { title: 'Feel good', subtitle: 'Sunshine\nIndie', bgColor: '#3A6A47', query: 'feel good acoustic' },
  { title: 'Focus', subtitle: 'Lofi Loft', bgColor: '#424850', query: 'study focus lofi' },
  { title: 'Gaming', subtitle: 'Gaming Hits', bgColor: '#2E3844', query: 'electronic gaming beats' },
  { title: 'Party', subtitle: 'Bollywood\nDance', bgColor: '#693A9A', query: 'bhangra party dance' },
  { title: 'Romance', subtitle: 'Bollywood\nRomantic', bgColor: '#9E242B', query: 'romantic soulful love' },
  { title: 'Sad', subtitle: 'Bollywood\nMelancholy', bgColor: '#2C2F35', query: 'sad acoustic melancholy' },
  { title: 'African', subtitle: 'Afrobeats & Heat', bgColor: '#543D28', query: 'afrobeats dancehall' },
  { title: 'Arabic', subtitle: 'Khaleeji & Pop', bgColor: '#6A5623', query: 'arabic modern pop' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { tracks, playTrack } = useRiiqxAudio();

  const handleSelectMood = (mood: ExploreCategory, index: number) => {
    const selectedTrack = tracks[index % tracks.length];
    if (selectedTrack) {
      playTrack(selectedTrack);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Explore</Text>

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
        {/* 2-Column Grid of Mood Tiles (Screenshot 2) */}
        <View style={styles.gridContainer}>
          {EXPLORE_MOODS.map((item, idx) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.moodCard, { backgroundColor: item.bgColor }]}
              activeOpacity={0.88}
              onPress={() => handleSelectMood(item, idx)}
            >
              <Text style={styles.moodTitle}>{item.title}</Text>
              <Text style={styles.moodSubtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 170, // Space for mini player and bottom tab dock
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodCard: {
    width: CARD_WIDTH,
    height: 100,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  moodTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  moodSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
  },
});

