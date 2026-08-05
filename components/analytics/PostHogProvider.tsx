'use client';

import React, { useEffect } from 'react';
import posthog from 'posthog-js';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (phKey) {
      posthog.init(phKey, {
        api_host: phHost,
        capture_pageview: true,
        autocapture: true,
      });
    }
  }, []);

  return <>{children}</>;
}
