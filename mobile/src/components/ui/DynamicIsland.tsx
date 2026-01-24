import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur'; // Keep for future use if needed
import { Ionicons } from '@expo/vector-icons';
import { useIslandStore, Activity } from '@/store/islandStore';
import * as Haptics from 'expo-haptics';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPRING_CONFIG = { damping: 15, stiffness: 200, mass: 0.5 };

export function DynamicIsland() {
    const insets = useSafeAreaInsets();
    const { islandState, activeActivity, expand, collapse, endActivity } = useIslandStore();

    // Realtime Data Hooks
    const { location, loading: locLoading } = useLocation();
    const { weather, loading: weatherLoading } = useWeather(location?.latitude || null, location?.longitude || null);

    // Clock State
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Shared Values
    const width = useSharedValue(130); // Wider default for core info
    const height = useSharedValue(36);
    const borderRadius = useSharedValue(18);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    // Initial Appearance
    useEffect(() => {
        opacity.value = withSpring(1);
        translateY.value = withSpring(-insets.bottom - 10, SPRING_CONFIG); // Docked inside Footer
    }, [insets.bottom]);

    // Resizing Logic
    useEffect(() => {
        if (!activeActivity && islandState !== 'expanded') {
            // Idle HUD State
            width.value = withSpring(140, SPRING_CONFIG);
            height.value = withSpring(36, SPRING_CONFIG);
            borderRadius.value = withSpring(18);
            return;
        }

        if (islandState === 'compact') {
            width.value = withSpring(activeActivity ? 140 : 140, SPRING_CONFIG);
            height.value = withSpring(36, SPRING_CONFIG);
            borderRadius.value = withSpring(18);
        } else if (islandState === 'expanded') {
            width.value = withSpring(SCREEN_WIDTH - 32, SPRING_CONFIG);
            height.value = withSpring(activeActivity ? 160 : 180, SPRING_CONFIG); // Taller for Location Details
            borderRadius.value = withSpring(28);
        }
    }, [islandState, activeActivity]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: width.value,
        height: height.value,
        borderRadius: borderRadius.value,
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    bottom: 0, // ANCHOR TO BOTTOM
                    alignSelf: 'center', // CENTER ALIGNED
                    backgroundColor: 'rgba(0,0,0,0.85)', // Slightly translucent black
                    zIndex: 9999,
                    overflow: 'hidden',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                }
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={islandState === 'compact' ? expand : collapse}
                style={{ flex: 1 }}
            >
                {islandState === 'compact' ? (
                    <CompactHUD
                        activity={activeActivity}
                        time={time}
                        weather={weather}
                    />
                ) : (
                    <ExpandedHUD
                        activity={activeActivity}
                        time={time}
                        weather={weather}
                        location={location}
                        onDismiss={activeActivity ? () => endActivity(activeActivity.id) : collapse}
                    />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

// --- Sub-components ---

function CompactHUD({ activity, time, weather }: { activity: Activity | null, time: Date, weather: any }) {
    // 1. Priority: Active Activity (Music/Cart)
    if (activity) {
        if (activity.type === 'music') {
            return (
                <View className="flex-1 flex-row items-center justify-between px-3">
                    <Ionicons name="musical-notes" size={12} color="#E31C79" />
                    <View className="flex-1 px-2">
                        <Text className="text-white text-[10px] font-bold truncate" numberOfLines={1}>{activity.title}</Text>
                    </View>
                    <View className="flex-row gap-0.5 items-end h-3">
                        <View className="w-0.5 h-2 bg-green-400 rounded-full" />
                        <View className="w-0.5 h-3 bg-green-400 rounded-full" />
                        <View className="w-0.5 h-1.5 bg-green-400 rounded-full" />
                    </View>
                </View>
            );
        }
        if (activity.type === 'cart') {
            return (
                <View className="flex-1 flex-row items-center justify-center gap-2">
                    <Ionicons name="checkmark-circle" size={14} color="#CCFF00" />
                    <Text className="text-white text-[10px] font-bold">Added</Text>
                </View>
            );
        }
    }

    // 2. Default: Clock & Weather HUD
    return (
        <View className="flex-1 flex-row items-center justify-between px-4">
            <Text className="text-white font-bold text-xs">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </Text>
            <View className="flex-row items-center gap-1.5">
                <Text className="text-gray-300 text-xs font-medium">
                    {weather ? `${weather.temperature}°` : '--'}
                </Text>
                <Ionicons
                    name={weather?.isDay === 0 ? "moon" : "sunny"}
                    size={10}
                    color={weather?.isDay === 0 ? "#A0A0A0" : "#FFD700"}
                />
            </View>
        </View>
    );
}

function ExpandedHUD({ activity, time, weather, location, onDismiss }: { activity: Activity | null, time: Date, weather: any, location: any, onDismiss: () => void }) {
    // If there is an active activity, show that card
    if (activity) {
        return (
            <View className="flex-1 p-4 justify-between">
                <View className="flex-row items-center justify-between">
                    <Text className="text-white/50 text-xs font-bold uppercase">{activity.type}</Text>
                    <TouchableOpacity onPress={onDismiss}>
                        <Ionicons name="close-circle" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 bg-gray-800 rounded-lg items-center justify-center">
                        <Ionicons name="image" size={24} color="gray" />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-lg">{activity.title}</Text>
                        <Text className="text-white/60 text-sm">{activity.subtitle}</Text>
                    </View>
                </View>
            </View>
        );
    }

    // Otherwise show Expanded Weather/Location Details
    return (
        <View className="flex-1 p-5 justify-between">
            {/* Header: Date & Time */}
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="text-white text-3xl font-light">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text className="text-cherry text-sm font-bold uppercase tracking-widest mt-1">
                        {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-white text-3xl font-bold">
                        {weather ? `${weather.temperature}°` : '--'}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                        {weather?.condition || 'Loading...'}
                    </Text>
                </View>
            </View>

            {/* Footer: Location Details */}
            <View className="bg-white/10 rounded-xl p-3 flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center">
                    <Ionicons name="location" size={16} color="#3B82F6" />
                </View>
                <View>
                    <Text className="text-white font-bold text-sm">
                        {location?.district || location?.city || "Locating..."}
                    </Text>
                    <Text className="text-white/50 text-xs">
                        {location?.city}, {location?.region || location?.isoCountryCode}
                    </Text>
                </View>
            </View>

            <TouchableOpacity onPress={onDismiss} className="absolute top-4 right-4 p-2">
                {/* Invisible hit area to close if needed */}
            </TouchableOpacity>
        </View>
    );
}
