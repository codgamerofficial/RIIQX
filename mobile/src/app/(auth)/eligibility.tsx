import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function EligibilityScreen() {
    const router = useRouter();
    const [handle, setHandle] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'eligible' | 'error'>('idle');

    const checkEligibility = async () => {
        if (handle.length < 2) return;

        setStatus('checking');
        // Mock API call simulation
        setTimeout(() => {
            setStatus('eligible');
        }, 2000);
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
                    <View className="h-full bg-cherry w-1/3" />
                </View>
                <Text className="text-gray-500 ml-4 font-bold">1/3</Text>
            </View>

            <View className="mt-8">
                <Text className="text-white text-3xl font-bold mb-2">Connect Instagram</Text>
                <Text className="text-gray-400 text-base mb-8">
                    We need to verify you have 1,000+ followers to unlock creator rewards.
                </Text>

                <View className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <View className="flex-row items-center bg-black/50 border border-gray-700 rounded-xl px-4 py-3 mb-4">
                        <Text className="text-gray-400 mr-2">@</Text>
                        <TextInput
                            placeholder="instagram_handle"
                            placeholderTextColor="#666"
                            className="flex-1 text-white text-lg font-medium"
                            value={handle}
                            onChangeText={setHandle}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={checkEligibility}
                        disabled={status === 'checking' || handle.length === 0}
                        className={`w-full h-12 rounded-xl items-center justify-center flex-row ${status === 'checking' ? 'bg-gray-700' : 'bg-white'
                            }`}
                    >
                        {status === 'checking' ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-black font-bold text-base">Check Eligibility</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {status === 'eligible' && (
                    <Animated.View entering={FadeIn} className="mt-8 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex-row items-center">
                        <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                            <Ionicons name="checkmark" size={24} color="#4ADE80" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-lg">You're Eligible!</Text>
                            <Text className="text-green-400">1.2k followers verified</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/permissions')}
                            className="bg-green-500 px-4 py-2 rounded-lg"
                        >
                            <Text className="text-black font-bold">Next</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </SafeAreaView>
    );
}
