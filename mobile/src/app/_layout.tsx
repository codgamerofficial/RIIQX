import "../global.css";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { DynamicIsland } from "@/components/ui/DynamicIsland";
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export default function Layout() {
    useEffect(() => {
        registerForPushNotificationsAsync();

        // Supabase Auth Listener
        supabase.auth.getSession().then(({ data: { session } }) => {
            useAuthStore.getState().setSession(session as Session | null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            useAuthStore.getState().setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-background">
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }} />
                <DynamicIsland />
            </View>
        </GestureHandlerRootView>
    );
}
