
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate,
    FadeIn
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useIslandStore } from '../../store/islandStore';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Physics Constants (Apple-like Spring)
const SPRING_CONFIG = {
    mass: 1,
    damping: 15, // Slightly bouncier than default
    stiffness: 120,
};

// Expanded Dimensions
const EXPANDED_HEIGHT = 180;
const EXPANDED_WIDTH = SCREEN_WIDTH * 0.92;
const COMPACT_height = 36;
const COMPACT_WIDTH = 120; // grows with content

export const DynamicIsland = () => {
    const { islandState, activeActivity, expand, collapse } = useIslandStore();

    // Shared Values for Animation
    const width = useSharedValue(COMPACT_WIDTH);
    const height = useSharedValue(COMPACT_height);
    const borderRadius = useSharedValue(18); // Pill shape radius

    // Sync state with animations
    useEffect(() => {
        if (islandState === 'idle') {
            width.value = withSpring(100, SPRING_CONFIG); // Small pill
            height.value = withSpring(30, SPRING_CONFIG);
            borderRadius.value = withSpring(15, SPRING_CONFIG);
        } else if (islandState === 'compact') {
            width.value = withSpring(200, SPRING_CONFIG); // Wider for activity
            height.value = withSpring(36, SPRING_CONFIG);
            borderRadius.value = withSpring(18, SPRING_CONFIG);
        } else if (islandState === 'expanded') {
            width.value = withSpring(EXPANDED_WIDTH, SPRING_CONFIG);
            height.value = withSpring(EXPANDED_HEIGHT, SPRING_CONFIG);
            borderRadius.value = withSpring(40, SPRING_CONFIG);
        } else if (islandState === 'peek') {
            width.value = withSpring(SCREEN_WIDTH * 0.92, SPRING_CONFIG);
            height.value = withSpring(80, SPRING_CONFIG); // Smaller expansion
            borderRadius.value = withSpring(30, SPRING_CONFIG);
        }
    }, [islandState]);

    // Gestures
    const tapGesture = Gesture.Tap()
        .onEnd(() => {
            if (islandState === 'compact') {
                expand();
            }
        })
        .runOnJS(true);

    const panGesture = Gesture.Pan()
        .onChange((event) => {
            // Drag logic (optional for fluid feel)
        })
        .onEnd((event) => {
            if (islandState === 'expanded') {
                // Swipe Up to Collapse
                if (event.translationY < -50) {
                    collapse();
                }
            }
            if (islandState === 'compact' || islandState === 'idle') {
                // Drag Down to Peck (Future)
            }
        })
        .runOnJS(true);

    const composedGestures = Gesture.Race(tapGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: width.value,
            height: height.value,
            borderRadius: borderRadius.value,
        };
    });

    if (islandState === 'idle' && !activeActivity) return null; // Or show small dot?

    return (
        <View style={styles.container} pointerEvents="box-none">
            <GestureDetector gesture={composedGestures}>
                <Animated.View style={[styles.island, animatedStyle]}>
                    {/* Content will go here - Morphing based on state */}

                    {/* Compact Content */}
                    {islandState === 'compact' && activeActivity && (
                        <Animated.View style={styles.compactContent} entering={FadeIn}>
                            {activeActivity.type === 'cart' ? (
                                <>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="bag" size={16} color="#F5C518" />
                                        <Text style={[styles.activityText, { color: '#F5C518' }]}>Cart Updates</Text>
                                    </View>
                                    <View style={styles.pillBadge}>
                                        <Text style={styles.pillText}>{activeActivity.subtitle}</Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.iconPlaceholder} />
                                    <Text style={styles.activityText}>{activeActivity.title}</Text>
                                    <View style={styles.wavesPlaceholder} />
                                </>
                            )}
                        </Animated.View>
                    )}

                    {/* Placeholder Expanded Content */}
                    {islandState === 'expanded' && activeActivity && (
                        <Animated.View style={styles.expandedContent} entering={FadeIn}>
                            <Text style={styles.expandedTitle}>{activeActivity.title}</Text>
                            <Text style={styles.expandedSubtitle}>{activeActivity.subtitle || 'Active'}</Text>
                            {/* Controls Container */}
                            <View style={styles.controlsPlaceholder} />
                        </Animated.View>
                    )}

                    {/* Peek Content (Drop Alert / Delivery) */}
                    {islandState === 'peek' && activeActivity && (
                        <Animated.View style={styles.peekContent} entering={FadeIn}>
                            {activeActivity.type === 'drop' && (
                                <View style={styles.dropContainer}>
                                    <Text style={styles.dropLabel}>DROP LIVE</Text>
                                    <Text style={styles.dropTitle}>{activeActivity.title}</Text>
                                    <View style={styles.countdownBadge}>
                                        <Text style={styles.countdownText}>{activeActivity.subtitle}</Text>
                                    </View>
                                </View>
                            )}
                            {activeActivity.type === 'delivery' && (
                                <View style={styles.rowCenter}>
                                    <Ionicons name="cube-outline" size={24} color="#4ade80" />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.deliveryTitle}>{activeActivity.title}</Text>
                                        <Text style={styles.deliverySubtitle}>{activeActivity.subtitle}</Text>
                                    </View>
                                </View>
                            )}
                        </Animated.View>
                    )}

                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 10 : 0, // Adjust for status bar/notch
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999, // Highest priority
    },
    island: {
        backgroundColor: 'black',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    compactContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12,
    },
    expandedContent: {
        flex: 1,
        width: '100%',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    expandedTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    expandedSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
    },
    iconPlaceholder: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E31C79', // Cherry Red (RIIQX Brand)
    },
    wavesPlaceholder: {
        width: 20,
        height: 12,
        backgroundColor: '#F5C518', // Gold
        borderRadius: 4,
    },
    controlsPlaceholder: {
        marginTop: 20,
        width: '100%',
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
    },
    pillBadge: {
        backgroundColor: '#E31C79',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    pillText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    peekContent: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    dropContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    dropLabel: {
        color: '#E31C79',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 2,
    },
    dropTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    countdownBadge: {
        backgroundColor: '#E31C79',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    countdownText: {
        color: 'white',
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    deliverySubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    }
});
