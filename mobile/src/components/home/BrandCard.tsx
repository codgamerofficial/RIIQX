import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface BrandCardProps {
    name: string;
    image: string;
    cashback: string;
    category: string;
    index: number;
}

export function BrandCard({ name, image, cashback, category, index }: BrandCardProps) {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            className="mb-4 mr-4 bg-gray-900 rounded-3xl overflow-hidden shadow-sm shadow-gray-800"
            style={{ width: width * 0.42, height: width * 0.55 }}
        >
            <Image
                source={{ uri: image }}
                className="absolute w-full h-full"
                resizeMode="cover"
            />

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
                className="absolute w-full h-full justify-end p-3"
            >
                <View className="bg-cherry self-start px-2 py-1 rounded-md mb-auto ml-auto">
                    <Text className="text-white text-xs font-bold">{cashback}</Text>
                </View>

                <Text className="text-gray-300 text-xs font-medium mb-1 uppercase tracking-wider">{category}</Text>
                <Text className="text-white text-lg font-bold leading-tight">{name}</Text>
            </LinearGradient>
        </Animated.View>
    );
}
