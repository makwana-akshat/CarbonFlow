import React, { forwardRef } from 'react';
import { TrendIndicator } from './Badge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Internal padding scale */
  padding?: 'sm' | 'md' | 'lg' | 'none';
  /** Optional hover elevation effect */
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, padding = 'md', hoverable = false, className = '', ...props }, ref) => {
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }[padding];

    const hoverClass = hoverable
      ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] hover:border-neutral-300'
      : '';

    return (
      <div
        ref={ref}
        className={`bg-[var(--surface-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--border-subtle)] ${paddingClasses} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Descriptive metric label shown beneath the value */
  label: string;
  /** Hero data number shown top in --data-stat */
  value: string;
  /** Optional trend indicator configuration */
  trend?: {
    direction: 'up' | 'down';
    value: string;
    isPositiveMetric?: boolean;
  };
  /** Optional icon shown in the top-right corner */
  icon?: React.ReactNode;
  /** Optional period context, e.g. "vs last month" */
  period?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  trend,
  icon,
  period,
  className = '',
  ...props
}) => {
  return (
    <Card hoverable padding="md" className={`flex flex-col justify-between ${className}`} {...props}>
      <div className="flex items-baseline justify-between gap-3">
        {/* Big --data-stat number top */}
        <div className="type-data-stat text-[var(--text-primary)]">
          {value}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {trend && (
            <TrendIndicator
              direction={trend.direction}
              value={trend.value}
              isPositiveMetric={trend.isPositiveMetric}
            />
          )}
          {icon && (
            <div className="w-8 h-8 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] flex items-center justify-center text-xs">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* --text-secondary label beneath */}
      <div className="mt-3 flex items-center justify-between text-[13px]">
        <span className="font-medium text-[var(--text-secondary-accessible)]">{label}</span>
        {period && <span className="text-[11px] text-[var(--text-secondary)]">{period}</span>}
      </div>
    </Card>
  );
};

export interface InsightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Single-sentence insight text */
  children: React.ReactNode;
  /** Optional eyebrow badge or prefix */
  tag?: string;
  /** Optional primary action button */
  primaryAction?: React.ReactNode;
  /** Optional secondary action button */
  secondaryAction?: React.ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  children,
  tag = 'AI Operational Insight',
  primaryAction,
  secondaryAction,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-[var(--radius-card)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] border-l-4 border-l-[var(--accent-primary)] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}
      {...props}
    >
      <div className="space-y-1 flex-1">
        {tag && (
          <div className="type-label text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
            {tag}
          </div>
        )}
        <div className="text-[15px] font-medium text-[var(--text-primary)] leading-relaxed">
          {children}
        </div>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
};

export interface AlertRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Leading icon */
  icon: React.ReactNode;
  /** Alert severity */
  severity: 'warning' | 'danger' | 'success';
  /** Bold headline */
  headline: string;
  /** Explanatory description */
  description: string;
  /** Optional timestamp or metadata */
  timestamp?: string;
  /** Optional right-side action slot */
  action?: React.ReactNode;
}

export const AlertRow: React.FC<AlertRowProps> = ({
  icon,
  severity,
  headline,
  description,
  timestamp,
  action,
  className = '',
  ...props
}) => {
  const circleColors = {
    warning: 'bg-[#F5A623]/15 text-[var(--status-warning)]',
    danger: 'bg-[#E5484D]/15 text-[var(--status-danger)]',
    success: 'bg-[#34C77B]/15 text-[var(--status-success)]',
  }[severity];

  return (
    <div
      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-[var(--surface-muted)]/40 rounded-[var(--radius-chip)] px-2 -mx-2 ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3.5 flex-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${circleColors}`}>
          {icon}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">{headline}</span>
            {timestamp && (
              <span className="text-[11px] text-[var(--text-secondary)] font-normal">• {timestamp}</span>
            )}
          </div>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] leading-relaxed">{description}</p>
        </div>
      </div>

      {action && <div className="sm:shrink-0 self-end sm:self-center pl-12 sm:pl-0">{action}</div>}
    </div>
  );
};
