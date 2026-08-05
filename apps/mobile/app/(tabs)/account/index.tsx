import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../../lib/supabase';
import { User, Package, MapPin, LogOut, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react-native';

const MOCK_ORDERS = [
  {
    id: 'ord-8812',
    orderNumber: 'RIIQX-99201',
    date: '2026-08-04',
    total: 12999,
    status: 'shipped',
    carrier: 'BlueDart Express',
    trackingNumber: 'BD-882710394',
    trackingUrl: 'https://www.bluedart.com',
    itemCount: 1,
    firstItemName: 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
  },
  {
    id: 'ord-7711',
    orderNumber: 'RIIQX-88192',
    date: '2026-07-28',
    total: 18499,
    status: 'delivered',
    carrier: 'Delhivery Ground',
    trackingNumber: 'DEL-99182371',
    trackingUrl: 'https://www.delhivery.com',
    itemCount: 1,
    firstItemName: 'CYBERNETIC BONDED BOMBER JACKET',
  },
];

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const openCarrierTracking = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View className="flex-1 bg-obsidian-base pt-12">
      {/* Header Profile */}
      <View className="px-5 pb-4 border-b border-glass-border-subtle flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="bg-charcoal-matte border border-glass-border-medium w-12 h-12 rounded-full items-center justify-center">
            <User size={24} color="#00F0FF" />
          </View>
          <View>
            <Text className="text-white font-extrabold text-lg">
              {user?.user_metadata?.full_name || 'VALUED RECRUIT'}
            </Text>
            <Text className="text-riiqxText-muted font-mono text-xs">
              {user?.email || 'CYBER OPERATIVE'}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} className="p-2">
          <LogOut size={20} color="#FF003C" />
        </TouchableOpacity>
      </View>

      {/* Orders Section */}
      <ScrollView className="flex-1 px-5 pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-mono font-bold text-xs tracking-widest">
            ORDER HISTORY & DISPATCH STATUS
          </Text>
          <View className="bg-accent-crimson/10 border border-accent-crimson/30 px-2 py-0.5 rounded">
            <Text className="text-accent-crimson font-mono text-xs font-bold">QIKINK LOGISTICS</Text>
          </View>
        </View>

        {MOCK_ORDERS.map((order) => (
          <TouchableOpacity
            key={order.id}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/(tabs)/account/${order.id}`);
            }}
            className="bg-charcoal-matte border border-glass-border-subtle rounded-lg p-4 mb-4"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-accent-cyan font-mono text-xs font-bold">
                {order.orderNumber}
              </Text>
              <View className="bg-accent-crimson/20 border border-accent-crimson/40 px-2.5 py-0.5 rounded-full">
                <Text className="text-accent-crimson font-mono text-xs font-bold text-transform uppercase">
                  {order.status}
                </Text>
              </View>
            </View>

            <Text className="text-white font-extrabold text-sm mb-1">{order.firstItemName}</Text>
            <Text className="text-riiqxText-muted font-mono text-xs mb-3">
              DATE: {order.date} // TOTAL: ₹{order.total.toLocaleString()}
            </Text>

            {/* Carrier Action */}
            <View className="flex-row justify-between items-center border-t border-glass-border-subtle pt-3">
              <Text className="text-riiqxText-secondary font-mono text-xs">
                CARRIER: {order.carrier}
              </Text>
              <TouchableOpacity
                onPress={() => openCarrierTracking(order.trackingUrl)}
                className="flex-row items-center bg-charcoal-elevated border border-glass-border-medium px-3 py-1.5 rounded"
              >
                <Text className="text-accent-cyan font-mono text-xs font-bold mr-1">TRACK CARRIER</Text>
                <ExternalLink size={12} color="#00F0FF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
