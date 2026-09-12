import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { type ActiveAlertItem, type AlertSeverity } from '../../types/alerts';

export interface ActiveAlertsListProps {
  alerts: ActiveAlertItem[];
  onSelectAlert: (alert: ActiveAlertItem) => void;
  onActionClick: (alert: ActiveAlertItem, e: React.MouseEvent) => void;
}

export const ActiveAlertsList: React.FC<ActiveAlertsListProps> = ({
  alerts,
  onSelectAlert,
  onActionClick,
}) => {
  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Info
          </span>
        );
    }
  };

  const getSeverityBorder = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-l-[var(--status-danger)]';
      case 'warning':
        return 'border-l-4 border-l-[var(--status-warning)]';
      case 'info':
        return 'border-l-4 border-l-sky-500';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="w-full py-12 px-4 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-[var(--status-success)] mx-auto" />
        <h3 className="text-sm font-semibold text-[var(--ink)]">No active alerts matching filter</h3>
        <p className="text-xs text-[var(--text-secondary-accessible)]">
          All network facilities, transport nodes, and market clearing conditions are within nominal tolerances.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Active Operational Conditions ({alerts.length})
        </h2>
        <span className="text-[11px] text-[var(--text-secondary-accessible)]">
          Click row to inspect SCADA parameters
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const borderClass = getSeverityBorder(alert.severity);

          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className={`w-full bg-[var(--surface-card)] hover:bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] ${borderClass} rounded-[var(--radius-card)] p-4 transition-all duration-150 cursor-pointer shadow-2xs group`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectAlert(alert);
                }
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                {/* Left content block */}
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Top metadata row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {getSeverityBadge(alert.severity)}
                    <span className="font-semibold text-[var(--ink)]">
                      {alert.source}
                    </span>
                    <span className="text-[var(--border-strong)]">•</span>
                    <span className="text-[var(--text-secondary-accessible)]">
                      {alert.region}
                    </span>
                    <span className="text-[var(--border-strong)]">•</span>
                    <span className="text-[var(--text-secondary)] font-mono text-[11px]">
                      {alert.detectedTime}
                    </span>
                    {alert.acknowledged && (
                      <span className="ml-auto md:ml-0 px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACKNOWLEDGED
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary-accessible)] leading-relaxed mt-0.5">
                      {alert.description}
                    </p>
                  </div>

                  {/* Operational Metrics & Impact */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 pt-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--text-secondary)]">Current:</span>
                      <span className="font-mono font-semibold text-[var(--ink)]">
                        {alert.currentMetric}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--text-secondary)]">Expected:</span>
                      <span className="font-mono text-[var(--text-secondary-accessible)]">
                        {alert.expectedMetric}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--text-secondary)]">Variance:</span>
                      <span className={`font-mono font-semibold ${
                        alert.severity === 'critical' 
                          ? 'text-[var(--status-danger)]' 
                          : alert.severity === 'warning' 
                            ? 'text-[var(--status-warning)]' 
                            : 'text-sky-600'
                      }`}>
                        {alert.variance}
                      </span>
                    </div>
                  </div>

                  {/* Operational Impact Callout */}
                  <div className="text-[11px] bg-[var(--surface-muted)]/50 rounded-[var(--radius-sm)] px-2.5 py-1 text-[var(--text-secondary-accessible)] border border-[var(--border-subtle)]/70">
                    <span className="font-semibold text-[var(--ink)]">Impact: </span>
                    {alert.operationalImpact}
                  </div>
                </div>

                {/* Right Action Button & Chevron */}
                <div className="flex items-center md:flex-col md:items-end justify-between gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(alert, e);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--accent-primary)] transition-colors shadow-2xs"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
