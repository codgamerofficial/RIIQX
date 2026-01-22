import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0A0A0A',
                    borderTopColor: '#1A1A1A',
                    height: 80,
                    paddingBottom: 20,
                },
                tabBarActiveTintColor: '#E31C79', // Cherry
                tabBarInactiveTintColor: '#666666',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <View className={focused ? 'bg-cherry/10 p-2 rounded-xl' : ''}>
                            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <View className={focused ? 'bg-cherry/10 p-2 rounded-xl' : ''}>
                            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={color} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <View className={focused ? 'bg-cherry/10 p-2 rounded-xl' : ''}>
                            {/* Dashboard / Analytics */}
                            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={26} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
