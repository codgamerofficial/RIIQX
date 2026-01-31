import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Animated, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

// Custom Tab Button with smooth animations
function TabBarButton({ children, onPress, accessibilityState, accessibilityLabel }: any) {
    const focused = accessibilityState.selected;
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Smooth spring animation for scale
        Animated.spring(scale, {
            toValue: focused ? 1.15 : 1,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();

        // Subtle translate animation
        Animated.spring(translateY, {
            toValue: focused ? -4 : 0,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();
    }, [focused]);

    const handlePress = (e: any) => {
        // Haptic feedback
        Haptics.impactAsync(
            focused ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
        );

        // Press animation sequence
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 0.85,
                duration: 80,
                useNativeDriver: true
            }),
            Animated.spring(scale, {
                toValue: focused ? 1.15 : 1,
                useNativeDriver: true,
                friction: 5,
            }),
        ]).start();

        onPress(e);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.tabButton}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
        >
            <Animated.View
                style={[
                    styles.tabContent,
                    {
                        transform: [
                            { scale },
                            { translateY }
                        ]
                    }
                ]}
            >
                {children}
                {focused && (
                    <View style={styles.indicator} />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={85}
                            style={StyleSheet.absoluteFill}
                            tint="dark"
                        />
                    ) : (
                        <View style={styles.androidBackground} />
                    )
                ),
                tabBarButton: (props) => <TabBarButton {...props} />,
                tabBarActiveTintColor: '#E31C79',
                tabBarInactiveTintColor: '#666666',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: "Home"
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "search" : "search-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: "Explore"
                }}
            />

            <Tabs.Screen
                name="shop"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "bag" : "bag-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: "Shop"
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: "Profile"
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 90 : 80,
        backgroundColor: Platform.select({ ios: 'transparent', android: '#0A0A0A' }),
        borderTopWidth: 0,
        elevation: 0,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
    },
    androidBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 10, 10, 0.98)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        bottom: -8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E31C79',
    },
});
