// =============================================================================
// RIIQX Mobile 2.0 — Audiophile Settings & Quality Configuration Screen
// Lossless Streaming • Dolby Atmos Spatial Engine • Direct Source Stream
// Matches User Design Screenshot 5 Exactly
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxAudio } from '../../src/context/RiiqxAudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const {
    directSourceStream,
    setDirectSourceStream,
    dolbyAtmos,
    setDolbyAtmos,
    wifiQuality,
    mobileDataQuality,
  } = useRiiqxAudio();

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Row with Back Button (Screenshot 5) */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButtonCircle}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.screenHeading}>Settings</Text>

      {/* Search Settings Input (Screenshot 5) */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={16} color="#71717A" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search settings"
          placeholderTextColor="#71717A"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account & Integrations Card Group (Screenshot 5) */}
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemAvatarBadge}>
              <Text style={styles.itemAvatarText}>QX</Text>
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Account &amp; integrations</Text>
              <Text style={styles.itemSubtitle}>@riiqxstudio</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="people-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Listen together</Text>
              <Text style={styles.itemSubtitle}>
                Share a code and play the same music, in time
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#71717A" />
          </TouchableOpacity>
        </View>

        {/* AUDIO QUALITY Section (Screenshot 5) */}
        <Text style={styles.sectionHeaderTitle}>AUDIO QUALITY</Text>

        <View style={styles.cardGroup}>
          {/* Sources */}
          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="extension-puzzle-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Sources</Text>
              <Text style={styles.itemSubtitle}>
                Where audio comes from and the order used
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          {/* Direct Source Stream Toggle */}
          <View style={styles.listItemRow}>
            <View style={styles.itemTextContainerNoIcon}>
              <Text style={styles.itemTitle}>Direct Source Stream</Text>
            </View>
            <Switch
              value={directSourceStream}
              onValueChange={setDirectSourceStream}
              trackColor={{ false: '#27272A', true: '#22C55E' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.itemDivider} />

          {/* On Wi-Fi Quality */}
          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="wifi-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>On Wi-Fi</Text>
            </View>
            <View style={styles.rightValueRow}>
              <Text style={styles.rightValueText}>{wifiQuality}</Text>
              <Ionicons name="chevron-forward" size={16} color="#71717A" />
            </View>
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          {/* On Mobile Data Quality with IN USE badge */}
          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="cellular-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainerWithBadge}>
              <Text style={styles.itemTitle}>On mobile data</Text>
              <View style={styles.inUseBadge}>
                <Text style={styles.inUseText}>IN USE</Text>
              </View>
            </View>
            <View style={styles.rightValueRow}>
              <Text style={styles.rightValueText}>{mobileDataQuality}</Text>
              <Ionicons name="chevron-forward" size={16} color="#71717A" />
            </View>
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          {/* Dolby Atmos Surround Toggle */}
          <View style={styles.listItemRow}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="hardware-chip-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Dolby Atmos</Text>
              <Text style={styles.itemSubtitle}>
                Play the more immersive, surround version of a song when there is one.
              </Text>
            </View>
            <Switch
              value={dolbyAtmos}
              onValueChange={setDolbyAtmos}
              trackColor={{ false: '#27272A', true: '#22C55E' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Content & Storage Options Group (Screenshot 5) */}
        <View style={[styles.cardGroup, { marginTop: 16 }]}>
          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="arrow-down-circle-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Downloads</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          <TouchableOpacity style={styles.listItemRow} activeOpacity={0.7}>
            <View style={styles.itemIconContainer}>
              <Ionicons name="videocam-outline" size={20} color="#D1D5DB" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Content Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#71717A" />
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButtonCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeading: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 14,
    letterSpacing: -0.6,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: 22,
    height: 42,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 170, // Space for mini player and bottom dock
  },
  cardGroup: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemAvatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemAvatarText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F43F5E',
  },
  itemIconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTextContainerNoIcon: {
    flex: 1,
  },
  itemTextContainerWithBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 14,
  },
  inUseBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inUseText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D1D5DB',
  },
  rightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightValueText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  itemDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginLeft: 62,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#71717A',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 12,
    letterSpacing: 0.8,
  },
});
