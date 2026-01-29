import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { getProducts } from '@/lib/shopify';
import { Product } from '@/lib/shopify/types';

// Debounce hook
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const CATEGORIES = [
    { id: '1', name: 'Fashion', icon: 'shirt-outline' },
    { id: '2', name: 'Beauty', icon: 'sparkles-outline' },
    { id: '3', name: 'Tech', icon: 'hardware-chip-outline' },
    { id: '4', name: 'Home', icon: 'home-outline' },
];

import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

export default function ExploreScreen() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 500);
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                // Fetch products based on query, or fetch default/featured if empty
                const { products } = await getProducts({
                    query: debouncedQuery.length > 2 ? debouncedQuery : undefined,
                    limit: 10
                });
                setResults(products);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [debouncedQuery]);

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* Fixed Search Header */}
            <View className="absolute top-0 left-0 right-0 z-50 px-6 pt-12 pb-4 bg-black/90 backdrop-blur-md">
                <View className="flex-row items-center gap-4 mb-4">
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
                    >
                        <Ionicons name="menu-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-3xl font-bold">Discover</Text>
                </View>

                <View className="flex-row items-center bg-gray-900 rounded-2xl px-4 py-3 border border-gray-800">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search RIIQX..."
                        placeholderTextColor="#6B7280"
                        className="flex-1 ml-3 text-white text-lg"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={false} // User can tap to focus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Animated.ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 160 }} // Space for header
                scrollEventThrottle={16}
            >

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

                {/* Results */}
                <View className="px-6 pb-24">
                    <Text className="text-white text-xl font-bold mb-4">
                        {searchQuery ? 'Results' : 'New Arrivals'}
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#E31C79" />
                    ) : (
                        results.map((item) => (
                            <Link key={item.id} href={`/product/${item.handle}`} asChild>
                                <TouchableOpacity className="flex-row bg-gray-900 mb-4 rounded-2xl overflow-hidden h-32 border border-gray-800">
                                    <Image
                                        source={{ uri: item.featuredImage?.url || 'https://via.placeholder.com/150' }}
                                        className="w-32 h-full"
                                        resizeMode="cover"
                                    />
                                    <View className="flex-1 p-4 justify-between">
                                        <View>
                                            <Text className="text-gray-400 text-xs mb-1 uppercase">RIIQX</Text>
                                            <Text className="text-white font-bold text-lg leading-tight" numberOfLines={2}>{item.title}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-white font-medium">
                                                {item.priceRange?.minVariantPrice?.amount} {item.priceRange?.minVariantPrice?.currencyCode}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        ))
                    )}

                    {!loading && results.length === 0 && (
                        <Text className="text-gray-500 text-center mt-8">No products found.</Text>
                    )}
                </View>

            </Animated.ScrollView>
        </SafeAreaView>
    );
}
