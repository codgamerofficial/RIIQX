import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SubmitPostScreen() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Simulation of image picker
    const pickImage = () => {
        setSelectedImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop');
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Submit Post</Text>
            </View>

            <View className="p-6 flex-1">
                <Text className="text-gray-400 text-base mb-8">
                    Upload a screenshot of your Instagram post or Reel to verify and earn your cashback.
                </Text>

                {/* Upload Area */}
                <TouchableOpacity
                    onPress={pickImage}
                    className="w-full aspect-square bg-gray-900 rounded-3xl border-2 border-dashed border-gray-700 items-center justify-center overflow-hidden"
                >
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <View className="items-center">
                            <View className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center mb-4">
                                <Ionicons name="camera" size={32} color="#E31C79" />
                            </View>
                            <Text className="text-white font-bold text-lg">Upload Proof</Text>
                            <Text className="text-gray-500 text-sm mt-2">Tap to select from gallery</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {selectedImage && (
                    <View className="mt-8">
                        <Text className="text-white font-bold mb-2">Tagged Brand</Text>
                        <View className="bg-gray-900 p-4 rounded-xl flex-row items-center">
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                                <Text className="font-bold text-black">Z</Text>
                            </View>
                            <Text className="text-white font-bold text-lg">Zara - $8.99 Cashback</Text>
                            <Ionicons name="checkmark-circle" size={24} color="#E31C79" className="ml-auto" />
                        </View>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View className="p-6 border-t border-gray-800 bg-black">
                <TouchableOpacity
                    onPress={() => router.push('/cashback/process')}
                    disabled={!selectedImage}
                    className={`w-full h-14 rounded-full items-center justify-center ${selectedImage ? 'bg-cherry shadow-lg shadow-cherry/30' : 'bg-gray-800'}`}
                >
                    <Text className={`${selectedImage ? 'text-white' : 'text-gray-500'} font-bold text-lg`}>Submit for Review</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
