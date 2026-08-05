'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heading, Text } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { signInWithPasswordAction } from '@/app/actions/auth';
import { Lock, Mail, Key, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await signInWithPasswordAction(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson flex flex-col justify-between">
      <Navbar />

      <main className="max-w-md mx-auto px-6 py-16 w-full flex-1 flex flex-col justify-center">
        <div className="p-8 rounded-lg bg-charcoal-matte/80 backdrop-blur-2xl border border-glass-border-medium shadow-glass-lg space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm bg-accent-crimson flex items-center justify-center mx-auto shadow-glow-crimson font-mono font-black text-white text-xl">
              R
            </div>
            <Heading size="2xl" font="display">
              AUTHENTICATE SESSION
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              ACCESS YOUR TACTICAL RIIQX ACCOUNT & DISPATCH HISTORY
            </Text>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons />

          <div className="relative flex items-center justify-center font-mono text-[10px] text-riiqxText-muted">
            <div className="border-t border-glass-border-subtle w-full" />
            <span className="bg-charcoal-matte px-3 shrink-0">OR PASSWORDLESS MAGIC LINK</span>
            <div className="border-t border-glass-border-subtle w-full" />
          </div>

          {/* Magic Link */}
          <MagicLinkForm />

          <div className="relative flex items-center justify-center font-mono text-[10px] text-riiqxText-muted">
            <div className="border-t border-glass-border-subtle w-full" />
            <span className="bg-charcoal-matte px-3 shrink-0">OR ENCRYPTED PASSWORD</span>
            <div className="border-t border-glass-border-subtle w-full" />
          </div>

          {/* Password Login */}
          <form onSubmit={handlePasswordLogin} className="space-y-4 font-mono text-xs">
            {errorMsg && (
              <p className="p-3 rounded-sm bg-status-error/15 border border-status-error/40 text-status-error font-bold">
                {errorMsg}
              </p>
            )}

            <Input
              label="EMAIL ADDRESS"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="SECURITY PASSWORD"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Key className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full py-3.5 shadow-glow-crimson"
              leftIcon={<Lock className="w-4 h-4" />}
            >
              AUTHENTICATE SESSION
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center font-mono text-xs text-riiqxText-muted pt-2 border-t border-glass-border-subtle">
            NEW TO RIIQX?{' '}
            <Link href="/signup" className="text-accent-cyan font-bold hover:underline">
              PROVISION AN ACCOUNT
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
