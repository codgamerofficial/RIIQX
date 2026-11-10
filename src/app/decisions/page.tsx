'use client';

// =============================================================================
// RIIQX — Decision Lab & Price Truth Engine Route (/decisions)
// =============================================================================

import React, { useEffect } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { TwinDecisionsView } from '@/components/twin/TwinDecisionsView';

export default function DecisionsPage() {
  const { setActiveTab } = useRiiqx();

  useEffect(() => {
    setActiveTab('decisions');
  }, [setActiveTab]);

  return <TwinDecisionsView />;
}

