import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Search, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'cat-001', name: 'HOODIES & FLEECE', slug: 'hoodies', items: '12 DROPS' },
  { id: 'cat-002', name: 'OUTERWEAR & SHELLS', slug: 'outerwear', items: '8 DROPS' },
  { id: 'cat-003', name: 'CARGO PANTS', slug: 'pants', items: '15 DROPS' },
  { id: 'cat-004', name: 'ACCESSORIES & HARDWARE', slug: 'accessories', items: '20 DROPS' },
];

export default function ShopScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="flex-1 bg-obsidian-base pt-12">
      {/* Header & Search */}
      <View className="px-5 pb-3">
        <Text className="text-white font-extrabold text-2xl tracking-widest mb-3">CATALOG</Text>
        
        <View className="bg-charcoal-matte border border-glass-border-subtle rounded-lg px-4 py-2.5 flex-row items-center">
          <Search size={18} color="#64748b" />
          <TextInput
            placeholder="SEARCH SPEC / CATEGORY"
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-white font-mono text-xs"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12 px-5 mb-4"
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveCategory('all');
          }}
          className={`px-4 py-2 rounded-full mr-2 border ${
            activeCategory === 'all'
              ? 'bg-accent-crimson border-accent-crimson'
              : 'bg-charcoal-matte border-glass-border-subtle'
          }`}
        >
          <Text
            className={`font-mono text-xs font-bold ${
              activeCategory === 'all' ? 'text-white' : 'text-riiqxText-muted'
            }`}
          >
            ALL CAPSULES
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveCategory(cat.slug);
            }}
            className={`px-4 py-2 rounded-full mr-2 border ${
              activeCategory === cat.slug
                ? 'bg-accent-crimson border-accent-crimson'
                : 'bg-charcoal-matte border-glass-border-subtle'
            }`}
          >
            <Text
              className={`font-mono text-xs font-bold ${
                activeCategory === cat.slug ? 'text-white' : 'text-riiqxText-muted'
              }`}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Cards List */}
      <ScrollView className="flex-1 px-5">
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/product/heavyweight-tactical-hoodie');
            }}
            className="bg-charcoal-matte border border-glass-border-subtle rounded-lg p-4 mb-4 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-3">
              <Text className="text-accent-cyan font-mono text-xs font-bold mb-1">
                {cat.items}
              </Text>
              <Text className="text-white font-extrabold text-base mb-1">{cat.name}</Text>
              <Text className="text-riiqxText-muted font-mono text-xs">
                VIEW CAPSULE COLLECTION
              </Text>
            </View>

            <View className="bg-charcoal-elevated rounded-full p-2 border border-glass-border-medium">
              <ArrowRight size={18} color="#FF003C" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
