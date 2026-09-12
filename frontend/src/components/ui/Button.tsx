import React, { forwardRef } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

// NOTE [SHARED PROP CHANGE]: Added 'pill-dark' to ButtonProps['variant'] and set it as default.
// Downstream screens use 'pill-dark' (--ink) as the default button for operational actions,
// reserving 'primary' (--accent-primary) for the single standout action per screen.
// Optional 'withArrow' prop automatically appends a trailing ArrowRight icon.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill-dark';
  /** Button sizing */
  size?: 'sm' | 'md' | 'lg';
  /** Displays a loading spinner and disables interaction */
  isLoading?: boolean;
  /** Optional icon element placed before text */
  leadingIcon?: React.ReactNode;
  /** Optional icon element placed after text */
  trailingIcon?: React.ReactNode;
  /** Automatically appends a trailing ArrowRight icon */
  withArrow?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'pill-dark',
      size = 'md',
      isLoading = false,
      disabled = false,
      leadingIcon,
      trailingIcon,
      withArrow = false,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    // Sizing tokens
    const sizeClasses = {
      sm: 'h-8 px-3.5 text-[12px] gap-1.5',
      md: 'h-10 px-5 text-[13px] gap-2',
      lg: 'h-12 px-6 text-[15px] gap-2.5',
    }[size];

    // Variant tokens consuming CSS custom properties
    const variantClasses = {
      primary:
        'bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 active:scale-[0.98] shadow-xs border border-transparent disabled:opacity-50 disabled:pointer-events-none',
      'pill-dark':
        'bg-[var(--ink)] text-white font-medium hover:opacity-90 active:scale-[0.98] shadow-xs border border-transparent disabled:opacity-50 disabled:pointer-events-none',
      secondary:
        'bg-transparent border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:bg-[var(--surface-muted)] active:scale-[0.98] shadow-2xs disabled:opacity-40 disabled:pointer-events-none',
      ghost:
        'bg-transparent border-transparent text-[var(--text-secondary-accessible)] font-medium hover:text-[var(--text-primary)] hover:underline disabled:opacity-40 disabled:pointer-events-none p-0 h-auto',
    }[variant];

    const radiusClass = variant === 'ghost' ? '' : 'rounded-[var(--radius-pill)]';
    const widthClass = fullWidth ? 'w-full' : 'w-auto';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${sizeClasses} ${variantClasses} ${radiusClass} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          <>
            {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
            <span>{children}</span>
            {trailingIcon ? (
              <span className="shrink-0">{trailingIcon}</span>
            ) : withArrow ? (
              <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
            ) : null}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element to render inside the circular button */
  icon: React.ReactNode;
  /** Button sizing */
  size?: 'sm' | 'md';
  /** Visual variant */
  variant?: 'default' | 'filled';
  /** Accessible label describing the button action */
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      variant = 'default',
      'aria-label': ariaLabel,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-[12px]',
      md: 'w-10 h-10 text-[14px]',
    }[size];

    const variantClasses = {
      default:
        'bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] border border-transparent hover:border-[var(--border-subtle)]',
      filled:
        'bg-[var(--accent-primary)] text-white hover:opacity-90 shadow-xs border border-transparent',
    }[variant];

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`rounded-full inline-flex items-center justify-center transition-all select-none active:scale-[0.95] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
