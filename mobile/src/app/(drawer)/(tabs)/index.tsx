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

            {/* SCOREBOARD HEADER */}
            <SafeAreaView className="px-6 pt-2 pb-4 flex-row justify-between items-center bg-background border-b border-white/10 z-50">
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Menu color="white" size={24} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white text-3xl font-display uppercase tracking-tighter italic">
                        RIIQX <Text className="text-brand-DEFAULT">FUTURE</Text>
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                        <Text className="text-white/50 text-[10px] font-mono tracking-widest">LIVE DROP</Text>
                    </View>
                </View>
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
                {/* FUTURE WEAR HERO */}
                <Animated.View entering={FadeInDown.delay(100).springify()} className="px-4 mt-4">
                    <PremiumCard className="h-[450px] justify-end p-0 border-white/20 bg-surface overflow-hidden">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop' }} // Cyberpunk model
                            className="absolute inset-0 w-full h-full opacity-60"
                        />
                        <View className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                        <View className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

                        <View className="p-6">
                            <View className="flex-row items-center gap-2 mb-2">
                                <View className="bg-brand-DEFAULT/20 px-2 py-0.5 border border-brand-DEFAULT">
                                    <Text className="text-brand-DEFAULT text-[10px] font-bold uppercase">New Season</Text>
                                </View>
                                <Text className="text-white/60 text-[10px] font-mono uppercase tracking-widest">Global Release</Text>
                            </View>

                            <Text className="text-white text-6xl font-display uppercase leading-[0.85] mb-4 italic">
                                FUTURE{"\n"}<Text className="text-brand-cyan">READY</Text>
                            </Text>

                            <View className="flex-row gap-4 mt-2">
                                <PremiumButton
                                    label="Shop Collection"
                                    variant="primary"
                                    className="self-start bg-white"
                                    textClassName="text-black font-display text-lg"
                                />
                            </View>
                        </View>
                    </PremiumCard>
                </Animated.View>

                {/* SQUAD SELECTION (Categories) */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-8 pl-6">
                    <Text className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">SELECT SQUAD</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        {CATEGORIES.map((cat, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`mr-3 px-6 py-3 border ${index === 0 ? 'bg-brand-cyan border-brand-cyan' : 'bg-surface border-white/10'}`}
                            >
                                <Text className={`font-display font-bold uppercase ${index === 0 ? 'text-black' : 'text-white/60'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* PLAYING XI (New Drops) */}
                <View className="px-4 mt-10">
                    <View className="flex-row justify-between items-end mb-6 border-l-4 border-brand-DEFAULT pl-4">
                        <View>
                            <Text className="text-white/40 text-[10px] font-mono uppercase">STARTING LINEUP</Text>
                            <Text className="text-white text-3xl font-display uppercase italic">New Drops</Text>
                        </View>
                        <Text className="text-brand-DEFAULT font-bold text-xs uppercase tracking-widest bg-brand-DEFAULT/10 px-2 py-1">View All</Text>
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-6">
                        {PRODUCTS.map((product, index) => (
                            <Animated.View
                                key={product.id}
                                entering={FadeInDown.delay(300 + index * 100).springify()}
                                className="w-[48%]"
                            >
                                <PremiumCard className="h-72 p-0 border-white/5 bg-[#0A0A0A]" variant="solid">
                                    {/* Image Area */}
                                    <View className="relative h-48 w-full bg-surface overflow-hidden">
                                        <Image
                                            source={{ uri: product.image }}
                                            className="w-full h-full opacity-90"
                                        />
                                        <View className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />

                                        {product.badge && (
                                            <View className="absolute top-2 left-2 bg-brand-ipl-rcb px-2 py-0.5">
                                                <Text className="text-white text-[10px] font-bold uppercase">{product.badge}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Stats Area */}
                                    <View className="p-3 border-t-2 border-brand-DEFAULT">
                                        <Text className="text-white font-display uppercase text-lg mb-1 line-clamp-1 italic">{product.name}</Text>
                                        <View className="flex-row justify-between items-center">
                                            <View>
                                                <Text className="text-[8px] text-white/40 font-mono">PRICE</Text>
                                                <Text className="text-brand-cyan font-mono font-bold text-lg">{product.price}</Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-[8px] text-white/40 font-mono">RATING</Text>
                                                <Text className="text-brand-purple font-mono font-bold">98.5</Text>
                                            </View>
                                        </View>
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
