import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const { queryParams } = Linking.parse(url);
        if (queryParams?.access_token && queryParams?.refresh_token) {
          await supabase.auth.setSession({
            access_token: queryParams.access_token as string,
            refresh_token: queryParams.refresh_token as string,
          });
        }
      }
      router.replace('/(tabs)');
    };

    handleUrl();
  }, []);

  return (
    <View className="flex-1 bg-obsidian-base items-center justify-center p-6">
      <ActivityIndicator size="large" color="#FF003C" />
      <Text className="text-white font-bold text-sm tracking-widest mt-4">
        VERIFYING BIOMETRIC PROTOCOL...
      </Text>
    </View>
  );
}
