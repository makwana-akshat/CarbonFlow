import React from 'react';
import type { MapMode } from '../../types/maps';

interface MapLegendProps {
  mode: MapMode;
}

const SUPPLY_LEGEND = [
  { label: '< 5,000 t', color: 'rgb(220,235,227)' },
  { label: '5–10k t',   color: 'rgb(195,220,207)' },
  { label: '10–20k t',  color: 'rgb(162,200,178)' },
  { label: '20k+ t',    color: 'rgb(132,180,150)' },
];

const DEMAND_LEGEND = [
  { label: '< 5,000 t',  color: 'rgb(210,228,238)' },
  { label: '5–10k t',    color: 'rgb(180,210,228)' },
  { label: '10–18k t',   color: 'rgb(148,188,215)' },
  { label: '18k+ t',     color: 'rgb(108,162,200)' },
];

const PRICE_LEGEND = [
  { label: '< ₹3,800/t', color: 'rgb(253,244,200)' },
  { label: '₹3.8–4.2k',  color: 'rgb(253,230,160)' },
  { label: '₹4.2–4.7k',  color: 'rgb(252,200,100)' },
  { label: '₹4.7k+',     color: 'rgb(245,145,60)' },
];

const FLOW_LEGEND = [
  { label: 'Low volume',  color: '#C4D5CC', strokeWidth: 1.5 },
  { label: 'Mid volume',  color: '#E8622E', strokeWidth: 3 },
  { label: 'High volume', color: '#F4611E', strokeWidth: 5 },
];

export const MapLegend: React.FC<MapLegendProps> = ({ mode }) => {
  if (mode === 'marketplace' || mode === 'routes') {
    return (
      <div className="bg-[var(--surface-card)]/95 backdrop-blur-sm border border-[var(--border-subtle)] rounded-[var(--radius-card)] px-3 py-2.5 shadow-[var(--shadow-sm)]">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
          Legend
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-[var(--ink)] flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-semibold">S</span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary-accessible)]">Supplier</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 flex items-center justify-center shrink-0"
              style={{ background: '#2E8B57', borderRadius: '4px', transform: 'rotate(45deg)' }}
            >
              <span className="text-white text-[9px] font-semibold" style={{ transform: 'rotate(-45deg)' }}>B</span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary-accessible)]">Buyer</span>
          </div>
          {mode === 'routes' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 bg-[var(--ink)]" />
                <span className="text-[11px] text-[var(--text-secondary-accessible)]">Recommended</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 bg-[var(--text-secondary)] border-dashed border-t" />
                <span className="text-[11px] text-[var(--text-secondary-accessible)]">Alternate</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'carbon-flow') {
    return (
      <div className="bg-[var(--surface-card)]/95 backdrop-blur-sm border border-[var(--border-subtle)] rounded-[var(--radius-card)] px-3 py-2.5 shadow-[var(--shadow-sm)]">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
          CO₂ Volume
        </div>
        <div className="flex flex-col gap-2">
          {FLOW_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-8 rounded"
                style={{ height: `${item.strokeWidth}px`, background: item.color }}
              />
              <span className="text-[11px] text-[var(--text-secondary-accessible)]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items =
    mode === 'supply' ? SUPPLY_LEGEND :
    mode === 'demand' ? DEMAND_LEGEND :
    PRICE_LEGEND;

  const title =
    mode === 'supply' ? 'Supply Density' :
    mode === 'demand' ? 'Demand Density' :
    'Avg Price';

  return (
    <div className="bg-[var(--surface-card)]/95 backdrop-blur-sm border border-[var(--border-subtle)] rounded-[var(--radius-card)] px-3 py-2.5 shadow-[var(--shadow-sm)]">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
        {title}
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-5 h-3 rounded-[2px] shrink-0 border border-[var(--border-subtle)]"
              style={{ background: item.color }}
            />
            <span className="text-[11px] text-[var(--text-secondary-accessible)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
