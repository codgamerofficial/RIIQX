'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { GlassDrawer } from '@/components/motion/GlassDrawer';
import { SlidersHorizontal, RotateCcw, Check, Filter } from 'lucide-react';

export interface FilterSidebarProps {
  currentCategorySlug: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  currentCategorySlug,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Parse active filter parameters
  const activeColors = searchParams.get('color')?.split(',').filter(Boolean) || [];
  const activeSizes = searchParams.get('size')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const inStockOnly = searchParams.get('in_stock') === 'true';

  const categories = [
    { label: 'ALL DROPS', slug: 'all' },
    { label: 'HOODIES & FLEECE', slug: 'hoodies' },
    { label: 'OUTERWEAR & SHELLS', slug: 'outerwear' },
    { label: 'BOTTOMS & CARGOS', slug: 'cargos' },
    { label: 'TEES & APPAREL', slug: 'tees' },
  ];

  const colorSwatches = [
    { label: 'OBSIDIAN', code: 'obsidian', bg: 'bg-obsidian-base border-white/20' },
    { label: 'CRIMSON', code: 'crimson', bg: 'bg-accent-crimson border-accent-crimson' },
    { label: 'CYAN', code: 'cyan', bg: 'bg-accent-cyan border-accent-cyan' },
    { label: 'CHARCOAL', code: 'charcoal', bg: 'bg-charcoal-elevated border-white/20' },
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  // Helper to push URL state updates
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleColor = (code: string) => {
    const next = activeColors.includes(code)
      ? activeColors.filter((c) => c !== code)
      : [...activeColors, code];
    updateParam('color', next.length > 0 ? next.join(',') : null);
  };

  const toggleSize = (size: string) => {
    const next = activeSizes.includes(size)
      ? activeSizes.filter((s) => s !== size)
      : [...activeSizes, size];
    updateParam('size', next.length > 0 ? next.join(',') : null);
  };

  const clearAllFilters = () => {
    router.push(`/collections/${currentCategorySlug}`);
  };

  const renderFilterContent = () => (
    <div className="space-y-6 font-mono text-xs">
      {/* Category Switching */}
      <div className="space-y-2.5 pb-5 border-b border-glass-border-subtle">
        <span className="text-accent-cyan uppercase tracking-widest font-bold block">
          // COLLECTION CONTEXT
        </span>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => router.push(`/collections/${cat.slug}`)}
              className={`w-full text-left px-3 py-2 rounded-sm transition-colors cursor-pointer flex items-center justify-between ${
                currentCategorySlug === cat.slug
                  ? 'bg-accent-crimson/15 text-accent-crimson font-bold border-l-2 border-accent-crimson'
                  : 'text-riiqxText-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              {currentCategorySlug === cat.slug && <Check className="w-3.5 h-3.5 text-accent-crimson" />}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatch Filter */}
      <div className="space-y-2.5 pb-5 border-b border-glass-border-subtle">
        <span className="text-riiqxText-muted uppercase tracking-wider block font-bold">
          COLOR WAY:
        </span>
        <div className="grid grid-cols-2 gap-2">
          {colorSwatches.map((swatch) => {
            const isSelected = activeColors.includes(swatch.code);
            return (
              <button
                key={swatch.code}
                onClick={() => toggleColor(swatch.code)}
                className={`flex items-center gap-2 p-2 rounded-sm border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/15 text-white font-bold'
                    : 'border-glass-border-subtle bg-charcoal-matte/60 text-riiqxText-muted hover:border-glass-border-medium'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border ${swatch.bg}`} />
                <span className="text-[11px]">{swatch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter Grid */}
      <div className="space-y-2.5 pb-5 border-b border-glass-border-subtle">
        <span className="text-riiqxText-muted uppercase tracking-wider block font-bold">
          SIZE MATRIX:
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {sizeOptions.map((size) => {
            const isSelected = activeSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`py-2 rounded-sm border font-bold text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent-crimson bg-accent-crimson/20 text-white shadow-glow-crimson'
                    : 'border-glass-border-subtle bg-charcoal-matte/60 text-riiqxText-muted hover:border-glass-border-medium'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2.5 pb-5 border-b border-glass-border-subtle">
        <span className="text-riiqxText-muted uppercase tracking-wider block font-bold">
          PRICE RANGE (₹):
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="MIN"
            value={minPrice}
            onChange={(e) => updateParam('min_price', e.target.value || null)}
            className="w-full bg-obsidian-base border border-glass-border-subtle rounded-sm px-2.5 py-2 text-xs font-sans text-white focus:outline-none focus:border-accent-cyan"
          />
          <span className="text-riiqxText-muted">-</span>
          <input
            type="number"
            placeholder="MAX"
            value={maxPrice}
            onChange={(e) => updateParam('max_price', e.target.value || null)}
            className="w-full bg-obsidian-base border border-glass-border-subtle rounded-sm px-2.5 py-2 text-xs font-sans text-white focus:outline-none focus:border-accent-cyan"
          />
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pb-5 border-b border-glass-border-subtle">
        <Switch
          label="IN-STOCK UNITS ONLY"
          sublabel="Filter out backorders & sold out items"
          checked={inStockOnly}
          onChange={(checked) => updateParam('in_stock', checked ? 'true' : null)}
        />
      </div>

      {/* Clear All Filters */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs text-riiqxText-muted hover:text-accent-crimson"
        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        onClick={clearAllFilters}
      >
        RESET ALL FILTERS
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Glass Panel */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-28 h-fit p-5 rounded-md bg-charcoal-matte/60 backdrop-blur-xl border border-glass-border-subtle shadow-glass-md">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-glass-border-subtle text-accent-cyan">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-mono font-bold text-xs uppercase tracking-widest">
            FACETED FILTERS
          </span>
        </div>
        {renderFilterContent()}
      </aside>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          variant="cyan"
          size="md"
          className="shadow-glow-cyan font-mono text-xs px-5 py-3 rounded-full"
          leftIcon={<Filter className="w-4 h-4" />}
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          FILTERS & SORT
        </Button>
      </div>

      {/* Mobile Glass Drawer Filter */}
      <GlassDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="FACETED CATALOG FILTERS"
        subtitle="REFINE COLLECTION SPECIFICATION"
        position="left"
      >
        {renderFilterContent()}
      </GlassDrawer>
    </>
  );
};
