'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Shield, ArrowUpRight, Cpu, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [utcTime, setUtcTime] = useState('');
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
      setIstTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#060605] border-t border-[#D4AF37]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Ambient Warm Golden Glow Backdrop */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Top Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Manifesto Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#D4AF37] to-[#8B7321] flex items-center justify-center font-mono font-black text-[#0C0B0A] text-base shadow-glow-gold">
                R
              </div>
              <span className="font-display font-bold text-2xl tracking-widest text-white">
                RIIQX
              </span>
            </div>
            <p className="font-mono text-xs text-riiqxText-muted leading-relaxed">
              Ultra-exclusive, liquid-gold haute streetwear label operating at the intersection of whispering luxury, haute couture, and high-performance digital commerce.
            </p>
            <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30">
              GOLDEN MODE ACTIVE
            </Badge>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#D4AF37] uppercase tracking-widest block font-bold">
              // COLLECTIONS
            </span>
            <ul className="space-y-2 text-riiqxText-secondary">
              <li>
                <Link href="/collections/hoodies" className="hover:text-[#D4AF37] transition-colors">
                  HOODIES & FLEECE (520 GSM)
                </Link>
              </li>
              <li>
                <Link href="/collections/outerwear" className="hover:text-[#D4AF37] transition-colors">
                  BOMBER & SHELLS (CORDURA)
                </Link>
              </li>
              <li>
                <Link href="/collections/cargos" className="hover:text-[#D4AF37] transition-colors">
                  TACTICAL CARGO PANTS
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-[#D4AF37] transition-colors">
                  COMPLETE CAPSULE CATALOG
                </Link>
              </li>
            </ul>
          </div>

          {/* System Spec Column */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#F3E5AB] uppercase tracking-widest block font-bold">
              // SPECIFICATION
            </span>
            <ul className="space-y-2 text-riiqxText-secondary">
              <li>
                <Link href="/design-system" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                  GOLDEN TOKEN SPEC <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  LIVE CARRIER TRACKING
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  256-BIT ENCRYPTED CHECKOUT
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  PRIVACY PROTOCOL
                </Link>
              </li>
            </ul>
          </div>

          {/* Live Server Telemetry */}
          <div className="space-y-4 font-mono text-xs p-4 rounded-sm bg-[#141312] border border-[#D4AF37]/20">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Cpu className="w-4 h-4 animate-pulse text-[#F3E5AB]" />
              <span className="font-bold tracking-wider">LIVE TELEMETRY</span>
            </div>
            <div className="space-y-1.5 text-riiqxText-muted text-[11px]">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>SERVER UTC:</span>
                <span className="text-white font-bold">{utcTime || '00:00:00 UTC'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>LOCAL IST:</span>
                <span className="text-white font-bold">{istTime || '00:00:00 IST'}</span>
              </div>
              <div className="flex justify-between">
                <span>NODE REGION:</span>
                <span className="text-[#D4AF37] font-bold">ASIA-SOUTH1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-[#D4AF37]/15 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-riiqxText-muted">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>© 2026 RIIQX HAUTE COUTURE. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#D4AF37] cursor-pointer">INSTAGRAM // @RIIQX</span>
            <span className="hover:text-[#D4AF37] cursor-pointer">DISCORD // RIIQX_GOLD</span>
            <span className="hover:text-[#D4AF37] cursor-pointer">X // @RIIQX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
