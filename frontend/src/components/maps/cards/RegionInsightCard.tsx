import { MapPin } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import type { RegionData } from '../../../types/maps';

interface RegionInsightCardProps {
  region: RegionData;
  subMode: 'supply' | 'demand' | 'price';
  onOpenMarketplace: () => void;
}

export const RegionInsightCard: React.FC<RegionInsightCardProps> = ({
  region,
  subMode,
  onOpenMarketplace,
}) => {
  const fulfilmentPct =
    region.demand.totalDemandTonnes > 0
      ? Math.round((region.demand.fulfilledTonnes / region.demand.totalDemandTonnes) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full text-[13px]">
      {/* Header */}
      <div className="pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[15px] text-[var(--ink)] leading-snug">
            {region.name}
          </h3>
          <Badge variant="neutral" className="text-[10px] uppercase font-semibold">
            {subMode} cluster
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[var(--text-secondary)]">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--accent-primary)]" />
          <span>
            {region.coords.lat.toFixed(2)}°N, {region.coords.lng.toFixed(2)}°E
          </span>
        </div>
      </div>

      {/* Sub-mode dependent metrics */}
      {subMode === 'supply' && (
        <div className="space-y-3 py-3 border-b border-[var(--border-subtle)]">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Supply Capacity
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                {region.supply.availableTonnes.toLocaleString()}{' '}
                <span className="text-[11px] font-normal text-[var(--text-secondary)]">tonnes</span>
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Active Emitters
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                {region.supply.activeSuppliers} facilities
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Mean Purity
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                {region.supply.avgPurity}%
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Mean Price
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                ₹{region.supply.avgPricePerTon.toLocaleString()}/t
              </span>
            </div>
          </div>
        </div>
      )}

      {subMode === 'demand' && (
        <div className="space-y-3 py-3 border-b border-[var(--border-subtle)]">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Aggregated Demand
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                {region.demand.totalDemandTonnes.toLocaleString()}{' '}
                <span className="text-[11px] font-normal text-[var(--text-secondary)]">t</span>
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Active Buyers
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                {region.demand.activeBuyers} industrial buyers
              </span>
            </div>
          </div>

          {/* Fulfilment Progress */}
          <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-secondary)] font-medium">Cluster Fulfilment</span>
              <span className="font-semibold text-[var(--ink)]">{fulfilmentPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--status-success)] rounded-full"
                style={{ width: `${fulfilmentPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
              <span>{region.demand.fulfilledTonnes.toLocaleString()} t contracted</span>
              <span>{region.demand.unfulfilledTonnes.toLocaleString()} t deficit</span>
            </div>
          </div>
        </div>
      )}

      {subMode === 'price' && (
        <div className="space-y-3 py-3 border-b border-[var(--border-subtle)]">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Regional Benchmark
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                ₹{region.price.avgPricePerTon.toLocaleString()}/t
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Market Depth
              </span>
              <span className="text-[14px] font-bold text-[var(--ink)]">
                {region.price.activeListings} listings
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Floor Price
              </span>
              <span className="text-[13px] font-semibold text-[var(--status-success)]">
                ₹{region.price.lowestListing.toLocaleString()}
              </span>
            </div>

            <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                Ceiling Price
              </span>
              <span className="text-[13px] font-semibold text-[var(--ink)]">
                ₹{region.price.highestListing.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 mt-auto flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center"
          onClick={onOpenMarketplace}
        >
          Explore Cluster in Marketplace
        </Button>
      </div>
    </div>
  );
};
