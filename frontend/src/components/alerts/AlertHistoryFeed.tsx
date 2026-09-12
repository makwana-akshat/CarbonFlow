import React from 'react';
import { CheckCircle2, History } from 'lucide-react';
import { type AlertHistoryItem } from '../../data/alertsMock';

export interface AlertHistoryFeedProps {
  history: AlertHistoryItem[];
}

export const AlertHistoryFeed: React.FC<AlertHistoryFeedProps> = ({ history }) => {
  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-4 sm:p-5 space-y-3 text-left shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Resolved Incident Audit History</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary-accessible)] mt-0.5">
            Cryptographically sealed operational incident resolutions from past 48 hours.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[var(--status-success)] flex items-center gap-1 font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          18 Resolved Today
        </span>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]/50">
        {history.map((item) => (
          <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] shrink-0" />
                <span className="font-semibold text-[var(--ink)]">
                  {item.title}
                </span>
                <span className="text-[var(--text-secondary)]">•</span>
                <span className="text-[var(--text-secondary-accessible)] font-medium">
                  {item.facilityOrRegion}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] pl-3.5 leading-snug">
                {item.resolutionNote}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pl-3.5 sm:pl-0 text-[11px] font-mono text-[var(--text-secondary)]">
              <span>{item.resolvedBy}</span>
              <span>•</span>
              <span className="font-semibold text-emerald-700">{item.resolvedTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
