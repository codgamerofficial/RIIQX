'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'cyan' | 'outline' | 'gold' | 'champagne';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-all duration-200 ease-magnetic select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-[#D4AF37] to-[#B38F28] text-[#0C0B0A] hover:shadow-glow-gold border border-[#F3E5AB]/40 font-bold',
      gold:
        'bg-gradient-to-r from-[#D4AF37] to-[#B38F28] text-[#0C0B0A] hover:shadow-glow-gold border border-[#F3E5AB]/40 font-bold',
      champagne:
        'bg-[#F3E5AB] text-[#0C0B0A] hover:bg-[#F3E5AB]/90 hover:shadow-glow-champagne border border-white/50 font-bold',
      secondary:
        'bg-[#1C1B18]/80 text-riiqxText-primary border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:bg-[#24221E] hover:shadow-glass-sm',
      ghost:
        'bg-transparent text-riiqxText-secondary hover:text-[#D4AF37] hover:bg-white/5',
      danger:
        'bg-status-error/20 text-status-error border border-status-error/40 hover:bg-status-error hover:text-white',
      cyan:
        'bg-[#00F0FF] text-[#0C0B0A] font-black hover:bg-[#00F0FF]/90 border border-[#00F0FF]/50',
      outline:
        'bg-transparent text-riiqxText-primary border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-glow-gold',
    };

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-sm gap-2',
      lg: 'text-base px-8 py-3.5 rounded-md gap-3',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current mr-1" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
