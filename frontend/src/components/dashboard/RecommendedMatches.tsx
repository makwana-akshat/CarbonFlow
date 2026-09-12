import React, { useState } from 'react';
import { ChevronRight, SlidersHorizontal, Sparkles, CheckCircle2 } from 'lucide-react';
import { TagChip, Badge } from '../ui/Badge';
import { EmptyState, Skeleton } from '../ui/Feedback';
import { MatchScoreBar } from './MatchScoreBar';
import type { RecommendationItem, UserRole } from '../../types/dashboard';

interface RecommendedMatchesProps {
  items: RecommendationItem[];
  userRole: UserRole;
  onViewRecommendation: (item: RecommendationItem) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export const RecommendedMatches: React.FC<RecommendedMatchesProps> = ({
  items,
  userRole,
  onViewRecommendation,
  onResetFilters,
  isLoading = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);

  const activeItem = items.find((i) => i.id === selectedId) || items[0];

  const sectionTitle =
    userRole === 'buyer'
      ? 'Recommended Suppliers'
      : userRole === 'supplier'
      ? 'Recommended Offtake Inquiries'
      : 'Top Priority Matched Routes';

  const handleRowClick = (item: RecommendationItem) => {
    setSelectedId(item.id);
    onViewRecommendation(item);
  };

  // Helper to extract clean purity percentage string
  const formatPurity = (purityStr?: string) => {
    if (!purityStr) return '99.9% Purity';
    const match = purityStr.match(/\d+(\.\d+)?%/);
    return match ? `${match[0]} Purity` : purityStr.split(' ')[0];
  };

  // Helper to get clean segment string
  const formatSegment = (item: RecommendationItem) => {
    if (item.segment) return item.segment.toUpperCase();
    const source = item.co2Source || (item as any).co2_source;
    if (source) return String(source).toUpperCase();
    const grade = item.co2Grade || (item as any).co2_grade;
    if (grade?.toLowerCase().includes('food')) return 'FOOD-GRADE';
    return 'DAC';
  };

  // 1. Loading State: Skeleton list rows matching row height
  if (isLoading) {
    return (
      <section aria-labelledby="recommended-matches-heading" className="w-full space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Skeleton width={220} height={24} />
            <Skeleton width={420} height={16} />
          </div>
          <Skeleton width={130} height={20} className="hidden sm:inline-block" />
        </div>

        <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] divide-y divide-[var(--border-subtle)] overflow-hidden">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="py-5 px-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton width={28} height={20} />
                <div className="space-y-2 flex-1 max-w-sm">
                  <Skeleton width={180} height={18} />
                  <div className="flex gap-2">
                    <Skeleton width={70} height={20} circle={false} />
                    <Skeleton width={60} height={20} circle={false} />
                    <Skeleton width={80} height={20} circle={false} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton width={50} height={22} />
                <Skeleton width={16} height={16} circle />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 2. Empty State: matches "0 matched"
  if (items.length === 0) {
    return (
      <section aria-labelledby="recommended-matches-heading" className="w-full space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="recommended-matches-heading" className="type-heading text-[var(--text-primary)]">
              {sectionTitle}
            </h2>
            <p className="type-body text-[13px] text-[var(--text-secondary-accessible)]">
              Algorithmic offtake matching based on chemical purity, carbon intensity, and intermodal transport latency.
            </p>
          </div>
          <span className="type-label text-[var(--text-secondary)] hidden sm:inline-block">
            0 vetted candidates
          </span>
        </div>

        <EmptyState
          icon={<SlidersHorizontal className="w-7 h-7 text-[var(--text-secondary)] stroke-[1.5]" />}
          title="No suppliers match these filters yet"
          description="Try widening your segment, purity, or distance range"
          ctaLabel="Adjust filters"
          onCtaClick={onResetFilters}
          className="border-dashed"
        />
      </section>
    );
  }

  // 3. Matched List Rows & Breakdown
  return (
    <section aria-labelledby="recommended-matches-heading" className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 id="recommended-matches-heading" className="type-heading text-[var(--text-primary)]">
            {sectionTitle}
          </h2>
          <p className="type-body text-[13px] text-[var(--text-secondary-accessible)]">
            Algorithmic offtake matching based on chemical purity, carbon intensity, and intermodal transport latency.
          </p>
        </div>
        <span className="type-label text-[var(--text-secondary)] hidden sm:inline-block">
          {items.length} vetted candidates
        </span>
      </div>

      {/* List-Row Container */}
      <div className="bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] divide-y divide-[var(--border-subtle)] overflow-hidden">
        {items.map((item, index) => {
          const rankNumber = String(index + 1).padStart(2, '0');
          const isSelected = item.id === activeItem?.id;

          return (
            <div
              key={item.id}
              onClick={() => handleRowClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRowClick(item);
                }
              }}
              className={`py-4.5 sm:py-5 px-4 sm:px-6 transition-all cursor-pointer group select-none ${
                isSelected
                  ? 'bg-[var(--surface-muted)]/60'
                  : 'hover:bg-[var(--surface-muted)]/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-6">
                
                {/* Left Side: Rank, Company Name, and Row of TagChips */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Rank Indicator (01, 02, 03...) */}
                  <span className="text-[14px] font-mono font-bold text-[var(--text-secondary)] w-6 shrink-0 pt-0.5 sm:pt-0">
                    {rankNumber}
                  </span>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 flex-1 min-w-0">
                    {/* Company Name + Badges */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className="text-[15px] sm:text-[16px] font-bold text-[var(--ink)] tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                        {item.companyName || (item as any).company_name}
                      </span>

                      {Boolean(item.isBestMatch ?? (item as any).is_best_match) && (
                        <span className="inline-flex items-center gap-1 bg-[var(--accent-primary)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] shadow-2xs">
                          <Sparkles className="w-2.5 h-2.5" />
                          Top Pick
                        </span>
                      )}

                      {Boolean(item.isVerified ?? (item as any).is_verified) && (
                        <Badge variant="outline-success" className="text-[10px] py-0 px-2">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Row of TagChips: purity %, distance, price/tonne, segment */}
                    {/* On mobile: stacks into second line */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5 lg:pt-0">
                      <TagChip label={formatPurity(item.purity)} />
                      <TagChip label={item.distance || '182 km'} />
                      <TagChip label={item.pricePerTon || (item as any).price_per_ton || '$39.20/t'} />
                      <TagChip label={formatSegment(item)} />
                    </div>
                  </div>
                </div>

                {/* Right Side: Match score bold stat + small chevron/arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center pl-9 sm:pl-0">
                  <div className="text-right">
                    <span className="text-[17px] sm:text-[18px] font-bold text-[var(--ink)] font-mono tracking-tight">
                      {item.matchScore ?? (item as any).match_score}%
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary-accessible)] block -mt-1 tracking-wider">
                      Match Index
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[var(--surface-muted)] group-hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] group-hover:text-[var(--ink)] flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* MatchScoreBar breakdown for the selected/top match below the list */}
      {activeItem && <MatchScoreBar item={activeItem} />}
    </section>
  );
};
export default RecommendedMatches;
