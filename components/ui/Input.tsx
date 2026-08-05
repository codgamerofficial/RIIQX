'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  status?: 'default' | 'success' | 'error' | 'warning';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      status = 'default',
      leftIcon,
      rightIcon,
      value,
      placeholder,
      onChange,
      onFocus,
      onBlur,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const currentVal = value !== undefined ? value : internalValue;
    const isFloating = isFocused || (currentVal !== undefined && currentVal !== '');

    const inputId = id || (label ? `riiqx-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const statusBorders = {
      default: 'border-glass-border-subtle hover:border-glass-border-medium focus-within:border-accent-cyan focus-within:shadow-glow-cyan',
      success: 'border-status-success/60 focus-within:border-status-success focus-within:shadow-[0_0_15px_rgba(0,255,157,0.3)]',
      error: 'border-status-error/60 focus-within:border-status-error focus-within:shadow-[0_0_15px_rgba(255,2,78,0.3)]',
      warning: 'border-status-warning/60 focus-within:border-status-warning focus-within:shadow-[0_0_15px_rgba(255,184,0,0.3)]',
    };

    const statusIcons = {
      default: null,
      success: <CheckCircle2 className="w-4 h-4 text-status-success" />,
      error: <AlertCircle className="w-4 h-4 text-status-error" />,
      warning: <AlertTriangle className="w-4 h-4 text-status-warning" />,
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div
          className={cn(
            'relative w-full rounded-sm bg-charcoal-matte/70 backdrop-blur-md border transition-all duration-200 ease-magnetic flex items-center px-3 py-2.5',
            statusBorders[status],
            className
          )}
        >
          {leftIcon && <div className="mr-2.5 text-riiqxText-muted shrink-0">{leftIcon}</div>}

          <div className="relative w-full flex flex-col justify-center min-h-[38px]">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'absolute left-0 font-mono transition-all duration-200 pointer-events-none select-none origin-left',
                  isFloating
                    ? '-top-2 text-[10px] uppercase tracking-wider text-accent-cyan font-bold'
                    : 'top-2.5 text-xs text-riiqxText-muted'
                )}
              >
                {label}
              </label>
            )}

            <input
              ref={ref}
              id={inputId}
              value={currentVal}
              placeholder={isFloating ? placeholder : ''}
              onChange={(e) => {
                setInternalValue(e.target.value);
                if (onChange) onChange(e);
              }}
              onFocus={(e) => {
                setIsFocused(true);
                if (onFocus) onFocus(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                if (onBlur) onBlur(e);
              }}
              className={cn(
                'w-full bg-transparent text-riiqxText-primary text-sm font-sans focus:outline-none placeholder:text-riiqxText-disabled',
                label && 'pt-2.5'
              )}
              {...props}
            />
          </div>

          <div className="ml-2 flex items-center gap-1.5 shrink-0">
            {rightIcon && <div className="text-riiqxText-muted">{rightIcon}</div>}
            {statusIcons[status]}
          </div>
        </div>

        {helperText && (
          <p
            className={cn(
              'text-[11px] font-mono tracking-wide',
              status === 'error' && 'text-status-error',
              status === 'success' && 'text-status-success',
              status === 'warning' && 'text-status-warning',
              status === 'default' && 'text-riiqxText-muted'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
