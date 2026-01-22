import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function ProcessScreen() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect or just stay here
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-black items-center justify-center p-6">

            <Animated.View entering={FadeIn.duration(1000)} className="items-center mb-12">
                <View className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-6 border border-green-500/50">
                    <Ionicons name="checkmark" size={48} color="#4ADE80" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">Submission Received!</Text>
                <Text className="text-gray-400 text-center text-lg">
                    We're verifying your post. You'll receive your <Text className="text-white font-bold">$8.99</Text> within 24 hours.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500)} className="w-full bg-gray-900 rounded-3xl p-6 border border-gray-800 mb-8">
                <Text className="text-white font-bold mb-6 text-lg">Tracker</Text>

                {/* Timeline Item 1 */}
                <View className="flex-row mb-6 relative">
                    <View className="items-center mr-4">
                        <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center z-10">
                            <Ionicons name="checkmark" size={16} color="black" />
                        </View>
                        <View className="w-0.5 flex-1 bg-green-500 absolute top-8 bottom-[-24]" />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-base">Post Submitted</Text>
                        <Text className="text-gray-500 text-sm">Just now</Text>
                    </View>
                </View>

                {/* Timeline Item 2 */}
                <View className="flex-row mb-6 relative">
                    <View className="items-center mr-4">
                        <View className="w-8 h-8 rounded-full bg-cherry items-center justify-center z-10 shadow-lg shadow-cherry/50">
                            <Ionicons name="time" size={16} color="white" />
                        </View>
                        <View className="w-0.5 flex-1 bg-gray-800 absolute top-8 bottom-[-24]" />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-base">Verifying Tag</Text>
                        <Text className="text-cherry text-sm">In Progress...</Text>
                    </View>
                </View>

                {/* Timeline Item 3 */}
                <View className="flex-row relative">
                    <View className="w-8 h-8 rounded-full bg-gray-800 items-center justify-center mr-4 z-10 border border-gray-700">
                        <Ionicons name="wallet-outline" size={16} color="#666" />
                    </View>
                    <View>
                        <Text className="text-gray-500 font-bold text-base">Cashback Deposited</Text>
                        <Text className="text-gray-600 text-sm">Estimated 24h</Text>
                    </View>
                </View>
            </Animated.View>

            <TouchableOpacity
                onPress={() => router.replace('/(tabs)/dashboard')}
                className="w-full bg-gray-800 h-14 rounded-full items-center justify-center border border-gray-700"
            >
                <Text className="text-white font-bold text-lg">Go to Dashboard</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}
