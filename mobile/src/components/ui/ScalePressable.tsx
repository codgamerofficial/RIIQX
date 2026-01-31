import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ScalePressableProps extends PressableProps {
    children: React.ReactNode;
    scaleTo?: number;
    disabled?: boolean;
    hapticFeedback?: boolean;
    hapticStyle?: Haptics.ImpactFeedbackStyle;
    springConfig?: {
        damping?: number;
        stiffness?: number;
        mass?: number;
    };
    style?: StyleProp<ViewStyle>;
}

export function ScalePressable({
    children,
    style,
    scaleTo = 0.96,
    disabled,
    hapticFeedback = true,
    hapticStyle = Haptics.ImpactFeedbackStyle.Light,
    springConfig = { damping: 15, stiffness: 400, mass: 0.8 },
    onPress,
    onPressIn,
    onPressOut,
    ...props
}: ScalePressableProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = (event: any) => {
        if (disabled) return;

        if (hapticFeedback) {
            Haptics.impactAsync(hapticStyle);
        }

        scale.value = withTiming(scaleTo, {
            duration: 100,
            easing: Easing.bezier(0.2, 0, 0, 1)
        });
        opacity.value = withTiming(0.9, { duration: 100 });

        onPressIn?.(event);
    };

    const handlePressOut = (event: any) => {
        scale.value = withSpring(1, springConfig);
        opacity.value = withTiming(1, { duration: 150 });

        onPressOut?.(event);
    };

    return (
        <Animated.View style={[style as any, animatedStyle]}>
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

// Bounce pressable with more pronounced feedback
interface BouncePressableProps extends PressableProps {
    children: React.ReactNode;
    bounceScale?: number;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function BouncePressable({
    children,
    style,
    bounceScale = 0.92,
    disabled,
    onPress,
    ...props
}: BouncePressableProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withSpring(bounceScale, { damping: 10, stiffness: 500 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 400 });
    };

    return (
        <Animated.View style={[style as any, animatedStyle]}>
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

// Card pressable with elevation effect
interface CardPressableProps extends PressableProps {
    children: React.ReactNode;
    disabled?: boolean;
    elevated?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function CardPressable({
    children,
    style,
    disabled,
    elevated = true,
    onPress,
    ...props
}: CardPressableProps) {
    const scale = useSharedValue(1);
    const elevation = useSharedValue(elevated ? 5 : 0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        shadowOpacity: interpolate(
            elevation.value,
            [0, 10],
            [0, 0.3],
            Extrapolate.CLAMP
        ),
        shadowRadius: elevation.value,
        elevation: elevation.value,
    }));

    const handlePressIn = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withTiming(0.98, { duration: 100 });
        elevation.value = withTiming(elevated ? 2 : 0, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        elevation.value = withSpring(elevated ? 5 : 0, { damping: 15, stiffness: 400 });
    };

    return (
        <Animated.View
            style={[
                style as any,
                animatedStyle,
                {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                }
            ]}
        >
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
