import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight } from "lucide-react-native";

export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const { products: fetchedProducts } = await getProducts({ limit: 4 });
                setProducts(fetchedProducts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const renderProduct = ({ item }: { item: Product }) => (
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
                {/* Hero Section */}
                <View className="px-6 pt-6 pb-8">
                    <Text className="text-[#D9F99D] text-sm font-bold tracking-widest uppercase mb-2">Welcome to RIIQX</Text>
                    <Text className="text-white text-5xl font-black tracking-tighter leading-tight mb-4">
                        WEAR YOUR <Text className="text-transparent" style={{ color: 'transparent', textShadowColor: '#fff', textShadowRadius: 1 }}>REALITY</Text>
                    </Text>
                    <Text className="text-white/50 text-base mb-6 max-w-[80%]">
                        Digital streetwear for the metaverse generation. Limited drops available now.
                    </Text>

                    <Link href="/shop" asChild>
                        <TouchableOpacity className="bg-[#D9F99D] self-start px-8 py-3 rounded-full flex-row items-center">
                            <Text className="text-black font-black uppercase tracking-widest mr-2">Shop Drops</Text>
                            <ArrowRight color="#000" size={16} />
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* New Drops Horizontal Scroll */}
                <View className="pl-6 mb-8">
                    <View className="flex-row items-center justify-between pr-6 mb-4">
                        <Text className="text-white text-xl font-bold uppercase tracking-tight">Latest Drops</Text>
                        <Link href="/shop" asChild>
                            <TouchableOpacity>
                                <Text className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest">View All</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#D9F99D" />
                    ) : (
                        <FlatList
                            data={products}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 24 }}
                        />
                    )}
                </View>

                {/* Categories / Trending Grid placeholder */}
                <View className="px-6">
                    <Text className="text-white text-xl font-bold uppercase tracking-tight mb-4">Trending Now</Text>
                    <View className="h-40 bg-muted/50 rounded-2xl border border-white/5 items-center justify-center">
                        <Text className="text-white/30 font-bold uppercase">Trending Grid Loading...</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
