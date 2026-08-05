import React from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { AddressManager } from '@/components/account/AddressManager';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';

export default function AccountAddressesPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="2xl" font="display">
              SAVED DELIVERY TARGETS
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              MANAGE SHIPPING DESTINATIONS & DEFAULT DISPATCH ADDRESSES
            </Text>
          </div>
          <Badge variant="lime" shape="chamfer" dot>
            ADDRESS MATRIX
          </Badge>
        </div>

        <AddressManager />
      </div>
    </AccountLayout>
  );
}
