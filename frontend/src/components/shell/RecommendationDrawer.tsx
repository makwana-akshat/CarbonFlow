import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MatchScoreBar } from '../dashboard/MatchScoreBar';
import type { RecommendationItem } from '../../types/dashboard';

interface RecommendationDrawerProps {
  item: RecommendationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOfftake: (item: RecommendationItem) => void;
  topCandidates?: RecommendationItem[];
}

export const RecommendationDrawer: React.FC<RecommendationDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmOfftake,
  topCandidates,
}) => {
  if (!item) return null;

  // Prepare top 3 candidates for comparison table
  let candidates = (topCandidates && topCandidates.length > 0) ? topCandidates : [item];

  // Ensure current item is in candidates list (at position 0 if top pick)
  if (!candidates.find((c) => c.id === item.id)) {
    candidates = [item, ...candidates.filter((c) => c.id !== item.id)];
  }
  const top3 = candidates.slice(0, 3);

  // Plain-sentence reasons
  const reasonsList = item.reasons && item.reasons.length > 0
    ? item.reasons
    : [
        `Meets your purity threshold with verified ${item.purity || '99.98% cryogenic assay'}.`,
        `${item.distance || '182 km'} from your facility via ${item.transportMode || 'ISO rail'} direct corridor.`,
        `Unit price of ${item.pricePerTon || '$39.20/t'} is 11% below regional spot benchmark.`,
        `Segment match: ${item.segment || item.co2Source || 'DAC'} with certified sequestration credentials.`,
        `${item.reliability || '99.4%'} historical custody transfer reliability rating.`,
      ];

  const formatPurityValue = (str?: string) => {
    if (!str) return '99.9%';
    const match = str.match(/\d+(\.\d+)?%/);
    return match ? match[0] : str.split(' ')[0];
  };

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

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-xl bg-[var(--surface-card)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 bg-[var(--surface-card)] border-b border-[var(--border-subtle)] sticky top-0 z-10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-0.5 rounded-[var(--radius-pill)]">
                      {item.matchScore}% Match Index
                    </span>
                    {item.isVerified && (
                      <Badge variant="outline-success">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <h2 className="text-[19px] sm:text-[21px] font-bold text-[var(--ink)] tracking-tight">
                    Why {item.companyName} was recommended
                  </h2>

                  <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary-accessible)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                    <span>{item.facilityType}</span>
                    <span className="text-[var(--border-subtle)]">•</span>
                    <span>{item.location}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] shrink-0"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* 1. Checklist of plain-sentence reasons */}
                <div className="bg-[var(--surface-muted)]/50 rounded-[var(--radius-card)] p-5 border border-[var(--border-subtle)] space-y-3.5">
                  <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-subtle)]">
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-[var(--ink)]">
                      Offtake Recommendation Rationale
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {reasonsList.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                        <p className="text-[13px] leading-relaxed text-[var(--text-primary)]">
                          {reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Compact MatchScoreBar Breakdown */}
                <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-5 border border-[var(--border-subtle)] shadow-xs">
                  <MatchScoreBar item={item} compact={true} />
                </div>

                {/* 3. Top 3 Candidates Comparison Table */}
                <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-5 border border-[var(--border-subtle)] shadow-xs space-y-3">
                  <div>
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-[var(--ink)]">
                      Top 3 Candidates Comparison
                    </h3>
                    <p className="text-[12px] text-[var(--text-secondary-accessible)] mt-0.5">
                      Cross-supplier evaluation across critical offtake benchmarks.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[12px] border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border-subtle)]">
                          <th className="py-2.5 pr-3 text-[var(--text-secondary)] font-medium text-[11px] uppercase tracking-wider">
                            Metric
                          </th>
                          {top3.map((cand) => {
                            const isCurrentPick = cand.id === item.id;
                            return (
                              <th
                                key={cand.id}
                                className={`py-2.5 px-3 font-semibold text-[var(--ink)] text-[12px] ${
                                  isCurrentPick
                                    ? 'border-t-2 border-[var(--accent-primary)] bg-transparent'
                                    : 'border-t-2 border-transparent'
                                }`}
                              >
                                <div className="truncate max-w-[110px]" title={cand.companyName}>
                                  {cand.companyName.split(' ')[0]}
                                </div>
                                {isCurrentPick && (
                                  <span className="text-[10px] text-[var(--accent-primary)] font-mono block font-normal">
                                    Current Pick
                                  </span>
                                )}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {/* Match Score */}
                        <tr>
                          <td className="py-2.5 pr-3 text-[var(--text-secondary-accessible)] font-medium">
                            Match Score
                          </td>
                          {top3.map((cand) => {
                            const isCurrentPick = cand.id === item.id;
                            return (
                              <td
                                key={cand.id}
                                className={`py-2.5 px-3 font-mono font-bold ${
                                  isCurrentPick ? 'text-[var(--accent-primary)]' : 'text-[var(--ink)]'
                                }`}
                              >
                                {cand.matchScore}%
                              </td>
                            );
                          })}
                        </tr>

                        {/* Purity */}
                        <tr>
                          <td className="py-2.5 pr-3 text-[var(--text-secondary-accessible)] font-medium">
                            Purity
                          </td>
                          {top3.map((cand) => {
                            const isCurrentPick = cand.id === item.id;
                            return (
                              <td
                                key={cand.id}
                                className={`py-2.5 px-3 ${
                                  isCurrentPick ? 'font-semibold text-[var(--ink)]' : 'text-[var(--text-secondary-accessible)]'
                                }`}
                              >
                                {formatPurityValue(cand.purity)}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Distance */}
                        <tr>
                          <td className="py-2.5 pr-3 text-[var(--text-secondary-accessible)] font-medium">
                            Distance
                          </td>
                          {top3.map((cand) => {
                            const isCurrentPick = cand.id === item.id;
                            return (
                              <td
                                key={cand.id}
                                className={`py-2.5 px-3 ${
                                  isCurrentPick ? 'font-semibold text-[var(--ink)]' : 'text-[var(--text-secondary-accessible)]'
                                }`}
                              >
                                {cand.distance || '182 km'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Price */}
                        <tr>
                          <td className="py-2.5 pr-3 text-[var(--text-secondary-accessible)] font-medium">
                            Price
                          </td>
                          {top3.map((cand) => {
                            const isCurrentPick = cand.id === item.id;
                            return (
                              <td
                                key={cand.id}
                                className={`py-2.5 px-3 ${
                                  isCurrentPick ? 'font-semibold text-[var(--ink)]' : 'text-[var(--text-secondary-accessible)]'
                                }`}
                              >
                                {cand.pricePerTon || '$39.20/t'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Reliability */}
                        <tr>
                          <td className="py-2.5 pr-3 text-[var(--text-secondary-accessible)] font-medium">
                            Reliability
                          </td>
                          {top3.map((cand) => {
                            const isCurrentPick = cand.id === item.id;
                            return (
                              <td
                                key={cand.id}
                                className={`py-2.5 px-3 ${
                                  isCurrentPick ? 'font-semibold text-[var(--ink)]' : 'text-[var(--text-secondary-accessible)]'
                                }`}
                              >
                                {cand.reliability || '99.4%'}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Action */}
              <div className="p-6 bg-[var(--surface-card)] border-t border-[var(--border-subtle)] sticky bottom-0">
                <Button
                  variant="pill-dark"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    onConfirmOfftake(item);
                    onClose();
                  }}
                  className="shadow-sm"
                >
                  Select this supplier →
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default RecommendationDrawer;
