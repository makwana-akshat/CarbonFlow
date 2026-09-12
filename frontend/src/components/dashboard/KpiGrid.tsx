import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { KpiMetric } from '../../types/dashboard';

interface KpiGridProps {
  metrics: KpiMetric[];
}

export const KpiGrid: React.FC<KpiGridProps> = ({ metrics }) => {
  return (
    <section aria-label="Key Performance Indicators">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric) => {
          const isUp = metric.trend.value.startsWith('+');
          const isNegativeTrendGood = metric.id === 'avg-cost'; // For procurement cost, reduction is positive
          const isPositive = isNegativeTrendGood ? !isUp : isUp;

          return (
            <div
              key={metric.id}
              className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
            >
              {/* Big --data-stat number top */}
              <div className="flex items-baseline justify-between gap-2">
                <div className="type-data-stat text-[var(--text-primary)]">
                  {metric.value}
                </div>

                {/* Small inline trend indicator (up/down arrow + %) */}
                <div
                  className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-[var(--radius-chip)] ${
                    isPositive
                      ? 'text-[var(--status-success)] bg-[#34C77B]/10'
                      : 'text-[var(--status-danger)] bg-[#E5484D]/10'
                  }`}
                  title={`${metric.trend.value} ${metric.period}`}
                >
                  {isUp ? (
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>{metric.trend.value}</span>
                </div>
              </div>

              {/* --text-secondary label beneath */}
              <div className="mt-3 flex items-center justify-between text-[13px]">
                <span className="font-medium text-[var(--text-secondary-accessible)]">
                  {metric.label}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  {metric.period}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
