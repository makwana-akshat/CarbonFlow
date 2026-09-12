import React from 'react';
import {
  Factory,
  Snowflake,
  Train,
  Truck,
  Ship,
  GitCommit,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { TagChip } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { RecommendationItem, RouteStep, UserRole } from '../../types/dashboard';

interface RecommendedMatchesProps {
  items: RecommendationItem[];
  userRole: UserRole;
  onViewRecommendation: (item: RecommendationItem) => void;
}

export const RecommendedMatches: React.FC<RecommendedMatchesProps> = ({
  items,
  userRole,
  onViewRecommendation,
}) => {
  const sectionTitle =
    userRole === 'buyer'
      ? 'Recommended Suppliers'
      : userRole === 'supplier'
      ? 'Recommended Offtake Inquiries'
      : 'Top Priority Matched Routes';

  const renderRouteIcon = (type: RouteStep['iconType']) => {
    const iconClass = 'w-3.5 h-3.5';
    switch (type) {
      case 'capture':
        return <Factory className={iconClass} />;
      case 'cryo':
        return <Snowflake className={iconClass} />;
      case 'rail':
        return <Train className={iconClass} />;
      case 'truck':
        return <Truck className={iconClass} />;
      case 'pipeline':
        return <GitCommit className={iconClass} />;
      case 'terminal':
        return <Ship className={iconClass} />;
      default:
        return <GitCommit className={iconClass} />;
    }
  };

  return (
    <section aria-labelledby="recommended-matches-heading" className="w-full">
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
          {items.length} vetted candidates
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-5 sm:p-6 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-neutral-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              
              {/* Left Column: Company, Badges, Facility */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-[17px] font-semibold text-[var(--text-primary)] tracking-tight">
                    {item.companyName}
                  </h3>

                  {/* Colored Pill Badges as requested */}
                  {item.isBestMatch && (
                    <span className="inline-flex items-center gap-1 bg-[var(--accent-primary)] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-[var(--radius-pill)] shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      Best Match
                    </span>
                  )}

                  {item.isVerified && (
                    <span className="inline-flex items-center gap-1 border border-[var(--status-success)] text-[var(--status-success)] text-[11px] font-semibold px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[#34C77B]/5">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}

                  <TagChip label={item.co2Grade} />
                </div>

                <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary-accessible)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                  <span>{item.facilityType}</span>
                  <span className="text-[var(--border-subtle)]">|</span>
                  <span className="text-[var(--text-secondary)]">{item.location}</span>
                </div>

                {/* Shipment route / status icon row (Terminal style) */}
                <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider shrink-0">
                    Route Flow:
                  </span>
                  <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-[var(--radius-chip)] bg-[var(--surface-muted)] border border-[var(--border-subtle)]/70">
                    {item.routeSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div
                          className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-primary)] shrink-0"
                          title={step.label}
                        >
                          <span className="text-[var(--text-secondary-accessible)]">
                            {renderRouteIcon(step.iconType)}
                          </span>
                          <span className="hidden md:inline">{step.label}</span>
                        </div>
                        {idx < item.routeSteps.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-[var(--text-secondary)] shrink-0 opacity-60" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

              </div>

              {/* Middle: Logistics, Volume, Price Specs */}
              <div className="flex items-center gap-6 sm:gap-8 border-y lg:border-y-0 lg:border-x border-[var(--border-subtle)] py-3 lg:py-0 lg:px-8 shrink-0">
                <div>
                  <div className="type-label text-[var(--text-secondary)] uppercase tracking-wider">
                    Contract Vol
                  </div>
                  <div className="text-[16px] font-semibold text-[var(--text-primary)] mt-0.5">
                    {item.volume}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary-accessible)]">
                    {item.transportMode}
                  </div>
                </div>

                <div>
                  <div className="type-label text-[var(--text-secondary)] uppercase tracking-wider">
                    Unit Price
                  </div>
                  <div className="text-[16px] font-semibold text-[var(--text-primary)] mt-0.5">
                    {item.pricePerTon}
                  </div>
                  <div className="text-[11px] text-[var(--status-success)] font-medium">
                    Fixed Escrow
                  </div>
                </div>
              </div>

              {/* Right Column: Match-% bold stat + Dark Filled Pill Button */}
              <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-3 shrink-0">
                <div className="text-left lg:text-right">
                  <div className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight">
                    {item.matchScore}%
                  </div>
                  <div className="type-label text-[var(--text-secondary-accessible)]">
                    System Match
                  </div>
                </div>

                <Button
                  variant={item.isBestMatch ? 'primary' : 'pill-dark'}
                  size="md"
                  withArrow
                  onClick={() => onViewRecommendation(item)}
                >
                  View Recommendation
                </Button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
