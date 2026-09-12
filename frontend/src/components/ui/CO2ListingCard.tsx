import React from 'react';
import { MapPin, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '../../lib/utils';
import { Badge } from './Badge';
import { Button } from './Button';
import { PurityPlate } from './purity-plate';
import type { PurityTier } from './listing-card';

export interface CO2ListingCardProps {
  name: string;
  verified: boolean;
  sourceDescription: string;
  sourceType: string;
  purity: number;
  physicalState: "Liquefied" | "Compressed" | "Gas";
  purityTier: PurityTier;
  availableVolume: number;
  spotPrice: number;
  location: string;
  distanceKm: number;
  dispatchWindow: string;
  matchPercentage?: number;
  onViewMap: () => void;
  onRequest: () => void;
  className?: string;
}

const CO2ListingCard = React.forwardRef<HTMLDivElement, CO2ListingCardProps>(
  (
    {
      name,
      verified,
      sourceDescription,
      sourceType,
      purity,
      physicalState,
      purityTier,
      availableVolume,
      spotPrice,
      location,
      distanceKm,
      dispatchWindow,
      matchPercentage,
      onViewMap,
      onRequest,
      className,
    },
    ref
  ) => {
    // Helper to format INR currency
    const formatCurrency = (amount: number | undefined | null) => {
      if (amount === undefined || amount === null || Number.isNaN(amount)) {
        return 'N/A';
      }
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as any } },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'w-full flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 text-[var(--text-primary)] shadow-[var(--shadow-card)] font-sans hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-subtle)] transition-all duration-200',
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col flex-1 space-y-5">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-semibold text-[16px] leading-tight tracking-tight text-[var(--ink)]">
              {name}
            </h2>
            {verified && (
              <Badge variant="outline-success" className="shrink-0">
                Verified
              </Badge>
            )}
          </div>

          {/* Source Description */}
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-[14px] font-medium text-[var(--ink)]">
              {sourceDescription}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[var(--text-secondary-accessible)]">
                &bull; {sourceType}
              </span>
              {physicalState && (
                <span className="text-[12px] text-[var(--text-secondary-accessible)]">
                  &bull; {physicalState}
                </span>
              )}
              {matchPercentage && (
                <>
                  <span className="text-[12px] text-[var(--border-subtle)]">|</span>
                  <span className="text-[12px] font-semibold text-[var(--status-success)]">
                    {matchPercentage}% Match
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Functional Tier-Coded Gradient Purity Plate */}
          <PurityPlate purity={purity} tier={purityTier} className="my-1" />

          {/* Commercial Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-medium text-[var(--text-secondary-accessible)] mb-1">Available Volume</p>
              <p className="text-[16px] font-semibold text-[var(--ink)]">
                {availableVolume.toLocaleString()} t
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[var(--text-secondary-accessible)] mb-1">Spot Price</p>
              <p className="text-[16px] font-semibold text-[var(--ink)]">
                {formatCurrency(spotPrice)} <span className="text-[12px] font-normal text-[var(--text-secondary-accessible)]">/ t</span>
              </p>
            </div>
          </div>

          {/* Logistics Information */}
          <div className="space-y-2.5 mt-1">
            <div className="flex items-start gap-2.5 text-[13px]">
              <MapPin className="h-4 w-4 text-[var(--text-secondary-accessible)] shrink-0 mt-0.5" />
              <div>
                <span className="text-[var(--ink)]">{location}</span>
                <span className="font-semibold text-[var(--ink)] block mt-0.5">({distanceKm} km away)</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-[13px]">
              <CalendarDays className="h-4 w-4 text-[var(--text-secondary-accessible)] shrink-0" />
              <span className="text-[var(--text-secondary-accessible)]">Window: <span className="font-medium text-[var(--ink)]">{dispatchWindow}</span></span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {/* Footer Divider */}
          <hr className="mb-4 border-[var(--border-subtle)]" />

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3">
            <Button 
              variant="ghost" 
              onClick={onViewMap} 
              className="text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] hover:bg-transparent p-0 h-auto font-medium text-[13px]"
            >
              View on Map
            </Button>
            <Button 
              variant="pill-dark" 
              onClick={onRequest} 
              className="rounded-[var(--radius-pill)] bg-[var(--ink)] text-white hover:bg-[var(--ink)]/90 px-4 py-2 text-[13px] shadow-sm font-semibold whitespace-nowrap shrink-0"
            >
              Request CO₂
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
);

CO2ListingCard.displayName = 'CO2ListingCard';

export { CO2ListingCard, CO2ListingCard as ListingCard };
export type { PurityTier };
