import React, { useState } from 'react';
import { Modal } from '../ui/Overlays';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/FormControls';
import type { SupplyListing, DemandRequirement } from '../../types/marketplace';
import { PurityTierBadge } from './PurityTierBadge';
import { ShieldCheck } from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: SupplyListing | null;
  requirement?: DemandRequirement | null;
  onConfirm: (data: any) => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  listing,
  requirement,
  onConfirm,
}) => {
  const [volume, setVolume] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [transportMode, setTransportMode] = useState('ISO Rail Tanker');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!listing && !requirement) return null;

  const isSupplyMode = Boolean(listing);
  const title = isSupplyMode
    ? `Request CO₂ Offtake: ${listing?.companyName}`
    : `Submit Supply Offer to ${requirement?.buyerCompanyName}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm({
        targetId: listing ? listing.id : requirement?.id,
        volume: volume || (listing ? listing.availableQuantity : requirement?.quantityNeeded),
        transportMode,
        deliveryDate,
        notes,
      });
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isSupplyMode ? 'Submit CO₂ Offtake Request' : 'Commit Supply Offer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Summary Card */}
        {listing && (
          <div className="p-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                {listing.facilityType}
              </span>
              <span className="text-[14px] font-semibold text-[var(--accent-primary)]">
                ₹{listing.pricePerTon.toLocaleString()}/t
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="type-data-stat text-[18px] text-[var(--text-primary)]">
                {listing.purity}% Purity
              </span>
              <PurityTierBadge purity={listing.purity} showUpgradeNote={true} />
            </div>
            <div className="text-[11px] text-[var(--text-secondary-accessible)]">
              Location: {listing.location} ({listing.distanceKm} km) • Window: {listing.availabilityWindow}
            </div>
          </div>
        )}

        {requirement && (
          <div className="p-3.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                Target: {requirement.application}
              </span>
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                Max Budget: ₹{requirement.maxPricePerTon.toLocaleString()}/t
              </span>
            </div>
            <div className="text-[12px] text-[var(--text-secondary-accessible)]">
              Volume: <strong>{requirement.quantityNeeded.toLocaleString()} t</strong> • Min Purity: <strong>≥{requirement.minPurityRequired}%</strong>
            </div>
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Requested Volume (Tonnes)"
            type="number"
            placeholder={listing ? `${listing.availableQuantity}` : `${requirement?.quantityNeeded}`}
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            helperText="Custom lot or full batch"
          />

          <Select
            label="Logistics & Transport Mode"
            options={[
              { label: 'ISO Rail Tanker (Chilled)', value: 'ISO Rail Tanker' },
              { label: 'Dedicated Cryogenic Truck', value: 'Cryogenic Truck' },
              { label: 'Pipeline Interconnect', value: 'Pipeline' },
              { label: 'Coastal Marine Barge', value: 'Marine Barge' },
            ]}
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
          />
        </div>

        <Input
          label="Desired Dispatch / Delivery Date"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />

        <Textarea
          label="Offtake Terms or Technical Custody Requirements"
          placeholder="Specify unloading pressure, moisture threshold (<5 ppm), or rail siding clearance..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary-accessible)] pt-1">
          <ShieldCheck className="w-4 h-4 text-[var(--status-success)] shrink-0" />
          <span>Offers on CarbonFlow are governed by ISO-14064 direct verification & escrow guarantee.</span>
        </div>
      </form>
    </Modal>
  );
};
