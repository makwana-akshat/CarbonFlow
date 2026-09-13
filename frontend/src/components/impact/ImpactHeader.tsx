import React from 'react';
import { useCarbonImpact, type TimeRangeOption } from '../../context/CarbonImpactContext';
import { Download, Calendar, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { BASE_REGIONAL_IMPACT } from '../../types/impact';

export const ImpactHeader: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    regionFilter,
    setRegionFilter,
    isExporting,
    exportReport,
    resetFilters,
  } = useCarbonImpact();

  const isFiltered = timeRange !== '1y' || regionFilter !== 'all';

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
      {/* Title & Narrative Lead */}
      <div className="space-y-1 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
            ENVIRONMENTAL PROVENANCE & MASS BALANCE
          </span>
          {isFiltered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
              Filtered Slice
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
          Carbon Impact
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary-accessible)] leading-relaxed">
          Track how captured CO₂ moves through CarbonFlow — from capture and marketplace matching to transport and productive utilization.
        </p>
      </div>

      {/* Right Controls: Compact Time Pills + Region Select + Export */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {/* Date Range Segmented Pill Group */}
        <div className="inline-flex items-center bg-[var(--surface-muted)] p-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[11px]">
          <span className="px-2 text-[var(--text-secondary)] hidden sm:inline">
            <Calendar className="w-3 h-3 inline mr-1 opacity-70" />
            Range:
          </span>
          {(['30d', '3m', '6m', '1y', 'all'] as TimeRangeOption[]).map((range) => {
            const labelMap: Record<TimeRangeOption, string> = {
              '30d': '30D',
              '3m': '3M',
              '6m': '6M',
              '1y': '1Y',
              'all': 'All Time',
            };
            const active = timeRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-[var(--radius-pill)] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-2xs font-semibold'
                    : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)]'
                }`}
              >
                {labelMap[range]}
              </button>
            );
          })}
        </div>

        {/* Region Selector Dropdown */}
        <div className="relative inline-flex items-center">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="h-8 pl-7 pr-8 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[12px] font-medium text-[var(--ink)] shadow-2xs hover:border-[var(--ink)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] cursor-pointer appearance-none"
            aria-label="Filter impact by region"
          >
            <option value="all">All Industrial Corridors</option>
            {BASE_REGIONAL_IMPACT.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.split(' ')[0]} Hub ({r.state})
              </option>
            ))}
          </select>
          <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-2.5 pointer-events-none" />
          <span className="absolute right-2.5 pointer-events-none text-[10px] text-[var(--text-secondary)]">▼</span>
        </div>

        {/* Reset Filters Affordance */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="p-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors"
            title="Reset filters to default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Export Report Action Button */}
        <button
          type="button"
          disabled={isExporting}
          onClick={() => exportReport('pdf')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] hover:bg-[var(--surface-muted)] text-[12px] font-medium text-[var(--ink)] shadow-2xs transition-all cursor-pointer disabled:opacity-60"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
          ) : (
            <Download className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          )}
          <span>{isExporting ? 'Compiling...' : 'Export'}</span>
        </button>
      </div>
    </div>
  );
};
