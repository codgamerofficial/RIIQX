'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Typography';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ArrowRight, Play, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const CinematicHero: React.FC = () => {
  return (
    <section className="relative w-full h-[92vh] min-h-[680px] flex items-center justify-center overflow-hidden bg-[#0C0B0A] border-b border-[#D4AF37]/20">
      {/* Background High-Fashion Editorial Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=2000"
          alt="RIIQX Haute Couture Hero"
          className="w-full h-full object-cover object-center opacity-35 scale-105 filter contrast-125 brightness-90"
        />
        {/* Golden Obsidian Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B0A] via-transparent to-[#0C0B0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-15 [background-size:28px_28px]" />
      </div>

      {/* Atmospheric Liquid Gold Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F3E5AB]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3"
        >
          <Badge variant="gold" shape="chamfer" dot className="px-3.5 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
            HAUTE COUTURE DROP 001 // LIVE
          </Badge>
          <span className="font-mono text-xs text-[#F3E5AB] tracking-widest hidden sm:inline flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> LIMITED LIQUID GOLD EDITION
          </span>
        </motion.div>

        {/* Monolithic Display Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <Heading
            size="6xl"
            font="display"
            className="text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#F3E5AB] to-[#D4AF37] font-bold drop-shadow-sm"
          >
            RIIQX // GOLDEN HAUTE
          </Heading>
          <p className="font-mono text-sm sm:text-base text-riiqxText-secondary max-w-2xl mx-auto tracking-wide">
            Whispering luxury streetwear engineered with 520 GSM heavyweight French Terry cotton, 3L Cordura shells, and liquid metallic hardware.
          </p>
        </motion.div>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-5 pt-4"
        >
          <MagneticButton>
            <Link href="/collections/all">
              <Button
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B38F28] text-[#0C0B0A] font-bold shadow-glow-gold hover:opacity-95"
              >
                EXPLORE COLLECTION
              </Button>
            </Link>
          </MagneticButton>

          <Link href="/account/orders">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Play className="w-4 h-4 text-[#D4AF37]" />}
              className="px-8 py-4 border-[#D4AF37]/40 text-white hover:border-[#D4AF37]"
            >
              TRACK LIVE SHIPMENTS
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-riiqxText-muted">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37]">
          SCROLL TO EXPLORE
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#D4AF37]" />
      </div>
    </section>
  );
};
