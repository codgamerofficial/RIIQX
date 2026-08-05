'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { updateVariantStockAction } from '@/app/actions/admin';
import { Layers, AlertTriangle, Save, CheckCircle2 } from 'lucide-react';

export default function AdminInventoryPage() {
  const [stockItems, setStockItems] = useState([
    { id: 'v-101', name: 'BATCH 004 // TACTICAL HOODIE', sku: 'RIIQX-HD-001-L', color: 'OBSIDIAN BLACK', size: 'L', qikinkId: 'QK-HD-L', qty: 12 },
    { id: 'v-102', name: 'CYBERNETIC BONDED BOMBER', sku: 'RIIQX-JK-002-M', color: 'VOID CHARCOAL', size: 'M', qikinkId: 'QK-JK-M', qty: 3 },
    { id: 'v-103', name: 'OMNI-CARGO PANTS', sku: 'RIIQX-PT-003-32', color: 'MATTE OBSIDIAN', size: '32', qikinkId: 'QK-PT-32', qty: 18 },
    { id: 'v-104', name: 'ANODIZED TITANIUM TAG', sku: 'RIIQX-AC-005-ONE', color: 'TITANIUM CRIMSON', size: 'OS', qikinkId: 'QK-AC-OS', qty: 0 },
  ]);

  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const handleQtyChange = (id: string, newQty: number) => {
    setStockItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(0, newQty) } : item))
    );
  };

  const handleSave = async (id: string, qty: number) => {
    setSavingId(id);
    const res = await updateVariantStockAction(id, qty);
    setSavingId(null);
    setMsg(res.message);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="3xl" font="display">
              INVENTORY & STOCK MATRIX
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              BATCH VARIANT QUANTITIES, LOW STOCK WARNINGS, AND QIKINK VARIANT MAPPINGS
            </Text>
          </div>
          <Badge variant="lime" shape="chamfer" dot>
            STOCK MONITORING
          </Badge>
        </div>

        {msg && (
          <div className="p-3 rounded-sm bg-status-success/15 border border-status-success/40 text-status-success font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <div className="rounded-md border border-glass-border-medium bg-charcoal-matte/80 overflow-hidden shadow-glass-lg font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-obsidian-void text-accent-cyan border-b border-glass-border-subtle uppercase">
              <tr>
                <th className="p-3.5">SKU / PRODUCT</th>
                <th className="p-3.5">COLOR</th>
                <th className="p-3.5">SIZE</th>
                <th className="p-3.5">QIKINK VARIANT ID</th>
                <th className="p-3.5">QUANTITY</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border-subtle text-riiqxText-secondary">
              {stockItems.map((item) => {
                const isLow = item.qty > 0 && item.qty <= 5;
                const isOut = item.qty <= 0;
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-riiqxText-muted">{item.sku}</div>
                    </td>
                    <td className="p-3.5 text-white">{item.color}</td>
                    <td className="p-3.5 font-bold text-accent-cyan">{item.size}</td>
                    <td className="p-3.5 text-riiqxText-muted">{item.qikinkId}</td>
                    <td className="p-3.5">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                        className="w-20 bg-obsidian-base border border-glass-border-subtle rounded-sm px-2.5 py-1 text-center font-bold text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </td>
                    <td className="p-3.5">
                      {isOut ? (
                        <Badge variant="neutral" shape="chamfer">OUT OF STOCK</Badge>
                      ) : isLow ? (
                        <Badge variant="crimson" shape="chamfer" dot>LOW STOCK ({item.qty})</Badge>
                      ) : (
                        <Badge variant="cyan" shape="chamfer">IN STOCK</Badge>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={savingId === item.id}
                        leftIcon={<Save className="w-3.5 h-3.5" />}
                        onClick={() => handleSave(item.id, item.qty)}
                      >
                        SAVE
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
