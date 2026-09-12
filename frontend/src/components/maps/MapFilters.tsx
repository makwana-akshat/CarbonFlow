import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { MapFilterState, MapMode } from '../../types/maps';
import { DEFAULT_MAP_FILTERS } from '../../types/maps';

interface MapFiltersProps {
  filters: MapFilterState;
  onChange: (filters: MapFilterState) => void;
  onReset: () => void;
  mode: MapMode;
}

const REGIONS = ['All Regions', 'Gujarat', 'Maharashtra', 'Tamil Nadu', 'Delhi NCR', 'Karnataka'];
const INDUSTRIES = ['All Industries', 'Cement', 'Steel', 'Chemicals', 'Fertilizers', 'Power Generation', 'Carbon Removal'];
const APPLICATIONS = ['All Applications', 'Urea Synthesis', 'EOR', 'Food-Grade', 'Synthetic Fuels', 'Building Materials', 'Refrigerants'];

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  onChange,
  onReset,
  mode,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters compared to defaults
  let activeCount = 0;
  if (filters.region && filters.region !== '') activeCount++;
  if (filters.industry && filters.industry !== '') activeCount++;
  if (filters.minPurity > DEFAULT_MAP_FILTERS.minPurity) activeCount++;
  if (filters.minQuantity > DEFAULT_MAP_FILTERS.minQuantity) activeCount++;
  if (filters.maxPrice < DEFAULT_MAP_FILTERS.maxPrice) activeCount++;
  if (filters.verifiedOnly) activeCount++;
  if (mode === 'routes' && filters.maxDistance < DEFAULT_MAP_FILTERS.maxDistance) activeCount++;
  if (mode === 'demand' && filters.application && filters.application !== '') activeCount++;

  const update = (patch: Partial<MapFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="relative pointer-events-auto">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] border text-[12px] font-medium transition-all shadow-[var(--shadow-sm)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
          isOpen || activeCount > 0
            ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
            : 'bg-[var(--surface-card)]/95 backdrop-blur-sm text-[var(--ink)] border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]'
        )}
        aria-expanded={isOpen}
        aria-label="Toggle map filters"
      >
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-[var(--accent-primary)] text-white text-[10px] font-semibold flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {/* Floating Filter Popover */}
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-[var(--shadow-popover)] p-4 max-h-[75vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[var(--ink)]">Filter View</span>
                {activeCount > 0 && (
                  <span className="text-[11px] text-[var(--text-secondary)]">({activeCount} active)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    onClick={onReset}
                    className="text-[11px] font-medium text-[var(--text-secondary-accessible)] hover:text-[var(--accent-primary)] flex items-center gap-1 transition-colors"
                    title="Reset all filters"
                  >
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors p-0.5"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3.5 text-[12px]">
              {/* Region */}
              <div>
                <label className="block font-medium text-[var(--ink)] mb-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                  Region
                </label>
                <select
                  value={filters.region || 'All Regions'}
                  onChange={(e) => update({ region: e.target.value === 'All Regions' ? '' : e.target.value })}
                  className="w-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-2.5 py-1.5 text-[12px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block font-medium text-[var(--ink)] mb-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                  Industry
                </label>
                <select
                  value={filters.industry || 'All Industries'}
                  onChange={(e) => update({ industry: e.target.value === 'All Industries' ? '' : e.target.value })}
                  className="w-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-2.5 py-1.5 text-[12px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Application (only in demand mode) */}
              {mode === 'demand' && (
                <div>
                  <label className="block font-medium text-[var(--ink)] mb-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Application
                  </label>
                  <select
                    value={filters.application || 'All Applications'}
                    onChange={(e) => update({ application: e.target.value === 'All Applications' ? '' : e.target.value })}
                    className="w-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-2.5 py-1.5 text-[12px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  >
                    {APPLICATIONS.map((app) => (
                      <option key={app} value={app}>
                        {app}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Min Purity Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Min Purity
                  </label>
                  <span className="font-semibold text-[var(--ink)]">{filters.minPurity}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="99.9"
                  step="0.5"
                  value={filters.minPurity}
                  onChange={(e) => update({ minPurity: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--ink)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                  <span>90% (Industrial)</span>
                  <span>99.9% (Ultra-pure)</span>
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Max Price / Ton
                  </label>
                  <span className="font-semibold text-[var(--ink)]">₹{filters.maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="10000"
                  step="250"
                  value={filters.maxPrice}
                  onChange={(e) => update({ maxPrice: parseInt(e.target.value, 10) })}
                  className="w-full accent-[var(--ink)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                  <span>₹3,000</span>
                  <span>₹10,000+</span>
                </div>
              </div>

              {/* Mode-specific: Routes */}
              {mode === 'routes' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                      Max Distance
                    </label>
                    <span className="font-semibold text-[var(--ink)]">{filters.maxDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={filters.maxDistance}
                    onChange={(e) => update({ maxDistance: parseInt(e.target.value, 10) })}
                    className="w-full accent-[var(--ink)] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>100 km</span>
                    <span>1,500 km</span>
                  </div>
                </div>
              )}

              {/* Verified Only Checkbox */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => update({ verifiedOnly: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--ink)] accent-[var(--ink)] focus:ring-0"
                  />
                  <div>
                    <span className="text-[12px] font-medium text-[var(--ink)]">Verified streams only</span>
                    <p className="text-[10px] text-[var(--text-secondary)]">Show emitters with audited purity assays</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
