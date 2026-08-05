'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bell, CheckCircle2 } from 'lucide-react';

export interface InventoryStockAlertProps {
  productName: string;
  variantSku: string;
  isPreOrder?: boolean;
}

export const InventoryStockAlert: React.FC<InventoryStockAlertProps> = ({
  productName,
  variantSku,
  isPreOrder = false,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('ENTER VALID EMAIL ADDRESS');
      return;
    }
    setErrorMsg('');
    setIsSubmitted(true);
  };

  return (
    <div className="p-5 rounded-md bg-charcoal-matte/90 border border-status-warning/40 space-y-4 shadow-glass-md">
      <div className="flex items-center gap-2 text-status-warning">
        <Bell className="w-5 h-5 animate-pulse" />
        <span className="font-mono font-bold text-sm uppercase tracking-wider">
          {isPreOrder ? 'PRE-ORDER NOTIFICATION QUEUE' : 'STOCK DEPLETED // RESTOCK ALERT'}
        </span>
      </div>

      <p className="font-mono text-xs text-riiqxText-secondary leading-relaxed">
        {isPreOrder
          ? `Reserve priority dispatch for ${productName} (${variantSku}). We will notify you the instant printing is verified.`
          : `This variant (${variantSku}) is currently out of stock. Enter your email to be automatically enrolled in the priority restock queue.`}
      </p>

      {isSubmitted ? (
        <div className="p-3 rounded-sm bg-status-success/15 border border-status-success/40 text-status-success font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>ENROLLED: YOU WILL RECEIVE INSTANT RESTOCK TELEMETRY.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="ENCRYPTED EMAIL ADDRESS"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            status={errorMsg ? 'error' : 'default'}
            helperText={errorMsg || 'Instant alert when restock lands.'}
          />
          <Button
            variant="cyan"
            size="md"
            className="w-full font-mono text-xs"
            leftIcon={<Bell className="w-4 h-4" />}
          >
            NOTIFY ME WHEN AVAILABLE
          </Button>
        </form>
      )}
    </div>
  );
};
