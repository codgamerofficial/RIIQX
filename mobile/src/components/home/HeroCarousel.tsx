import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const HEIGHT = 280;

const HERO_ITEMS = [
    {
        id: 1,
        title: "Summer Collection",
        subtitle: "Earn 15% Cashback",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        color: "#E31C79"
    },
    {
        id: 2,
        title: "Luxury Beauty",
        subtitle: "Sephora & More",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop",
        color: "#FFB800"
    }
];

export function HeroCarousel() {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 5000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    return (
        <View className="w-full mb-8 relative" style={{ height: HEIGHT }}>
            {/* Simulation of a carousel - simplified for MVP */}
            <View className="w-full h-full">
                <Image
                    source={{ uri: HERO_ITEMS[0].image }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)', '#000000']}
                    className="absolute w-full h-full justify-end px-6 pb-10"
                >
                    <View className="mb-2 bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full border border-white/30">
                        <Text className="text-white font-bold text-xs uppercase tracking-widest">Trending Now</Text>
                    </View>
                    <Text className="text-white text-4xl font-bold mb-2 w-3/4">
                        {HERO_ITEMS[0].title}
                    </Text>
                    <Text className="text-gray-300 text-lg font-medium">
                        {HERO_ITEMS[0].subtitle}
                    </Text>
                </LinearGradient>
            </View>

            {/* Progress Indicator */}
            <View className="absolute bottom-4 left-6 right-6 h-1 bg-gray-800 rounded-full overflow-hidden">
                <Animated.View
                    className="h-full bg-cherry"
                    style={{ width: `${50}%` }} // Dynamic in real implemention
                />
            </View>
        </View>
    );
}
