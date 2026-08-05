'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'crimson' | 'cyan' | 'lime' | 'voltage' | 'glass' | 'outline' | 'neutral' | 'gold' | 'champagne';
  shape?: 'square' | 'pill' | 'chamfer';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'gold',
  shape = 'chamfer',
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    gold:
      'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]',
    champagne:
      'bg-[#F3E5AB]/15 text-[#F3E5AB] border-[#F3E5AB]/40 shadow-[0_0_10px_rgba(243,229,171,0.2)]',
    crimson:
      'bg-accent-crimson/15 text-accent-crimson border-accent-crimson/40 shadow-[0_0_10px_rgba(255,0,60,0.2)]',
    cyan:
      'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    lime:
      'bg-accent-lime/15 text-accent-lime border-accent-lime/40 shadow-[0_0_10px_rgba(204,255,0,0.2)]',
    voltage:
      'bg-accent-voltage/20 text-purple-300 border-accent-voltage/50 shadow-[0_0_10px_rgba(112,0,255,0.3)]',
    glass:
      'bg-white/5 text-riiqxText-secondary border-glass-border-medium backdrop-blur-md',
    outline:
      'bg-transparent text-riiqxText-primary border-glass-border-active',
    neutral:
      'bg-[#1C1B18] text-riiqxText-muted border-[#D4AF37]/15',
  };

  const shapeStyles = {
    square: 'rounded-none',
    pill: 'rounded-full px-3',
    chamfer: 'rounded-sm',
  };

  const dotColors = {
    gold: 'bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]',
    champagne: 'bg-[#F3E5AB] shadow-[0_0_6px_#F3E5AB]',
    crimson: 'bg-accent-crimson shadow-[0_0_6px_#ff003c]',
    cyan: 'bg-accent-cyan shadow-[0_0_6px_#00f0ff]',
    lime: 'bg-accent-lime shadow-[0_0_6px_#ccff00]',
    voltage: 'bg-accent-voltage shadow-[0_0_6px_#7000ff]',
    glass: 'bg-white',
    outline: 'bg-white',
    neutral: 'bg-riiqxText-muted',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border select-none',
        variantStyles[variant],
        shapeStyles[shape],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />
      )}
      <span>{children}</span>
    </div>
  );
};
