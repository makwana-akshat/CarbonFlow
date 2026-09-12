import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input, Checkbox, RadioButton } from '../ui/FormControls';
import type { MarketplaceFilterState, PhysicalState } from '../../types/marketplace';
import { ChevronDown, SlidersHorizontal, PanelLeftClose } from 'lucide-react';

interface FilterSidebarProps {
  filterState: MarketplaceFilterState;
  onChangeFilter: (updates: Partial<MarketplaceFilterState>) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  onToggleCollapse?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterState,
  onChangeFilter,
  onApply,
  onClear,
  className = '',
  isMobileDrawer = false,
  onCloseMobileDrawer,
  onToggleCollapse,
}) => {
  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    purity: true,
    quantity: true,
    price: true,
    distance: true,
    application: true,
    state: true,
    verification: true,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const applicationsList = [
    'Fuel synthesis',
    'Building materials',
    'Greenhouse',
    'Algae farming',
    'EOR',
  ];

  const handleApplicationToggle = (app: string) => {
    const current = filterState.selectedApplications;
    const exists = current.includes(app);
    const updated = exists ? current.filter((item) => item !== app) : [...current, app];
    onChangeFilter({ selectedApplications: updated });
  };

  return (
    <aside
      className={`w-full lg:w-80 shrink-0 bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] p-5 shadow-[var(--shadow-card)] flex flex-col justify-between ${className}`}
      aria-label="Marketplace Filters"
    >
      <div className="space-y-5">
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <span className="type-heading text-[15px] font-semibold text-[var(--text-primary)]">
              Filters & Specs
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClear}
              className="text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--ink)] px-2 py-1 rounded hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            >
              Clear all
            </button>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
                title="Collapse filter sidebar"
                aria-label="Collapse filter sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 1. PURITY RANGE SLIDER WITH TIER MARKERS (96% / 97% / 99%) */}
        <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
          <button
            type="button"
            onClick={() => toggleSection('purity')}
            className="w-full flex items-center justify-between text-[13px] font-semibold text-[var(--text-primary)] select-none"
          >
            <span>Minimum Purity: {filterState.minPurity}%</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                openSections.purity ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.purity && (
            <div className="pt-2 space-y-3">
              <input
                type="range"
                min="90"
                max="100"
                step="0.1"
                value={filterState.minPurity}
                onChange={(e) => onChangeFilter({ minPurity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-[var(--surface-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                aria-label="Minimum Purity Percentage"
              />

              {/* Tier Markers (EOR / Pipeline / Liquefaction) */}
              <div className="relative pt-1 flex justify-between text-[10px] text-[var(--text-secondary-accessible)] font-medium select-none">
                <span className="text-left">90%</span>
                <div className="flex flex-col items-center">
                  <span className="h-1.5 w-0.5 bg-[var(--border-subtle)] mb-0.5" />
                  <span className="text-[var(--text-primary)] font-semibold">96%</span>
                  <span className="text-[9px] text-[var(--text-secondary)]">EOR</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1.5 w-0.5 bg-[var(--border-subtle)] mb-0.5" />
                  <span className="text-[var(--text-primary)] font-semibold">97%</span>
                  <span className="text-[9px] text-[var(--text-secondary)]">Pipeline</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1.5 w-0.5 bg-[var(--status-success)] mb-0.5" />
                  <span className="text-[var(--status-success)] font-semibold">99%</span>
                  <span className="text-[9px] text-[var(--status-success)]">Cryo</span>
                </div>
                <span className="text-right">100%</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. QUANTITY MIN/MAX INPUTS */}
        <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
          <button
            type="button"
            onClick={() => toggleSection('quantity')}
            className="w-full flex items-center justify-between text-[13px] font-semibold text-[var(--text-primary)] select-none"
          >
            <span>Quantity (Tonnes)</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                openSections.quantity ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.quantity && (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min t"
                value={filterState.minQuantity || ''}
                onChange={(e) =>
                  onChangeFilter({ minQuantity: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                type="number"
                placeholder="Max t"
                value={filterState.maxQuantity || ''}
                onChange={(e) =>
                  onChangeFilter({ maxQuantity: parseInt(e.target.value) || 100000 })
                }
              />
            </div>
          )}
        </div>

        {/* 3. PRICE RANGE */}
        <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-[13px] font-semibold text-[var(--text-primary)] select-none"
          >
            <span>Price Range (₹/t)</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                openSections.price ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.price && (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min ₹"
                value={filterState.minPrice || ''}
                onChange={(e) =>
                  onChangeFilter({ minPrice: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                type="number"
                placeholder="Max ₹"
                value={filterState.maxPrice || ''}
                onChange={(e) =>
                  onChangeFilter({ maxPrice: parseInt(e.target.value) || 10000 })
                }
              />
            </div>
          )}
        </div>

        {/* 4. DISTANCE SLIDER (0 - 500 km) */}
        <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
          <button
            type="button"
            onClick={() => toggleSection('distance')}
            className="w-full flex items-center justify-between text-[13px] font-semibold text-[var(--text-primary)] select-none"
          >
            <span>Max Distance: {filterState.maxDistance} km</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                openSections.distance ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.distance && (
            <div className="pt-2 space-y-1.5">
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={filterState.maxDistance}
                onChange={(e) => onChangeFilter({ maxDistance: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-[var(--surface-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                aria-label="Maximum Distance in Kilometers"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
                <span>0 km</span>
                <span>250 km</span>
                <span>500 km</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. APPLICATION CHECKBOXES */}
        <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
          <button
            type="button"
            onClick={() => toggleSection('application')}
            className="w-full flex items-center justify-between text-[13px] font-semibold text-[var(--text-primary)] select-none"
          >
            <span>Application Sector</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                openSections.application ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.application && (
            <div className="pt-2 space-y-2">
              {applicationsList.map((app) => (
                <Checkbox
                  key={app}
                  label={app}
                  checked={filterState.selectedApplications.includes(app)}
                  onChange={() => handleApplicationToggle(app)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 6. PHYSICAL STATE (Gas vs Liquefied) */}
        <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
          <button
            type="button"
            onClick={() => toggleSection('state')}
            className="w-full flex items-center justify-between text-[13px] font-semibold text-[var(--text-primary)] select-none"
          >
            <span>Physical Phase</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                openSections.state ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.state && (
            <div className="pt-2 space-y-2">
              {(['All', 'Liquefied', 'Gas'] as PhysicalState[]).map((stateOpt) => (
                <RadioButton
                  key={stateOpt}
                  name="physicalStateGroup"
                  label={stateOpt === 'All' ? 'All Physical States' : `${stateOpt} CO₂`}
                  checked={filterState.physicalState === stateOpt}
                  onChange={() => onChangeFilter({ physicalState: stateOpt })}
                />
              ))}
            </div>
          )}
        </div>

        {/* 7. VERIFICATION STATUS */}
        <div className="space-y-2 pb-2">
          <Checkbox
            label="Verified Suppliers Only"
            description="Third-party ISO-14064 direct injection certified"
            checked={filterState.verifiedOnly}
            onChange={(e) => onChangeFilter({ verifiedOnly: e.target.checked })}
          />
        </div>

      </div>

      {/* Panel Bottom Action Buttons */}
      <div className="pt-4 border-t border-[var(--border-subtle)] mt-4 flex items-center gap-2">
        <Button
          variant="pill-dark"
          size="md"
          fullWidth
          onClick={() => {
            onApply();
            if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
          }}
        >
          Apply Filters
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Reset
        </Button>
      </div>

    </aside>
  );
};
