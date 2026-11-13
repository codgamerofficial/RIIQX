// =============================================================================
// RIIQX Mobile 2.0 — Master Audio & Agentic OS Tab Layout
// Floating Frosted Bottom Dock • Home • Explore • Library • Search
// Embedded Mini-Player & Fullscreen Immersion Modal • Zero Webview
// Matches Screenshots 1, 2, 3, 5 Exactly
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RiiqxAudioProvider } from '../../src/context/RiiqxAudioContext';
import { MobileFloatingMiniPlayer } from '../../src/components/audio/MobileFloatingMiniPlayer';
import { MobileFullscreenPlayerModal } from '../../src/components/audio/MobileFullscreenPlayerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: any) {
  const primaryTabs = ['index', 'explore', 'library', 'search'];

  return (
    <View style={styles.tabBarWrapper} pointerEvents="box-none">
      <View style={styles.tabBarContainer}>
        {state.routes
          .filter((route: any) => primaryTabs.includes(route.name))
          .map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === state.routes.findIndex((r: any) => r.name === route.name);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName: any = 'home';
            let label = 'Home';

            if (route.name === 'index') {
              iconName = isFocused ? 'home' : 'home-outline';
              label = 'Home';
            } else if (route.name === 'explore') {
              iconName = isFocused ? 'grid' : 'grid-outline';
              label = 'Explore';
            } else if (route.name === 'library') {
              iconName = isFocused ? 'file-tray-full' : 'file-tray-full-outline';
              label = 'Library';
            } else if (route.name === 'search') {
              iconName = isFocused ? 'search' : 'search-outline';
              label = 'Search';
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.tabButton, isFocused && styles.tabButtonActive]}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isFocused ? '#FFFFFF' : '#8E8E93'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <RiiqxAudioProvider>
      <View style={styles.rootContainer}>
        <Tabs
          tabBar={(props: any) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Tab 1: Home (Screenshots 1) */}
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
            }}
          />

          {/* Tab 2: Explore (Screenshots 2) */}
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
            }}
          />

          {/* Tab 3: Library */}
          <Tabs.Screen
            name="library"
            options={{
              title: 'Library',
            }}
          />

          {/* Tab 4: Search (Screenshots 3) */}
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
            }}
          />

          {/* Settings & Submodules (No Tab Bar Item) */}
          <Tabs.Screen name="settings" options={{ href: null }} />
          <Tabs.Screen name="shopping" options={{ href: null }} />
          <Tabs.Screen name="chat" options={{ href: null }} />
          <Tabs.Screen name="creator" options={{ href: null }} />
          <Tabs.Screen name="autopilot" options={{ href: null }} />
          <Tabs.Screen name="apps" options={{ href: null }} />
          <Tabs.Screen name="tasks" options={{ href: null }} />
          <Tabs.Screen name="research" options={{ href: null }} />
          <Tabs.Screen name="code" options={{ href: null }} />
          <Tabs.Screen name="integrations" options={{ href: null }} />
          <Tabs.Screen name="analytics" options={{ href: null }} />
          <Tabs.Screen name="studio" options={{ href: null }} />
        </Tabs>

        {/* Global Floating Mini Player Dock (Screenshot 1, 2, 3, 5) */}
        <MobileFloatingMiniPlayer />

        {/* Fullscreen Immersion Modal (Screenshot 4) */}
        <MobileFullscreenPlayerModal />
      </View>
    </RiiqxAudioProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 50,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(16, 16, 20, 0.94)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 22,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: '#8E8E93',
  },
});
