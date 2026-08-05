import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductTable } from '@/components/admin/ProductTable';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="3xl" font="display">
              PRODUCT CATALOG MATRIX
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              MANAGE APPAREL DROPS, BASE PRICES, PUBLISHED STATES, AND FABRIC SPECIFICATIONS
            </Text>
          </div>
          <Badge variant="crimson" shape="chamfer" dot>
            CATALOG CONTROL
          </Badge>
        </div>

        <ProductTable />
      </div>
    </AdminLayout>
  );
}
