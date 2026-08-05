'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

export interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const sizeChart = [
    { size: 'S', chestCm: '108', chestIn: '42.5', lengthCm: '72', lengthIn: '28.3', shoulderCm: '54' },
    { size: 'M', chestCm: '114', chestIn: '44.8', lengthCm: '74', lengthIn: '29.1', shoulderCm: '56' },
    { size: 'L', chestCm: '120', chestIn: '47.2', lengthCm: '76', lengthIn: '29.9', shoulderCm: '58' },
    { size: 'XL', chestCm: '126', chestIn: '49.6', lengthCm: '78', lengthIn: '30.7', shoulderCm: '60' },
    { size: 'XXL', chestCm: '132', chestIn: '52.0', lengthCm: '80', lengthIn: '31.5', shoulderCm: '62' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-base/85 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-2xl bg-charcoal-elevated/95 backdrop-blur-2xl border border-glass-border-medium rounded-md p-6 shadow-glass-lg space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-accent-cyan" />
                <div>
                  <Heading size="lg" font="display">
                    SIZE & FIT SPECIFICATION
                  </Heading>
                  <span className="font-mono text-xs text-riiqxText-muted uppercase">
                    RIIQX MONOLITHIC OVERSIZED SILHOUETTE
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-sm bg-white/5 border border-glass-border-subtle text-riiqxText-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Unit Toggle & Description */}
            <div className="flex items-center justify-between">
              <Badge variant="cyan" shape="chamfer" dot>
                FIT RECOMMENDATION: RELAXED OVERSIZED
              </Badge>

              <div className="flex items-center gap-1 bg-obsidian-base p-1 rounded-sm border border-glass-border-subtle font-mono text-xs">
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-xs transition-colors ${
                    unit === 'cm' ? 'bg-accent-crimson text-white font-bold' : 'text-riiqxText-muted'
                  }`}
                >
                  CM
                </button>
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-xs transition-colors ${
                    unit === 'in' ? 'bg-accent-crimson text-white font-bold' : 'text-riiqxText-muted'
                  }`}
                >
                  INCHES
                </button>
              </div>
            </div>

            {/* Size Table */}
            <div className="overflow-x-auto rounded-sm border border-glass-border-subtle">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-obsidian-void text-accent-cyan border-b border-glass-border-subtle uppercase">
                  <tr>
                    <th className="p-3">SIZE</th>
                    <th className="p-3">CHEST ({unit.toUpperCase()})</th>
                    <th className="p-3">LENGTH ({unit.toUpperCase()})</th>
                    <th className="p-3">SHOULDER ({unit.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border-subtle text-riiqxText-secondary">
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-white">{row.size}</td>
                      <td className="p-3">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                      <td className="p-3">{unit === 'cm' ? row.lengthCm : row.lengthIn}</td>
                      <td className="p-3">{unit === 'cm' ? row.shoulderCm : row.shoulderCm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Guidance Note */}
            <div className="p-4 rounded-sm bg-charcoal-matte border border-glass-border-subtle text-xs font-mono space-y-1 text-riiqxText-muted">
              <span className="text-accent-crimson font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FIT NOTE:
              </span>
              <p>
                RIIQX garments are intentionally engineered with a boxy, dropped-shoulder oversized fit. Order your true size for the intended silhouette, or size down for a standard tailored fit.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
