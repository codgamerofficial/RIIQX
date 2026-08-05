'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OrderTrackingModal } from '@/components/account/OrderTrackingModal';
import { MOCK_ADMIN_ORDERS } from '@/components/admin/OrdersTable';
import { Truck, Eye, ArrowRight } from 'lucide-react';
import type { AdminOrder } from '@/components/admin/OrderDetailModal';

export const OrderHistoryList: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  return (
    <div className="space-y-4">
      {MOCK_ADMIN_ORDERS.map((order) => (
        <div
          key={order.id}
          className="p-5 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle hover:border-glass-border-medium transition-all shadow-glass-md space-y-4 font-mono text-xs"
        >
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-glass-border-subtle pb-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">{order.orderNumber}</span>
              <span className="text-riiqxText-muted text-[11px]">{order.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={order.paymentStatus === 'paid' ? 'cyan' : 'crimson'} shape="chamfer">
                {order.paymentStatus.toUpperCase()}
              </Badge>
              <Badge variant="lime" shape="chamfer" dot>
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-riiqxText-secondary font-sans font-bold">{item.name}</span>
                <span className="text-white font-bold">
                  {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Card Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-glass-border-subtle">
            <div className="flex items-baseline gap-2">
              <span className="text-riiqxText-muted">TOTAL CHARGE:</span>
              <span className="text-accent-crimson font-black text-sm">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Truck className="w-3.5 h-3.5 text-accent-cyan" />}
              onClick={() => setSelectedOrder(order)}
            >
              LIVE TRACKING
            </Button>
          </div>
        </div>
      ))}

      <OrderTrackingModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};
