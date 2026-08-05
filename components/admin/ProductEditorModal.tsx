'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { upsertProductAction } from '@/app/actions/admin';
import { X, Save, CheckCircle2, Package } from 'lucide-react';
import type { Product } from '@/lib/mock/homepage';

export interface ProductEditorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    basePrice: product?.base_price || 9999,
    salePrice: product?.sale_price || undefined,
    isPublished: product?.is_published ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await upsertProductAction({
      id: product?.id,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      basePrice: Number(formData.basePrice),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      isPublished: formData.isPublished,
    });
    setIsSaving(false);
    setMsg(res.message);
    onRefresh();
    setTimeout(() => onClose(), 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-base/85 backdrop-blur-xl cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-xl bg-charcoal-elevated/95 backdrop-blur-2xl border border-glass-border-medium rounded-md p-6 shadow-glass-lg space-y-6 font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent-cyan" />
              <Heading size="lg" font="display">
                {product ? 'EDIT PRODUCT CATALOG ITEM' : 'PROVISION NEW PRODUCT DROP'}
              </Heading>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-sm bg-white/5 border border-glass-border-subtle text-riiqxText-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {msg && (
            <div className="p-3 rounded-sm bg-status-success/15 border border-status-success/40 text-status-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="PRODUCT NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="SLUG"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="BASE PRICE (₹)"
                type="number"
                value={formData.basePrice.toString()}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                required
              />

              <Input
                label="SALE PRICE (₹ OPTIONAL)"
                type="number"
                value={formData.salePrice?.toString() || ''}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-accent-cyan uppercase block mb-1">
                DESCRIPTION & TEXTILE SPEC
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-obsidian-base border border-glass-border-subtle rounded-sm p-3 font-sans text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <Switch
              label="CATALOG PUBLISHED STATE"
              sublabel="Make visible on digital storefront"
              checked={formData.isPublished}
              onChange={(checked) => setFormData({ ...formData, isPublished: checked })}
            />

            <div className="pt-4 border-t border-glass-border-subtle flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                SAVE CATALOG ITEM
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
