import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getProduct, formatPrice } from "@/lib/shopify";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react-native";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useIslandStore } from "@/store/islandStore";

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
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#e31c79" />
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-rich-black">Product not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Sticky Header */}
            <View className="bg-white border-b border-neutral-gray px-4 py-3">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft color="#1f1f1f" size={24} />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-rich-black flex-1 text-center" numberOfLines={1}>{product.title}</Text>
                    <TouchableOpacity onPress={toggleWishlist}>
                        <Heart
                            color={isWishlisted ? "#e31c79" : "#1f1f1f"}
                            fill={isWishlisted ? "#e31c79" : "transparent"}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 relative">
                <ScrollView>
                    {/* Header Image */}
                    <View className="w-full aspect-[3/4] bg-neutral-light relative">
                        <Image
                            source={{ uri: selectedVariant?.image?.url || product.featuredImage?.url }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>

                    <View className="p-6 pb-32">
                        <Text className="text-2xl font-bold font-serif text-rich-black mb-2">
                            {product.title}
                        </Text>

                        <Text className="text-xl font-bold text-cherry-red mb-6">
                            {selectedVariant ?
                                formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode) :
                                formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
                            }
                        </Text>

                        {/* Options */}
                        {product.options.map((option) => (
                            <View key={option.id} className="mb-6">
                                <Text className="text-neutral-gray text-sm font-semibold uppercase mb-3">
                                    {option.name}
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {option.values.map((value) => {
                                        const isSelected = selectedOptions[option.name] === value;
                                        return (
                                            <TouchableOpacity
                                                key={value}
                                                onPress={() => handleOptionSelect(option.name, value)}
                                                className={`px-4 py-2 border rounded-lg ${isSelected ? 'bg-cherry-red border-cherry-red' : 'bg-transparent border-neutral-gray'}`}
                                            >
                                                <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-rich-black'}`}>
                                                    {value}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        ))}

                        <View className="mb-6">
                            <Text className="text-neutral-gray text-sm font-semibold uppercase mb-2">Description</Text>
                            <Text className="text-rich-black leading-6">
                                {product.description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Bar */}
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-gray">
                    <TouchableOpacity
                        onPress={handleAddToCart}
                        className={`w-full py-4 rounded-lg flex-row items-center justify-center ${selectedVariant?.availableForSale ? 'bg-cherry-red' : 'bg-neutral-gray'}`}
                        disabled={!selectedVariant?.availableForSale}
                    >
                        <ShoppingBag color="white" size={20} />
                        <Text className="text-white font-bold uppercase ml-2">
                            {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
