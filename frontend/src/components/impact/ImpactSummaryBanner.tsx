import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { Layers, Network, Activity, Building } from 'lucide-react';

export const ImpactSummaryBanner: React.FC = () => {
  const { summaryStats } = useCarbonImpact();

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--ink)] text-white p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6">
      {/* Top Headline Statement */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-mono tracking-wider uppercase text-[var(--accent-primary)] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          NETWORK MASS BALANCE CONVERSION
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
          <span className="text-[var(--accent-primary)]">{summaryStats.formattedUtilizedTonnes} tonnes</span> of captured CO₂ successfully routed toward productive industrial utilization.
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Through dynamic discovery, supercritical pipeline dispatching, and automated bilateral clearing contracts, CarbonFlow minimizes unmitigated venting by transforming industrial waste gas into economic feedstock.
        </p>
      </div>

      {/* 4 Platform Ratio Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Activity className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Utilization Rate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {summaryStats.utilizationRatePercent}%
          </div>
          <div className="text-[10px] text-gray-500">Utilized / Captured CO₂</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Completed Deals</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {summaryStats.completedTransactions}
          </div>
          <div className="text-[10px] text-gray-500">Cleared B2B contracts</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Facilities</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {summaryStats.activeFacilities}
          </div>
          <div className="text-[10px] text-gray-500">Connected emitters & sinks</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span>Industrial Hubs</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {summaryStats.connectedRegions}
          </div>
          <div className="text-[10px] text-gray-500">Connected regional corridors</div>
        </div>
      </div>
    </div>
  );
};
