'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  position?: 'right' | 'left';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const GlassDrawer: React.FC<GlassDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = 'right',
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const slideVariants = {
    closed: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: 0.8,
    },
    open: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop Blur Underlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-base/80 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            variants={slideVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'relative z-10 w-full max-w-md h-full bg-charcoal-elevated/95 backdrop-blur-2xl border-glass-border-medium border-l shadow-glass-lg flex flex-col',
              position === 'left' ? 'mr-auto border-r border-l-0' : 'ml-auto border-l',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-glass-border-subtle">
              <div>
                {title && (
                  <h3 className="font-display text-lg font-bold text-riiqxText-primary tracking-wide">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="font-mono text-xs text-accent-cyan mt-0.5 uppercase tracking-wider">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-sm bg-white/5 border border-glass-border-subtle hover:border-accent-crimson text-riiqxText-muted hover:text-accent-crimson transition-colors duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">{children}</div>

            {/* Optional Footer */}
            {footer && (
              <div className="p-5 border-t border-glass-border-subtle bg-charcoal-matte/80">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
