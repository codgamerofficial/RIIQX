import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-riiqxText-primary selection:bg-[#D4AF37] selection:text-[#0C0B0A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-[#141312] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-glow-gold animate-pulse">
          <Compass className="w-8 h-8" />
        </div>

        <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
          404 // NULL ROUTE DETECTED
        </Badge>

        <Heading size="4xl" font="display" className="text-[#F3E5AB]">
          CAPSULE DROP NOT FOUND
        </Heading>

        <Text size="sm" variant="secondary" className="max-w-md">
          The page or product line you are searching for does not exist or has been archived in the RIIQX vault.
        </Text>

        <Link href="/collections/all">
          <Button variant="gold" size="lg" className="shadow-glow-gold" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            RETURN TO CAPSULE CATALOG
          </Button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
