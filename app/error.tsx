'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Typography';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-riiqxText-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6 bg-[#141312] p-8 rounded-md border border-[#D4AF37]/30 shadow-glow-gold">
        <div className="w-12 h-12 rounded-sm bg-[#D4AF37] text-[#0C0B0A] font-bold text-xl flex items-center justify-center mx-auto">
          R
        </div>
        <Heading size="2xl" font="display" className="text-[#F3E5AB]">
          SYSTEM EXCEPTION DETECTED
        </Heading>
        <Text size="xs" variant="muted">
          {error.message || 'A transient rendering error occurred.'}
        </Text>
        <Button
          variant="gold"
          size="lg"
          className="w-full shadow-glow-gold"
          onClick={() => reset()}
        >
          RETRY TRANSACTION
        </Button>
      </div>
    </div>
  );
}
