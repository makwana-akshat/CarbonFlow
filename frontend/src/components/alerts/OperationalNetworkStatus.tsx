import React from 'react';
import { 
  Factory, 
  Truck, 
  Droplet, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import type { OperationsHealthIndexResponse } from '../../types/alerts';

interface OperationalNetworkStatusProps {
  healthIndex: OperationsHealthIndexResponse | null;
}

export const OperationalNetworkStatus: React.FC<OperationalNetworkStatusProps> = ({ healthIndex }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Facilities':
        return <Factory className="w-4 h-4 text-[var(--text-secondary)]" />;
      case 'Transport':
        return <Truck className="w-4 h-4 text-[var(--text-secondary)]" />;
      case 'Supply':
        return <Droplet className="w-4 h-4 text-[var(--text-secondary)]" />;
      case 'Orders':
        return <FileCheck className="w-4 h-4 text-[var(--text-secondary)]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[var(--text-secondary)]" />;
    }
  };

  const categories = healthIndex?.categories || [];

  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-4 sm:p-5 space-y-3 text-left shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Network Operations Health Index
          </h2>
          <p className="text-xs text-[var(--text-secondary-accessible)] mt-0.5">
            Real-time status breakdown across supply nodes, logistics corridors, and clearing orders.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          {healthIndex ? 'Sync: Nominal' : 'Sync: Loading...'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="p-3 bg-[var(--paper)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] space-y-2.5"
          >
            {/* Category header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--ink)]">
                {getCategoryIcon(cat.category)}
                <span>{cat.category}</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--text-secondary-accessible)]">
                {cat.total} nodes
              </span>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden flex">
              {cat.total > 0 ? cat.breakdown.map((b, idx) => {
                const pct = (b.count / cat.total) * 100;
                return (
                  <div
                    key={idx}
                    style={{ width: `${pct}%`, backgroundColor: b.color }}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    title={`${b.label}: ${b.count}`}
                  />
                );
              }) : (
                <div className="w-full h-full bg-[var(--border-subtle)]" />
              )}
            </div>

            {/* Breakdown counts */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              {cat.breakdown.map((b, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: b.color }}
                  />
                  <span className="font-semibold text-[var(--ink)]">{b.count}</span>
                  <span className="text-[var(--text-secondary)]">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-4 text-center text-sm text-[var(--text-secondary)]">
            Loading network status...
          </div>
        )}
      </div>
    </div>
  );
};

