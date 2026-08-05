import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { useMobileCartStore } from '../../store/useMobileCartStore';
import { ShoppingBag, Trash2, Plus, Minus, Lock, ArrowRight, Tag } from 'lucide-react-native';

export default function BagScreen() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } = useMobileCartStore();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 15000;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleApplyCoupon = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (coupon.toUpperCase() === 'CYBER10') {
      setDiscount(subtotal * 0.1);
      Alert.alert('PROMO APPLIED', '10% Cyber Discount Applied.');
    } else {
      Alert.alert('INVALID CODE', 'Use code CYBER10 for 10% off.');
    }
  };

  const handleCheckoutHandoff = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const checkoutUrl = 'http://localhost:3000/checkout';
    await WebBrowser.openBrowserAsync(checkoutUrl);
  };

  const finalTotal = subtotal - discount;

  return (
    <View className="flex-1 bg-obsidian-base pt-12">
      {/* Header */}
      <View className="px-5 pb-3 border-b border-glass-border-subtle flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <ShoppingBag size={22} color="#FF003C" />
          <Text className="text-white font-extrabold text-2xl tracking-widest">TACTICAL BAG</Text>
        </View>
        <Text className="text-accent-cyan font-mono text-xs font-bold">{getItemCount()} ITEMS</Text>
      </View>

      {/* Free Shipping Progress Indicator */}
      <View className="bg-charcoal-matte p-4 border-b border-glass-border-subtle">
        <Text className="text-white font-mono text-xs font-bold mb-2">
          {remainingForFreeShipping === 0
            ? '✓ FREE EXPRESS DISPATCH UNLOCKED'
            : `ADD ₹${remainingForFreeShipping.toLocaleString()} FOR FREE EXPRESS DISPATCH`}
        </Text>
        <View className="w-full bg-obsidian-base h-2 rounded-full overflow-hidden">
          <View
            className="bg-accent-crimson h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Cart Items ScrollView */}
      <ScrollView className="flex-1 px-5 pt-4">
        {items.length === 0 ? (
          <View className="items-center justify-center py-20">
            <ShoppingBag size={48} color="#334155" />
            <Text className="text-riiqxText-muted font-mono text-sm mt-4">BAG IS EMPTY</Text>
          </View>
        ) : (
          items.map((item) => (
            <View
              key={item.variantId}
              className="bg-charcoal-matte border border-glass-border-subtle rounded-lg p-3 mb-3 flex-row items-center"
            >
              <Image
                source={{ uri: item.image }}
                className="w-20 h-20 rounded bg-obsidian-base mr-3"
                resizeMode="cover"
              />

              <View className="flex-1">
                <Text className="text-white font-extrabold text-sm mb-1" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-riiqxText-muted font-mono text-xs mb-2">
                  {item.color} // SIZE {item.size}
                </Text>
                <Text className="text-accent-crimson font-mono text-xs font-bold">
                  ₹{item.price.toLocaleString()}
                </Text>
              </View>

              {/* Quantity Controls */}
              <View className="items-end gap-2">
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    removeItem(item.variantId);
                  }}
                >
                  <Trash2 size={16} color="#64748b" />
                </TouchableOpacity>

                <View className="flex-row items-center bg-obsidian-base border border-glass-border-subtle rounded px-2 py-1">
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      updateQuantity(item.variantId, item.quantity - 1);
                    }}
                  >
                    <Minus size={12} color="#FFFFFF" />
                  </TouchableOpacity>

                  <Text className="text-white font-mono text-xs font-bold mx-2">
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      updateQuantity(item.variantId, item.quantity + 1);
                    }}
                  >
                    <Plus size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Coupon Code Section */}
        {items.length > 0 && (
          <View className="bg-charcoal-matte border border-glass-border-subtle rounded-lg p-3 my-4 flex-row items-center">
            <Tag size={16} color="#00F0FF" />
            <TextInput
              placeholder="COUPON (TRY CYBER10)"
              placeholderTextColor="#64748b"
              className="flex-1 ml-2 text-white font-mono text-xs"
              value={coupon}
              onChangeText={setCoupon}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              onPress={handleApplyCoupon}
              className="bg-charcoal-elevated border border-glass-border-medium px-3 py-1.5 rounded"
            >
              <Text className="text-accent-cyan font-mono text-xs font-bold">APPLY</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Fixed Checkout Bar */}
      {items.length > 0 && (
        <View className="p-5 bg-charcoal-matte border-t border-glass-border-subtle">
          <View className="flex-row justify-between mb-2">
            <Text className="text-riiqxText-muted font-mono text-xs">SUBTOTAL</Text>
            <Text className="text-white font-mono text-xs">₹{subtotal.toLocaleString()}</Text>
          </View>

          {discount > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-accent-cyan font-mono text-xs">CYBER10 PROMO</Text>
              <Text className="text-accent-cyan font-mono text-xs">-₹{discount.toLocaleString()}</Text>
            </View>
          )}

          <View className="flex-row justify-between mb-4 border-t border-glass-border-subtle pt-2">
            <Text className="text-white font-mono text-sm font-bold">TOTAL ESTIMATE</Text>
            <Text className="text-accent-crimson font-mono text-base font-extrabold">
              ₹{finalTotal.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCheckoutHandoff}
            className="bg-accent-crimson rounded-lg py-4 flex-row items-center justify-center shadow-glow-crimson"
          >
            <Lock size={16} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-mono font-bold text-xs tracking-widest mr-2">
              PROCEED TO SECURE CHECKOUT
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
