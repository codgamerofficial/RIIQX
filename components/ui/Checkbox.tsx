'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  sublabel,
  disabled = false,
  className,
  id,
}) => {
  const [isCheckedInternal, setIsCheckedInternal] = React.useState(defaultChecked);

  const isChecked = checked !== undefined ? checked : isCheckedInternal;

  const handleClick = () => {
    if (disabled) return;
    const nextState = !isChecked;
    setIsCheckedInternal(nextState);
    if (onChange) onChange(nextState);
  };

  const checkboxId = id || (label ? `riiqx-checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div
      onClick={handleClick}
      className={cn(
        'inline-flex items-start gap-3 select-none cursor-pointer group',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <div
        id={checkboxId}
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          'w-5 h-5 mt-0.5 rounded-sm border transition-all duration-200 ease-magnetic flex items-center justify-center shrink-0 focus:outline-none focus:ring-1 focus:ring-accent-cyan',
          isChecked
            ? 'bg-accent-crimson border-accent-crimson shadow-glow-crimson'
            : 'bg-charcoal-matte/80 border-glass-border-medium group-hover:border-glass-border-active'
        )}
      >
        {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
      </div>

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
    </div>
  );
};
