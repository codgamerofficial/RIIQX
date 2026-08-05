'use client';

import React from 'react';
import Link from 'next/link';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Grid } from 'lucide-react';
import type { Category } from '@/lib/mock/homepage';

export interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-accent-cyan" />
            <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase">
              CATEGORY MATRIX
            </span>
          </div>
          <Heading size="3xl" font="display">
            EXPLORE BY CATEGORY
          </Heading>
        </div>

        <Link href="/collections/all">
          <span className="font-mono text-xs text-riiqxText-secondary hover:text-white flex items-center gap-1">
            VIEW ALL CATEGORIES <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Cyber Category Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/collections/${cat.slug}`} className="group block">
            <div className="relative rounded-md h-80 overflow-hidden bg-charcoal-matte/80 border border-glass-border-subtle hover:border-accent-cyan/60 transition-all duration-300 shadow-glass-md group-hover:-translate-y-1">
              <img
                src={cat.image_url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-magnetic filter brightness-75"
              />
              {/* Obsidian Gradient Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-base via-obsidian-base/40 to-transparent" />

              {/* Tile Content Overlay */}
              <div className="absolute bottom-5 left-5 right-5 space-y-2">
                <Badge variant="cyan" shape="chamfer" className="text-[9px]">
                  CATEGORY // 01
                </Badge>
                <h3 className="font-display font-bold text-xl text-white group-hover:text-accent-cyan transition-colors">
                  {cat.name}
                </h3>
                <Text size="xs" variant="muted" className="line-clamp-1">
                  {cat.description || 'Precision cybernetic technical apparel.'}
                </Text>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
