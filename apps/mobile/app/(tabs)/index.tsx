import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ShieldAlert, ArrowUpRight, Zap, ShoppingBag } from 'lucide-react-native';
import { useMobileCartStore } from '../../store/useMobileCartStore';

const { width } = Dimensions.get('window');

const DROPS = [
  {
    id: 'prod-001',
    name: 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
    slug: 'heavyweight-tactical-hoodie',
    category: 'HOODIES & FLEECE',
    price: '₹12,999',
    rawPrice: 12999,
    badge: 'DROP-004',
    specs: '520 GSM French Terry Cotton',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'prod-002',
    name: 'CYBERNETIC BONDED BOMBER JACKET',
    slug: 'cybernetic-bonded-bomber',
    category: 'OUTERWEAR & SHELLS',
    price: '₹18,499',
    rawPrice: 18499,
    badge: 'DROP-004',
    specs: '3-Layer Waterproof Nylon',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'prod-003',
    name: 'OMNI-CARGO TACTICAL PANTS',
    slug: 'omni-cargo-tactical-pants',
    category: 'CARGO PANTS',
    price: '₹12,499',
    rawPrice: 12499,
    badge: 'DROP-003',
    specs: '8 Modular Magnetic Utility Pockets',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const addItem = useMobileCartStore((state) => state.addItem);

  const handleQuickAdd = (drop: typeof DROPS[0]) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem({
      variantId: `var-${drop.id}-L`,
      productId: drop.id,
      name: drop.name,
      slug: drop.slug,
      color: 'OBSIDIAN BLACK',
      size: 'L',
      price: drop.rawPrice,
      image: drop.image,
    });
  };

  return (
    <View className="flex-1 bg-obsidian-base">
      {/* Fixed Top Bar */}
      <View className="pt-12 pb-3 px-5 border-b border-glass-border-subtle flex-row justify-between items-center bg-obsidian-base z-10">
        <View className="flex-row items-center gap-2">
          <ShieldAlert size={20} color="#FF003C" />
          <Text className="text-white font-extrabold text-xl tracking-widest">RIIQX</Text>
        </View>
        <View className="bg-accent-crimson/10 border border-accent-crimson/30 px-3 py-1 rounded-full flex-row items-center">
          <Zap size={12} color="#FF003C" />
          <Text className="text-accent-crimson font-mono text-xs font-bold ml-1">CAPSULE 004</Text>
        </View>
      </View>

      {/* Main Snap Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {DROPS.map((drop, idx) => (
          <View key={drop.id} className="mb-6 px-4 pt-4">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/product/${drop.slug}`);
              }}
              className="relative rounded-lg overflow-hidden border border-glass-border-subtle bg-charcoal-matte"
            >
              {/* Media Card */}
              <Image
                source={{ uri: drop.image }}
                style={{ width: '100%', height: width * 1.1 }}
                resizeMode="cover"
              />

              {/* Gradient Overlay Details */}
              <View className="p-4 bg-charcoal-matte border-t border-glass-border-subtle">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-accent-cyan font-mono text-xs font-bold tracking-widest">
                    {drop.category}
                  </Text>
                  <Text className="text-accent-crimson font-mono text-sm font-extrabold">
                    {drop.price}
                  </Text>
                </View>

                <Text className="text-white font-extrabold text-lg mb-1" numberOfLines={1}>
                  {drop.name}
                </Text>
                <Text className="text-riiqxText-muted font-mono text-xs mb-3">
                  SPEC: {drop.specs}
                </Text>

                {/* Card Actions */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/product/${drop.slug}`);
                    }}
                    className="flex-1 bg-charcoal-elevated border border-glass-border-medium rounded py-2.5 items-center justify-center flex-row"
                  >
                    <Text className="text-white font-mono text-xs font-bold mr-1">INSPECT SPEC</Text>
                    <ArrowUpRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleQuickAdd(drop)}
                    className="bg-accent-crimson rounded px-4 py-2.5 items-center justify-center flex-row"
                  >
                    <ShoppingBag size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
