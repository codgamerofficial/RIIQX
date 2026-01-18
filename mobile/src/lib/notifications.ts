import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true, // changed to true for better feedback
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token
        // For Expo Go, use getExpoPushTokenAsync. For actual builds, might need getDevicePushTokenAsync depending on provider.
        // We'll use Expo Push Token for simplicity as it works with Expo's push service.
        try {
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: '717d9fd1-0513-47ce-b061-26e13eb3d169' // Ideally this comes from app.json/eas.json, but for now we let it auto-detect or fail gracefully if projectId is missing in config
            })).data;
            console.log("Expo Push Token:", token);
        } catch (e) {
            console.error("Error fetching push token", e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function sendLocalNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: 'default',
        },
        trigger: null, // Send immediately
    });
}
