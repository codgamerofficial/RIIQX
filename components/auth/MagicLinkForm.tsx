'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signInWithMagicLinkAction } from '@/app/actions/auth';
import { Mail, Zap, CheckCircle2 } from 'lucide-react';

export const MagicLinkForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const res = await signInWithMagicLinkAction(email);
    setIsLoading(false);
    setMsg(res.message);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {msg ? (
        <div className="p-4 rounded-sm bg-accent-cyan/15 border border-accent-cyan/40 text-accent-cyan flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="PASSWORDLESS MAGIC LINK"
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="cyan"
            size="md"
            isLoading={isLoading}
            className="w-full"
            leftIcon={<Zap className="w-4 h-4" />}
          >
            TRANSMIT MAGIC ACCESS LINK
          </Button>
        </form>
      )}
    </div>
  );
};
