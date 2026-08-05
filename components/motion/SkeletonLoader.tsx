'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonLoaderProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'card';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'rectangular',
  count = 1,
}) => {
  const variantStyles = {
    rectangular: 'h-24 w-full rounded-sm',
    circular: 'h-12 w-12 rounded-full',
    text: 'h-4 w-3/4 rounded-sm',
    card: 'h-64 w-full rounded-md',
  };

  const renderSkeleton = (index: number) => (
    <div
      key={index}
      className={cn(
        'relative overflow-hidden bg-charcoal-matte/70 border border-glass-border-subtle animate-pulse-glow',
        variantStyles[variant],
        className
      )}
    >
      {/* Cyber Sweep Scanline Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[scanline-sweep_2s_infinite]" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};
