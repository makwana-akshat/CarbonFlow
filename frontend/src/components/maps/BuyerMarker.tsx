import React from 'react';
import { motion } from 'framer-motion';
import { projectCoords, SVG_W, SVG_H } from './MapCanvas';
import type { BuyerNode } from '../../types/maps';
import { cn } from '../../lib/utils';

interface BuyerMarkerProps {
  buyer: BuyerNode;
  isSelected: boolean;
  onSelect: (buyer: BuyerNode) => void;
}

export const BuyerMarker: React.FC<BuyerMarkerProps> = ({
  buyer,
  isSelected,
  onSelect,
}) => {
  const { x, y } = projectCoords(buyer.coords);
  const leftPct = (x / SVG_W) * 100;
  const topPct = (y / SVG_H) * 100;

  return (
    <motion.button
      className={cn(
        'absolute pointer-events-auto -translate-x-1/2 -translate-y-full',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--status-success)]'
      )}
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      onClick={() => onSelect(buyer)}
      aria-label={`Buyer: ${buyer.name}, needs ${buyer.requiredTonnes.toLocaleString()} tonnes`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: isSelected ? 1.15 : 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className={cn('flex flex-col items-center', isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm')}>
        {/* Label */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-1 bg-[var(--status-success)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] whitespace-nowrap"
          >
            {buyer.name}
          </motion.div>
        )}

        {/* Diamond pin — visually distinct from supplier squares */}
        <div
          className={cn(
            'relative w-7 h-7 flex items-center justify-center border-2 transition-colors',
            'rotate-45', // diamond shape
            isSelected
              ? 'bg-[var(--status-success)] border-white shadow-lg'
              : 'bg-[#2E8B57] border-white shadow-md'
          )}
          style={{ borderRadius: '4px' }}
        >
          <span
            className="text-white text-[11px] font-semibold select-none"
            style={{ transform: 'rotate(-45deg)' }}
          >
            B
          </span>
        </div>
        <div className={cn('w-0.5 h-2', isSelected ? 'bg-[var(--status-success)]' : 'bg-[#2E8B57]')} />
        <div className={cn('w-1.5 h-1.5 rounded-full', isSelected ? 'bg-[var(--status-success)]' : 'bg-[#2E8B57]')} />
      </div>
    </motion.button>
  );
};
