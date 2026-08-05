import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string) => {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key: string) => {
    try {
      return SecureStore.deleteItemAsync(key);
    } catch {
      return Promise.resolve();
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://scqnqibmjgkhkrepuort.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcW5xaWJtamdraGtyZXB1b3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjQ4MDIsImV4cCI6MjEwMTUwMDgwMn0.OW0zGC52ItUoTMKvouAO7flYyX67gH6DUCFfSx_ThY0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
