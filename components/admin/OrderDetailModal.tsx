'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { updateOrderStatusAction, retryQikinkOrderAction } from '@/app/actions/admin';
import { X, RefreshCw, CheckCircle2, Truck, Package, MapPin, CreditCard } from 'lucide-react';
import type { OrderStatus } from '@/types/database.types';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'unpaid' | 'failed';
  qikinkOrderId?: string | null;
  items: { name: string; sku: string; qty: number; price: number }[];
  address: { line1: string; city: string; state: string; pincode: string; phone: string };
}

export interface OrderDetailModalProps {
  order: AdminOrder | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onRefresh,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  if (!order) return null;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    const res = await updateOrderStatusAction(order.id, newStatus);
    setIsUpdating(false);
    setMsg(res.message);
    onRefresh();
  };

  const handleQikinkRetry = async () => {
    setIsUpdating(true);
    const res = await retryQikinkOrderAction(order.id);
    setIsUpdating(false);
    setMsg(res.message);
    onRefresh();
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
          className="relative z-10 w-full max-w-2xl bg-charcoal-elevated/95 backdrop-blur-2xl border border-glass-border-medium rounded-md p-6 shadow-glass-lg space-y-6 font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
            <div>
              <Heading size="xl" font="display">
                ORDER {order.orderNumber}
              </Heading>
              <span className="text-riiqxText-muted uppercase text-[10px]">
                DISPATCH SPECIFICATION & QIKINK POD TELEMETRY
              </span>
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

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-1">
              <span className="text-riiqxText-muted text-[10px] block">PAYMENT STATUS</span>
              <Badge variant={order.paymentStatus === 'paid' ? 'cyan' : 'crimson'} shape="chamfer">
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>

            <div className="p-3 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-1">
              <span className="text-riiqxText-muted text-[10px] block">FULFILLMENT</span>
              <Badge variant="lime" shape="chamfer">
                {order.status.toUpperCase()}
              </Badge>
            </div>

            <div className="p-3 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-1">
              <span className="text-riiqxText-muted text-[10px] block">QIKINK POD ID</span>
              <span className="text-white font-bold block">{order.qikinkOrderId || 'NOT TRANSMITTED'}</span>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="p-4 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-accent-cyan font-bold">
              <MapPin className="w-4 h-4" />
              <span>SHIPPING DESTINATION</span>
            </div>
            <p className="text-white font-bold">{order.customerName} ({order.customerEmail})</p>
            <p className="text-riiqxText-secondary">
              {order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="text-riiqxText-muted">PHONE: {order.address.phone}</p>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <span className="text-accent-cyan font-bold block">// ORDERED ITEMS</span>
            <div className="divide-y divide-glass-border-subtle rounded-sm border border-glass-border-subtle overflow-hidden">
              {order.items.map((item, i) => (
                <div key={i} className="p-3 bg-charcoal-matte flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] text-riiqxText-muted">{item.sku}</span>
                  </div>
                  <span className="font-bold text-accent-crimson">
                    {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Override Controls */}
          <div className="pt-3 border-t border-glass-border-subtle flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-riiqxText-muted">OVERRIDE STATUS:</span>
              <Button size="sm" variant="secondary" onClick={() => handleStatusChange('shipped')}>
                SHIPPED
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleStatusChange('delivered')}>
                DELIVERED
              </Button>
            </div>

            <Button
              variant="cyan"
              size="sm"
              isLoading={isUpdating}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleQikinkRetry}
            >
              RE-TRANSMIT TO QIKINK
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
