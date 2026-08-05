import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../lib/supabase';
import { User, Mail, Lock, Shield } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('REQUIRED', 'Please fill in all identity credentials.');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);

    if (error) {
      Alert.alert('REGISTRATION FAILED', error.message);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('ACCOUNT INITIALIZED', 'Please verify your email address to activate session.');
      router.replace('/(auth)/login');
    }
  };

  return (
    <View className="flex-1 bg-obsidian-base px-6 justify-center">
      {/* Header */}
      <View className="items-center mb-8">
        <Shield size={32} color="#00F0FF" />
        <Text className="text-white font-extrabold text-2xl tracking-widest mt-2">INITIALIZE PROFILE</Text>
        <Text className="text-riiqxText-muted text-xs font-mono tracking-widest mt-1">
          RIIQX BLACK LABEL ACCESS
        </Text>
      </View>

      {/* Inputs */}
      <View className="space-y-4 mb-6">
        <View className="bg-charcoal-matte border border-glass-border-subtle rounded px-4 py-3 flex-row items-center">
          <User size={18} color="#64748b" />
          <TextInput
            placeholder="FULL LEGAL NAME"
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-white font-mono text-xs"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="bg-charcoal-matte border border-glass-border-subtle rounded px-4 py-3 flex-row items-center">
          <Mail size={18} color="#64748b" />
          <TextInput
            placeholder="PRIMARY EMAIL"
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
            placeholder="SECURE PASSWORD"
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-white font-mono text-xs"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className="bg-accent-cyan rounded py-4 items-center justify-center mb-6"
      >
        {loading ? (
          <ActivityIndicator color="#050508" />
        ) : (
          <Text className="text-obsidian-base font-mono font-bold text-xs tracking-widest">
            CREATE RIIQX IDENTITY
          </Text>
        )}
      </TouchableOpacity>

      {/* Footer Navigation */}
      <View className="flex-row justify-center items-center">
        <Text className="text-riiqxText-muted font-mono text-xs">ALREADY REGISTERED? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-accent-crimson font-mono text-xs font-bold">LOGIN HERE</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
