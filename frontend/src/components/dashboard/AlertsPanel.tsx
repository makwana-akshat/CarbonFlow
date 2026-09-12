import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Bell,
  ArrowRight
} from 'lucide-react';
import type { AlertItem } from '../../types/dashboard';

interface AlertsPanelProps {
  alerts: AlertItem[];
  onDismissAlert?: (id: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'warning':
        return (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(245, 166, 35, 0.14)', color: 'var(--status-warning)' }}
            title="Price Alert"
          >
            <AlertTriangle className="w-4 h-4 stroke-[2.25]" />
          </div>
        );
      case 'danger':
        return (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(229, 72, 77, 0.14)', color: 'var(--status-danger)' }}
            title="Supply Shortage Risk"
          >
            <AlertOctagon className="w-4 h-4 stroke-[2.25]" />
          </div>
        );
      case 'success':
        return (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(52, 199, 123, 0.14)', color: 'var(--status-success)' }}
            title="Verification Cleared"
          >
            <CheckCircle className="w-4 h-4 stroke-[2.25]" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section aria-labelledby="alerts-panel-heading" className="w-full">
      <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-primary)]">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <h2 id="alerts-panel-heading" className="text-[17px] font-semibold text-[var(--text-primary)]">
              Operational Alerts & Exceptions
            </h2>
          </div>
          <span className="type-label px-2 py-0.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">
            Live Stream
          </span>
        </div>

        {/* Clean list-row style matching reference's shipment list */}
        <div className="divide-y divide-[var(--border-subtle)]">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="py-[var(--space-row)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-[var(--surface-muted)]/30 rounded-[var(--radius-chip)] px-3 -mx-2"
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Left-side icon in a colored circle */}
                {getAlertIcon(item.type)}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-normal">
                      • {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary-accessible)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action pill button */}
              {item.actionText && (
                <div className="sm:shrink-0 self-end sm:self-center pl-12 sm:pl-0">
                  <button
                    onClick={() => window.alert(`Action initiated: ${item.actionText}`)}
                    className="h-8 px-3.5 rounded-[var(--radius-pill)] bg-[var(--surface-muted)] hover:bg-[var(--border-subtle)] text-[12px] font-medium text-[var(--text-primary)] transition-all flex items-center gap-1.5 border border-[var(--border-subtle)] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-secondary)]" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
