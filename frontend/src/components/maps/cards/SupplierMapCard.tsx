import { CheckCircle2, MapPin, Clock, Factory } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import type { SupplierNode } from '../../../types/maps';

interface SupplierMapCardProps {
  supplier: SupplierNode;
  onOpenMarketplace: () => void;
  onRequestStream?: (supplier: SupplierNode) => void;
}

export const SupplierMapCard: React.FC<SupplierMapCardProps> = ({
  supplier,
  onOpenMarketplace,
  onRequestStream,
}) => {
  return (
    <div className="flex flex-col h-full text-[13px]">
      {/* Header */}
      <div className="pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[15px] text-[var(--ink)] leading-snug">
            {supplier.name}
          </h3>
          {supplier.verified && (
            <Badge variant="outline-success" icon={<CheckCircle2 className="w-3 h-3 text-[var(--status-success)]" />}>
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
          <Factory className="w-3.5 h-3.5 shrink-0" />
          <span>{supplier.facilityType}</span>
          <span>•</span>
          <span>{supplier.industry}</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[var(--text-secondary)] mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--accent-primary)]" />
          <span>{supplier.location}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 py-3 border-b border-[var(--border-subtle)]">
        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Available Volume
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            {supplier.availableTonnes.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">tonnes</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Stream Purity
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            {supplier.purity}%{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">CO₂</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Base Price
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            ₹{supplier.pricePerTon.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">/ ton</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Physical State
          </span>
          <span className="text-[13px] font-semibold text-[var(--ink)]">
            {supplier.physicalState}
          </span>
        </div>
      </div>

      {/* Additional details */}
      <div className="py-3 space-y-2 text-[12px] border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">CO₂ Capture Source</span>
          <span className="font-medium text-[var(--ink)]">{supplier.co2Source}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Dispatch Window</span>
          <span className="font-medium text-[var(--ink)] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[var(--accent-primary)]" />
            {supplier.dispatchWindow}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 mt-auto flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center"
          onClick={() => onRequestStream ? onRequestStream(supplier) : onOpenMarketplace()}
        >
          Request CO₂ Stream
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          onClick={onOpenMarketplace}
        >
          View in Marketplace
        </Button>
      </div>
    </div>
  );
};
