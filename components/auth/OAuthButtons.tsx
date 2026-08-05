'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Globe, Github } from 'lucide-react';

export const OAuthButtons: React.FC = () => {
  const handleOAuth = async (provider: 'google' | 'github') => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
      <Button
        variant="secondary"
        size="md"
        leftIcon={<Globe className="w-4 h-4 text-accent-cyan" />}
        onClick={() => handleOAuth('google')}
      >
        GOOGLE OAUTH
      </Button>

      <Button
        variant="secondary"
        size="md"
        leftIcon={<Github className="w-4 h-4 text-white" />}
        onClick={() => handleOAuth('github')}
      >
        GITHUB OAUTH
      </Button>
    </div>
  );
};
