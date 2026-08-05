'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'elevated' | 'bordered' | 'glow';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', hoverEffect = true, children, ...props }, ref) => {
    const variantStyles = {
      glass:
        'bg-charcoal-matte/60 backdrop-blur-xl border border-glass-border-subtle shadow-glass-md',
      elevated:
        'bg-charcoal-elevated/80 backdrop-blur-2xl border border-glass-border-medium shadow-glass-lg',
      bordered:
        'bg-obsidian-void/90 border border-glass-border-active shadow-glass-sm',
      glow:
        'bg-charcoal-matte/70 backdrop-blur-xl border border-accent-crimson/30 shadow-glow-crimson',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md p-6 relative overflow-hidden transition-all duration-300 ease-magnetic',
          variantStyles[variant],
          hoverEffect &&
            'hover:border-glass-border-active hover:-translate-y-1 hover:shadow-glass-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4 border-b border-glass-border-subtle', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-display text-xl font-bold tracking-tight text-riiqxText-primary', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('font-mono text-xs text-riiqxText-muted tracking-wide', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-glass-border-subtle mt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
