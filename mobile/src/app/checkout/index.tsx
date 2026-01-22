import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function CheckoutScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            <View className="px-6 py-4 flex-row items-center border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Checkout</Text>
            </View>

            <ScrollView className="flex-1 px-6 py-6">

                {/* Shipping Address */}
                <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">Shipping To</Text>
                <TouchableOpacity className="flex-row items-center bg-gray-900 p-4 rounded-xl mb-6 border border-gray-800">
                    <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-4">
                        <Ionicons name="location-outline" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold">Creator House</Text>
                        <Text className="text-gray-400 text-sm">123 Fashion Ave, Beverly Hills, CA</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                {/* Payment */}
                <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">Payment Method</Text>
                <TouchableOpacity className="flex-row items-center bg-gray-900 p-4 rounded-xl mb-6 border border-gray-800">
                    <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-4">
                        <Ionicons name="card-outline" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold">Apple Pay</Text>
                        <Text className="text-gray-400 text-sm">Ending in 4242</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                {/* Order Summary */}
                <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">Order Summary</Text>
                <View className="bg-gray-900 p-6 rounded-2xl mb-6 border border-gray-800">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-400">Subtotal</Text>
                        <Text className="text-white font-medium">$89.90</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-gray-400">Shipping</Text>
                        <Text className="text-white font-medium">$0.00</Text>
                    </View>
                    <View className="h-[1px] bg-gray-800 mb-4" />
                    <View className="flex-row justify-between items-end">
                        <Text className="text-white font-bold text-lg">Total</Text>
                        <Text className="text-white font-bold text-2xl">$89.90</Text>
                    </View>
                </View>

                {/* Cashback Preview */}
                <View className="bg-gradient-to-r from-cherry to-orange-500 p-[1px] rounded-2xl">
                    <View className="bg-black/90 p-4 rounded-2xl flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="sparkles" size={20} color="#E31C79" className="mr-2" />
                            <Text className="text-white font-bold">Cashback You'll Earn</Text>
                        </View>
                        <Text className="text-cherry font-bold text-xl">$8.99</Text>
                    </View>
                </View>

            </ScrollView>

            <View className="p-6 border-t border-gray-800 bg-black">
                <TouchableOpacity
                    className="w-full h-14 bg-white rounded-full items-center justify-center"
                >
                    <Text className="text-black font-bold text-lg">Pay & Earn $8.99</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
