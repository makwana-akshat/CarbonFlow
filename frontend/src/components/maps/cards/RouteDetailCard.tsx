import { Truck, Train, GitMerge } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import type { RouteData } from '../../../types/maps';

interface RouteDetailCardProps {
  route: RouteData;
  onOpenMarketplace: () => void;
  onPlanDispatch?: (route: RouteData) => void;
}

export const RouteDetailCard: React.FC<RouteDetailCardProps> = ({
  route,
  onOpenMarketplace,
  onPlanDispatch,
}) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Rail':
        return <Train className="w-3.5 h-3.5" />;
      case 'Pipeline':
        return <GitMerge className="w-3.5 h-3.5" />;
      default:
        return <Truck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col h-full text-[13px]">
      {/* Header */}
      <div className="pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Corridor Analysis
          </span>
          {route.isRecommended && (
            <Badge variant="filled-accent" className="text-[10px] px-2 py-0">
              Optimal Corridor
            </Badge>
          )}
        </div>

        {/* Origin → Destination */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--ink)] shrink-0" />
            <span className="font-semibold text-[13px] text-[var(--ink)] truncate">
              {route.supplierName}
            </span>
          </div>
          <div className="pl-1 border-l-2 border-dashed border-[var(--border-subtle)] ml-1 py-0.5">
            <span className="text-[11px] text-[var(--text-secondary)]">
              {route.distanceKm} km via {route.transportMode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2E8B57] shrink-0" />
            <span className="font-semibold text-[13px] text-[var(--ink)] truncate">
              {route.buyerName}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 py-3 border-b border-[var(--border-subtle)]">
        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Haul Distance
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            {route.distanceKm}{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">km</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Estimated Transit
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            {route.travelTimeHrs}{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">hours</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Freight Estimate
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            ₹{route.estimatedCostINR.toLocaleString()}
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Transport Mode
          </span>
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ink)]">
            {getModeIcon(route.transportMode)}
            <span>{route.transportMode}</span>
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {route.alternatives && route.alternatives.length > 0 && (
        <div className="py-3 border-b border-[var(--border-subtle)]">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Alternative Route Options
          </span>
          <div className="space-y-1.5">
            {route.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2.5 py-1.5 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] text-[12px]"
              >
                <span className="font-medium text-[var(--ink)]">{alt.label}</span>
                <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                  <span>{alt.timeHrs}h</span>
                  <span className="font-semibold text-[var(--ink)]">₹{alt.costINR.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 mt-auto flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center"
          onClick={() => onPlanDispatch ? onPlanDispatch(route) : onOpenMarketplace()}
        >
          Plan Logistics Dispatch
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          onClick={onOpenMarketplace}
        >
          Explore Corridor Listings
        </Button>
      </div>
    </div>
  );
};
