import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import type { AlertSeverity } from '../../data/alertsMock';

export interface AlertsHeaderProps {
  selectedSeverity: AlertSeverity | 'all';
  onSelectSeverity: (severity: AlertSeverity | 'all') => void;
  timeWindow: string;
  onSelectTimeWindow: (window: string) => void;
  totalAlertsCount: number;
}

export const AlertsHeader: React.FC<AlertsHeaderProps> = ({
  selectedSeverity,
  onSelectSeverity,
  timeWindow,
  onSelectTimeWindow,
  totalAlertsCount,
}) => {
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = React.useState(false);

  const timeOptions = [
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 48 hours', value: '48h' },
    { label: 'Last 7 days', value: '7d' },
  ];

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)] text-left">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Alerts &amp; SCADA
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border border-[var(--border-subtle)]">
            {totalAlertsCount} active conditions
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-secondary-accessible)] max-w-2xl leading-relaxed">
          Monitor operational events, supply conditions, logistics risks, and facility status across the CarbonFlow network.
        </p>
      </div>

      {/* Right side compact controls */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {/* Severity filter pills */}
        <div className="inline-flex items-center p-1 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-xs font-medium">
          {(['all', 'critical', 'warning', 'info'] as const).map((sev) => {
            const isSelected = selectedSeverity === sev;
            const label = sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1);
            return (
              <button
                key={sev}
                type="button"
                onClick={() => onSelectSeverity(sev)}
                className={`px-3 py-1 rounded-[var(--radius-pill)] transition-all text-xs capitalize ${
                  isSelected
                    ? 'bg-[var(--surface-card)] text-[var(--ink)] font-semibold shadow-xs'
                    : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)]'
                }`}
                aria-pressed={isSelected}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Time window selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--ink)] hover:border-[var(--border-strong)] transition-colors shadow-2xs"
            aria-expanded={isTimeDropdownOpen}
            aria-haspopup="listbox"
          >
            <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>
              {timeOptions.find((o) => o.value === timeWindow)?.label || 'Last 24h'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>

          {isTimeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsTimeDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-36 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-[var(--shadow-popover)] py-1 z-30 text-left">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelectTimeWindow(opt.value);
                      setIsTimeDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center justify-between ${
                      timeWindow === opt.value
                        ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold'
                        : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--ink)]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {timeWindow === opt.value && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
