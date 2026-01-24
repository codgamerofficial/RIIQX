import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

function TabBarButton({ children, onPress, accessibilityState }: any) {
    const focused = accessibilityState.selected;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.1 : 1,
            useNativeDriver: true,
            friction: 5,
        }).start();
    }, [focused]);

    const handlePress = (e: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 50, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        ]).start();
        onPress(e);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className="flex-1 items-center justify-center pt-2 pb-6"
        >
            <Animated.View style={{ transform: [{ scale }] }}>
                {children}
            </Animated.View>
            {focused && (
                <View className="absolute bottom-2 w-1 h-1 bg-cherry rounded-full" />
            )}
        </TouchableOpacity>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 85,
                    backgroundColor: Platform.select({ ios: 'transparent', android: '#0A0A0A' }),
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView intensity={80} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} tint="dark" />
                    ) : (
                        <View className="flex-1 bg-black/90 border-t border-white/5" />
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
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="shop"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "bag" : "bag-outline"} size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="wishlist"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />

            {/* Hidden Tabs */}
            <Tabs.Screen name="bag" options={{ href: null }} />
            <Tabs.Screen name="profile" options={{ href: null }} />
        </Tabs>
    );
}
