'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Headphones } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const CheckoutHeader: React.FC = () => {
  return (
    <header className="w-full bg-obsidian-base/90 backdrop-blur-xl border-b border-glass-border-subtle py-4 px-6 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-sm bg-accent-crimson flex items-center justify-center font-mono font-black text-white text-base shadow-glow-crimson">
            R
          </div>
          <span className="font-display font-extrabold text-xl tracking-wider text-white">
            RIIQX
          </span>
        </Link>

        {/* Security Telemetry Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-status-success">
            <Lock className="w-3.5 h-3.5" />
            <span>256-BIT SSL ENCRYPTED CHECKOUT</span>
          </div>

          <Badge variant="cyan" shape="chamfer" dot>
            RAZORPAY SECURE
          </Badge>
        </div>
      </div>
    </header>
  );
};
