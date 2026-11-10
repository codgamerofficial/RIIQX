'use client';

// =============================================================================
// RIIQX — Master Application View
// Ultra-High-Fidelity Audio Streaming • AI Music Copilot • Decision Lab & Deals
// =============================================================================

import React from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxMusicView } from '@/components/music/RiiqxMusicView';
import { TwinDecisionsView } from '@/components/twin/TwinDecisionsView';

export default function RiiqxWorkspacePage() {
  const { activeTab } = useRiiqx();

  if (activeTab === 'decisions') {
    return <TwinDecisionsView />;
  }

  return <RiiqxMusicView />;
}
