'use client';

import React from 'react';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import type { Category } from '@/lib/mock/homepage';

export interface CollectionHeroProps {
  category: Category | null;
  totalCount: number;
  slug: string;
}

export const CollectionHero: React.FC<CollectionHeroProps> = ({
  category,
  totalCount,
  slug,
}) => {
  const title =
    slug === 'all'
      ? 'ALL CYBER DROPS'
      : category?.name || slug.toUpperCase().replace(/-/g, ' ');

  const description =
    category?.description ||
    'Explore RIIQX technical streetwear garments engineered with 500 GSM organic cotton, 3L Cordura shells, and anodized titanium serial tags.';

  const imageUrl =
    category?.image_url ||
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1600';

  return (
    <section className="relative rounded-lg p-8 md:p-12 bg-charcoal-matte/60 backdrop-blur-2xl border border-glass-border-medium overflow-hidden shadow-glass-lg">
      {/* Background Visual Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-base via-obsidian-base/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant="crimson" shape="chamfer" dot>
            COLLECTION BATCH 004
          </Badge>
          <span className="font-mono text-xs text-accent-cyan tracking-widest">
            // {totalCount} UNITS AVAILABLE
          </span>
        </div>

        <Heading size="4xl" font="display" gradient className="uppercase">
          {title}
        </Heading>

        <Text size="base" variant="secondary" className="leading-relaxed">
          {description}
        </Text>
      </div>
    </section>
  );
};
