'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FitPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
}

export const FitPredictorModal: React.FC<FitPredictorModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
}) => {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'oversized'>('oversized');
  const [calculatedSize, setCalculatedSize] = useState<string>('');

  if (!isOpen) return null;

  const handleCalculateFit = () => {
    let base = 'M';
    if (weightKg < 60) base = 'S';
    else if (weightKg <= 75) base = 'M';
    else if (weightKg <= 88) base = 'L';
    else base = 'XL';

    if (fitPreference === 'oversized' && base !== 'XL') {
      if (base === 'S') base = 'M';
      else if (base === 'M') base = 'L';
      else if (base === 'L') base = 'XL';
    }

    setCalculatedSize(base);
  };

  const handleApplySize = () => {
    if (calculatedSize) {
      onSelectSize(calculatedSize);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0B0A]/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in-up">
      <div className="w-full max-w-lg bg-[#141312] border border-[#D4AF37]/30 rounded-md p-6 shadow-glow-gold relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-riiqxText-muted hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Ruler className="w-4 h-4 text-[#F3E5AB]" /> SMART FIT PREDICTOR // NIKE & ZARA SPEC
          </span>
          <h3 className="font-display font-bold text-2xl text-white">
            FIND YOUR PERFECT FIT
          </h3>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Height Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-riiqxText-secondary">
              <span>YOUR HEIGHT:</span>
              <span className="text-[#D4AF37] font-bold">{heightCm} CM ({Math.floor(heightCm / 30.48)}'{Math.round((heightCm % 30.48) / 2.54)}")</span>
            </div>
            <input
              type="range"
              min={150}
              max={200}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          {/* Weight Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-riiqxText-secondary">
              <span>YOUR WEIGHT:</span>
              <span className="text-[#D4AF37] font-bold">{weightKg} KG</span>
            </div>
            <input
              type="range"
              min={45}
              max={120}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          {/* Fit Preference Chips */}
          <div className="space-y-1.5 pt-2">
            <span className="text-riiqxText-secondary block">PREFERRED SILHOUETTE FIT:</span>
            <div className="grid grid-cols-3 gap-2">
              {(['slim', 'regular', 'oversized'] as const).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setFitPreference(pref)}
                  className={`py-2 px-3 rounded-sm border uppercase font-bold text-[10px] transition-all cursor-pointer ${
                    fitPreference === pref
                      ? 'bg-[#D4AF37] text-[#0C0B0A] border-[#D4AF37]'
                      : 'bg-[#1C1B18] text-[#9E9A93] border-[#D4AF37]/20 hover:text-white'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction Results Display */}
        {calculatedSize ? (
          <div className="p-4 rounded-sm bg-[#1C1B18] border border-[#D4AF37]/40 space-y-3 text-center animate-fade-in-up">
            <span className="font-mono text-xs text-[#F3E5AB] uppercase tracking-widest block">
              RECOMMENDED SIZE FOR YOU:
            </span>
            <div className="font-mono font-black text-4xl text-[#D4AF37]">
              {calculatedSize}
            </div>
            <Button
              variant="gold"
              size="md"
              className="w-full py-3 shadow-glow-gold font-mono font-bold"
              onClick={handleApplySize}
              leftIcon={<Check className="w-4 h-4 text-[#0C0B0A]" />}
            >
              SELECT SIZE {calculatedSize} & CONTINUE
            </Button>
          </div>
        ) : (
          <Button
            variant="gold"
            size="md"
            className="w-full py-3 shadow-glow-gold font-mono font-bold"
            onClick={handleCalculateFit}
            leftIcon={<Sparkles className="w-4 h-4 text-[#0C0B0A]" />}
          >
            PREDICT MY FIT SIZE
          </Button>
        )}
      </div>
    </div>
  );
};
