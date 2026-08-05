'use client';

import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/lib/mock/homepage';

export interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-6 pt-16 border-t border-glass-border-subtle">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Badge variant="cyan" shape="chamfer" dot>
            RECOMMENDED DROPS
          </Badge>
          <Heading size="2xl" font="display">
            COMPLETE THE CYBER LOOK
          </Heading>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
