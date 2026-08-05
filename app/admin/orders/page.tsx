import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="3xl" font="display">
              ORDER FULFILLMENT MATRIX
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              MANAGE CUSTOMER DISPATCH, OVERRIDE STATUSES, AND RE-TRANSMIT FAILED ORDERS TO QIKINK
            </Text>
          </div>
          <Badge variant="cyan" shape="chamfer" dot>
            QIKINK SYNC ONLINE
          </Badge>
        </div>

        <OrdersTable />
      </div>
    </AdminLayout>
  );
}
