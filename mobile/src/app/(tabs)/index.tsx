import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HeroCarousel } from '../../components/home/HeroCarousel';
import { BrandCard } from '../../components/home/BrandCard';
import { Ionicons } from '@expo/vector-icons';
import { useIslandStore } from '../../store/islandStore';

const CATEGORIES = ["All", "Beauty", "Fashion", "Lifestyle", "Wellness", "Tech"];
const BRANDS = [
    { id: '1', name: "Zara", image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop', cashback: '10%', category: 'Fashion' },
    { id: '2', name: "Sephora", image: 'https://images.unsplash.com/photo-1571781535014-53bd96540988?q=80&w=2070&auto=format&fit=crop', cashback: '5%', category: 'Beauty' },
    { id: '3', name: "Nike", image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', cashback: '8%', category: 'Sport' },
    { id: '4', name: "Aesop", image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop', cashback: '12%', category: 'Beauty' },
];

export default function HomeScreen() {
    return (
        <View className="flex-1 bg-background">
            <StatusBar style="light" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <SafeAreaView className="px-6 pb-2 flex-row justify-between items-center bg-black/80">
                    <Text className="text-white text-2xl font-bold">Cherry<Text className="text-cherry">.</Text></Text>
                    <View className="flex-row gap-4">
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="bag-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <HeroCarousel />

                <ScrollView horizontal showsVerticalScrollIndicator={false} className="px-6 mb-8">
                    {/* Demo Trigger */}
                    <TouchableOpacity
                        onPress={() => useIslandStore.getState().startActivity({
                            id: 'music-1',
                            type: 'music',
                            title: 'Starboy',
                            subtitle: 'The Weeknd',
                        })}
                        className="mr-4 px-6 py-2 rounded-full border bg-cherry border-cherry"
                    >
                        <Text className="font-bold text-white">🎵 Play Music</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => useIslandStore.getState().startActivity({
                            id: 'timer-1',
                            type: 'timer',
                            title: 'Timer',
                            subtitle: '14:59',
                        })}
                        className="mr-4 px-6 py-2 rounded-full border bg-orange-500 border-orange-500"
                    >
                        <Text className="font-bold text-white">⏱ Start Timer</Text>
                    </TouchableOpacity>

                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`mr-4 px-6 py-2 rounded-full border ${index === 0 ? 'bg-white border-white' : 'bg-transparent border-gray-700'}`}
                        >
                            <Text className={`font-bold ${index === 0 ? 'text-black' : 'text-gray-400'}`}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Brands */}
                <View className="px-6 mb-24">
                    <View className="flex-row justify-between items-end mb-6">
                        <Text className="text-white text-xl font-bold">Trending Brands</Text>
                        <TouchableOpacity>
                            <Text className="text-cherry font-medium">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap justify-between">
                        {BRANDS.map((brand, index) => (
                            <BrandCard
                                key={brand.id}
                                index={index}
                                {...brand}
                            />
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
