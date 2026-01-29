import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PremiumCardProps extends ViewProps {
    className?: string;
    children?: React.ReactNode;
    variant?: 'glass' | 'solid' | 'outline';
}

export function PremiumCard({ className, children, variant = 'glass', style, ...props }: PremiumCardProps) {
    const baseStyles = "rounded-[24px] overflow-hidden border border-white/10";

    const variants = {
        glass: "bg-surface/60",
        solid: "bg-surface",
        outline: "bg-transparent border-white/20"
    };

    return (
        <View
            className={twMerge(baseStyles, variants[variant], className)}
            style={style}
            {...props}
        >
            {/* Dark Gradient Overlay equivalent */}
            <View className="absolute inset-0 bg-black/20" pointerEvents="none" />

            {/* Content */}
            <View className="relative z-10 p-4">
                {children}
            </View>
        </View>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <View className={twMerge("mb-3", className)}>{children}</View>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <Text className={twMerge("font-display text-xl text-white uppercase tracking-wider", className)}>{children}</Text>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <View className={twMerge(className)}>{children}</View>;
}
