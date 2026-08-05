'use client';

import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export interface FreeShippingBarProps {
  subtotal: number;
  threshold?: number; // Free shipping threshold in INR (default: 15000)
}

export const FreeShippingBar: React.FC<FreeShippingBarProps> = ({
  subtotal,
  threshold = 15000,
}) => {
  const isUnlocked = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="p-3.5 rounded-sm bg-charcoal-matte/80 border border-glass-border-subtle font-mono text-xs space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        {isUnlocked ? (
          <span className="text-status-success font-bold flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" /> FREE CYBER EXPRESS SHIPPING UNLOCKED
          </span>
        ) : (
          <span className="text-riiqxText-secondary flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-accent-cyan" /> ADD{' '}
            <strong className="text-accent-cyan font-bold">₹{remaining.toLocaleString('en-IN')}</strong> MORE FOR FREE SHIPPING
          </span>
        )}
        <span className="text-riiqxText-muted font-bold">{percentage}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-1.5 rounded-full bg-obsidian-base overflow-hidden border border-glass-border-subtle">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full transition-all duration-500 ease-magnetic ${
            isUnlocked
              ? 'bg-status-success shadow-[0_0_10px_rgba(0,255,157,0.8)]'
              : 'bg-accent-crimson shadow-glow-crimson'
          }`}
        />
      </div>
    </div>
  );
};
