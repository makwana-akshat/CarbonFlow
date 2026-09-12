import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { MapMode } from '../../types/maps';

interface MapModeSelectorProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

const MODES: { id: MapMode; label: string; shortLabel: string }[] = [
  { id: 'marketplace', label: 'Marketplace', shortLabel: 'Market' },
  { id: 'routes',      label: 'Routes',      shortLabel: 'Routes' },
  { id: 'supply',      label: 'Supply',      shortLabel: 'Supply' },
  { id: 'demand',      label: 'Demand',      shortLabel: 'Demand' },
  { id: 'price',       label: 'Price',       shortLabel: 'Price' },
  { id: 'carbon-flow', label: 'Carbon Flow', shortLabel: 'Flow' },
];

export const MapModeSelector: React.FC<MapModeSelectorProps> = ({ mode, onChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = MODES.find((m) => m.id === mode)!;

  return (
    <>
      {/* ── Desktop: Horizontal segmented pill ── */}
      <div className="hidden sm:flex items-center gap-0.5 bg-[var(--surface-card)]/95 backdrop-blur-sm border border-[var(--border-subtle)] rounded-[var(--radius-pill)] p-1 shadow-[var(--shadow-sm)]">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              'px-3 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium transition-all whitespace-nowrap select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
              mode === m.id
                ? 'bg-[var(--ink)] text-white shadow-sm'
                : 'text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)]'
            )}
            aria-pressed={mode === m.id}
            aria-label={`Map mode: ${m.label}`}
          >
            <span className="sm:hidden lg:hidden">{m.shortLabel}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* ── Mobile: Dropdown ── */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-card)]/95 backdrop-blur-sm border border-[var(--border-subtle)] rounded-[var(--radius-pill)] text-[13px] font-semibold text-[var(--ink)] shadow-[var(--shadow-sm)]"
          aria-expanded={mobileOpen}
          aria-haspopup="listbox"
        >
          <span>{current.label}</span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', mobileOpen && 'rotate-180')} />
        </button>

        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-full mt-1 z-50 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-[var(--shadow-popover)] overflow-hidden min-w-[160px]">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { onChange(m.id); setMobileOpen(false); }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-[13px] transition-colors',
                    mode === m.id
                      ? 'bg-[var(--surface-muted)] font-semibold text-[var(--ink)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-muted)]/60 font-medium'
                  )}
                  role="option"
                  aria-selected={mode === m.id}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
