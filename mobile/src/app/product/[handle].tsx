import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getProduct, formatPrice } from "@/lib/shopify";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { ArrowLeft, ShoppingBag, Heart, Share2 } from "lucide-react-native";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useIslandStore } from "@/store/islandStore";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { PremiumButton } from "@/components/ui/PremiumButton";

export default function ProductScreen() {
    const { handle } = useLocalSearchParams<{ handle: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Options State
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    const router = useRouter();
    const addItem = useCartStore(state => state.addItem);
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    // Check if in wishlist
    const isWishlisted = product ? isInWishlist(product.id) : false;

    const toggleWishlist = () => {
        if (!product) return;
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    useEffect(() => {
        async function load() {
            if (!handle) return;
            try {
                const fetchedProduct = await getProduct(handle);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    // Pre-select first variant
                    if (fetchedProduct.variants.edges.length > 0) {
                        const firstVariant = fetchedProduct.variants.edges[0].node;
                        setSelectedVariant(firstVariant);

                        // Initialize options
                        const initialOptions: Record<string, string> = {};
                        firstVariant.selectedOptions.forEach((opt: any) => {
                            initialOptions[opt.name] = opt.value;
                        });
                        setSelectedOptions(initialOptions);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [handle]);

    // Handle Option Click
    const handleOptionSelect = (name: string, value: string) => {
        const newOptions = { ...selectedOptions, [name]: value };
        setSelectedOptions(newOptions);

        // Find matching variant
        if (product) {
            const variantEdge = product.variants.edges.find((edge: any) => {
                return edge.node.selectedOptions.every((opt: any) => newOptions[opt.name] === opt.value);
            });
            if (variantEdge) {
                setSelectedVariant(variantEdge.node);
            }
        }
    };

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;

        addItem({
            id: selectedVariant.id, // Store key
            variantId: selectedVariant.id,
            productId: product.id,
            title: product.title,
            price: selectedVariant.price.amount,
            currencyCode: selectedVariant.price.currencyCode,
            image: selectedVariant.image?.url || product.featuredImage?.url,
            quantity: 1,
            color: selectedOptions['Color'],
            size: selectedOptions['Size']
        });

        // Trigger Dynamic Island (Commerce update)
        const newCount = useCartStore.getState().getItemCount();
        useIslandStore.getState().startActivity({
            id: 'cart-status',
            type: 'cart',
            title: 'Added to Bag',
            subtitle: `${newCount} items`,
            priority: 10,
        });
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#CCFF00" />
            </View>
        );
    }

    if (!product) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-white font-display">Product not found.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header Image */}
                <View className="w-full aspect-[3/4] relative bg-neutral-900">
                    <Image
                        source={{ uri: selectedVariant?.image?.url || product.featuredImage?.url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', '#050505']}
                        className="absolute bottom-0 left-0 right-0 h-32"
                    />

                    {/* Floating Nav */}
                    <SafeAreaView className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-start">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
                        >
                            <ArrowLeft color="white" size={20} />
                        </TouchableOpacity>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={toggleWishlist}
                                className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
                            >
                                <Heart
                                    color={isWishlisted ? "#E31C79" : "white"}
                                    fill={isWishlisted ? "#E31C79" : "transparent"}
                                    size={20}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                                <Share2 color="white" size={20} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>

                {/* Content */}
                <View className="px-6 -mt-8 relative z-10">
                    <Animated.Text
                        entering={FadeInDown.delay(100).springify()}
                        className="text-white text-3xl font-display uppercase leading-tight mb-2"
                    >
                        {product.title}
                    </Animated.Text>

                    <Animated.Text
                        entering={FadeInDown.delay(200).springify()}
                        className="text-brand text-2xl font-mono font-bold mb-6"
                    >
                        {selectedVariant ?
                            formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode) :
                            formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
                        }
                    </Animated.Text>

                    {/* Options */}
                    {product.options.map((option, idx) => (
                        <Animated.View
                            key={option.id}
                            entering={FadeInDown.delay(300 + idx * 100).springify()}
                            className="mb-6"
                        >
                            <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
                                Select {option.name}
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {option.values.map((value) => {
                                    const isSelected = selectedOptions[option.name] === value;
                                    return (
                                        <TouchableOpacity
                                            key={value}
                                            onPress={() => handleOptionSelect(option.name, value)}
                                            className={`px-5 py-3 rounded-xl border ${isSelected ? 'bg-white border-white' : 'bg-surface border-white/10'}`}
                                        >
                                            <Text className={`font-bold uppercase text-sm ${isSelected ? 'text-black' : 'text-white'}`}>
                                                {value}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </Animated.View>
                    ))}

                    <View className="mb-6 mt-4">
                        <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Description</Text>
                        <Text className="text-white/80 leading-6 font-sans">
                            {product.description}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#050505]/90 border-t border-white/10 p-4 pb-8 backdrop-blur-lg">
                <View className="flex-row gap-4 items-center">
                    <View>
                        <Text className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Total Price</Text>
                        <Text className="text-white text-xl font-display uppercase">
                            {selectedVariant ?
                                formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode) :
                                '---'
                            }
                        </Text>
                    </View>
                    <PremiumButton
                        label={selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
                        variant="primary"
                        onPress={handleAddToCart}
                        disabled={!selectedVariant?.availableForSale}
                        className={`flex-1 ${!selectedVariant?.availableForSale && 'opacity-50'}`}
                        textClassName="text-base"
                    />
                </View>
            </View>
        </View>
    );
}
