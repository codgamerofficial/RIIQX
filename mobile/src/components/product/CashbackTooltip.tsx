import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface CashbackTooltipProps {
    amount: string;
}

export function CashbackTooltip({ amount }: CashbackTooltipProps) {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }]
    }));

    return (
        <Animated.View className="bg-white px-4 py-2 rounded-full flex-row items-center shadow-lg shadow-black/20" style={animatedStyle}>
            <View className="w-5 h-5 bg-green-500 rounded-full items-center justify-center mr-2">
                <Ionicons name="cash" size={12} color="white" />
            </View>
            <Text className="text-black font-bold text-sm">Earn {amount} Cashback</Text>
        </Animated.View>
    );
}
