import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getProducts, getCollectionProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight } from "lucide-react-native";
import { DesignFeaturedStory } from "@/components/marketing/DesignFeaturedStory";
import { HeroCarousel } from "@/components/home/HeroCarousel";

import { DesignFearlessPromo } from "@/components/marketing/DesignFearlessPromo";
import { DesignNewArrivalsBanner } from "@/components/marketing/DesignNewArrivalsBanner";

export default function HomeScreen() {
    const [newDrops, setNewDrops] = useState<Product[]>([]);
    const [trending, setTrending] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch New Arrivals for "Latest Drops"
                const { products: newArrivalsData } = await getCollectionProducts({ handle: 'new-arrivals', limit: 8 });
                setNewDrops(newArrivalsData);

                // Fetch Streetwear for "Trending"
                const { products: trendingData } = await getCollectionProducts({ handle: 'streetwear', limit: 4 });
                setTrending(trendingData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const renderCard = ({ item }: { item: Product }) => (
        <Link href="/shop" asChild>
            <TouchableOpacity className="mr-4 w-60 group">
                <View className="aspect-[4/5] bg-muted rounded-2xl overflow-hidden border border-white/5 relative">
                    <Image
                        source={{ uri: item.featuredImage?.url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                        <Text className="text-[#D9F99D] text-[10px] font-bold uppercase">New Drop</Text>
                    </View>
                </View>
                <View className="mt-3">
                    <Text className="text-white font-bold text-sm uppercase truncate" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-white/50 text-xs font-medium mt-1">
                        {Number(item.priceRange.minVariantPrice.amount).toLocaleString('en-US', { style: 'currency', currency: item.priceRange.minVariantPrice.currencyCode })}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Carousel v2 - Premium Redesign */}
                <HeroCarousel />

                {/* [NEW] Design 4: Fearless Promo */}
                <View className="px-6 mb-8">
                    <DesignFearlessPromo />
                </View>

                {/* [NEW] Design 3: New Arrivals Banner */}
                <DesignNewArrivalsBanner />

                {/* New Drops Horizontal Scroll */}
                <View className="pl-6 mb-8">
                    <View className="flex-row items-center justify-between pr-6 mb-4">
                        <Text className="text-white text-xl font-bold uppercase tracking-tight">Latest Drops</Text>
                        <Link href="/collections/new-arrivals" asChild>
                            <TouchableOpacity>
                                <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest">View All</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#D9F99D" />
                    ) : (
                        <FlatList
                            data={newDrops}
                            renderItem={renderCard}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 24 }}
                        />
                    )}
                </View>

                {/* [NEW] Design 1: Featured Story */}
                <View className="px-6 mb-8">
                    <DesignFeaturedStory />
                </View>

                {/* Categories / Trending Grid */}
                <View className="px-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-white text-xl font-bold uppercase tracking-tight">Trending Heat</Text>
                        <Link href="/collections/streetwear" asChild>
                            <TouchableOpacity>
                                <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest">View All</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#D9F99D" />
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {trending.map((item) => (
                                <Link key={item.id} href="/shop" asChild>
                                    <TouchableOpacity className="w-[48%] mb-4">
                                        <View className="aspect-square bg-muted rounded-xl overflow-hidden border border-white/5 mb-2">
                                            <Image
                                                source={{ uri: item.featuredImage?.url }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <Text className="text-white font-bold text-xs uppercase truncate">{item.title}</Text>
                                        <Text className="text-white/50 text-[10px] font-bold">
                                            {Number(item.priceRange.minVariantPrice.amount).toLocaleString('en-US', { style: 'currency', currency: item.priceRange.minVariantPrice.currencyCode })}
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
