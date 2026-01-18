import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getProduct, formatPrice } from "@/lib/shopify";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react-native";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

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

        Alert.alert("Added to Bag", `${product.title} has been added to your loadout.`);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <ActivityIndicator size="large" color="#D9F99D" />
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white">Product not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 relative">
                <ScrollView>
                    {/* Header Image */}
                    <View className="w-full aspect-[3/4] bg-zinc-900 relative">
                        <Image
                            source={{ uri: selectedVariant?.image?.url || product.featuredImage?.url }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />

                        {/* Back Button Overlay */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-md"
                        >
                            <ArrowLeft color="white" size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleWishlist}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-md"
                        >
                            <Heart
                                color={isWishlisted ? "#D9F99D" : "white"}
                                fill={isWishlisted ? "#D9F99D" : "transparent"}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="p-6 pb-32">
                        <Text className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                            {product.title}
                        </Text>

                        <Text className="text-2xl font-bold text-[#D9F99D] mb-6">
                            {selectedVariant ?
                                formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode) :
                                formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
                            }
                        </Text>

                        {/* Options */}
                        {product.options.map((option) => (
                            <View key={option.id} className="mb-6">
                                <Text className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3">
                                    {option.name}
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {option.values.map((value) => {
                                        const isSelected = selectedOptions[option.name] === value;
                                        return (
                                            <TouchableOpacity
                                                key={value}
                                                onPress={() => handleOptionSelect(option.name, value)}
                                                className={`px-4 py-2 border rounded-lg ${isSelected ? 'bg-white border-white' : 'bg-transparent border-white/30'}`}
                                            >
                                                <Text className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                                                    {value}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        ))}

                        <View className="mb-6">
                            <Text className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Description</Text>
                            <Text className="text-white/80 leading-6">
                                {product.description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Bar */}
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 border-t border-white/10 backdrop-blur-xl">
                    <TouchableOpacity
                        onPress={handleAddToCart}
                        className={`w-full py-4 rounded-full flex-row items-center justify-center space-x-2 ${selectedVariant?.availableForSale ? 'bg-[#D9F99D]' : 'bg-zinc-700 opacity-50'}`}
                        disabled={!selectedVariant?.availableForSale}
                    >
                        <ShoppingBag color="black" size={20} />
                        <Text className="text-black font-black uppercase tracking-wider">
                            {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
