import React from 'react';
import { useCarbonImpact, type TimeRangeOption } from '../../context/CarbonImpactContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const UtilizationTrendChart: React.FC = () => {
  const { monthlyTrend, timeRange, setTimeRange } = useCarbonImpact();

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 flex flex-col justify-between">
      {/* Header with Title & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--ink)] tracking-tight">
              CO₂ Utilization Trend
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">
              Monthly Tonnes
            </span>
          </div>
          <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
            Physical CO₂ transferred into permanent utilization sinks over time.
          </p>
        </div>

        {/* Controls: Metric Toggle + Quick Range */}
        <div className="flex items-center gap-2">
          {/* Range pills */}
          <div className="inline-flex items-center bg-[var(--surface-muted)] p-0.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[11px]">
            {(['3m', '6m', '1y'] as TimeRangeOption[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2 py-0.5 rounded-[var(--radius-pill)] font-medium transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-[var(--surface-card)] text-[var(--ink)] font-semibold shadow-2xs'
                    : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)]'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyTrend}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111418" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#111418" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.06)" />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k t`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-lg bg-[var(--ink)] text-white shadow-xl border border-white/10 text-xs space-y-1">
                      <div className="font-semibold text-gray-200">{data.periodLabel}</div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                        <span className="text-gray-300">Utilized Volume:</span>
                        <span className="font-mono font-bold text-white">
                          {data.tonnes.toLocaleString()} tonnes
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 border-t border-white/10 pt-1 mt-1">
                        Target Baseline: {data.targetTonnes.toLocaleString()} t
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="tonnes"
              stroke="#111418"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#utilizationGradient)"
              activeDot={{ r: 5, fill: '#F4611E', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Readout */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary-accessible)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[var(--ink)] inline-block" />
            <span>Actual Utilized CO₂</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] inline-block" />
            <span>Verified Custody Delivery</span>
          </div>
        </div>
        <span className="font-mono">Avg Monthly Run-Rate: ~5.8k t/mo</span>
      </div>
    </div>
  );
};
