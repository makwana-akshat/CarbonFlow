import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import type { FilterState } from '../../types/dashboard';
import { SEARCH_CATEGORY_CHIPS, type CategoryChip } from '../../constants/ui';

interface SearchAndFilterBarProps {
  filterState: FilterState;
  onChangeFilter: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filterState,
  onChangeFilter,
  onResetFilters,
  totalResultsCount
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const hasActiveFilters = Boolean(
    filterState.searchQuery ||
    filterState.activeChip ||
    filterState.grade !== 'all' ||
    filterState.source !== 'all' ||
    filterState.verifiedOnly
  );

  const sortLabels: Record<FilterState['sortBy'], string> = {
    match: 'Match %',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    volumeDesc: 'Volume: Highest'
  };

  return (
    <div className="w-full bg-transparent py-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Global Search with embedded Category Tag Chips inside the pill */}
        <div className="flex-1 relative flex items-center">
          <div className="w-full rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 shadow-xs transition-shadow focus-within:shadow-[var(--shadow-card)] focus-within:border-[var(--accent-primary)]">
            <Search className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            
            {/* Embedded Category Tag Chips inside pill input (Shipment / Cargo / Route style) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 max-w-full">
              {SEARCH_CATEGORY_CHIPS.slice(0, 4).map((chip: CategoryChip) => {
                const isSelected = filterState.activeChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => {
                      onChangeFilter({
                        activeChip: isSelected ? null : chip.id
                      });
                    }}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-[var(--radius-pill)] border transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)] ${
                      isSelected
                        ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] font-semibold shadow-xs'
                        : 'bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-neutral-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Input field */}
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
              placeholder="Search by facility, hub, chemical purity, offtake route..."
              className="flex-1 min-w-[140px] bg-transparent border-none text-[14px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
            />

            {/* Clear button if search is active */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-full hover:bg-[var(--surface-muted)] transition-colors"
                title="Clear all search & filters"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter and Sort Pill Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
          
          {/* Results count pill */}
          <div className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[12px] font-medium text-[var(--text-secondary-accessible)]">
            <span className="font-semibold text-[var(--text-primary)] mr-1">{totalResultsCount}</span> matched
          </div>

          {/* Filter Pill Button */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterMenuOpen(!filterMenuOpen);
                setSortMenuOpen(false);
              }}
              className={`h-10 px-4 rounded-[var(--radius-pill)] border text-[13px] font-medium transition-all flex items-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                filterState.grade !== 'all' || filterState.source !== 'all' || filterState.verifiedOnly
                  ? 'bg-[var(--surface-card)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                  : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
              {(filterState.grade !== 'all' || filterState.source !== 'all' || filterState.verifiedOnly) && (
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
              )}
            </button>

            {/* Filter Popover */}
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <span className="text-[13px] font-semibold text-[var(--text-primary)]">Filter Listings</span>
                  <button
                    onClick={onResetFilters}
                    className="text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4 pt-3">
                  {/* CO2 Source */}
                  <div>
                    <label className="type-label block text-[var(--text-secondary-accessible)] mb-1.5">
                      CO₂ Capture Source
                    </label>
                    <select
                      value={filterState.source}
                      onChange={(e) => onChangeFilter({ source: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="all">All Sources</option>
                      <option value="DAC">Direct Air Capture (DAC)</option>
                      <option value="Biogenic">Biogenic Fermentation</option>
                      <option value="Point-Source Capture">Point-Source Capture</option>
                    </select>
                  </div>

                  {/* CO2 Grade */}
                  <div>
                    <label className="type-label block text-[var(--text-secondary-accessible)] mb-1.5">
                      Purity / Grade Standard
                    </label>
                    <select
                      value={filterState.grade}
                      onChange={(e) => onChangeFilter({ grade: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="all">All Grades</option>
                      <option value="Food Grade">Food Grade (E290)</option>
                      <option value="Industrial">Industrial Tech Grade</option>
                      <option value="Sequestered">Geological Sequestration</option>
                    </select>
                  </div>

                  {/* Verified Only */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[13px] text-[var(--text-primary)]">Verified Plants Only</span>
                    <input
                      type="checkbox"
                      checked={filterState.verifiedOnly}
                      onChange={(e) => onChangeFilter({ verifiedOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] accent-[var(--accent-primary)]"
                    />
                  </div>

                  <button
                    onClick={() => setFilterMenuOpen(false)}
                    className="w-full mt-2 py-2 rounded-[var(--radius-pill)] bg-[var(--text-primary)] text-white text-[12px] font-medium hover:opacity-90 transition-opacity"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sort Pill Button */}
          <div className="relative">
            <button
              onClick={() => {
                setSortMenuOpen(!sortMenuOpen);
                setFilterMenuOpen(false);
              }}
              className="h-10 px-4 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors flex items-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>Sort: {sortLabels[filterState.sortBy]}</span>
            </button>

            {/* Sort Popover */}
            {sortMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-2 z-50 animate-in fade-in zoom-in-95">
                {(Object.keys(sortLabels) as FilterState['sortBy'][]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      onChangeFilter({ sortBy: key });
                      setSortMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-[var(--radius-chip)] text-[13px] transition-colors ${
                      filterState.sortBy === key
                        ? 'bg-[var(--surface-muted)] text-[var(--text-primary)] font-semibold'
                        : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{sortLabels[key]}</span>
                    {filterState.sortBy === key && <Check className="w-4 h-4 text-[var(--accent-primary)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
