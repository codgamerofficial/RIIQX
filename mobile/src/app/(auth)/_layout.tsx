import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#000000' },
                    animation: 'fade',
                }}
            />
        </View>
    );
}
