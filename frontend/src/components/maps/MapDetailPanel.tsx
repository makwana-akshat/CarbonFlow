import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { SelectedEntity } from '../../types/maps';
import { SupplierMapCard } from './cards/SupplierMapCard';
import { BuyerMapCard } from './cards/BuyerMapCard';
import { RouteDetailCard } from './cards/RouteDetailCard';
import { RegionInsightCard } from './cards/RegionInsightCard';

interface MapDetailPanelProps {
  selectedEntity: SelectedEntity | null;
  onDismiss: () => void;
  onOpenMarketplace: () => void;
}

export const MapDetailPanel: React.FC<MapDetailPanelProps> = ({
  selectedEntity,
  onDismiss,
  onOpenMarketplace,
}) => {
  return (
    <AnimatePresence>
      {selectedEntity && (
        <>
          {/* Mobile bottom sheet backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30 md:hidden pointer-events-auto"
            onClick={onDismiss}
          />

          {/* Panel Container (Desktop: right floating drawer, Mobile: bottom sheet) */}
          <motion.aside
            key="map-detail-panel"
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={`
              fixed z-40 pointer-events-auto
              /* Desktop: Floating right sidebar */
              md:right-4 md:top-[60px] md:bottom-4 md:w-[350px]
              md:bg-[var(--surface-card)] md:border md:border-[var(--border-subtle)]
              md:rounded-[var(--radius-card)] md:shadow-[var(--shadow-popover)]
              /* Mobile: Bottom drawer */
              bottom-0 left-0 right-0 max-h-[80vh]
              bg-[var(--surface-card)] border-t border-[var(--border-subtle)]
              rounded-t-[20px] md:rounded-t-[var(--radius-card)] shadow-[var(--shadow-popover)]
              p-4 flex flex-col overflow-y-auto
            `}
            role="dialog"
            aria-label="Entity Details"
          >
            {/* Mobile drag handle bar */}
            <div className="md:hidden flex justify-center pb-2">
              <div className="w-10 h-1 rounded-full bg-[var(--border-subtle)]" />
            </div>

            {/* Top Close Button */}
            <div className="flex justify-end pb-1">
              <button
                onClick={onDismiss}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                aria-label="Close detail panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {selectedEntity.type === 'supplier' && (
                <SupplierMapCard
                  supplier={selectedEntity.data}
                  onOpenMarketplace={onOpenMarketplace}
                />
              )}

              {selectedEntity.type === 'buyer' && (
                <BuyerMapCard
                  buyer={selectedEntity.data}
                  onOpenMarketplace={onOpenMarketplace}
                />
              )}

              {selectedEntity.type === 'route' && (
                <RouteDetailCard
                  route={selectedEntity.data}
                  onOpenMarketplace={onOpenMarketplace}
                />
              )}

              {selectedEntity.type === 'region' && (
                <RegionInsightCard
                  region={selectedEntity.data}
                  subMode={selectedEntity.subMode}
                  onOpenMarketplace={onOpenMarketplace}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
