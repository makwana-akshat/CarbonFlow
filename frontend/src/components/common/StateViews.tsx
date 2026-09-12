import React from 'react';
import { AlertCircle, Inbox, RotateCw } from 'lucide-react';

interface LoadingSkeletonProps {
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading dashboard data">
      {/* 4 KPI skeleton cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-7 w-28 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
              <div className="h-5 w-14 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
            </div>
            <div className="h-4 w-36 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
          </div>
        ))}
      </div>

      {/* AI Insight Skeleton */}
      <div className="h-20 w-full bg-[var(--surface-muted)] rounded-[var(--radius-card)] border-l-4 border-l-[var(--accent-primary)]/40" />

      {/* Recommended Matches Skeletons */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-52 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
                <div className="h-4 w-72 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
              </div>
              <div className="h-10 w-36 bg-[var(--surface-muted)] rounded-[var(--radius-pill)]" />
            </div>
            <div className="h-8 w-full bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] h-64 flex flex-col justify-between">
          <div className="h-5 w-40 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
          <div className="h-40 w-full bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
        </div>
        <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--border-subtle)] h-64 flex flex-col justify-between">
          <div className="h-5 w-40 bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
          <div className="h-40 w-full bg-[var(--surface-muted)] rounded-[var(--radius-chip)]" />
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No active records or matches found',
  description = 'Try adjusting your search query, filter criteria, or category chips to find available CO2 suppliers and contracts.',
  actionText = 'Reset Search & Filters',
  onAction
}) => {
  return (
    <div className="min-h-[400px] w-full bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] p-12 flex flex-col items-center justify-center text-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-secondary)] mb-4">
        <Inbox className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h3 className="type-heading text-[var(--text-primary)] text-[18px] mb-2">
        {title}
      </h3>

      <p className="type-body text-[var(--text-secondary)] max-w-[48ch] text-[14px] mb-6 leading-relaxed">
        {description}
      </p>

      {/* Filled pill CTA button in --accent-primary */}
      {actionText && (
        <button
          onClick={onAction}
          className="h-10 px-6 rounded-[var(--radius-pill)] bg-[var(--accent-primary)] text-white text-[13px] font-semibold hover:opacity-90 active:scale-98 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operational Telemetry Connection Interrupted',
  message = 'Failed to synchronize with the regional CO2 Pipeline SCADA node. Please verify network credentials and retry synchronization.',
  onRetry
}) => {
  return (
    <div className="min-h-[400px] w-full bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--status-danger)]/30 p-12 flex flex-col items-center justify-center text-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-rose-50 text-[var(--status-danger)] flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 stroke-[2]" />
      </div>

      {/* --status-danger accent text */}
      <h3 className="type-heading text-[var(--status-danger)] text-[18px] mb-2">
        {title}
      </h3>

      <p className="type-body text-[var(--text-secondary)] max-w-[48ch] text-[14px] mb-6 leading-relaxed">
        {message}
      </p>

      {/* Retry pill button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-10 px-6 rounded-[var(--radius-pill)] bg-[var(--status-danger)] text-white text-[13px] font-semibold hover:opacity-90 active:scale-98 transition-all shadow-xs flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
