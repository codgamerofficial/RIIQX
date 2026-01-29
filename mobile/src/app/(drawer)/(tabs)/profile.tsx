import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Package, Heart, LogOut, ChevronRight, Shield, Bell, CircleHelp, FileText } from "lucide-react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PremiumButton } from "@/components/ui/PremiumButton";

// Reusable Settings Item Component
const SettingsItem = ({ icon: Icon, label, value, onPress, isLast = false, isDestructive = false }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center p-4 bg-surface ${!isLast ? 'border-b border-white/5' : ''}`}
    >
        <View className={`w-8 h-8 rounded-full items-center justify-center ${isDestructive ? 'bg-red-500/10' : 'bg-white/5'}`}>
            <Icon size={16} color={isDestructive ? '#EF4444' : '#CCFF00'} />
        </View>
        <Text className={`flex-1 ml-3 font-medium text-sm ${isDestructive ? 'text-red-500' : 'text-white'}`}>
            {label}
        </Text>
        {value && <Text className="text-white/60 text-xs mr-2">{value}</Text>}
        <ChevronRight size={16} color="#666" />
    </TouchableOpacity>
);

const SettingsGroup = ({ title, children }: any) => (
    <View className="mb-6">
        {title && <Text className="text-white/40 text-xs font-bold uppercase tracking-widest px-4 mb-2">{title}</Text>}
        <View className="rounded-2xl overflow-hidden bg-surface mx-4">
            {children}
        </View>
    </View>
);

export default function ProfileScreen() {
    const { session, user } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        useAuthStore.getState().setSession(null);
    };

    if (!session || !user) {
        return (
            <View className="flex-1 bg-background">
                <SafeAreaView className="flex-1 px-6 justify-center">
                    <View className="items-center mb-12">
                        <View className="w-24 h-24 rounded-full bg-brand/10 items-center justify-center border border-brand/20 mb-6">
                            <User size={40} color="#CCFF00" />
                        </View>
                        <Text className="text-white text-3xl font-display uppercase mb-2">Access Denied</Text>
                        <Text className="text-white/60 text-center font-sans">
                            Sign in to access your missions, loadouts, and exclusive drops.
                        </Text>
                    </View>

                    <PremiumButton
                        label="Authenticate"
                        variant="primary"
                        onPress={() => router.push("/auth/login")}
                        className="mb-4"
                    />
                    <PremiumButton
                        label="Create Identity"
                        variant="glass"
                        onPress={() => router.push("/auth/register")}
                    />
                </SafeAreaView>
            </View>
        );
    }

    const { full_name, first_name } = user.user_metadata || {};

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Header */}
                    <View className="px-6 py-6 border-b border-white/5 bg-background mb-6">
                        <Text className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Operator Profile</Text>
                        <Text className="text-white text-4xl font-display uppercase tracking-tighter">
                            {full_name || 'Unknown'}
                        </Text>
                        <Text className="text-white/40 font-mono text-xs">{user.email}</Text>
                    </View>

                    {/* Account Settings */}
                    <SettingsGroup title="Account">
                        <SettingsItem
                            icon={Package}
                            label="Orders"
                            onPress={() => { }}
                        />
                        <SettingsItem
                            icon={Heart}
                            label="Wishlist"
                            onPress={() => router.push('/wishlist')}
                            isLast
                        />
                    </SettingsGroup>

                    {/* Preferences */}
                    <SettingsGroup title="Preferences">
                        <SettingsItem icon={Bell} label="Notifications" value="On" onPress={() => { }} />
                        <SettingsItem icon={Shield} label="Security" onPress={() => { }} isLast />
                    </SettingsGroup>

                    {/* Support */}
                    <SettingsGroup title="Support">
                        <SettingsItem icon={CircleHelp} label="Help Center" onPress={() => { }} />
                        <SettingsItem icon={FileText} label="Terms of Service" onPress={() => { }} isLast />
                    </SettingsGroup>

                    {/* Danger Zone */}
                    <SettingsGroup>
                        <SettingsItem
                            icon={LogOut}
                            label="Log Out"
                            isDestructive
                            isLast
                            onPress={handleLogout}
                        />
                    </SettingsGroup>

                    <Text className="text-white/20 text-center text-[10px] font-mono uppercase mt-4">
                        RIIQX v2.0.0 (Build 2026)
                    </Text>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
