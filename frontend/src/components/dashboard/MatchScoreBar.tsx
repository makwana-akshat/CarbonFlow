import React from 'react';
import { Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import type { RecommendationItem } from '../../types/dashboard';

interface MatchScoreBarProps {
  item: RecommendationItem;
  className?: string;
  compact?: boolean;
}

export const MatchScoreBar: React.FC<MatchScoreBarProps> = ({
  item,
  className = '',
  compact = false,
}) => {
  const breakdown = item.breakdown || {
    purity: Math.min(99, Math.round(item.matchScore + 0.5)),
    price: Math.min(98, Math.max(75, Math.round(item.matchScore - 2.5))),
    distance: Math.min(96, Math.max(70, Math.round(item.matchScore - 4.5))),
    reliability: Math.min(99, Math.round(item.matchScore + 0.3)),
    segmentFit: Math.min(98, Math.max(78, Math.round(item.matchScore - 1.2))),
  };

  const metrics = [
    {
      label: 'Chemical Purity',
      shortLabel: 'Purity',
      score: breakdown.purity,
      detail: item.purity ? item.purity.split('(')[0].trim() : '99.98% Assay Verified',
    },
    {
      label: 'Economic / Price',
      shortLabel: 'Price',
      score: breakdown.price,
      detail: `${item.pricePerTon || '$39.20/t'} vs regional spot benchmark`,
    },
    {
      label: 'Logistics / Distance',
      shortLabel: 'Distance',
      score: breakdown.distance,
      detail: `${item.distance || '182 km'} transport corridor (${item.transportMode || 'ISO Rail'})`,
    },
    {
      label: 'Reliability Index',
      shortLabel: 'Reliability',
      score: breakdown.reliability,
      detail: `${item.reliability || '99.4%'} verified delivery performance`,
    },
    {
      label: 'Segment Alignment',
      shortLabel: 'Segment Fit',
      score: breakdown.segmentFit,
      detail: `Segment match: ${item.segment || item.co2Source || 'DAC'} verified`,
    },
  ];

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--ink)]">
            <Activity className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Algorithmic Fit Breakdown</span>
          </div>
          <span className="text-[12px] font-mono font-bold text-[var(--accent-primary)]">
            {item.matchScore}% Overall
          </span>
        </div>

        <div className="space-y-2.5">
          {metrics.map((m) => (
            <div key={m.shortLabel} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-[var(--text-secondary-accessible)]">
                  {m.shortLabel}
                </span>
                <span className="font-mono font-semibold text-[var(--ink)]">{m.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-[16px] font-bold text-[var(--ink)] tracking-tight">
              Match Scoring Breakdown — {item.companyName}
            </h3>
          </div>
          <p className="text-[12px] text-[var(--text-secondary-accessible)]">
            Normalized multi-parameter scoring weights across chemical purity, price variance, spatial latency, and custody reliability.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 text-[12px] font-semibold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {item.matchScore}% Weighted Score
          </span>
        </div>
      </div>

      {/* Grid of 5 Score Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-muted)]/50 border border-[var(--border-subtle)]/70 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                {m.label}
              </span>
              <span className="text-[13px] font-mono font-bold text-[var(--ink)]">
                {m.score}%
              </span>
            </div>

            {/* Fill Bar */}
            <div className="w-full h-2 bg-[var(--surface-card)] rounded-full overflow-hidden border border-[var(--border-subtle)]/50">
              <div
                className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${m.score}%` }}
              />
            </div>

            <p className="text-[11px] text-[var(--text-secondary-accessible)] truncate" title={m.detail}>
              {m.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
