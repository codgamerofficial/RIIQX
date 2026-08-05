'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export const PincodeDeliveryEstimator: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [estimateResult, setEstimateResult] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) return;

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setEstimateResult(`EXPRESS DELIVERY BY ${formattedDate.toUpperCase()} // FREE AIR FREIGHT`);
    }, 600);
  };

  return (
    <div className="p-4 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between text-riiqxText-secondary">
        <span className="flex items-center gap-1.5 font-bold text-white">
          <MapPin className="w-4 h-4 text-[#D4AF37]" /> ESTIMATE DISPATCH & DELIVERY
        </span>
        <span className="text-[10px] text-[#D4AF37]">27,000+ PINCODES COVERED</span>
      </div>

      <form onSubmit={handleCheckPincode} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="ENTER 6-DIGIT PINCODE (e.g. 110001)"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          className="flex-1 bg-[#0C0B0A] border border-[#D4AF37]/30 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
        />
        <button
          type="submit"
          disabled={pincode.length !== 6 || isChecking}
          className="px-4 py-2 rounded-sm bg-[#D4AF37] text-[#0C0B0A] font-bold uppercase text-[11px] disabled:opacity-50 hover:shadow-glow-gold transition-all"
        >
          {isChecking ? 'VERIFYING...' : 'CHECK'}
        </button>
      </form>

      {estimateResult && (
        <div className="p-2.5 rounded-sm bg-[#1C1B18] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center gap-2 animate-fade-in-up font-bold">
          <Truck className="w-4 h-4 text-[#F3E5AB] shrink-0" />
          <span>{estimateResult}</span>
        </div>
      )}

      <div className="flex items-center gap-4 text-[10px] text-riiqxText-muted pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> 7-DAY REPLACEMENT GUARANTEE
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" /> QIKINK POD VERIFIED
        </span>
      </div>
    </div>
  );
};
