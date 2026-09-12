import React, { useEffect, useState } from 'react';
import { Inbox, AlertCircle, CheckCircle2, Info, AlertTriangle, RotateCw, X } from 'lucide-react';
import { Button } from './Button';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  circle = false,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-[var(--surface-muted)] ${
        circle ? 'rounded-full' : 'rounded-[var(--radius-chip)]'
      } ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="w-6 h-6 stroke-[1.5]" />,
  title,
  description,
  ctaLabel,
  onCtaClick,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`min-h-[360px] w-full bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs ${className}`}
      {...props}
    >
      <div className="w-14 h-14 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="type-heading text-[var(--text-primary)] text-[18px] mb-2">{title}</h3>
      {description && (
        <p className="type-body text-[var(--text-secondary)] max-w-[46ch] text-[14px] mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {ctaLabel && onCtaClick && (
        <Button variant="primary" size="md" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operational System Failure',
  description = 'An unexpected connection failure occurred while fetching live telemetry. Please retry.',
  onRetry,
  retryLabel = 'Retry Action',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`min-h-[360px] w-full bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--status-danger)]/30 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs ${className}`}
      {...props}
    >
      <div className="w-14 h-14 rounded-full bg-[#E5484D]/10 text-[var(--status-danger)] flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 stroke-[2]" />
      </div>
      <h3 className="type-heading text-[var(--status-danger)] text-[18px] mb-2">{title}</h3>
      <p className="type-body text-[var(--text-secondary)] max-w-[46ch] text-[14px] mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          leadingIcon={<RotateCw className="w-3.5 h-3.5" />}
          className="bg-[var(--status-danger)] hover:opacity-90"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export interface ToastProps {
  variant?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  message,
  onClose,
  duration = 4000,
  className = '',
}) => {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const borderStyles = {
    success: 'border-l-4 border-l-[var(--status-success)]',
    error: 'border-l-4 border-l-[var(--status-danger)]',
    info: 'border-l-4 border-l-[var(--accent-primary)]',
  }[variant];

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[var(--status-success)] shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-[var(--status-danger)] shrink-0" />,
    info: <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />,
  }[variant];

  return (
    <div
      role="status"
      className={`bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] ${borderStyles} px-4 py-3 rounded-[var(--radius-chip)] shadow-[var(--shadow-card)] flex items-center gap-3 text-[13px] font-medium animate-in fade-in slide-in-from-bottom-2 ${className}`}
    >
      {icons}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5 rounded transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-[var(--text-primary)] rounded-[var(--radius-chip)] shadow-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 ${positionClasses}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
