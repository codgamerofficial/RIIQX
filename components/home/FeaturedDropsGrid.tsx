'use client';

import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/mock/homepage';

export interface FeaturedDropsGridProps {
  products: Product[];
}

export const FeaturedDropsGrid: React.FC<FeaturedDropsGridProps> = ({ products }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-glass-border-subtle pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="crimson" dot shape="chamfer">
              BATCH 004 CATALOG
            </Badge>
            <span className="font-mono text-xs text-riiqxText-muted">// FEATURED RELEASES</span>
          </div>
          <Heading size="3xl" font="display">
            FEATURED CYBER DROPS
          </Heading>
          <Text size="sm" variant="secondary" className="max-w-xl">
            Precision technical streetwear garments engineered with 500 GSM organic cotton fleece, weatherproof shells, and titanium NFC serial tags.
          </Text>
        </div>

        <Link href="/collections/all">
          <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4 text-accent-cyan" />}>
            VIEW ALL DROPS
          </Button>
        </Link>
      </div>

      {/* Responsive 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
