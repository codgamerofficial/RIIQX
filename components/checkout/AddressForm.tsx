'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Heading } from '@/components/ui/Typography';
import { User, Mail, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';
import type { CheckoutAddressPayload } from '@/app/actions/checkout';

export interface AddressFormProps {
  address: CheckoutAddressPayload;
  onChange: (updated: CheckoutAddressPayload) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange }) => {
  const [isPinLoading, setIsPinLoading] = useState(false);

  const handleFieldChange = (field: keyof CheckoutAddressPayload, value: string) => {
    const updated = { ...address, [field]: value };

    // Auto PIN Code Lookup for 6-digit Indian PIN codes
    if (field === 'pincode' && value.length === 6) {
      setIsPinLoading(true);
      fetch(`https://api.postalpincode.in/pincode/${value}`)
        .then((res) => res.json())
        .then((data) => {
          setIsPinLoading(false);
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.[0]) {
            const po = data[0].PostOffice[0];
            onChange({
              ...updated,
              city: po.District || po.Name,
              state: po.State,
            });
          }
        })
        .catch(() => setIsPinLoading(false));
    } else {
      onChange(updated);
    }
  };

  return (
    <div className="p-6 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle shadow-glass-md space-y-6">
      <div className="flex items-center gap-2 border-b border-glass-border-subtle pb-3">
        <MapPin className="w-5 h-5 text-accent-crimson" />
        <Heading size="lg" font="display">
          01 // SHIPPING & DISPATCH ADDRESS
        </Heading>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <Input
          label="FULL NAME"
          placeholder="e.g. SASWAT PATRA"
          value={address.fullName}
          onChange={(e) => handleFieldChange('fullName', e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        {/* Email Address */}
        <Input
          label="ENCRYPTED EMAIL ADDRESS"
          type="email"
          placeholder="name@domain.com"
          value={address.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="Order hash & confirmation sent here."
          required
        />

        {/* Phone Number */}
        <Input
          label="PHONE NUMBER (FOR DISPATCH SMS)"
          type="tel"
          placeholder="+91 98765 43210"
          value={address.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          leftIcon={<Phone className="w-4 h-4" />}
          helperText="WhatsApp tracking updates."
          required
        />

        {/* PIN Code */}
        <Input
          label="INDIAN PIN CODE (6-DIGIT)"
          placeholder="e.g. 560001"
          value={address.pincode}
          maxLength={6}
          onChange={(e) => handleFieldChange('pincode', e.target.value)}
          leftIcon={<Building className="w-4 h-4" />}
          helperText={isPinLoading ? 'AUTOFETCHING CITY & STATE...' : 'Auto-fetches city & state.'}
          required
        />

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <Input
            label="STREET ADDRESS / HOUSE NO."
            placeholder="Flat 402, Monolith Towers, Cyber Street"
            value={address.addressLine1}
            onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
            required
          />
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <Input
            label="LANDMARK / AREA (OPTIONAL)"
            placeholder="Near Tech Park Gate 3"
            value={address.addressLine2 || ''}
            onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
          />
        </div>

        {/* City */}
        <Input
          label="CITY / DISTRICT"
          placeholder="BENGALURU"
          value={address.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          required
        />

        {/* State */}
        <Input
          label="STATE"
          placeholder="KARNATAKA"
          value={address.state}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          required
        />
      </div>
    </div>
  );
};
