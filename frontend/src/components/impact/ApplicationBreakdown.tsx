import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { Building2, Fuel, FlaskConical, Mountain, Sprout } from 'lucide-react';

export const ApplicationBreakdown: React.FC = () => {
  const { applicationShares } = useCarbonImpact();

  const iconMap: Record<string, React.ReactNode> = {
    concrete: <Building2 className="w-4 h-4 text-[var(--ink)]" />,
    efuels: <Fuel className="w-4 h-4 text-[var(--accent-primary)]" />,
    chemicals: <FlaskConical className="w-4 h-4 text-blue-600" />,
    mineralization: <Mountain className="w-4 h-4 text-gray-700" />,
    agri: <Sprout className="w-4 h-4 text-[#34C77B]" />,
  };

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--ink)] tracking-tight">
              CO₂ by Utilization Application
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)]">
              Sector Share
            </span>
          </div>
          <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
            Breakdown of where captured molecules are permanently bound or converted.
          </p>
        </div>
      </div>

      {/* Stacked Horizontal Bar List */}
      <div className="space-y-3.5 py-1">
        {applicationShares.map((item) => (
          <div key={item.id} className="space-y-1.5 group">
            {/* Label, Volume, and Percentage Header */}
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 rounded bg-[var(--surface-muted)] shrink-0">
                  {iconMap[item.id] || <Building2 className="w-3.5 h-3.5" />}
                </div>
                <span className="font-semibold text-[var(--ink)] truncate">
                  {item.application}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono">
                <span className="text-[var(--text-secondary-accessible)] text-[11px]">
                  {item.formattedTonnes}
                </span>
                <span className="font-bold text-[var(--ink)] w-11 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--surface-muted)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.colorVar,
                }}
              />
            </div>

            {/* Primary Buyers Sub-text */}
            <div className="text-[10px] text-[var(--text-secondary)] truncate pl-6">
              Verified Sinks: {item.primaryBuyers}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary-accessible)]">
        <span>Concrete & E-Fuels represent ~70% of total offtake</span>
        <span className="font-mono text-[10px]">VERIFIED CUSTODY TRANSFERS</span>
      </div>
    </div>
  );
};
