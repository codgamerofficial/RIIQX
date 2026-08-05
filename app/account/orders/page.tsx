import React from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { OrderHistoryList } from '@/components/account/OrderHistoryList';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';

export default function AccountOrdersPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="2xl" font="display">
              ORDERS & LIVE TRACKING
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              REAL-TIME QIKINK CARRIER TELEMETRY & DISPATCH HISTORY
            </Text>
          </div>
          <Badge variant="cyan" shape="chamfer" dot>
            CARRIER TELEMETRY ACTIVE
          </Badge>
        </div>

        <OrderHistoryList />
      </div>
    </AccountLayout>
  );
}
