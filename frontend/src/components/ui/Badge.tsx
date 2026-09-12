import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant consuming design tokens */
  variant?: 'filled-accent' | 'outline-success' | 'outline-warning' | 'outline-danger' | 'neutral';
  /** Optional leading icon element */
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = '',
  ...props
}) => {
  const variantStyles = {
    'filled-accent':
      'bg-[var(--accent-primary)] text-white font-semibold shadow-2xs border border-transparent',
    'outline-success':
      'border border-[var(--status-success)] text-[var(--status-success)] bg-[#34C77B]/10 font-semibold',
    'outline-warning':
      'border border-[var(--status-warning)] text-[var(--status-warning)] bg-[#F5A623]/10 font-semibold',
    'outline-danger':
      'border border-[var(--status-danger)] text-[var(--status-danger)] bg-[#E5484D]/10 font-semibold',
    'neutral':
      'bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border border-[var(--border-subtle)] font-medium',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[12px] leading-tight select-none ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export interface TrendIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Direction of the trend */
  direction: 'up' | 'down';
  /** Percentage or value string, e.g. "8%" or "+12.4%" */
  value: string;
  /** Whether an upward trend represents a positive metric (e.g. true for volume, false for cost) */
  isPositiveMetric?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  direction,
  value,
  isPositiveMetric = true,
  className = '',
  ...props
}) => {
  // If upward trend is positive: up -> success, down -> danger
  // If upward trend is negative (e.g. cost): up -> danger, down -> success
  const isPositive = direction === 'up' ? isPositiveMetric : !isPositiveMetric;

  const colorClasses = isPositive
    ? 'text-[var(--status-success)] bg-[#34C77B]/10'
    : 'text-[var(--status-danger)] bg-[#E5484D]/10';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-chip)] text-[12px] font-semibold ${colorClasses} ${className}`}
      {...props}
    >
      {direction === 'up' ? (
        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
      )}
      <span>{value}</span>
    </span>
  );
};

export interface LiveStatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Operational online or offline status */
  status: 'online' | 'offline';
  /** Optional text label to display next to the dot */
  label?: string;
  /** Whether to animate a pulsing ring around the dot when online */
  pulse?: boolean;
}

export const LiveStatusDot: React.FC<LiveStatusDotProps> = ({
  status,
  label,
  pulse = true,
  className = '',
  ...props
}) => {
  const isOnline = status === 'online';

  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${className}`} {...props}>
      <span className="relative flex h-2.5 w-2.5">
        {isOnline && pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-success)] opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOnline ? 'bg-[var(--status-success)]' : 'bg-[var(--status-danger)]'
          }`}
        />
      </span>
      {label && (
        <span className={isOnline ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary-accessible)]'}>
          {label}
        </span>
      )}
    </span>
  );
};

// NOTE [NEW COMPONENT]: TagChip added for metadata & attribute pills (outline pill, 1px --border-subtle, uppercase 11px --text-secondary, no fill).
// Use Badge exclusively for status states (Best Match, Verified, Urgent, etc.) and TagChip for attribute pills.
export interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  icon?: React.ReactNode;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  icon,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-transparent text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary-accessible)] select-none ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

