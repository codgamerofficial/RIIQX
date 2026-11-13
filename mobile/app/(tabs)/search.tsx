// =============================================================================
// RIIQX Mobile 2.0 — Search Screen (Universal Audiophile Finder)
// Unified Query Bar • YouTube/Library/Addons Chips • Recent Searches
// Matches User Design Screenshot 3 Exactly
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxAudio, RecentSearchItem } from '../../src/context/RiiqxAudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const {
    tracks,
    playTrack,
    recentSearches,
    clearRecentSearches,
    removeRecentSearch,
    activeFilterTab,
    setActiveFilterTab,
  } = useRiiqxAudio();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectRecent = (item: RecentSearchItem) => {
    // Find matching or closest track
    const found = tracks.find((t) => t.title.toLowerCase().includes(item.title.toLowerCase()));
    if (found) {
      playTrack(found);
    } else if (tracks[0]) {
      playTrack(tracks[0]);
    }
  };

  const filteredRecents = searchQuery.trim()
    ? recentSearches.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentSearches;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Search Input Row + Glowing QX Avatar (Screenshot 3) */}
      <View style={styles.headerRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Artists, Songs, Lyrics and More"
            placeholderTextColor="#71717A"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color="#71717A" />
            </TouchableOpacity>
          )}
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

      {/* Filter Tabs Row: YouTube • Library • Addons (Screenshot 3) */}
      <View style={styles.filterPillsRow}>
        {(['YouTube', 'Library', 'Addons'] as const).map((tab) => {
          const isActive = activeFilterTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setActiveFilterTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && styles.filterPillTextActive,
                ]}
              >
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
        {/* Recent Searches Section Header with Clear Button */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent searches</Text>
          {recentSearches.length > 0 && (
            <TouchableOpacity onPress={clearRecentSearches} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List of Recent Searches (Screenshot 3) */}
        <View style={styles.recentsList}>
          {filteredRecents.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.searchRowItem}
              activeOpacity={0.7}
              onPress={() => handleSelectRecent(item)}
            >
              <Image
                source={{ uri: item.artworkUrl || 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg' }}
                style={styles.searchThumb}
              />

              <View style={styles.searchInfo}>
                <Text style={styles.searchTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.searchSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={(e: any) => {
                  e.stopPropagation();
                  removeRecentSearch(item.id);
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close" size={16} color="#71717A" />
              </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181C',
    borderRadius: 24,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
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
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C22',
  },
  filterPillActive: {
    backgroundColor: '#383842',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 170, // Space for floating mini player and bottom dock
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  recentsList: {
    gap: 16,
  },
  searchRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1E1E24',
    marginRight: 14,
  },
  searchInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  searchSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
});
