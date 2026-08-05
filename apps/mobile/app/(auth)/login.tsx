import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('REQUIRED', 'Please enter your account email and password.');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('AUTHENTICATION FAILED', error.message);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'riiqx://auth/callback' },
    });

    if (error) {
      Alert.alert('SSO ERROR', error.message);
    } else if (data?.url) {
      await WebBrowser.openAuthSessionAsync(data.url, 'riiqx://auth/callback');
    }
  };

  return (
    <View className="flex-1 bg-obsidian-base px-6 justify-center">
      {/* Header */}
      <View className="items-center mb-10">
        <View className="flex-row items-center gap-2 mb-2">
          <ShieldCheck size={28} color="#FF003C" />
          <Text className="text-white font-extrabold text-3xl tracking-widest">RIIQX</Text>
        </View>
        <Text className="text-riiqxText-muted text-xs font-mono tracking-widest">
          CYBERNETIC LUXURY APPAREL PORTAL
        </Text>
      </View>

      {/* Inputs */}
      <View className="space-y-4 mb-6">
        <View className="bg-charcoal-matte border border-glass-border-subtle rounded px-4 py-3 flex-row items-center">
          <Mail size={18} color="#64748b" />
          <TextInput
            placeholder="CYBER EMAIL ADDRESS"
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-white font-mono text-xs"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="bg-charcoal-matte border border-glass-border-subtle rounded px-4 py-3 flex-row items-center">
          <Lock size={18} color="#64748b" />
          <TextInput
            placeholder="ACCESS TOKEN / PASSWORD"
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-white font-mono text-xs"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-accent-crimson rounded py-4 items-center justify-center flex-row mb-4 shadow-glow-crimson"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text className="text-white font-mono font-bold text-xs tracking-widest mr-2">
              AUTHENTICATE SESSION
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>

      {/* OAuth SSO Buttons */}
      <View className="space-y-2 mb-8">
        <TouchableOpacity
          onPress={() => handleOAuth('google')}
          className="bg-charcoal-elevated border border-glass-border-medium rounded py-3 items-center"
        >
          <Text className="text-white font-mono text-xs font-semibold">CONTINUE WITH GOOGLE SSO</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Navigation */}
      <View className="flex-row justify-center items-center">
        <Text className="text-riiqxText-muted font-mono text-xs">NEW RECRUIT? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text className="text-accent-cyan font-mono text-xs font-bold">INITIALIZE IDENTITY</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
