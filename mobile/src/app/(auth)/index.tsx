import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-black items-center justify-between px-6 py-10">
            <StatusBar style="light" />

            {/* Brand / Hero Section */}
            <View className="flex-1 items-center justify-center w-full">
                <View className="w-24 h-24 bg-cherry rounded-full mb-8 items-center justify-center shadow-lg shadow-cherry/50">
                    <Text className="text-4xl">🍒</Text>
                </View>

                <Text className="text-white text-5xl font-bold text-center leading-tight mb-4">
                    Cherry
                </Text>

                <Text className="text-gray-400 text-lg text-center font-medium max-w-[80%]">
                    Shop what you love. <Text className="text-cherry-400">Get paid to post.</Text>
                </Text>
            </View>

            {/* Action / Value Prop */}
            <View className="w-full space-y-6">
                <View className="flex-row justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <View>
                        <Text className="text-white text-lg font-bold">30-90% Cashback</Text>
                        <Text className="text-gray-500 text-sm">On top fashion & beauty brands</Text>
                    </View>
                    <View className="bg-gold/20 px-3 py-1 rounded-full">
                        <Text className="text-gold font-bold">Creators Only</Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/(auth)/eligibility')}
                    className="w-full bg-cherry h-14 rounded-full items-center justify-center shadow-lg shadow-cherry/30"
                >
                    <Text className="text-white font-bold text-lg">Start Earning</Text>
                </TouchableOpacity>

                <Text className="text-gray-600 text-center text-sm">
                    By joining, you agree to our Terms & Privacy Policy
                </Text>
            </View>
        </SafeAreaView>
    );
}
