import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

export async function registerForPushNotificationsAsync(userId?: string) {
  let token: string | undefined;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (userId && token) {
      try {
        await supabase
          .from('profiles')
          .update({ expo_push_token: token } as any)
          .eq('id', userId);
      } catch {
        // Fallback for dev mode
      }
    }
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF003C',
    });
  }

  return token;
}
