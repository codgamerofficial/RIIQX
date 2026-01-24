import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ScalePressableProps extends PressableProps {
    children: React.ReactNode;
    scaleTo?: number;
    disabled?: boolean;
}

export function ScalePressable({ children, style, scaleTo = 0.96, disabled, onPress, ...props }: ScalePressableProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withTiming(scaleTo, { duration: 100, easing: Easing.bezier(0.2, 0, 0, 1) });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 150, easing: Easing.bezier(0.2, 0, 0, 1) });
    };

    return (
        <Animated.View style={[style, animatedStyle]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                disabled={disabled}
                {...props}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
}
