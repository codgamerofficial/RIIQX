import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Cpu, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-riiqxText-primary selection:bg-[#D4AF37] selection:text-[#0C0B0A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10 flex-1">
        <div className="space-y-4 border-b border-[#D4AF37]/20 pb-8">
          <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
            NFC HARDWARE AUTHENTICATION
          </Badge>
          <Heading size="4xl" font="display" className="text-[#F3E5AB]">
            NFC SERIAL AUTHENTICATION PROTOCOL
          </Heading>
          <Text size="base" variant="muted">
            Cryptographically signed anodized titanium tags sewn into every RIIQX garment.
          </Text>
        </div>

        <div className="space-y-6 font-mono text-sm leading-relaxed text-[#D4D0C8]">
          <div className="p-6 rounded-md bg-[#141312] border border-[#D4AF37]/30 space-y-4 shadow-glow-gold">
            <div className="flex items-center gap-3 text-[#D4AF37] font-bold text-lg">
              <Cpu className="w-6 h-6 text-[#F3E5AB] animate-pulse" />
              <span>CRYPTOGRAPHIC HARDWARE VERIFICATION</span>
            </div>
            <p className="text-xs text-[#9E9A93]">
              Every garment in the RIIQX Golden Drop series contains a micro-encapsulated NTAG215 NFC chip embedded within the hem label. Scanning the tag with any smartphone verifies the unique cryptographic serial signature registered on the Supabase database ledger.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#F3E5AB]">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>100% IMMUTABLE PROOF OF AUTHENTICITY</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
