import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PremiumButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    label: string;
    icon?: React.ReactNode;
    className?: string;
    textClassName?: string;
}

export function PremiumButton({
    variant = 'primary',
    size = 'md',
    label,
    icon,
    className,
    textClassName,
    ...props
}: PremiumButtonProps) {

    const baseStyles = "flex-row items-center justify-center rounded-full uppercase tracking-widest font-bold active:scale-[0.98]";

    const variants = {
        primary: "bg-brand text-black",
        secondary: "bg-white text-black",
        outline: "border border-white/20 bg-transparent text-white",
        danger: "bg-red-500/10 border border-red-500 text-red-500",
        glass: "bg-white/10 border border-white/20 text-white",
    };

    const sizes = {
        sm: "h-10 px-4",
        md: "h-12 px-6",
        lg: "h-14 px-8",
    };

    const textVariants = {
        primary: "text-black",
        secondary: "text-black",
        outline: "text-white",
        danger: "text-red-500",
        glass: "text-white",
    };

    return (
        <TouchableOpacity
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text
                className={twMerge(
                    "font-display font-bold",
                    size === 'sm' ? 'text-xs' : 'text-sm',
                    textVariants[variant],
                    textClassName
                )}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
