'use client';

// =============================================================================
// RIIQX MUSIC — Dedicated Route Page (/music)
// =============================================================================

import React, { useEffect } from 'react';
import { RiiqxMusicView } from '@/components/music/RiiqxMusicView';
import { useRiiqx } from '@/context/RiiqxContext';

export default function MusicPage() {
  const { setActiveTab } = useRiiqx();

  useEffect(() => {
    setActiveTab('music');
  }, [setActiveTab]);

  return <RiiqxMusicView />;
}

