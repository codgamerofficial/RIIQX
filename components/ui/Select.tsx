'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select deployment option...',
  label,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-riiqxText-muted">
          {label}
        </span>
      )}

      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'w-full flex items-center justify-between px-3.5 py-3 rounded-sm bg-charcoal-matte/80 backdrop-blur-md border border-glass-border-subtle hover:border-glass-border-medium focus:outline-none focus:border-accent-cyan transition-all duration-200 ease-magnetic cursor-pointer text-left',
            isOpen && 'border-accent-cyan shadow-glow-cyan',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'font-sans text-sm tracking-wide truncate',
              selectedOption ? 'text-riiqxText-primary font-medium' : 'text-riiqxText-muted'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-riiqxText-muted transition-transform duration-200 ease-magnetic ml-2 shrink-0',
              isOpen && 'rotate-180 text-accent-cyan'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-sm bg-charcoal-elevated/95 backdrop-blur-xl border border-glass-border-medium shadow-glass-lg overflow-hidden animate-fade-in-up py-1">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-colors duration-150 text-left cursor-pointer',
                    isSelected
                      ? 'bg-accent-crimson/15 text-accent-crimson font-bold border-l-2 border-accent-crimson'
                      : 'text-riiqxText-secondary hover:bg-white/5 hover:text-white',
                    option.disabled && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {option.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/10 text-riiqxText-muted uppercase">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent-crimson" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
