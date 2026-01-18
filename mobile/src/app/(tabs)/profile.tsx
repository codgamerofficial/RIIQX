import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Package, Heart, LogOut } from "lucide-react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
    const { session, user } = useAuthStore();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // Reload session or fetch data
        const { data: { session: newSession } } = await supabase.auth.getSession();
        useAuthStore.getState().setSession(newSession);
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        useAuthStore.getState().setSession(null);
    };

    if (!session || !user) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <View className="flex-1 items-center justify-center p-6 bg-[#1A1A1A] m-6 rounded-3xl border border-white/5">
                    <View className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D9F99D] to-transparent p-1 mb-4">
                        <View className="w-full h-full rounded-full bg-black items-center justify-center overflow-hidden border-2 border-[#D9F99D]">
                            <User size={40} color="rgba(255,255,255,0.5)" />
                        </View>
                    </View>
                    <Text className="text-white text-xl font-black uppercase tracking-tight mb-2">Guest Access</Text>
                    <Text className="text-white/50 text-sm font-medium text-center mb-6">Initialize connection to access personalized loadout and mission history.</Text>

                    <TouchableOpacity
                        onPress={() => router.push("/auth/login")}
                        className="w-full bg-white py-4 rounded-full items-center mb-3"
                    >
                        <Text className="text-black font-bold uppercase text-xs tracking-wider">Connect</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/auth/register")}
                        className="w-full bg-white/5 border border-white/10 py-4 rounded-full items-center"
                    >
                        <Text className="text-white font-bold uppercase text-xs tracking-wider">New Operator</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const { full_name, first_name, referral_code } = user.user_metadata || {};

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D9F99D" />}
            >
                {/* Header */}
                <View className="px-6 pt-6 pb-8 border-b border-white/10">
                    <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest mb-2">Operator Status: Active</Text>
                    <Text className="text-white text-4xl font-black uppercase tracking-tighter">My Profile</Text>
                </View>

                {/* Profile Card */}
                <View className="mx-6 mt-8 p-6 bg-[#1A1A1A] rounded-3xl border border-white/5">
                    <View className="flex-row items-center gap-4">
                        <View className="w-16 h-16 rounded-full bg-[#D9F99D] items-center justify-center">
                            <Text className="text-black text-2xl font-black">{first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}</Text>
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold uppercase">{full_name || 'Operator'}</Text>
                            <Text className="text-white/50 text-sm">{user.email}</Text>
                            {referral_code && (
                                <Text className="text-[#D9F99D] text-xs font-mono mt-1">Code: {referral_code}</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Orders Section (Placeholder for now as we disconnected Shopify Auth) */}
                <View className="px-6 mt-8">
                    <Text className="text-white text-lg font-bold uppercase mb-4">Recent Missions</Text>
                    <Text className="text-white/30 italic">No missions linked to this frequency.</Text>
                </View>

                {/* Menu Items */}
                <View className="px-6 mt-8 space-y-4">
                    <TouchableOpacity onPress={() => router.push('/wishlist')} className="flex-row items-center bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
                        <Heart size={20} color="#D9F99D" />
                        <Text className="text-white font-bold text-sm uppercase ml-4 flex-1">Wishlist Store</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout} className="flex-row items-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <LogOut size={20} color="#EF4444" />
                        <Text className="text-red-500 font-bold text-sm uppercase ml-4 flex-1">Terminate Session</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
