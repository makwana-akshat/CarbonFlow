import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { projectCoords, SVG_W, SVG_H } from './MapCanvas';
import type { SupplierNode } from '../../types/maps';
import { cn } from '../../lib/utils';

interface SupplierMarkerProps {
  supplier: SupplierNode;
  isSelected: boolean;
  onSelect: (supplier: SupplierNode) => void;
}

export const SupplierMarker: React.FC<SupplierMarkerProps> = ({
  supplier,
  isSelected,
  onSelect,
}) => {
  const { x, y } = projectCoords(supplier.coords);

  // Convert SVG coords → percentage-based CSS positioning
  const leftPct = (x / SVG_W) * 100;
  const topPct = (y / SVG_H) * 100;

  return (
    <motion.button
      className={cn(
        'absolute pointer-events-auto -translate-x-1/2 -translate-y-full',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]'
      )}
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      onClick={() => onSelect(supplier)}
      aria-label={`Supplier: ${supplier.name}, ${supplier.availableTonnes.toLocaleString()} tonnes, ${supplier.purity}% purity`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: isSelected ? 1.15 : 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Pin body */}
      <div
        className={cn(
          'flex flex-col items-center',
          isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm'
        )}
      >
        {/* Bubble label */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-1 bg-[var(--ink)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] whitespace-nowrap"
          >
            {supplier.name}
          </motion.div>
        )}

        {/* Hexagonal pin */}
        <div
          className={cn(
            'relative w-8 h-8 rounded-[10px] flex items-center justify-center border-2 transition-colors',
            isSelected
              ? 'bg-[var(--accent-primary)] border-white shadow-lg'
              : 'bg-[var(--ink)] border-white shadow-md',
            supplier.verified && 'ring-1 ring-[var(--status-success)] ring-offset-1'
          )}
        >
          {/* Factory icon as text */}
          <span className="text-white text-[12px] font-semibold select-none">S</span>
          {/* Verified badge */}
          {supplier.verified && (
            <CheckCircle2
              className="absolute -top-1.5 -right-1.5 w-3 h-3 text-[var(--status-success)] bg-white rounded-full"
            />
          )}
        </div>

        {/* Connector line to geo point */}
        <div
          className={cn(
            'w-0.5 h-2',
            isSelected ? 'bg-[var(--accent-primary)]' : 'bg-[var(--ink)]'
          )}
        />
        {/* Geo dot */}
        <div
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isSelected ? 'bg-[var(--accent-primary)]' : 'bg-[var(--ink)]'
          )}
        />
      </div>
    </motion.button>
  );
};
