import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { ArrowRight, Clock, Truck, ShieldCheck } from 'lucide-react';
import type { RecentActivityItem } from '../../types/impact';

export const RecentActivityFeed: React.FC = () => {
  const { recentActivity } = useCarbonImpact();

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[var(--ink)] tracking-tight">
            Recent Impact Activity
          </h3>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#34C77B]/10 text-[var(--status-online)]">
            Live Telemetry
          </span>
        </div>
        <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
          Real-time custody transfer events verified through pipeline mass meters and rail manifests.
        </p>
      </div>

      {/* Movement List */}
      <div className="space-y-3">
        {recentActivity.map((item: RecentActivityItem) => (
          <div
            key={item.id}
            className="p-3 rounded-[var(--radius-card)] bg-[var(--surface-muted)]/40 hover:bg-[var(--surface-muted)]/80 border border-[var(--border-subtle)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            {/* Left: Origin ─▶ Destination & Region */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--ink)] flex-wrap">
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{item.source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{item.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary-accessible)]">
                <span className="font-mono">{item.region}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[var(--text-secondary)]" />
                  {item.mode}
                </span>
              </div>
            </div>

            {/* Right: Volume & Timestamp */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
              <div className="text-sm font-bold text-[var(--ink)] font-mono">
                {item.formattedVolume}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                <span>{item.completedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary-accessible)]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--status-online)]" />
          All batches backed by ISO 27913 custody transfer verification
        </span>
      </div>
    </div>
  );
};
