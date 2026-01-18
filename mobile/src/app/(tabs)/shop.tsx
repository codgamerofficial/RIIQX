import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { Link } from "expo-router";

export default function ShopScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const { products: fetchedProducts } = await getProducts({ limit: 20 });
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
            <TouchableOpacity className="flex-1 m-2 mb-6 group">
                <View className="aspect-[4/5] bg-muted rounded-xl overflow-hidden border border-white/5 mb-2 relative">
                    <Image
                        source={{ uri: item.featuredImage?.url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                <Text className="text-white font-bold text-xs uppercase truncate">{item.title}</Text>
                <Text className="text-[#D9F99D] text-xs font-bold mt-1">
                    {Number(item.priceRange.minVariantPrice.amount).toLocaleString('en-US', { style: 'currency', currency: item.priceRange.minVariantPrice.currencyCode })}
                </Text>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-4 py-4 border-b border-white/10">
                <Text className="text-2xl font-black text-white uppercase tracking-tighter">All Drops</Text>
                <Text className="text-white/50 text-xs font-medium uppercase tracking-widest mt-1">Shop All Products</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#D9F99D" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            )}
        </SafeAreaView>
    );
}
