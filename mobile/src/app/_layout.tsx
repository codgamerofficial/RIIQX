import "../global.css";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function Layout() {
    useEffect(() => {
        registerForPushNotificationsAsync();

        // Supabase Auth Listener
        supabase.auth.getSession().then(({ data: { session } }) => {
            useAuthStore.getState().setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            useAuthStore.getState().setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <View className="flex-1 bg-background">
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
        </View>
    );
}
