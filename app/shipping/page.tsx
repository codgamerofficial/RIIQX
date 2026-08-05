import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Truck, Package, Shield, Clock } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-riiqxText-primary selection:bg-[#D4AF37] selection:text-[#0C0B0A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10 flex-1">
        <div className="space-y-4 border-b border-[#D4AF37]/20 pb-8">
          <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
            DISPATCH PROTOCOL
          </Badge>
          <Heading size="4xl" font="display" className="text-[#F3E5AB]">
            SHIPPING & ANTI-STATIC PACKAGING SPEC
          </Heading>
          <Text size="base" variant="muted">
            Automated Qikink POD fulfillment, real-time carrier webhooks, and express dispatch.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
              <Truck className="w-5 h-5 text-[#F3E5AB]" />
              <span>EXPRESS COURIER PARTNERS</span>
            </div>
            <p className="text-xs text-[#9E9A93] leading-relaxed">
              All RIIQX orders are dispatched via Tier-1 express air carriers (Delhivery, BlueDart, Bluedart Apex, DTDC) with end-to-end live tracking webhooks.
            </p>
          </div>

          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
              <Package className="w-5 h-5 text-[#F3E5AB]" />
              <span>ANTI-STATIC LIQUID GOLD PACKAGING</span>
            </div>
            <p className="text-xs text-[#9E9A93] leading-relaxed">
              Every garment is vacuum-sealed in ESD-shielded matte black polybags with tamper-evident security holographic tape and NFC serial authentication tags.
            </p>
          </div>

          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
              <Clock className="w-5 h-5 text-[#F3E5AB]" />
              <span>DISPATCH TIMELINES</span>
            </div>
            <p className="text-xs text-[#9E9A93] leading-relaxed">
              In-stock items are produced and dispatched within 24-48 hours. Express delivery arrives within 2-4 business days across India.
            </p>
          </div>

          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
              <Shield className="w-5 h-5 text-[#F3E5AB]" />
              <span>COMPLIMENTARY SHIPPING THRESHOLD</span>
            </div>
            <p className="text-xs text-[#9E9A93] leading-relaxed">
              Orders equal to or exceeding ₹15,000 automatically qualify for free express air freight across all Indian postal pincodes.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
