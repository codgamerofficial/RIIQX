'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, CheckCircle2, Truck, Package, ExternalLink, Clock } from 'lucide-react';
import type { AdminOrder } from '@/components/admin/OrderDetailModal';

export interface OrderTrackingModalProps {
  order: AdminOrder | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const timelineSteps = [
    { label: 'ORDER PLACED', desc: 'Verified & Payment Settled', done: true },
    { label: 'QIKINK PRINTING', desc: 'POD Fabrication Active', done: order.status !== 'pending' },
    { label: 'DISPATCHED', desc: 'Carrier Manifest Generated', done: order.status === 'shipped' || order.status === 'delivered' },
    { label: 'DELIVERED', desc: 'Target Unlocked', done: order.status === 'delivered' },
  ];

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
          className="relative z-10 w-full max-w-xl bg-charcoal-elevated/95 backdrop-blur-2xl border border-glass-border-medium rounded-md p-6 shadow-glass-lg space-y-6 font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
            <div>
              <Heading size="lg" font="display">
                LIVE SHIPMENT TRACKER // {order.orderNumber}
              </Heading>
              <span className="text-accent-cyan uppercase text-[10px]">
                QIKINK CARRIER TELEMETRY
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-sm bg-white/5 border border-glass-border-subtle text-riiqxText-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Visualizer */}
          <div className="py-2 space-y-4">
            <span className="text-riiqxText-muted uppercase tracking-wider block font-bold">
              TIMELINE STATUS:
            </span>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-glass-border-medium">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div
                    className={`absolute -left-6 w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                      step.done
                        ? 'bg-status-success border-status-success shadow-[0_0_10px_rgba(0,255,157,0.8)]'
                        : 'bg-obsidian-base border-glass-border-medium'
                    }`}
                  >
                    {step.done && <CheckCircle2 className="w-3 h-3 text-obsidian-base stroke-[3]" />}
                  </div>
                  <div>
                    <h5 className={`font-bold ${step.done ? 'text-white' : 'text-riiqxText-muted'}`}>
                      {step.label}
                    </h5>
                    <p className="text-[11px] text-riiqxText-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qikink Tracking Action */}
          <div className="p-4 rounded-sm bg-obsidian-base border border-glass-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-riiqxText-muted text-[10px] block">CARRIER TRACKING CODE</span>
              <span className="text-white font-bold text-sm">{order.qikinkOrderId || 'QK-889102-IN'}</span>
            </div>

            <Button
              variant="cyan"
              size="sm"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => window.open(`https://track.qikink.com/`, '_blank')}
            >
              TRACK ON QIKINK PORTAL
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
