import React, { useState } from 'react';
import { Map as MapIcon, Search, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface MapHeaderProps {
  onBack: () => void;
  onOpenMarketplace: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const MapHeader: React.FC<MapHeaderProps> = ({
  onBack,
  onOpenMarketplace,
  searchQuery: externalQuery,
  onSearchChange,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');

  const currentQuery = externalQuery !== undefined ? externalQuery : internalQuery;
  const handleQueryChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setInternalQuery(val);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-3 px-4 py-2.5 bg-[var(--surface-card)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
      {/* Left: back + title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-[var(--radius-md)] px-1"
          aria-label="Back to Dashboard"
        >
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* CarbonFlow logo mark */}
          <div className="w-6 h-6 rounded bg-[var(--ink)] text-white text-[10px] font-semibold flex items-center justify-center">
            CF
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[13px] text-[var(--ink)] tracking-tight hidden sm:inline">
              CARBONFLOW
            </span>
            <span className="text-[var(--border-subtle)]">/</span>
            <div className="flex items-center gap-1">
              <MapIcon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="font-semibold text-[13px] text-[var(--ink)]">Maps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Search + Marketplace CTA */}
      <div className="flex items-center gap-2">
        {/* Expandable search */}
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-1.5 w-64 transition-all">
            <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
            <input
              autoFocus
              value={currentQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search location, supplier..."
              className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none"
            />
            <button
              onClick={() => { setSearchOpen(false); handleQueryChange(''); }}
              className="text-[var(--text-secondary)] hover:text-[var(--ink)]"
              aria-label="Close search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[13px] font-medium text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] hover:bg-[var(--surface-card)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            aria-label="Open search"
          >
            <span>Search</span>
          </button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenMarketplace}
          className="hidden sm:flex shrink-0"
        >
          Marketplace
        </Button>
      </div>
    </header>
  );
};
