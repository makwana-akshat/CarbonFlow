import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Download
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { RecommendationItem } from '../../types/dashboard';

interface RecommendationDrawerProps {
  item: RecommendationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOfftake: (item: RecommendationItem) => void;
}

export const RecommendationDrawer: React.FC<RecommendationDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmOfftake
}) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-xl bg-[var(--bg)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 bg-[var(--surface-card)] border-b border-[var(--border-subtle)] sticky top-0 z-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-0.5 rounded-[var(--radius-pill)]">
                      {item.matchScore}% Match Index
                    </span>
                    {item.isVerified && (
                      <Badge variant="outline-success">
                        Verified Facility
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">
                    {item.companyName}
                  </h2>
                  <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-0.5">
                    {item.facilityType} • {item.location}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Core Commercial Specs */}
                <div className="bg-[var(--surface-card)] p-5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-xs">
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)] mb-3">
                    Commercial Contract Terms
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="type-label text-[var(--text-secondary)] block">Offtake Rate</span>
                      <span className="text-[17px] font-semibold text-[var(--text-primary)]">{item.volume}</span>
                    </div>
                    <div>
                      <span className="type-label text-[var(--text-secondary)] block">Unit Pricing</span>
                      <span className="text-[17px] font-semibold text-[var(--text-primary)]">{item.pricePerTon}</span>
                    </div>
                    <div>
                      <span className="type-label text-[var(--text-secondary)] block">Purity Assay</span>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{item.purity}</span>
                    </div>
                    <div>
                      <span className="type-label text-[var(--text-secondary)] block">Transport Mode</span>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{item.transportMode}</span>
                    </div>
                  </div>
                </div>

                {/* Logistics Route Chain */}
                <div className="bg-[var(--surface-card)] p-5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)]">
                      Custody Transfer Chain
                    </h3>
                    <span className="text-[11px] font-medium text-[var(--status-success)]">
                      {item.deliveryTimeline}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {item.routeSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] flex items-center justify-center text-xs font-semibold shrink-0 border border-[var(--border-subtle)]">
                          {idx + 1}
                        </div>
                        <div className="flex-1 text-[13px] font-medium text-[var(--text-primary)]">
                          {step.label}
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)] uppercase">
                          {step.iconType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance & Verification */}
                <div className="bg-[var(--surface-card)] p-5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-xs space-y-3">
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary-accessible)]">
                    Audit & Regulatory Verification
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[13px] text-[var(--text-primary)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--status-success)] shrink-0" />
                    <span>Compliance: <strong>{item.certification}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-[13px] text-[var(--text-primary)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span>Source Method: <strong>{item.co2Source}</strong> (Direct Net-Negative Ledger)</span>
                  </div>

                  <button
                    onClick={() => alert('Downloading verified laboratory assay certificate...')}
                    className="w-full mt-2 py-2 px-3 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] hover:bg-[var(--border-subtle)] text-[12px] font-medium text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cryptographic Assay Certificate (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Footer CTAs */}
              <div className="p-6 bg-[var(--surface-card)] border-t border-[var(--border-subtle)] sticky bottom-0 flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={onClose}
                >
                  Dismiss
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  withArrow
                  onClick={() => {
                    onConfirmOfftake(item);
                    onClose();
                  }}
                >
                  Initiate Agreement
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
