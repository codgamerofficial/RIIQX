import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Package, Heart, LogOut } from "lucide-react-native";

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="px-6 pt-6 pb-8 border-b border-white/10">
                    <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest mb-2">RIIQX Insider</Text>
                    <Text className="text-white text-4xl font-black uppercase tracking-tighter">My Profile</Text>
                </View>

                {/* Profile Card */}
                <View className="mx-6 mt-8 p-6 bg-[#1A1A1A] rounded-3xl border border-white/5">
                    <View className="items-center">
                        <View className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D9F99D] to-transparent p-1 mb-4">
                            <View className="w-full h-full rounded-full bg-black items-center justify-center overflow-hidden border-2 border-[#D9F99D]">
                                <User size={40} color="rgba(255,255,255,0.5)" />
                            </View>
                        </View>
                        <Text className="text-white text-xl font-black uppercase tracking-tight">Guest User</Text>
                        <Text className="text-white/50 text-sm font-medium">Please sign in to access VIP features</Text>
                    </View>

                    <View className="flex-row mt-6 gap-3">
                        <TouchableOpacity className="flex-1 bg-white py-3 rounded-xl items-center">
                            <Text className="text-black font-bold uppercase text-xs tracking-wider">Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl items-center">
                            <Text className="text-white font-bold uppercase text-xs tracking-wider">Join Club</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="px-6 mt-8 space-y-4">
                    <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
                        <Package size={20} color="#D9F99D" />
                        <Text className="text-white font-bold text-sm uppercase ml-4 flex-1">Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
                        <Heart size={20} color="#D9F99D" />
                        <Text className="text-white font-bold text-sm uppercase ml-4 flex-1">Wishlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
                        <Settings size={20} color="#fff" />
                        <Text className="text-white font-bold text-sm uppercase ml-4 flex-1">Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 rounded-xl mt-4">
                        <LogOut size={20} color="#EF4444" />
                        <Text className="text-red-500 font-bold text-sm uppercase ml-4 flex-1">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
