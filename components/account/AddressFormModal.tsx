'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { upsertCustomerAddressAction, type CustomerAddress } from '@/app/actions/account';
import { X, Save, MapPin, CheckCircle2 } from 'lucide-react';

export interface AddressFormModalProps {
  address: CustomerAddress | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  address,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<CustomerAddress>(
    address || {
      id: `addr-${Date.now()}`,
      fullName: 'Saswat Patra',
      phone: '+91 9876543210',
      addressLine1: 'Flat 402, Monolith Towers',
      addressLine2: 'Cyber Street',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await upsertCustomerAddressAction(formData);
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
          className="relative z-10 w-full max-w-lg bg-charcoal-elevated/95 backdrop-blur-2xl border border-glass-border-medium rounded-md p-6 shadow-glass-lg space-y-6 font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-crimson" />
              <Heading size="lg" font="display">
                {address ? 'EDIT DELIVERY TARGET' : 'ADD NEW DELIVERY TARGET'}
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
              label="FULL NAME"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              label="PHONE NUMBER"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Input
              label="STREET ADDRESS / HOUSE NO."
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CITY"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />

              <Input
                label="STATE"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>

            <Input
              label="PIN CODE"
              value={formData.pincode}
              maxLength={6}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              required
            />

            <Switch
              label="SET AS DEFAULT DELIVERY TARGET"
              checked={formData.isDefault ?? false}
              onChange={(checked) => setFormData({ ...formData, isDefault: checked })}
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
                SAVE TARGET ADDRESS
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
