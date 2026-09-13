import React from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';
import type { TimelineEvent } from '../../types/contracts';

export interface ContractAuditTimelineProps {
  timeline: TimelineEvent[];
}

export const ContractAuditTimeline: React.FC<ContractAuditTimelineProps> = ({ timeline }) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Audit &amp; Verification Trail
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
          ISO 27913 Custody Standard
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
        {timeline.map((event) => {
          const isCompleted = event.status === 'completed';
          const isInProgress = event.status === 'in-progress';

          return (
            <div key={event.step} className="relative space-y-1 group">
              {/* Step indicator dot */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 ring-4 ring-[var(--surface-card)]'
                    : isInProgress
                      ? 'bg-amber-100 text-amber-800 ring-4 ring-[var(--surface-card)] animate-pulse'
                      : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] ring-4 ring-[var(--surface-card)]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                ) : isInProgress ? (
                  <CircleDot className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <span className="font-mono text-[10px]">{event.step}</span>
                )}
              </div>

              {/* Event Header */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-bold text-[var(--ink)]">
                  {event.label}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] shrink-0">
                  {event.timestamp}
                </span>
              </div>

              {/* Actor and Action */}
              <div className="text-[11px] text-[var(--text-secondary-accessible)]">
                <span className="font-medium text-[var(--ink)]">{event.actor}</span>
                <span className="text-[var(--text-secondary)]"> ({event.role})</span>
              </div>

              <div className="text-[11px] text-[var(--text-secondary-accessible)] leading-relaxed">
                {event.action}
              </div>

              {event.notes && (
                <div className="mt-1 p-2 rounded bg-[var(--surface-muted)]/60 border border-[var(--border-subtle)] text-[11px] text-[var(--ink)] leading-snug">
                  <span className="font-semibold text-[var(--accent-primary)]">Note: </span>
                  {event.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
