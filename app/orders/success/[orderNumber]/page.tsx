import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, PackageCheck, Copy } from 'lucide-react';

interface OrderSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderSuccessPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmed ${orderNumber} // RIIQX`,
    description: `Your RIIQX order ${orderNumber} has been verified and sent to Qikink Print-on-Demand fulfillment.`,
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10 w-full flex-1">
        {/* Success Hero Header */}
        <div className="text-center space-y-4 relative">
          <div className="w-20 h-20 rounded-full bg-status-success/20 border-2 border-status-success flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,157,0.4)] animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-status-success" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="cyan" shape="chamfer" dot>
                PAYMENT VERIFIED & PAID
              </Badge>
              <span className="font-mono text-xs text-riiqxText-muted">// STATUS: PROCESSING</span>
            </div>

            <Heading size="4xl" font="display" gradient>
              ORDER CONFIRMED
            </Heading>

            <Text size="base" variant="secondary" className="max-w-xl mx-auto">
              Your order hash has been written to system ledger. Qikink Print-on-Demand has initialized garment fabrication.
            </Text>
          </div>
        </div>

        {/* Order Details Matrix Card */}
        <div className="p-8 rounded-lg bg-charcoal-matte/80 backdrop-blur-2xl border border-glass-border-medium shadow-glass-lg space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-glass-border-subtle">
            <div>
              <span className="text-riiqxText-muted block uppercase text-[10px]">ORDER IDENTIFIER</span>
              <span className="text-white font-bold text-lg font-mono tracking-wider">{orderNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="crimson" shape="chamfer">
                ESTIMATED DISPATCH: 24-48 HOURS
              </Badge>
            </div>
          </div>

          {/* Delivery & Security Spec */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-1.5">
              <div className="flex items-center gap-2 text-accent-cyan font-bold">
                <Truck className="w-4 h-4" />
                <span>EXPRESS SHIPMENT</span>
              </div>
              <p className="text-riiqxText-muted text-[11px]">
                3-5 Business Days across India via Qikink priority courier network.
              </p>
            </div>

            <div className="p-4 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-1.5">
              <div className="flex items-center gap-2 text-status-success font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>NFC VERIFICATION TAG</span>
              </div>
              <p className="text-riiqxText-muted text-[11px]">
                Includes laser-engraved titanium NFC tag linking to digital authenticity hash.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections/all">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                CONTINUE SHOPPING
              </Button>
            </Link>

            <Link href="/dashboard/orders">
              <Button variant="outline" size="lg" leftIcon={<PackageCheck className="w-4 h-4 text-accent-cyan" />}>
                VIEW IN DASHBOARD
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
