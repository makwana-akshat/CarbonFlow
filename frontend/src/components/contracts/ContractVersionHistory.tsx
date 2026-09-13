import React from 'react';
import { Calendar } from 'lucide-react';
import type { ContractVersionInfo } from '../../types/contracts';

export interface ContractVersionHistoryProps {
  versions: ContractVersionInfo[];
}

export const ContractVersionHistory: React.FC<ContractVersionHistoryProps> = ({ versions }) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Amendment &amp; Version History
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
          {versions.length} Revisions Logged
        </span>
      </div>

      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.version}
            className={`p-3 rounded-[var(--radius-card)] border transition-colors ${
              ver.isCurrent
                ? 'bg-[var(--surface-muted)]/50 border-[var(--border-strong)]'
                : 'bg-[var(--paper)] border-[var(--border-subtle)]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[var(--ink)]">
                  {ver.version}
                </span>
                {ver.isCurrent && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Current Active
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--text-secondary)]" />
                {ver.effectiveDate}
              </span>
            </div>

            <p className="text-xs text-[var(--ink)] font-medium leading-snug">
              {ver.summary}
            </p>

            <div className="mt-2 text-[11px] text-[var(--text-secondary-accessible)]">
              <span className="font-semibold text-[var(--ink)]">Signatories / Authors: </span>
              {ver.author}
            </div>

            {ver.changes.length > 0 && (
              <ul className="mt-2 space-y-1 pl-3.5 border-l border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary-accessible)]">
                {ver.changes.map((ch: string, idx: number) => (
                  <li key={idx} className="leading-snug list-disc">
                    {ch}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
