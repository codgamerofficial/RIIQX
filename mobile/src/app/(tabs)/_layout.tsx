import { Tabs } from "expo-router";
import { Home, ShoppingBag, Search, User } from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#121212",
                    borderTopColor: "#333",
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: "#D9F99D", // Neon
                tabBarInactiveTintColor: "#666",
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <Home size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    tabBarIcon: ({ color }) => <Search size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="bag"
                options={{
                    tabBarIcon: ({ color }) => <ShoppingBag size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <User size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}
