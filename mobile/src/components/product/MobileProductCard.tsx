import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Plus, Share2, ArrowUpRight } from 'lucide-react-native';
import { clsx } from 'clsx';

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    type?: string;
    badge?: string;
    isAccessory?: boolean;
}

interface MobileProductCardProps {
    product: Product;
    onPress?: () => void;
    onAddToCart?: () => void;
}

export function MobileProductCard({ product, onPress, onAddToCart }: MobileProductCardProps) {
    // Accessory Logic (Simplified for now, similar to Web)
    const isAccessory = product.isAccessory || product.type?.includes("Accessory");

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="w-[48%] bg-[#0A0A0A] border border-white/10 overflow-hidden mb-4 group"
        >
            {/* ═ TOP BAR ═ */}
            <View className="flex-row justify-between items-center p-2 border-b border-white/5 bg-[#080808]">
                <Text className="text-[8px] font-mono text-neon uppercase tracking-widest opacity-80">
                    //RIIQX_V2
                </Text>

                <View className="flex-row items-center gap-2">
                    {/* Status Indicator */}
                    <View className="flex-row gap-1 items-center px-1.5 py-0.5 border border-neon/20 rounded-full bg-neon/5">
                        <View className="w-1 h-1 bg-neon rounded-full" />
                        <Text className="text-[6px] font-bold text-neon uppercase tracking-widest">LIVE</Text>
                    </View>
                </View>
            </View>

            {/* ═ IMAGE CONTAINER ═ */}
            <View className="relative w-full aspect-[3/4] bg-surface">
                <Image
                    source={{ uri: product.image }}
                    className="w-full h-full opacity-90"
                    resizeMode="cover"
                />

                {/* Badges */}
                {product.badge && (
                    <View className="absolute top-2 left-2 bg-white/10 border border-white/20 px-2 py-1 backdrop-blur-md">
                        <Text className="text-white text-[8px] font-bold uppercase tracking-widest">
                            {product.badge}
                        </Text>
                    </View>
                )}

                {/* Gradient Overlay */}
                <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* FAST ADD BUTTON (Absolute Bottom) */}
                <TouchableOpacity
                    onPress={onAddToCart}
                    className={clsx(
                        "absolute bottom-0 left-0 right-0 py-2.5 flex-row items-center justify-center gap-1",
                        isAccessory ? "bg-white" : "bg-neon"
                    )}
                >
                    <Plus color="black" size={12} strokeWidth={3} />
                    <Text className="text-black text-[10px] font-black uppercase tracking-widest">
                        {isAccessory ? "FAST ADD" : "QUICK ADD"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ═ INFO SECTION ═ */}
            <View className="p-3 bg-[#0A0A0A]">
                <View className="flex-row justify-between items-start mb-2">
                    <Text
                        className="text-white font-display text-lg uppercase leading-5 flex-1 mr-2"
                        numberOfLines={2}
                    >
                        {product.title}
                    </Text>
                    <ArrowUpRight color="#B4F000" size={16} />
                </View>

                <View className="border-t border-white/5 pt-2 flex-row justify-between items-end">
                    <View>
                        <Text className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-0.5">
                            PRICE
                        </Text>
                        <Text className="text-white font-mono font-bold text-base">
                            {product.price}
                        </Text>
                    </View>

                    <View className={clsx(
                        "px-1.5 py-0.5 border",
                        isAccessory
                            ? "border-neon/30 bg-neon/10"
                            : "border-white/10 bg-white/5"
                    )}>
                        <Text className={clsx(
                            "text-[8px] uppercase tracking-widest font-mono",
                            isAccessory ? "text-neon" : "text-white/50"
                        )}>
                            {isAccessory ? 'LIFESTYLE' : 'APPAREL'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
