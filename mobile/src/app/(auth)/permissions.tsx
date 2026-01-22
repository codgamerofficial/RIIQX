import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function PermissionsScreen() {
    const router = useRouter();

    const handleContinue = () => {
        // Navigate to main tabs
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-black px-6">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center py-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="h-1 bg-gray-800 flex-1 ml-4 rounded-full overflow-hidden">
                    <View className="h-full bg-cherry w-full" />
                </View>
                <Text className="text-gray-500 ml-4 font-bold">3/3</Text>
            </View>

            <View className="flex-1 justify-center items-center">
                <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-6">
                    <Ionicons name="notifications" size={40} color="#FFB800" />
                </View>

                <Text className="text-white text-3xl font-bold mb-4 text-center">
                    Don't Miss a Reward
                </Text>
                <Text className="text-gray-400 text-center text-lg mb-12 px-4">
                    Enable notifications so we can tell you when your cashback is approved.
                </Text>

                <TouchableOpacity
                    className="w-full bg-gray-900 border border-gray-800 p-5 rounded-2xl flex-row items-center justify-between mb-4"
                >
                    <View className="flex-row items-center">
                        <Ionicons name="notifications-outline" size={24} color="white" />
                        <Text className="text-white font-bold ml-4 text-lg">Enable Notifications</Text>
                    </View>
                    <View className="w-6 h-6 rounded-full border-2 border-cherry bg-cherry items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <View className="pb-8">
                <TouchableOpacity
                    onPress={handleContinue}
                    className="w-full bg-cherry h-14 rounded-full items-center justify-center shadow-lg shadow-cherry/30"
                >
                    <Text className="text-white font-bold text-lg">Start Shopping</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
