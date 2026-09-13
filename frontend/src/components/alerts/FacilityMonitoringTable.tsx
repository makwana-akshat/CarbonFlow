import React from 'react';
import { Factory } from 'lucide-react';
import { type FacilityMonitoringItem } from '../../types/alerts';

export interface FacilityMonitoringTableProps {
  facilities: FacilityMonitoringItem[];
  onSelectFacility?: (facility: FacilityMonitoringItem) => void;
}

export const FacilityMonitoringTable: React.FC<FacilityMonitoringTableProps> = ({
  facilities,
  onSelectFacility,
}) => {
  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-4 sm:p-5 space-y-3 text-left shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Facility Capture &amp; Scrub Output Telemetry
          </h2>
          <p className="text-xs text-[var(--text-secondary-accessible)] mt-0.5">
            Active industrial point-source and DAC plant status reporting every 60 seconds.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          {facilities.length} Facilities Monitored
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              <th className="py-2.5 px-3">Facility</th>
              <th className="py-2.5 px-3">Region</th>
              <th className="py-2.5 px-3">Capture Output</th>
              <th className="py-2.5 px-3">Expected</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {facilities.map((fac) => {

              return (
                <tr
                  key={fac.id}
                  onClick={() => onSelectFacility?.(fac)}
                  className="hover:bg-[var(--surface-muted)]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                        <Factory className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-[var(--ink)] block truncate group-hover:text-[var(--accent-primary)] transition-colors">
                          {fac.facility}
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                          Capacity: {fac.designCapacity}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-[var(--text-secondary-accessible)] font-medium">
                    {fac.region}
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--ink)]">
                        {fac.captureOutput}%
                      </span>
                      <div className="w-16 h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${
                            fac.status === 'critical'
                              ? 'bg-[var(--status-danger)]'
                              : fac.status === 'warning'
                                ? 'bg-[var(--status-warning)]'
                                : 'bg-[var(--status-success)]'
                          }`}
                          style={{ width: `${Math.min(fac.captureOutput, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 font-mono text-[var(--text-secondary-accessible)]">
                    {fac.expectedOutput}%
                  </td>

                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider ${
                      fac.status === 'critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : fac.status === 'warning'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        fac.status === 'critical'
                          ? 'bg-rose-600 animate-pulse'
                          : fac.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`} />
                      {fac.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-[var(--text-secondary)]">
                    {fac.lastUpdate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
