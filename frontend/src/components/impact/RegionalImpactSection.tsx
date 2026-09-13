import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { MapPin, Factory, ArrowUpRight, CheckCircle2, Truck } from 'lucide-react';
import type { RegionalImpactItem } from '../../types/impact';

export const RegionalImpactSection: React.FC = () => {
  const { regionalData, selectedRegionId, selectRegion, activeRegionDetail } = useCarbonImpact();

  const currentSelected = activeRegionDetail || regionalData[0] || null;

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[var(--ink)] tracking-tight">
              Regional Impact Distribution
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border border-[var(--border-subtle)]">
              Western Industrial Corridors
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-0.5">
            Geographic concentration of physical CO₂ capture, transport trunk lines, and utilization off-takes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Regional Nodes Interactive Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {regionalData.map((region: RegionalImpactItem) => {
            const isSelected = selectedRegionId === region.id || (!selectedRegionId && currentSelected?.id === region.id);

            return (
              <div
                key={region.id}
                onClick={() => selectRegion(region.id)}
                className={`p-3.5 rounded-[var(--radius-card)] border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'border-[var(--ink)] bg-[var(--surface-muted)]/70 shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-[var(--ink)]/30 hover:bg-[var(--surface-muted)]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-[13px] font-bold text-[var(--ink)] truncate">
                        {region.name.split(' ')[0]}
                      </h4>
                      <span className="text-[10px] text-[var(--text-secondary-accessible)] font-mono">
                        {region.state} Cluster
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected ? 'text-[var(--accent-primary)] translate-x-0.5 -translate-y-0.5' : 'text-[var(--text-secondary)]'
                    }`}
                  />
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Utilized Volume</span>
                    <span className="font-extrabold text-[var(--ink)] font-mono text-[13px]">
                      {region.formattedTonnes}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-secondary)] block">Facilities</span>
                    <span className="font-semibold text-[var(--text-secondary-accessible)]">
                      {region.activeFacilities} nodes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Column: Selected Region Deep Dive Card */}
        {currentSelected && (
          <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                <MapPin className="w-3.5 h-3.5" />
                <span>INSPECTED CORRIDOR NODE</span>
              </div>
              <h4 className="text-base font-bold text-[var(--ink)] tracking-tight mt-1">
                {currentSelected.name}
              </h4>
              <p className="text-[11px] text-[var(--text-secondary-accessible)] mt-0.5">
                Integrated industrial cluster connecting capture emitters with utilization offtakers.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary-accessible)] tracking-wider block">
                  Total CO₂ Utilized
                </span>
                <span className="text-2xl font-extrabold text-[var(--ink)] font-mono">
                  {currentSelected.formattedTonnes}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                    <Factory className="w-3 h-3 text-[var(--text-secondary)]" />
                    Facilities
                  </span>
                  <span className="font-bold text-[var(--ink)] text-sm">
                    {currentSelected.activeFacilities}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[var(--status-online)]" />
                    Contracts
                  </span>
                  <span className="font-bold text-[var(--ink)] text-sm">
                    {currentSelected.completedTransactions}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-1 text-[11px]">
                <span className="text-[10px] font-semibold text-[var(--text-secondary-accessible)] block">
                  Primary Utilization Sector:
                </span>
                <div className="font-semibold text-[var(--ink)]">
                  {currentSelected.primaryApplication}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-1 text-[11px]">
                <span className="text-[10px] font-semibold text-[var(--text-secondary-accessible)] block flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[var(--accent-primary)]" />
                  Corridor Infrastructure:
                </span>
                <div className="text-[10px] text-[var(--text-secondary-accessible)] font-mono">
                  {currentSelected.transportNetwork}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] font-mono">
              LAT/LNG: {currentSelected.coordinates.lat.toFixed(4)}° N, {currentSelected.coordinates.lng.toFixed(4)}° E
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
