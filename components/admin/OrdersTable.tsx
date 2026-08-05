'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OrderDetailModal, type AdminOrder } from '@/components/admin/OrderDetailModal';
import { Eye, RefreshCw, Filter } from 'lucide-react';
import type { OrderStatus } from '@/types/database.types';

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: '#RIIQX-98241',
    customerName: 'Saswat Patra',
    customerEmail: 'saswat@riiqx.com',
    date: '2026-08-05 14:20',
    totalAmount: 12999,
    status: 'processing',
    paymentStatus: 'paid',
    qikinkOrderId: 'QK-889102',
    items: [{ name: 'BATCH 004 // TACTICAL HOODIE', sku: 'RIIQX-HD-001-L', qty: 1, price: 12999 }],
    address: { line1: 'Flat 402, Cyber Towers', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', phone: '+91 9876543210' },
  },
  {
    id: 'ord-102',
    orderNumber: '#RIIQX-98242',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@domain.com',
    date: '2026-08-05 11:05',
    totalAmount: 18499,
    status: 'printed',
    paymentStatus: 'paid',
    qikinkOrderId: 'QK-889103',
    items: [{ name: 'CYBERNETIC BONDED BOMBER', sku: 'RIIQX-JK-002-M', qty: 1, price: 18499 }],
    address: { line1: '12 Brutalist Way', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 9876543211' },
  },
  {
    id: 'ord-103',
    orderNumber: '#RIIQX-98243',
    customerName: 'Ananya Roy',
    customerEmail: 'ananya@design.com',
    date: '2026-08-04 18:45',
    totalAmount: 6499,
    status: 'shipped',
    paymentStatus: 'paid',
    qikinkOrderId: 'QK-889090',
    items: [{ name: 'MONOLITH GRAPHIC TEE', sku: 'RIIQX-TS-004-XL', qty: 1, price: 6499 }],
    address: { line1: 'Sector 5, Salt Lake', city: 'Kolkata', state: 'West Bengal', pincode: '700091', phone: '+91 9876543212' },
  },
];

export const OrdersTable: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders =
    statusFilter === 'all'
      ? MOCK_ADMIN_ORDERS
      : MOCK_ADMIN_ORDERS.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent-cyan" />
          <span className="text-riiqxText-muted">FILTER STATUS:</span>
          {['all', 'processing', 'printed', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-sm border uppercase transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-accent-crimson border-accent-crimson text-white font-bold'
                  : 'bg-charcoal-matte border-glass-border-subtle text-riiqxText-muted hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-riiqxText-muted">{filteredOrders.length} ORDERS FOUND</span>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border border-glass-border-medium bg-charcoal-matte/80 overflow-hidden shadow-glass-lg font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-obsidian-void text-accent-cyan border-b border-glass-border-subtle uppercase">
            <tr>
              <th className="p-3.5">ORDER #</th>
              <th className="p-3.5">CUSTOMER</th>
              <th className="p-3.5">DATE</th>
              <th className="p-3.5">PAYMENT</th>
              <th className="p-3.5">FULFILLMENT</th>
              <th className="p-3.5">AMOUNT</th>
              <th className="p-3.5">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border-subtle text-riiqxText-secondary">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-bold text-white">{order.orderNumber}</td>
                <td className="p-3.5">
                  <div className="font-bold text-white">{order.customerName}</div>
                  <div className="text-[10px] text-riiqxText-muted">{order.customerEmail}</div>
                </td>
                <td className="p-3.5 text-riiqxText-muted">{order.date}</td>
                <td className="p-3.5">
                  <Badge variant={order.paymentStatus === 'paid' ? 'cyan' : 'crimson'} shape="chamfer">
                    {order.paymentStatus.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-3.5">
                  <Badge variant="lime" shape="chamfer" dot>
                    {order.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-3.5 font-bold text-accent-crimson">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-3.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedOrder(order)}
                  >
                    INSPECT
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onRefresh={() => {}}
      />
    </div>
  );
};
