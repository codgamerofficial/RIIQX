import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Package, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react-native';

const STEPS = [
  { label: 'ORDER PLACED', status: 'completed' },
  { label: 'FABRICATION (QIKINK)', status: 'completed' },
  { label: 'PRINTED & QC', status: 'completed' },
  { label: 'DISPATCHED', status: 'active' },
  { label: 'DELIVERED', status: 'pending' },
];

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleOpenCarrier = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync('https://www.bluedart.com');
  };

  return (
    <View className="flex-1 bg-obsidian-base pt-12 px-5">
      {/* Header Navigation */}
      <View className="flex-row items-center justify-between pb-4 border-b border-glass-border-subtle mb-4">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          className="flex-row items-center"
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text className="text-white font-mono text-xs font-bold ml-2">BACK</Text>
        </TouchableOpacity>
        <Text className="text-accent-cyan font-mono text-xs font-bold">ORDER SPEC #{id}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Info Card */}
        <View className="bg-charcoal-matte border border-glass-border-subtle rounded-lg p-4 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-extrabold text-base">BATCH 004 // TACTICAL HOODIE</Text>
            <Text className="text-accent-crimson font-mono text-xs font-bold">₹12,999</Text>
          </View>
          <Text className="text-riiqxText-muted font-mono text-xs mb-3">
            CARRIER: BLUEDART EXPRESS // AWB: BD-882710394
          </Text>

          <TouchableOpacity
            onPress={handleOpenCarrier}
            className="bg-accent-crimson rounded py-3 items-center justify-center flex-row shadow-glow-crimson"
          >
            <ExternalLink size={16} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-mono font-bold text-xs tracking-widest">
              LAUNCH CARRIER PORTAL
            </Text>
          </TouchableOpacity>
        </View>

        {/* Visual Step Timeline */}
        <View className="bg-charcoal-matte border border-glass-border-subtle rounded-lg p-5 mb-6">
          <Text className="text-white font-mono text-xs font-bold tracking-widest mb-4">
            REAL-TIME DISPATCH TIMELINE
          </Text>

          {STEPS.map((step, idx) => (
            <View key={step.label} className="flex-row items-center mb-4 relative">
              <View
                className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                  step.status === 'completed'
                    ? 'bg-accent-crimson'
                    : step.status === 'active'
                    ? 'bg-accent-cyan'
                    : 'bg-obsidian-base border border-glass-border-subtle'
                }`}
              >
                {step.status === 'completed' && <CheckCircle2 size={14} color="#FFFFFF" />}
              </View>
              <Text
                className={`font-mono text-xs ${
                  step.status === 'completed' || step.status === 'active'
                    ? 'text-white font-bold'
                    : 'text-riiqxText-muted'
                }`}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
