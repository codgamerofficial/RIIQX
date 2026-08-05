import React from 'react';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Home, Grid, ShoppingBag, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#050508',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF003C',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontFamily: 'Space Grotesk',
          fontSize: 10,
          fontWeight: 'bold',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'DROPS',
          tabBarIcon: ({ color }: { color: string }) => <Home size={20} color={color} />,
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ color }: { color: string }) => <Grid size={20} color={color} />,
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: 'BAG',
          tabBarIcon: ({ color }: { color: string }) => <ShoppingBag size={20} color={color} />,
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: 'PORTAL',
          tabBarIcon: ({ color }: { color: string }) => <User size={20} color={color} />,
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tabs.Screen
        name="account/[id]"
        options={{
          href: null, // Hidden tab for order tracking modal
        }}
      />
    </Tabs>
  );
}
