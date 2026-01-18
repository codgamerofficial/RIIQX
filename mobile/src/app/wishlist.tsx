import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/shopify";
import { Link, Stack } from "expo-router";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react-native";

export default function WishlistScreen() {
    const { items, removeItem } = useWishlistStore();

    return (
        <SafeAreaView className="flex-1 bg-black">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-4 border-b border-white/10 flex-row items-center gap-4">
                <Link href="../" asChild>
                    <TouchableOpacity>
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>
                </Link>
                <View>
                    <Text className="text-xl font-black text-white uppercase tracking-tighter">Wishlist</Text>
                    <Text className="text-white/50 text-xs font-medium uppercase tracking-widest">{items.length} Items</Text>
                </View>
            </View>

            {items.length === 0 ? (
                <View className="flex-1 items-center justify-center p-6">
                    <Text className="text-white text-lg font-bold mb-2">Your wishlist is empty</Text>
                    <Text className="text-white/50 text-center mb-6">Save items you want to track here.</Text>
                    <Link href="/(tabs)/shop" asChild>
                        <TouchableOpacity className="bg-[#D9F99D] px-8 py-3 rounded-full">
                            <Text className="text-black font-bold uppercase text-xs tracking-wider">Start Shopping</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View className="flex-row bg-[#1A1A1A] mb-4 rounded-xl overflow-hidden border border-white/5">
                            <Link href={`/product/${item.handle}`} asChild>
                                <TouchableOpacity className="w-24 h-24 bg-zinc-800">
                                    <Image
                                        source={{ uri: item.featuredImage?.url }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            </Link>

                            <View className="flex-1 p-3 justify-center">
                                <Link href={`/product/${item.handle}`} asChild>
                                    <TouchableOpacity>
                                        <Text className="text-white font-bold text-sm uppercase mb-1" numberOfLines={1}>{item.title}</Text>
                                    </TouchableOpacity>
                                </Link>
                                <Text className="text-[#D9F99D] font-bold text-sm mb-3">
                                    {formatPrice(item.priceRange.minVariantPrice.amount, item.priceRange.minVariantPrice.currencyCode)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => removeItem(item.id)}
                                className="w-12 items-center justify-center bg-white/5 border-l border-white/5"
                            >
                                <Trash2 size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}
