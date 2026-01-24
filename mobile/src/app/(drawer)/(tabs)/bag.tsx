import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createCart, formatPrice } from "@/lib/shopify";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react-native";
import { useState } from "react";
import { sendLocalNotification } from "@/lib/notifications";

export default function BagScreen() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const { accessToken } = useAuthStore();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setCheckingOut(true);

        try {
            const lines = items.map(item => ({
                merchandiseId: item.variantId,
                quantity: item.quantity
            }));

            // Pass accessToken if available to link checkout to user
            const cart = await createCart(lines, accessToken || undefined);

            if (cart && cart.checkoutUrl) {
                // Clear cart locally (optional, or wait for webhook/success)
                // clearCart(); 

                await sendLocalNotification("Processing Loadout", "Secure channel established. Redirecting to transaction terminal.");

                // Open Checkout
                await Linking.openURL(cart.checkoutUrl);
            } else {
                Alert.alert("Error", "Could not initiate checkout.");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to connect to checkout.");
        } finally {
            setCheckingOut(false);
        }
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View className="flex-row gap-4 mb-6 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
            <View className="w-20 h-24 bg-zinc-800 rounded-lg overflow-hidden">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>

            <View className="flex-1 justify-between">
                <View>
                    <Text className="text-white font-bold uppercase tracking-tight text-sm mb-1">{item.title}</Text>
                    <Text className="text-white/50 text-xs">
                        {item.color} {item.size ? `• ${item.size}` : ''}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[#D9F99D] font-bold text-sm">
                        {formatPrice(item.price, item.currencyCode)}
                    </Text>

                    <View className="flex-row items-center gap-3 bg-zinc-800 rounded-full px-2 py-1">
                        <TouchableOpacity onPress={() => updateQuantity(item.variantId, item.quantity - 1, item.color, item.size)}>
                            <Minus size={14} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-xs font-bold w-4 text-center">{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.variantId, item.quantity + 1, item.color, item.size)}>
                            <Plus size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => removeItem(item.variantId, item.color, item.size)}
                className="justify-center pl-2"
            >
                <Trash2 size={18} color="#ef4444" opacity={0.8} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="px-6 py-4 border-b border-white/10">
                <Text className="text-3xl font-black text-white uppercase tracking-tighter">Loadout</Text>
                <Text className="text-white/50 text-xs font-medium uppercase tracking-widest mt-1">
                    {items.length} Items Selected
                </Text>
            </View>

            {items.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <ShoppingBag size={48} color="#333" />
                    <Text className="text-white/30 font-bold mt-4 uppercase tracking-widest">Bag is Empty</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.variantId}-${item.color}-${item.size}`}
                        contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                    />

                    <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/90 border-t border-white/10 backdrop-blur-xl">
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-white/50 font-bold uppercase text-xs">Total Estimate</Text>
                            <Text className="text-white font-black text-lg">
                                {formatPrice(String(getTotalPrice()), "INR")}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleCheckout}
                            disabled={checkingOut}
                            className="w-full bg-[#D9F99D] py-4 rounded-full flex-row items-center justify-center space-x-2"
                        >
                            {checkingOut ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <>
                                    <Text className="text-black font-black uppercase tracking-wider">
                                        Secure Checkout
                                    </Text>
                                    <View className="bg-black/10 rounded-full p-1">
                                        <ShoppingBag size={14} color="black" />
                                    </View>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
