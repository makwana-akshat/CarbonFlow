import React from 'react';
import { CheckCircle2, MapPin, Building2 } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import type { BuyerNode } from '../../../types/maps';

interface BuyerMapCardProps {
  buyer: BuyerNode;
  onOpenMarketplace: () => void;
  onSubmitOffer?: (buyer: BuyerNode) => void;
}

export const BuyerMapCard: React.FC<BuyerMapCardProps> = ({
  buyer,
  onOpenMarketplace,
  onSubmitOffer,
}) => {
  const urgencyVariant =
    buyer.urgency === 'Immediate' ? 'outline-danger' :
    buyer.urgency === 'Within 30 days' ? 'outline-warning' :
    'neutral';

  return (
    <div className="flex flex-col h-full text-[13px]">
      {/* Header */}
      <div className="pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[15px] text-[var(--ink)] leading-snug">
            {buyer.name}
          </h3>
          {buyer.verified && (
            <Badge variant="outline-success" icon={<CheckCircle2 className="w-3 h-3 text-[var(--status-success)]" />}>
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>{buyer.organisation}</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[var(--text-secondary)] mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2E8B57]" />
          <span>{buyer.location}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 py-3 border-b border-[var(--border-subtle)]">
        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Demand Volume
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            {buyer.requiredTonnes.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">tonnes</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Acceptable Purity
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            ≥ {buyer.minPurity}%{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">CO₂</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Target Budget
          </span>
          <span className="text-[14px] font-bold text-[var(--ink)]">
            ₹{buyer.maxBudgetPerTon.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[var(--text-secondary)]">/ ton</span>
          </span>
        </div>

        <div className="bg-[var(--surface-muted)] p-2.5 rounded-[var(--radius-md)]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
            Timeline
          </span>
          <Badge variant={urgencyVariant} className="text-[11px] px-2 py-0">
            {buyer.urgency}
          </Badge>
        </div>
      </div>

      {/* Additional details */}
      <div className="py-3 space-y-2 text-[12px] border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Application & End-Use</span>
          <span className="font-medium text-[var(--ink)]">{buyer.application}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Active Tenders</span>
          <span className="font-semibold text-[var(--ink)]">
            {buyer.activeRequirements} open {buyer.activeRequirements === 1 ? 'requirement' : 'requirements'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 mt-auto flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center"
          onClick={() => onSubmitOffer ? onSubmitOffer(buyer) : onOpenMarketplace()}
        >
          Submit Supply Offer
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          onClick={onOpenMarketplace}
        >
          View Buyer Requirements
        </Button>
      </div>
    </div>
  );
};
