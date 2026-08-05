import React from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { WishlistGrid } from '@/components/account/WishlistGrid';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';

export default function AccountWishlistPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="2xl" font="display">
              PERSONAL TACTICAL WISHLIST
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              SAVED ITEMS RESERVED FOR QUICK DISPATCH
            </Text>
          </div>
          <Badge variant="crimson" shape="chamfer">
            SAVED DROPS
          </Badge>
        </div>

        <WishlistGrid />
      </div>
    </AccountLayout>
  );
}
