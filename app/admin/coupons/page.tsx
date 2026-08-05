'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createCouponAction } from '@/app/actions/admin';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { id: 'c-1', code: 'CYBER10', discountType: 'percentage', discountValue: 10, minOrderAmount: 5000, currentUses: 42, maxUses: 100, isActive: true },
    { id: 'c-2', code: 'FLAT1000', discountType: 'flat', discountValue: 1000, minOrderAmount: 10000, currentUses: 15, maxUses: 50, isActive: true },
  ]);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'flat' | 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    maxUses: 100,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [msg, setMsg] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;

    setIsCreating(true);
    const res = await createCouponAction(formData);
    setIsCreating(false);

    setMsg(res.message);
    setCoupons((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minOrderAmount: formData.minOrderAmount,
        currentUses: 0,
        maxUses: formData.maxUses,
        isActive: true,
      },
    ]);
    setFormData({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxUses: 100 });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="3xl" font="display">
              PROMOTIONS & DISCOUNT ENGINE
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              CREATE PROMO CODES, SET MINIMUM ORDER THRESHOLDS, AND TRACK REDEMPTION METRICS
            </Text>
          </div>
          <Badge variant="cyan" shape="chamfer" dot>
            PROMO ENGINE ACTIVE
          </Badge>
        </div>

        {msg && (
          <div className="p-3 rounded-sm bg-status-success/15 border border-status-success/40 text-status-success font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coupon Provisioning Form */}
          <div className="lg:col-span-5 p-6 rounded-md bg-charcoal-matte/80 border border-glass-border-medium shadow-glass-md space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-accent-cyan border-b border-glass-border-subtle pb-3">
              <Tag className="w-4 h-4" />
              <span className="font-bold uppercase">PROVISION NEW PROMO CODE</span>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="COUPON CODE"
                placeholder="e.g. CYBER15"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-riiqxText-muted uppercase block mb-1">
                    DISCOUNT TYPE
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as 'flat' | 'percentage' })
                    }
                    className="w-full bg-obsidian-base border border-glass-border-subtle rounded-sm px-3 py-2 text-xs text-white"
                  >
                    <option value="percentage">PERCENTAGE (%)</option>
                    <option value="flat">FLAT (₹)</option>
                  </select>
                </div>

                <Input
                  label="DISCOUNT VALUE"
                  type="number"
                  value={formData.discountValue.toString()}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="MIN ORDER (₹)"
                  type="number"
                  value={formData.minOrderAmount.toString()}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                />

                <Input
                  label="MAX USES"
                  type="number"
                  value={formData.maxUses.toString()}
                  onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isCreating}
                className="w-full"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                PROVISION COUPON CODE
              </Button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-7 rounded-md border border-glass-border-medium bg-charcoal-matte/80 overflow-hidden shadow-glass-lg font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-obsidian-void text-accent-cyan border-b border-glass-border-subtle uppercase">
                <tr>
                  <th className="p-3.5">CODE</th>
                  <th className="p-3.5">DISCOUNT</th>
                  <th className="p-3.5">MIN ORDER</th>
                  <th className="p-3.5">REDEMPTIONS</th>
                  <th className="p-3.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border-subtle text-riiqxText-secondary">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-white">{coupon.code}</td>
                    <td className="p-3.5 text-accent-crimson font-bold">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </td>
                    <td className="p-3.5">₹{coupon.minOrderAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3.5">{coupon.currentUses} / {coupon.maxUses || '∞'}</td>
                    <td className="p-3.5">
                      <Badge variant="cyan" shape="chamfer" dot>
                        ACTIVE
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
