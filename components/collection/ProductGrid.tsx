'use client';

import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RotateCcw } from 'lucide-react';
import type { Product } from '@/lib/mock/homepage';

export interface ProductGridProps {
  products: Product[];
  currentCategorySlug: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currentCategorySlug,
}) => {
  const router = useRouter();

  if (!products || products.length === 0) {
    return (
      <div className="w-full p-12 rounded-md bg-charcoal-matte/50 backdrop-blur-md border border-glass-border-medium text-center space-y-4 my-8">
        <div className="w-12 h-12 rounded-full bg-status-warning/15 border border-status-warning/40 flex items-center justify-center mx-auto text-status-warning">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1">
          <Heading size="xl" font="display" className="text-white">
            NO DROPS MATCH YOUR SPECIFICATIONS
          </Heading>
          <Text size="sm" variant="muted" className="max-w-md mx-auto">
            Zero products match your active color, size, or price filter parameters. Try clearing your filters or selecting a different category.
          </Text>
        </div>

        <div className="pt-2">
          <Button
            variant="cyan"
            size="md"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => router.push(`/collections/${currentCategorySlug}`)}
          >
            RESET ALL FILTERS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
