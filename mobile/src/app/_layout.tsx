import "../global.css";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

// Fonts
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Oswald_400Regular, Oswald_500Medium, Oswald_700Bold } from '@expo-google-fonts/oswald';

export default function Layout() {
    // Load Fonts
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
        Oswald_400Regular,
        Oswald_500Medium,
        Oswald_700Bold,
    });

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

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#050505' }}>
            <View style={{ flex: 1 }}>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }} />
            </View >
        </GestureHandlerRootView >
    );
}
