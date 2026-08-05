'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, Sparkles, Layers } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const ProductAccordion: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>(['fabric']);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const items: AccordionItem[] = [
    {
      id: 'fabric',
      title: 'FABRIC & CRAFTSMANSHIP SPECIFICATION',
      icon: <Layers className="w-4 h-4 text-accent-crimson" />,
      content: (
        <ul className="space-y-2 text-xs font-mono text-riiqxText-secondary list-disc pl-4">
          <li><strong>Textile Weight:</strong> 500 GSM Heavyweight Organic Cotton Fleece.</li>
          <li><strong>Surface Treatment:</strong> Hydrophobic bonded membrane layer with matte finish.</li>
          <li><strong>Hardware:</strong> Grade 5 Titanium eyelets & custom laser-etched drawcord tips.</li>
          <li><strong>Care Instructions:</strong> Machine wash cold (30°C) inside out. Do not tumble dry. Iron low inside out.</li>
        </ul>
      ),
    },
    {
      id: 'fit',
      title: 'SILHOUETTE & FIT ADVICE',
      icon: <Sparkles className="w-4 h-4 text-accent-cyan" />,
      content: (
        <p className="text-xs font-mono text-riiqxText-secondary leading-relaxed">
          Engineered with RIIQX's signature monolithic dropped-shoulder oversized drape. Relaxed through the chest and armholes with ribbed hem structure. Order true-to-size for the intended cyber streetwear silhouette.
        </p>
      ),
    },
    {
      id: 'shipping',
      title: 'SHIPPING & QIKINK POD FULFILLMENT',
      icon: <Truck className="w-4 h-4 text-accent-lime" />,
      content: (
        <div className="space-y-2 text-xs font-mono text-riiqxText-secondary">
          <p>
            Every order is custom printed & fulfilled via the Qikink Print-on-Demand network across India.
          </p>
          <div className="p-3 rounded-sm bg-obsidian-base border border-glass-border-subtle space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>DISPATCH TIME:</span>
              <span className="text-white font-bold">24-48 HOURS</span>
            </div>
            <div className="flex justify-between">
              <span>EXPRESS DELIVERY:</span>
              <span className="text-accent-cyan font-bold">3-5 BUSINESS DAYS</span>
            </div>
            <div className="flex justify-between">
              <span>PACKAGING:</span>
              <span className="text-white">HERMETIC ANTI-STATIC BAG</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3 pt-4 border-t border-glass-border-subtle">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-sm bg-charcoal-matte/60 border border-glass-border-subtle overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-3.5 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-left text-white hover:text-accent-cyan transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-riiqxText-muted transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-accent-cyan' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-glass-border-subtle bg-obsidian-void/50 animate-fade-in-up">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
