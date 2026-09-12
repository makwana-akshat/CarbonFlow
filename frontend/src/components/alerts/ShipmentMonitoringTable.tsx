import React from 'react';
import { Truck, Train, GitCommit } from 'lucide-react';
import { type ShipmentMonitoringItem } from '../../types/alerts';

export interface ShipmentMonitoringTableProps {
  shipments: ShipmentMonitoringItem[];
  onSelectShipment?: (shipment: ShipmentMonitoringItem) => void;
}

export const ShipmentMonitoringTable: React.FC<ShipmentMonitoringTableProps> = ({
  shipments,
  onSelectShipment,
}) => {
  const getModeIcon = (mode: string) => {
    if (mode.includes('Rail')) return <Train className="w-3.5 h-3.5 text-[var(--text-secondary)]" />;
    if (mode.includes('Pipeline')) return <GitCommit className="w-3.5 h-3.5 text-[var(--accent-primary)]" />;
    return <Truck className="w-3.5 h-3.5 text-[var(--text-secondary)]" />;
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
            High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-4 sm:p-5 space-y-3 text-left shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Active Freight &amp; Custody Transfer Logistics
          </h2>
          <p className="text-xs text-[var(--text-secondary-accessible)] mt-0.5">
            Real-time GPS, rail dispatch, and cryogenic container tracking across Gujarat and Maharashtra corridors.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          {shipments.length} Active Convoys
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              <th className="py-2.5 px-3">Shipment</th>
              <th className="py-2.5 px-3">Route</th>
              <th className="py-2.5 px-3">Mode</th>
              <th className="py-2.5 px-3">ETA</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {shipments.map((shp) => (
              <tr
                key={shp.id}
                onClick={() => onSelectShipment?.(shp)}
                className="hover:bg-[var(--surface-muted)]/40 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-3">
                  <div className="font-mono font-bold text-[var(--ink)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {shp.shipmentId}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono">
                    {shp.volume} • {shp.carrier}
                  </div>
                </td>

                <td className="py-2.5 px-3 font-medium text-[var(--ink)]">
                  {shp.route}
                </td>

                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary-accessible)]">
                    {getModeIcon(shp.mode)}
                    <span>{shp.mode}</span>
                  </div>
                </td>

                <td className="py-2.5 px-3 font-mono font-semibold text-[var(--ink)]">
                  {shp.eta}
                </td>

                <td className="py-2.5 px-3 capitalize">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                    shp.status === 'delayed'
                      ? 'text-amber-700'
                      : shp.status === 'at-risk'
                        ? 'text-rose-700'
                        : 'text-emerald-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      shp.status === 'delayed'
                        ? 'bg-amber-500'
                        : shp.status === 'at-risk'
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-emerald-500'
                    }`} />
                    {shp.status.replace('-', ' ')}
                  </span>
                </td>

                <td className="py-2.5 px-3 text-right">
                  {getRiskBadge(shp.risk)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
