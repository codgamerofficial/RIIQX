'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Camera } from 'lucide-react';
import Link from 'next/link';

export const ParallaxLookbook: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <section ref={containerRef} className="w-full py-20 bg-charcoal-matte/40 border-y border-glass-border-subtle overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-glass-border-subtle pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-accent-cyan" />
              <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase">
                EDITORIAL LOOKBOOK // BATCH 004
              </span>
            </div>
            <Heading size="4xl" font="display" gradient>
              CYBER-NOIR EDITORIAL
            </Heading>
            <Text size="base" variant="secondary" className="max-w-xl">
              Shot in raw brutalist architectures and wet obsidian streets under neon rim refractions.
            </Text>
          </div>

          <Link href="/lookbook">
            <Button variant="cyan" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              EXPLORE FULL LOOKBOOK
            </Button>
          </Link>
        </div>

        {/* Parallax Image Grid Sequence */}
        <motion.div style={{ scale }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Panel 1 */}
          <motion.div style={{ y: y1 }} className="lg:col-span-7 relative group rounded-lg overflow-hidden border border-glass-border-medium shadow-glass-lg aspect-[16/10]">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600"
              alt="Editorial Streetwear Look 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-magnetic"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-base via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <Badge variant="crimson" shape="chamfer" dot>LOOK 01 // TACTICAL FLEECE</Badge>
              <h4 className="font-display font-bold text-2xl text-white">500 GSM MONOLITHIC HOODIE</h4>
              <p className="font-mono text-xs text-riiqxText-secondary">Model wearing Size L in Obsidian Black</p>
            </div>
          </motion.div>

          {/* Panel 2 */}
          <motion.div style={{ y: y2 }} className="lg:col-span-5 relative group rounded-lg overflow-hidden border border-glass-border-medium shadow-glass-lg aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200"
              alt="Editorial Streetwear Look 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-magnetic"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-base via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <Badge variant="cyan" shape="chamfer" dot>LOOK 02 // CARGO SYSTEM</Badge>
              <h4 className="font-display font-bold text-xl text-white">OMNI-CARGO PANTS</h4>
              <p className="font-mono text-xs text-accent-cyan">Ripstop cotton blend with 8 magnetic pockets</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
