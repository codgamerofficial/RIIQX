'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  font?: 'display' | 'sans' | 'mono';
  gradient?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  size = '3xl',
  font = 'display',
  gradient = false,
  className,
  children,
  ...props
}) => {
  const fontStyles = {
    display: 'font-display font-extrabold tracking-tight',
    sans: 'font-sans font-bold tracking-normal',
    mono: 'font-mono font-bold tracking-wider uppercase',
  };

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl md:text-4xl',
    '4xl': 'text-4xl md:text-5xl',
    '5xl': 'text-5xl md:text-6xl',
    '6xl': 'text-6xl md:text-7xl leading-none',
  };

  return (
    <Component
      className={cn(
        fontStyles[font],
        sizeStyles[size],
        gradient
          ? 'bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-accent-cyan'
          : 'text-riiqxText-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'muted' | 'disabled' | 'accent' | 'cyan';
  font?: 'sans' | 'mono' | 'display';
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  size = 'base',
  variant = 'primary',
  font = 'sans',
  className,
  children,
  ...props
}) => {
  const fontStyles = {
    sans: 'font-sans',
    mono: 'font-mono',
    display: 'font-display',
  };

  const sizeStyles = {
    xs: 'text-xs leading-relaxed',
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-normal',
    lg: 'text-lg leading-snug',
    xl: 'text-xl leading-snug',
  };

  const variantStyles = {
    primary: 'text-riiqxText-primary',
    secondary: 'text-riiqxText-secondary',
    muted: 'text-riiqxText-muted',
    disabled: 'text-riiqxText-disabled',
    accent: 'text-accent-crimson',
    cyan: 'text-accent-cyan',
  };

  return (
    <Component
      className={cn(fontStyles[font], sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
