import React from 'react';
import { Card } from '../ui/Card';
import { Badge, TagChip } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { DemandRequirement } from '../../types/marketplace';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface RequirementCardProps {
  requirement: DemandRequirement;
  onSubmitOffer: (requirement: DemandRequirement) => void;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  onSubmitOffer,
}) => {
  return (
    <Card hoverable padding="md" className="flex flex-col justify-between h-full space-y-4">
      
      {/* Header: Buyer Company Name + Application Type Badge */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="type-heading text-[17px] font-semibold text-[var(--text-primary)] leading-snug">
            {requirement.buyerCompanyName}
          </h3>
          {requirement.isUrgent ? (
            <Badge variant="filled-accent" icon={<Clock className="w-3 h-3" />}>
              Urgent Offtake
            </Badge>
          ) : (
            <TagChip label={requirement.application} />
          )}
        </div>
        <p className="type-body text-[12px] text-[var(--text-secondary-accessible)]">
          Industry: <span className="font-medium text-[var(--text-primary)]">{requirement.industry}</span> • {requirement.offtakeFrequency}
        </p>
      </div>

      {/* Specifications Block: Quantity, Min Purity, Max Price */}
      <div className="p-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)]/70 border border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="type-label text-[var(--text-secondary)] block text-[11px]">Needed</span>
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">
            {requirement.quantityNeeded.toLocaleString()} t
          </span>
        </div>

        <div>
          <span className="type-label text-[var(--text-secondary)] block text-[11px]">Min Purity</span>
          <span className="text-[15px] font-semibold text-[var(--status-success)]">
            ≥{requirement.minPurityRequired}%
          </span>
        </div>

        <div>
          <span className="type-label text-[var(--text-secondary)] block text-[11px]">Max Price</span>
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">
            ₹{requirement.maxPricePerTon.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Sourcing Radius & Required-By Date */}
      <div className="space-y-1.5 py-1 text-left border-y border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary-accessible)]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
          <span className="truncate">{requirement.location}</span>
          <span className="font-semibold text-[var(--text-primary)] shrink-0">
            (max {requirement.maxDistanceKm} km radius)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
          <span>Required by: <strong className="text-[var(--text-primary)]">{requirement.requiredByDate}</strong></span>
        </div>
      </div>

      {/* Primary Action: Submit Offer */}
      <div className="pt-1">
        <Button
          variant="pill-dark"
          size="md"
          fullWidth
          onClick={() => onSubmitOffer(requirement)}
        >
          Submit Offer
        </Button>
      </div>

    </Card>
  );
};
