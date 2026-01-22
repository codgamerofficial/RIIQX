import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Mock Data
const SUGGESTIONS = ["Summer Dresses", "Nike Air Max", "Sephora Skincare", "Gymshark"];
const CATEGORIES = [
    { id: '1', name: 'Fashion', icon: 'shirt-outline' },
    { id: '2', name: 'Beauty', icon: 'sparkles-outline' },
    { id: '3', name: 'Tech', icon: 'hardware-chip-outline' },
    { id: '4', name: 'Home', icon: 'home-outline' },
];

const SEARCH_RESULTS = [
    { id: '1', name: 'Oversized Blazer', brand: 'Zara', price: '$89.90', cashback: '10%', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop' },
    { id: '2', name: 'Glow Serum', brand: 'Glow Recipe', price: '$42.00', cashback: '15%', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop' },
    { id: '3', name: 'Running Shorts', brand: 'Lululemon', price: '$68.00', cashback: '5%', image: 'https://images.unsplash.com/photo-1571781535014-53bd96540988?q=80&w=2070&auto=format&fit=crop' },
];

export default function ExploreScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* Search Header */}
            <View className="px-6 py-4">
                <Text className="text-white text-3xl font-bold mb-6">Discover</Text>

                <View className="flex-row items-center bg-gray-900 rounded-2xl px-4 py-3 border border-gray-800">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search brands, products..."
                        placeholderTextColor="#6B7280"
                        className="flex-1 ml-3 text-white text-lg"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Categories Grid */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">Browse Categories</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setActiveCategory(cat.id)}
                                className={`w-[48%] bg-gray-900/50 p-4 rounded-2xl mb-4 border ${activeCategory === cat.id ? 'border-cherry bg-cherry/10' : 'border-gray-800'}`}
                            >
                                <Ionicons name={cat.icon as any} size={24} color={activeCategory === cat.id ? '#E31C79' : 'white'} />
                                <Text className={`mt-2 font-bold ${activeCategory === cat.id ? 'text-cherry' : 'text-white'}`}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Search Results or Recommendations */}
                <View className="px-6 pb-24">
                    <Text className="text-white text-xl font-bold mb-4">
                        {searchQuery ? 'Results' : 'Recommended for You'}
                    </Text>

                    {SEARCH_RESULTS.map((item) => (
                        <Link key={item.id} href={`/product/${item.id}`} asChild>
                            <TouchableOpacity className="flex-row bg-gray-900 mb-4 rounded-2xl overflow-hidden h-32 border border-gray-800">
                                <Image source={{ uri: item.image }} className="w-32 h-full" resizeMode="cover" />
                                <View className="flex-1 p-4 justify-between">
                                    <View>
                                        <Text className="text-gray-400 text-xs mb-1 uppercase">{item.brand}</Text>
                                        <Text className="text-white font-bold text-lg leading-tight" numberOfLines={2}>{item.name}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-white font-medium">{item.price}</Text>
                                        <View className="bg-cherry/20 px-2 py-1 rounded-md">
                                            <Text className="text-cherry text-xs font-bold">{item.cashback} Back</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
