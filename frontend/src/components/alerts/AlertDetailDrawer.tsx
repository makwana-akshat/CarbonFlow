import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  ArrowRight,
  Building,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import type { ActiveAlertItem } from '../../data/alertsMock';

export interface AlertDetailDrawerProps {
  alert: ActiveAlertItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string, note: string) => void;
  onInvestigate: (alert: ActiveAlertItem) => void;
  onOpenFacility: (sourceName: string) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  isOpen,
  onClose,
  onAcknowledge,
  onResolve,
  onInvestigate,
  onOpenFacility,
}) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-left" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--surface-card)] border-l border-[var(--border-subtle)] shadow-[var(--shadow-popover)] flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--paper)]">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider ${
                alert.severity === 'critical'
                  ? 'bg-rose-100 text-rose-800'
                  : alert.severity === 'warning'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-sky-100 text-sky-900'
              }`}>
                {alert.severity} Condition
              </span>
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                {alert.id}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
              aria-label="Close detail panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Title & Core Location */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--ink)] leading-snug">
                {alert.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary-accessible)]">
                <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                  <Building className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  {alert.source}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  {alert.region}
                </span>
              </div>
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div className="bg-[var(--paper)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-4 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                SCADA Telemetry Parameters
              </div>

              <div className="grid grid-cols-3 gap-3 divide-x divide-[var(--border-subtle)] pt-1">
                <div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Current</div>
                  <div className="text-base font-bold font-mono text-[var(--ink)] mt-0.5">
                    {alert.currentMetric}
                  </div>
                </div>
                <div className="pl-3">
                  <div className="text-[10px] text-[var(--text-secondary)]">Expected</div>
                  <div className="text-base font-medium font-mono text-[var(--text-secondary-accessible)] mt-0.5">
                    {alert.expectedMetric}
                  </div>
                </div>
                <div className="pl-3">
                  <div className="text-[10px] text-[var(--text-secondary)]">Variance</div>
                  <div className={`text-base font-bold font-mono mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'text-[var(--status-danger)]'
                      : alert.severity === 'warning'
                        ? 'text-[var(--status-warning)]'
                        : 'text-sky-600'
                  }`}>
                    {alert.variance}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-2.5 flex items-center justify-between text-xs text-[var(--text-secondary-accessible)]">
                <span>Duration in State:</span>
                <span className="font-mono font-medium text-[var(--ink)] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                  {alert.duration}
                </span>
              </div>
            </div>

            {/* Operational Impact */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Operational Network Impact
              </h3>
              <div className="p-3 rounded-[var(--radius-card)] bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
                {alert.operationalImpact}
              </div>
            </div>

            {/* Engineering Recommendation */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Recommended Action
              </h3>
              <p className="text-xs text-[var(--ink)] bg-[var(--surface-muted)]/50 p-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] leading-relaxed">
                "{alert.recommendedAction}"
              </p>
            </div>

            {/* Description Details */}
            <div className="space-y-1.5 text-xs text-[var(--text-secondary-accessible)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
              <span className="font-semibold text-[var(--ink)] block">Condition Diagnostic Notes:</span>
              <p>{alert.description}</p>
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--paper)] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAcknowledge(alert.id)}
                className={`w-full py-2 px-3 rounded-[var(--radius-md)] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  alert.acknowledged
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
              </button>

              {alert.acknowledged ? (
                <button
                  type="button"
                  onClick={() => onResolve(alert.id, "Resolved via operator dashboard")}
                  className="w-full py-2 px-3 rounded-[var(--radius-md)] bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onInvestigate(alert)}
                  className="w-full py-2 px-3 rounded-[var(--radius-md)] bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--accent-primary)] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenFacility(alert.source)}
              className="w-full py-1.5 px-3 rounded-[var(--radius-md)] text-xs text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)]/50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Facility &amp; Telemetry View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
