import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HISTORY = [
    { id: 1, brand: 'Zara', amount: '+$8.99', status: 'Pending', date: 'Today' },
    { id: 2, brand: 'Sephora', amount: '+$12.50', status: 'Approved', date: 'Yesterday' },
    { id: 3, brand: 'Nike', amount: '+$5.20', status: 'Paid', date: 'Oct 24' },
];

export default function DashboardScreen() {
    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />
            <SafeAreaView className="flex-1">

                {/* Header */}
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <Text className="text-white text-2xl font-bold">Dashboard</Text>
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

                    {/* Earnings Card */}
                    <LinearGradient
                        colors={['#E31C79', '#FFB800']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full rounded-3xl p-6 mb-8 relative overflow-hidden"
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-white/80 font-medium">Total Earnings</Text>
                            <TouchableOpacity className="bg-white/20 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-bold">Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-white text-5xl font-bold mb-4">$256.40</Text>

                        <View className="flex-row gap-4">
                            <View className="bg-black/20 p-2 rounded-xl flex-1 backdrop-blur-sm">
                                <Text className="text-white/60 text-xs">Pending</Text>
                                <Text className="text-white font-bold text-lg">$21.49</Text>
                            </View>
                            <View className="bg-black/20 p-2 rounded-xl flex-1 backdrop-blur-sm">
                                <Text className="text-white/60 text-xs">Available</Text>
                                <Text className="text-white font-bold text-lg">$234.91</Text>
                            </View>
                        </View>

                        {/* Decoration */}
                        <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    </LinearGradient>

                    {/* Stats Row */}
                    <Text className="text-white text-lg font-bold mb-4">Performance</Text>
                    <View className="flex-row gap-4 mb-8">
                        <View className="flex-1 bg-gray-900 p-4 rounded-2xl border border-gray-800">
                            <Ionicons name="trending-up" size={24} color="#4ADE80" className="mb-2" />
                            <Text className="text-gray-400 text-xs">Engagement</Text>
                            <Text className="text-white font-bold text-xl">+24%</Text>
                        </View>
                        <View className="flex-1 bg-gray-900 p-4 rounded-2xl border border-gray-800">
                            <Ionicons name="people" size={24} color="#60A5FA" className="mb-2" />
                            <Text className="text-gray-400 text-xs">Reach</Text>
                            <Text className="text-white font-bold text-xl">12.5k</Text>
                        </View>
                    </View>

                    {/* History */}
                    <Text className="text-white text-lg font-bold mb-4">Recent Activity</Text>
                    <View className="pb-24">
                        {HISTORY.map((item) => (
                            <View key={item.id} className="flex-row items-center bg-gray-900/50 p-4 rounded-xl mb-3">
                                <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center mr-4">
                                    <Ionicons name="bag-handle" size={20} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base">{item.brand}</Text>
                                    <Text className="text-gray-500 text-xs">{item.date}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-green-400 font-bold text-base">{item.amount}</Text>
                                    <Text className={`text-xs ${item.status === 'Pending' ? 'text-yellow-500' : 'text-gray-400'}`}>{item.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
