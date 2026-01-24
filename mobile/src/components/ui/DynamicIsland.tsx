import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    runOnJS
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useIslandStore, Activity } from '@/store/islandStore';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SPRING_CONFIG = { damping: 15, stiffness: 200, mass: 0.5 };

export function DynamicIsland() {
    const insets = useSafeAreaInsets();
    const { islandState, activeActivity, expand, collapse, endActivity } = useIslandStore();

    // Shared Values for Animation
    const width = useSharedValue(120);
    const height = useSharedValue(36);
    const borderRadius = useSharedValue(20);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    // Initial Appearance
    useEffect(() => {
        // Always show now (Idle state)
        opacity.value = withSpring(1);
        translateY.value = withSpring(insets.top + 6, SPRING_CONFIG);
    }, [insets.top]);

    // Resizing Logic based on State
    useEffect(() => {
        if (!activeActivity) {
            // Idle State
            width.value = withSpring(100, SPRING_CONFIG);
            height.value = withSpring(32, SPRING_CONFIG);
            borderRadius.value = withSpring(16);
            return;
        }

        if (islandState === 'compact') {
            width.value = withSpring(activeActivity ? 120 : 100, SPRING_CONFIG);
            height.value = withSpring(36, SPRING_CONFIG);
            borderRadius.value = withSpring(18);
        } else if (islandState === 'expanded') {
            width.value = withSpring(SCREEN_WIDTH - 24, SPRING_CONFIG);
            height.value = withSpring(160, SPRING_CONFIG); // Music/Checkout Cards
            borderRadius.value = withSpring(28);
        }

        // Auto-collapse added to cart notification
        if (activeActivity.type === 'cart' && islandState === 'expanded') {
            // Just a pulse usually, but if expanded
            // runOnJS(collapse)(); 
        }

    }, [islandState, activeActivity]);

    // Haptics on change
    useEffect(() => {
        if (activeActivity) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [islandState, activeActivity?.id]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: width.value,
        height: height.value,
        borderRadius: borderRadius.value,
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    // if (!activeActivity) return null; // Removed to show idle state

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    top: 0,
                    alignSelf: 'center',
                    backgroundColor: 'black',
                    zIndex: 9999,
                    overflow: 'hidden',
                }
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={islandState === 'compact' ? expand : collapse}
                style={{ flex: 1 }}
            >
                {/* Content Rendering based on Mode */}
                {islandState === 'compact' ? (
                    <CompactView activity={activeActivity} />
                ) : (
                    activeActivity && <ExpandedView activity={activeActivity} onDismiss={() => endActivity(activeActivity.id)} />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

// Sub-components
function CompactView({ activity }: { activity: Activity | null }) {
    if (!activity) {
        // Idle State
        return <View className="flex-1 items-center justify-center"><View className="w-8 h-1 bg-white/20 rounded-full" /></View>;
    }

    if (activity.type === 'music') {
        return (
            <View className="flex-1 flex-row items-center justify-between px-3">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="musical-notes" size={12} color="#E31C79" />
                    <Text className="text-white text-[10px] font-bold max-w-[60px]" numberOfLines={1}>
                        {activity.title}
                    </Text>
                </View>
                {/* Waveform placeholder */}
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

    return null;
}

function ExpandedView({ activity, onDismiss }: { activity: Activity, onDismiss: () => void }) {
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
                    <Text className="text-white/60 text-sm">{activity.subtitle || 'Now Playing'}</Text>
                </View>
            </View>

            {/* Controls (for music) */}
            {activity.type === 'music' && (
                <View className="flex-row items-center justify-center gap-8 mt-2">
                    <Ionicons name="play-skip-back" size={24} color="white" />
                    <Ionicons name="pause-circle" size={40} color="white" />
                    <Ionicons name="play-skip-forward" size={24} color="white" />
                </View>
            )}
        </View>
    );
}
