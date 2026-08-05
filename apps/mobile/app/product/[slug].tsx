import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Heart, ShoppingBag, ShieldCheck, Zap } from 'lucide-react-native';
import { useMobileCartStore } from '../../store/useMobileCartStore';

const { width } = Dimensions.get('window');

const PRODUCT = {
  id: 'prod-001',
  name: 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
  slug: 'heavyweight-tactical-hoodie',
  category: 'HOODIES & FLEECE',
  basePrice: 14999,
  salePrice: 12999,
  description:
    'Constructed from 520GSM French Terry cotton with cybernetic arm patch, magnetic face guard, and laser-cut ventilation ports.',
  specs: ['520 GSM French Terry', 'Cyber-cut Chamfer Pockets', 'YKK AquaGuard Zippers'],
  colors: ['OBSIDIAN BLACK', 'CYBER CYAN', 'VOLTAGE PURPLE'],
  sizes: ['M', 'L', 'XL', '2XL'],
  images: [
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
  ],
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const addItem = useMobileCartStore((state) => state.addItem);

  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[1]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem({
      variantId: `var-${PRODUCT.id}-${selectedColor}-${selectedSize}`,
      productId: PRODUCT.id,
      name: PRODUCT.name,
      slug: PRODUCT.slug,
      color: selectedColor,
      size: selectedSize,
      price: PRODUCT.salePrice,
      image: PRODUCT.images[0],
    });
    Alert.alert('BAG UPDATED', `${PRODUCT.name} added to tactical bag.`);
  };

  return (
    <View className="flex-1 bg-obsidian-base">
      {/* Top Header Floating Controls */}
      <View className="absolute top-12 left-5 right-5 z-20 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          className="bg-obsidian-base/80 p-2.5 rounded-full border border-glass-border-medium"
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          className="bg-obsidian-base/80 p-2.5 rounded-full border border-glass-border-medium"
        >
          <Heart size={20} color="#FF003C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Horizontal Gesture Image Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e: any) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {PRODUCT.images.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={{ width, height: width * 1.25 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Carousel Page Dots */}
        <View className="flex-row justify-center gap-2 -mt-6 mb-4 z-10">
          {PRODUCT.images.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                activeImageIndex === i ? 'w-6 bg-accent-crimson' : 'w-1.5 bg-riiqxText-muted'
              }`}
            />
          ))}
        </View>

        {/* Product Details Section */}
        <View className="px-5 pt-2 pb-24">
          <Text className="text-accent-cyan font-mono text-xs font-bold tracking-widest mb-1">
            {PRODUCT.category} // CAPSULE 004
          </Text>

          <Text className="text-white font-extrabold text-2xl mb-2">{PRODUCT.name}</Text>

          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-accent-crimson font-mono text-xl font-extrabold">
              ₹{PRODUCT.salePrice.toLocaleString()}
            </Text>
            <Text className="text-riiqxText-muted font-mono text-sm line-through">
              ₹{PRODUCT.basePrice.toLocaleString()}
            </Text>
          </View>

          <Text className="text-riiqxText-secondary font-mono text-xs leading-5 mb-6">
            {PRODUCT.description}
          </Text>

          {/* Color Selector */}
          <Text className="text-white font-mono text-xs font-bold tracking-widest mb-2">
            COLOR SPEC: {selectedColor}
          </Text>
          <View className="flex-row gap-2 mb-6">
            {PRODUCT.colors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedColor(color);
                }}
                className={`px-3 py-2 rounded border ${
                  selectedColor === color
                    ? 'bg-accent-crimson/20 border-accent-crimson'
                    : 'bg-charcoal-matte border-glass-border-subtle'
                }`}
              >
                <Text
                  className={`font-mono text-xs font-bold ${
                    selectedColor === color ? 'text-accent-crimson' : 'text-riiqxText-muted'
                  }`}
                >
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Size Selector */}
          <Text className="text-white font-mono text-xs font-bold tracking-widest mb-2">
            SIZE SPEC: {selectedSize}
          </Text>
          <View className="flex-row gap-2 mb-6">
            {PRODUCT.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedSize(size);
                }}
                className={`w-12 h-12 rounded items-center justify-center border ${
                  selectedSize === size
                    ? 'bg-accent-cyan/20 border-accent-cyan'
                    : 'bg-charcoal-matte border-glass-border-subtle'
                }`}
              >
                <Text
                  className={`font-mono text-xs font-bold ${
                    selectedSize === size ? 'text-accent-cyan' : 'text-riiqxText-muted'
                  }`}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Sticky Add to Cart Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-charcoal-matte border-t border-glass-border-subtle">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-accent-crimson rounded-lg py-4 flex-row items-center justify-center shadow-glow-crimson"
        >
          <ShoppingBag size={18} color="#FFFFFF" className="mr-2" />
          <Text className="text-white font-mono font-bold text-xs tracking-widest">
            ADD TO TACTICAL BAG — ₹{PRODUCT.salePrice.toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
