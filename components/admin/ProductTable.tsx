'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductEditorModal } from '@/components/admin/ProductEditorModal';
import { Edit3, Plus, Layers, Eye } from 'lucide-react';
import { MOCK_PRODUCTS, type Product } from '@/lib/mock/homepage';

export const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-riiqxText-muted">{products.length} CATALOG PRODUCTS FOUND</span>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleCreateNew}
        >
          PROVISION NEW PRODUCT
        </Button>
      </div>

      {/* Product Matrix Table */}
      <div className="rounded-md border border-glass-border-medium bg-charcoal-matte/80 overflow-hidden shadow-glass-lg font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-obsidian-void text-accent-cyan border-b border-glass-border-subtle uppercase">
            <tr>
              <th className="p-3.5">PRODUCT NAME</th>
              <th className="p-3.5">CATEGORY</th>
              <th className="p-3.5">BASE PRICE</th>
              <th className="p-3.5">SALE PRICE</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border-subtle text-riiqxText-secondary">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-3">
                  <img
                    src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=200'}
                    alt={prod.name}
                    className="w-10 h-12 object-cover rounded-sm border border-glass-border-subtle shrink-0"
                  />
                  <div>
                    <div className="text-white font-bold">{prod.name}</div>
                    <div className="text-[10px] text-riiqxText-muted">{prod.slug}</div>
                  </div>
                </td>
                <td className="p-3.5 text-accent-cyan">{prod.category?.name || 'APPAREL'}</td>
                <td className="p-3.5 font-bold text-white">₹{prod.base_price.toLocaleString('en-IN')}</td>
                <td className="p-3.5 text-riiqxText-muted">
                  {prod.sale_price ? `₹${prod.sale_price.toLocaleString('en-IN')}` : '—'}
                </td>
                <td className="p-3.5">
                  <Badge variant={prod.is_published ? 'lime' : 'neutral'} shape="chamfer" dot>
                    {prod.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </Badge>
                </td>
                <td className="p-3.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    onClick={() => handleEdit(prod)}
                  >
                    EDIT SPEC
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductEditorModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={() => {}}
      />
    </div>
  );
};
