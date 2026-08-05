'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AddressFormModal } from '@/components/account/AddressFormModal';
import { MapPin, Plus, Edit3, Trash2 } from 'lucide-react';
import type { CustomerAddress } from '@/app/actions/account';

export const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([
    {
      id: 'addr-1',
      fullName: 'Saswat Patra',
      phone: '+91 98765 43210',
      addressLine1: 'Flat 402, Monolith Towers, Cyber Street',
      addressLine2: 'Near Tech Park Gate 3',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (addr: CustomerAddress) => {
    setSelectedAddress(addr);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-riiqxText-muted">{addresses.length} SAVED TARGET ADDRESSES</span>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddNew}
        >
          ADD NEW TARGET ADDRESS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-5 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle hover:border-glass-border-medium transition-all shadow-glass-md space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-glass-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-crimson" />
                <span className="font-bold text-white text-sm">{addr.fullName}</span>
              </div>
              {addr.isDefault && (
                <Badge variant="cyan" shape="chamfer" dot>
                  DEFAULT TARGET
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-riiqxText-secondary">
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-riiqxText-muted text-[11px] pt-1">PHONE: {addr.phone}</p>
            </div>

            <div className="pt-3 border-t border-glass-border-subtle flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => handleEdit(addr)}
              >
                EDIT
              </Button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="p-2 rounded-sm bg-obsidian-base border border-glass-border-subtle hover:border-status-error text-riiqxText-muted hover:text-status-error transition-colors cursor-pointer"
                aria-label="Delete Address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddressFormModal
        address={selectedAddress}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={() => {}}
      />
    </div>
  );
};
