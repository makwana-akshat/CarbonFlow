import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { TrendingUp, CheckCircle2, ShieldCheck, Factory } from 'lucide-react';

export const ImpactKpiRow: React.FC = () => {
  const { overviewMetrics } = useCarbonImpact();

  const iconMap: Record<string, React.ReactNode> = {
    captured: <Factory className="w-4 h-4 text-[var(--accent-primary)]" />,
    listed: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    matched: <CheckCircle2 className="w-4 h-4 text-[#34C77B]" />,
    utilized: <TrendingUp className="w-4 h-4 text-[var(--ink)]" />,
  };

  return (
    <div className="space-y-2">
      {/* 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {overviewMetrics.map((metric) => (
          <div
            key={metric.id}
            className="p-4 sm:p-5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between space-y-3 hover:border-[var(--ink)]/20 transition-all group"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold text-[var(--text-secondary-accessible)] uppercase tracking-wider">
                {metric.label}
              </span>
              <div className="p-1.5 rounded-lg bg-[var(--surface-muted)] group-hover:scale-105 transition-transform">
                {iconMap[metric.id]}
              </div>
            </div>

            {/* Middle: Big Stat & Unit */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)] font-mono">
                  {metric.formattedTonnes}
                </span>
                <span className="text-[12px] font-medium text-[var(--text-secondary-accessible)]">
                  {metric.unit}
                </span>
              </div>
            </div>

            {/* Bottom: Context Trend / Yield */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
              <span
                className={`font-semibold ${
                  metric.trendPositive ? 'text-[var(--status-success)]' : 'text-amber-600'
                }`}
              >
                {metric.trendText}
              </span>
              <span className="text-[var(--text-secondary-accessible)] truncate ml-2">
                {metric.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Platform-Reported Notice */}
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-[var(--text-secondary)] pr-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-online)]" />
        <span>Platform-Reported Mass Balance Data (Demo / Unaudited Clearing)</span>
      </div>
    </div>
  );
};
