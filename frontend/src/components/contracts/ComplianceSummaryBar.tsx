import React from 'react';
import type { ApiComplianceSummary } from '../../services/contractsApi';

export interface ComplianceSummaryBarProps {
  summary: ApiComplianceSummary;
  onFilterActive?: () => void;
  onFilterPending?: () => void;
}

export const ComplianceSummaryBar: React.FC<ComplianceSummaryBarProps> = ({
  summary,
  onFilterActive,
  onFilterPending,
}) => {
  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-3 sm:px-5 sm:py-3 shadow-2xs text-left">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)]">
        
        {/* Active Contracts */}
        <button
          type="button"
          onClick={onFilterActive}
          className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4 text-left group hover:opacity-85 transition-opacity"
        >
          <div className="w-7 h-7 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-[var(--ink)]">
                {summary.active_contracts}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                Active
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              In Execution
            </div>
          </div>
        </button>

        {/* Pending Approval */}
        <button
          type="button"
          onClick={onFilterPending}
          className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4 text-left group hover:opacity-85 transition-opacity"
        >
          <div className="w-7 h-7 rounded-[var(--radius-md)] bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--status-warning)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-[var(--ink)]">
                {summary.pending_approval}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                Review
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              Pending Approval
            </div>
          </div>
        </button>

        {/* Completed */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4 text-left">
          <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-[var(--ink)]">
                {summary.completed}
              </span>
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                Settled
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              Fulfillment Complete
            </div>
          </div>
        </div>

        {/* With Amendments */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4 text-left">
          <div className="w-7 h-7 rounded-[var(--radius-md)] bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-blue-700">
                {summary.with_amendments}
              </span>
              <span className="text-[10px] font-semibold text-blue-700">
                Versioned
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)] font-medium">
              With Amendments
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
