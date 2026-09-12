import React from 'react';
import type { OperationalSummary } from '../../types/alerts';

export interface OperationalSummaryBarProps {
  summary: OperationalSummary;
  onFilterCritical?: () => void;
  onFilterWarnings?: () => void;
}

export const OperationalSummaryBar: React.FC<OperationalSummaryBarProps> = ({
  summary,
  onFilterCritical,
  onFilterWarnings,
}) => {
  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-3 sm:px-5 sm:py-3.5 shadow-2xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)]">
        
        {/* Critical */}
        <button
          type="button"
          onClick={onFilterCritical}
          className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4 text-left group hover:opacity-85 transition-opacity"
        >
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-danger)] animate-pulse" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tracking-tight text-[var(--ink)]">
                {summary.critical}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                Action Req.
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              Critical Alerts
            </div>
          </div>
        </button>

        {/* Warnings */}
        <button
          type="button"
          onClick={onFilterWarnings}
          className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4 text-left group hover:opacity-85 transition-opacity"
        >
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-warning)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tracking-tight text-[var(--ink)]">
                {summary.warnings}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                Monitoring
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              Active Warnings
            </div>
          </div>
        </button>

        {/* Total Active */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4 text-left">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tracking-tight text-[var(--ink)]">
                {summary.active}
              </span>
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                Total
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              Open Conditions
            </div>
          </div>
        </div>

        {/* Resolved Today */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4 text-left">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tracking-tight text-[var(--status-success)]">
                {summary.resolvedToday}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                Resolved
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              Cleared Today
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
