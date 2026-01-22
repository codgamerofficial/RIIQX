import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { CashbackTooltip } from '../../components/product/CashbackTooltip';
import { useCartStore } from '../../store/useCartStore';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Mock Data based on ID (simplified)
    const product = {
        id: id as string,
        name: "Oversized Wool Blazer",
        brand: "Zara",
        price: 89.90,
        cashback: "10%",
        description: "Relaxed fit blazer made of wool blend fabric. Lapel collar and long sleeves with shoulder pads. Front flap pockets. Front button closure.",
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
            "https://plus.unsplash.com/premium_photo-1673356301535-21a2d44933a0?q=80&w=1887&auto=format&fit=crop"
        ]
    };

    const handleAddToBag = () => {
        if (!selectedSize) {
            Alert.alert('Select Size', 'Please select a size before adding to bag');
            return;
        }

        addItem({
            id: product.id,
            variantId: `${product.id}-${selectedSize}`,
            productId: product.id,
            title: product.name,
            price: product.price.toString(),
            image: product.images[0],
            quantity: 1,
            size: selectedSize,
            currencyCode: 'USD',
        });

        Alert.alert(
            'Added to Bag!',
            `${product.name} (Size: ${selectedSize}) has been added to your bag.`,
            [
                { text: 'Continue Shopping', style: 'cancel' },
                { text: 'View Bag', onPress: () => router.push('/(tabs)/bag') }
            ]
        );
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            Alert.alert('Select Size', 'Please select a size before proceeding');
            return;
        }

        // Add to cart first
        addItem({
            id: product.id,
            variantId: `${product.id}-${selectedSize}`,
            productId: product.id,
            title: product.name,
            price: product.price.toString(),
            image: product.images[0],
            quantity: 1,
            size: selectedSize,
            currencyCode: 'USD',
        });

        // Navigate to checkout
        router.push('/checkout');
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Image Carousel (Simplified as single image for now) */}
                <View className="relative w-full h-[500px]">
                    <Image
                        source={{ uri: product.images[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute w-full h-full"
                    />

                    {/* Header Controls */}
                    <SafeAreaView className="absolute top-0 w-full flex-row justify-between px-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="flex-row gap-4">
                            <TouchableOpacity className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20">
                                <Ionicons name="heart-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20">
                                <Ionicons name="share-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    {/* Floating Cashback Tooltip */}
                    <View className="absolute bottom-8 left-6">
                        <CashbackTooltip amount={product.cashback} />
                    </View>
                </View>

                {/* Product Details */}
                <View className="px-6 py-8">
                    <View className="flex-row justify-between items-start mb-2">
                        <View>
                            <Text className="text-gray-400 font-bold uppercase tracking-wider mb-1">{product.brand}</Text>
                            <Text className="text-white text-3xl font-bold w-64">{product.name}</Text>
                        </View>
                        <View>
                            <Text className="text-white text-2xl font-bold">${product.price}</Text>
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-800 my-6" />

                    <Text className="text-gray-300 text-lg leading-relaxed mb-8">
                        {product.description}
                    </Text>

                    {/* Size Selector */}
                    <Text className="text-white font-bold mb-4">Select Size {selectedSize && <Text className="text-cherry">({selectedSize})</Text>}</Text>
                    <View className="flex-row gap-4 mb-24">
                        {['XS', 'S', 'M', 'L'].map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full items-center justify-center ${selectedSize === size
                                    ? 'bg-cherry border-2 border-cherry'
                                    : 'border border-gray-700 bg-gray-900'
                                    }`}
                            >
                                <Text className={`font-medium ${selectedSize === size ? 'text-white' : 'text-gray-300'}`}>
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View className="absolute bottom-0 w-full bg-black/90 px-6 pt-4 pb-10 border-t border-gray-800 flex-row gap-4">
                <TouchableOpacity
                    onPress={handleBuyNow}
                    className="flex-1 bg-white h-14 rounded-full items-center justify-center"
                >
                    <Text className="text-black font-bold text-lg">Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleAddToBag}
                    className="flex-1 bg-cherry h-14 rounded-full items-center justify-center shadow-lg shadow-cherry/30"
                >
                    <Text className="text-white font-bold text-lg">Add to Bag</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
