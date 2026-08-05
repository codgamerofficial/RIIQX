'use client';

import React, { useState, useEffect } from 'react';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DropCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('ENTER VALID ENCRYPTED EMAIL ADDRESS');
      return;
    }
    setErrorMsg('');
    setIsSubscribed(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative rounded-lg p-8 md:p-12 bg-gradient-to-r from-charcoal-matte via-charcoal-elevated to-charcoal-matte border border-accent-crimson/40 shadow-glow-crimson overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ff003c_1px,transparent_1px)] opacity-10 [background-size:20px_20px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Countdown Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="crimson" shape="chamfer" dot>
                NEXT SYSTEM DEPLOYMENT
              </Badge>
              <span className="font-mono text-xs text-accent-cyan tracking-widest">// BATCH 005 PREVIEW</span>
            </div>

            <Heading size="4xl" font="display" className="text-white">
              BATCH 005 // RE-ENGINEERED
            </Heading>

            <Text size="base" variant="secondary" className="max-w-xl">
              Limited to 100 units worldwide. High-density carbon weave, laser-cut waterproof pockets, and integrated NFC encryption. Sign up to receive priority dispatch access codes.
            </Text>

            {/* Hype Timer Display */}
            <div className="grid grid-cols-4 gap-3 max-w-md pt-2">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="flex flex-col items-center justify-center p-3 rounded-sm bg-obsidian-base/80 border border-glass-border-medium shadow-glass-sm"
                >
                  <span className="font-mono font-black text-2xl md:text-3xl text-accent-crimson">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[9px] text-riiqxText-muted tracking-widest">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Priority Dispatch Newsletter Signup */}
          <div className="lg:col-span-5 bg-obsidian-base/90 backdrop-blur-xl border border-glass-border-medium rounded-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent-cyan">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-mono font-bold text-sm uppercase tracking-wider">
                PRIORITY DISPATCH ACCESS
              </span>
            </div>

            {isSubscribed ? (
              <div className="p-4 rounded-sm bg-accent-cyan/15 border border-accent-cyan/40 space-y-2 animate-fade-in-up">
                <div className="flex items-center gap-2 text-accent-cyan font-mono font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> ACCESS GRANTED
                </div>
                <p className="font-mono text-xs text-riiqxText-secondary">
                  Your encrypted email hash has been enrolled in the priority queue for Batch 005. Check your inbox for access code.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  label="ENCRYPTED EMAIL ADDRESS"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  status={errorMsg ? 'error' : 'default'}
                  helperText={errorMsg || 'We strictly send drop access codes. Zero spam.'}
                />
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  ENROLL FOR PRIORITY DROP
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
