'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  sublabel,
  disabled = false,
  className,
}) => {
  const [isCheckedInternal, setIsCheckedInternal] = React.useState(defaultChecked);

  const isChecked = checked !== undefined ? checked : isCheckedInternal;

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !isChecked;
    setIsCheckedInternal(nextState);
    if (onChange) onChange(nextState);
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center justify-between gap-4 select-none cursor-pointer group',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span
              className={cn(
                'text-sm font-sans font-medium transition-colors duration-150',
                isChecked ? 'text-riiqxText-primary' : 'text-riiqxText-secondary group-hover:text-white'
              )}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-xs font-mono text-riiqxText-muted mt-0.5">{sublabel}</span>
          )}
        </div>
      )}

      <div
        role="switch"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={cn(
          'w-11 h-6 rounded-full p-0.5 transition-all duration-300 ease-magnetic border shrink-0 flex items-center',
          isChecked
            ? 'bg-accent-cyan/20 border-accent-cyan shadow-glow-cyan'
            : 'bg-charcoal-matte border-glass-border-medium group-hover:border-glass-border-active'
        )}
      >
        <div
          className={cn(
            'w-4 h-4 rounded-full transition-transform duration-300 ease-magnetic',
            isChecked
              ? 'translate-x-5 bg-accent-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]'
              : 'translate-x-0 bg-riiqxText-muted'
          )}
        />
      </div>
    </div>
  );
};
