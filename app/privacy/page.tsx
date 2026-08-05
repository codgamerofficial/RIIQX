import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-riiqxText-primary selection:bg-[#D4AF37] selection:text-[#0C0B0A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10 flex-1">
        <div className="space-y-4 border-b border-[#D4AF37]/20 pb-8">
          <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
            ENCRYPTED DATA PROTOCOL
          </Badge>
          <Heading size="4xl" font="display" className="text-[#F3E5AB]">
            PRIVACY & DATA SECURITY SPECIFICATION
          </Heading>
          <Text size="base" variant="muted">
            Official Data Privacy & Telemetry Standards for RIIQX Haute Couture Platform.
          </Text>
        </div>

        <div className="space-y-8 font-mono text-sm leading-relaxed text-[#D4D0C8]">
          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[#F3E5AB]" />
              <span>1. 256-BIT ENCRYPTED TRANSACTION PROTOCOL</span>
            </div>
            <p className="text-xs text-[#9E9A93]">
              All payment transactions processed on RIIQX are executed over SSL/TLS 256-bit encrypted channels directly via Razorpay and Supabase Row Level Security (RLS). RIIQX does not store raw credit card numbers or banking credentials on local servers.
            </p>
          </div>

          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base">
              <Database className="w-5 h-5 text-[#F3E5AB]" />
              <span>2. USER PROFILE & DISPATCH DATA</span>
            </div>
            <p className="text-xs text-[#9E9A93]">
              Personal details such as full name, shipping address, and phone numbers are encrypted in transit and at rest in Supabase PostgreSQL data clusters. This data is exclusively transmitted to our print-on-demand fulfillment engine (Qikink POD API v2) for order dispatch.
            </p>
          </div>

          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base">
              <Lock className="w-5 h-5 text-[#F3E5AB]" />
              <span>3. TELEMETRY & ANALYTICS PRIVACY</span>
            </div>
            <p className="text-xs text-[#9E9A93]">
              Product interaction data collected via PostHog telemetry is sanitized and anonymized. Users may opt out of tracking at any time by configuring Do-Not-Track headers in their client browser.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
