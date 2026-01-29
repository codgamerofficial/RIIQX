import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Menu, Search, ShoppingBag } from 'lucide-react-native';

import { PremiumCard, CardTitle, CardContent } from '../../../components/ui/PremiumCard';
import { PremiumButton } from '../../../components/ui/PremiumButton';

const CATEGORIES = ["New", "Tees", "Oversized", "Bottoms", "Accessories"];

const PRODUCTS = [
    { id: '1', name: "Phantom Black Tee", price: "₹1,299", image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop', badge: "NEW" },
    { id: '2', name: "Cyberpunk Hoodie", price: "₹2,499", image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop', badge: "HOT" },
    { id: '3', name: "Street Cargo", price: "₹1,899", image: 'https://images.unsplash.com/photo-1517445312882-5632f77eec86?q=80&w=2069&auto=format&fit=crop' },
    { id: '4', name: "Neon Cap", price: "₹899", image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1935&auto=format&fit=crop' },
];

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-background">
            <StatusBar style="light" />

            {/* Header */}
            <SafeAreaView className="px-6 pt-2 pb-4 flex-row justify-between items-center bg-background/90 z-50">
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Menu color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-3xl font-display uppercase tracking-tighter">RIIQX</Text>
                <View className="flex-row gap-4">
                    <Search color="white" size={24} />
                    <ShoppingBag color="white" size={24} />
                </View>
            </SafeAreaView>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Hero Section */}
                <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6 mt-4">
                    <PremiumCard className="h-[400px] justify-end p-0 border-white/20">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1000&auto=format&fit=crop' }}
                            className="absolute inset-0 w-full h-full opacity-80"
                        />
                        <View className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        <View className="p-6">
                            <Text className="text-brand font-bold tracking-widest uppercase mb-2">Collection 2026</Text>
                            <Text className="text-white text-5xl font-display uppercase leading-tight mb-4">
                                Built For{"\n"}The Bold
                            </Text>
                            <PremiumButton
                                label="Shop Now"
                                variant="primary"
                                className="self-start"
                            />
                        </View>
                    </PremiumCard>
                </Animated.View>

                {/* Categories */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-8 pl-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        {CATEGORIES.map((cat, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`mr-3 px-6 py-3 rounded-full border ${index === 0 ? 'bg-white border-white' : 'bg-transparent border-white/20'}`}
                            >
                                <Text className={`font-display font-bold uppercase ${index === 0 ? 'text-black' : 'text-white/60'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* New Drops */}
                <View className="px-6 mt-10">
                    <View className="flex-row justify-between items-end mb-6">
                        <Text className="text-white text-2xl font-display uppercase">New Drops</Text>
                        <Text className="text-brand font-bold text-xs uppercase tracking-widest">View All</Text>
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-6">
                        {PRODUCTS.map((product, index) => (
                            <Animated.View
                                key={product.id}
                                entering={FadeInDown.delay(300 + index * 100).springify()}
                                className="w-[48%]"
                            >
                                <PremiumCard className="h-64 p-0 border-white/5 bg-surface" variant="glass">
                                    <Image
                                        source={{ uri: product.image }}
                                        className="w-full h-48 rounded-t-[24px]"
                                    />
                                    {product.badge && (
                                        <View className="absolute top-3 left-3 bg-white px-2 py-1">
                                            <Text className="text-black text-[10px] font-bold uppercase">{product.badge}</Text>
                                        </View>
                                    )}
                                    <View className="p-3">
                                        <Text className="text-white font-display uppercase text-sm mb-1 line-clamp-1">{product.name}</Text>
                                        <Text className="text-white/60 font-mono text-xs">{product.price}</Text>
                                    </View>
                                </PremiumCard>
                            </Animated.View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
