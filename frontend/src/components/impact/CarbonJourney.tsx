import React from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { ArrowRight, ArrowDown, ChevronRight, Info } from 'lucide-react';
import type { JourneyStage } from '../../types/impact';

export const CarbonJourney: React.FC = () => {
  const { journeyStages, selectStage } = useCarbonImpact();

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-6">
      {/* Header with Title and Narrative */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] tracking-tight">
              CO₂ Journey
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border border-[var(--border-subtle)]">
              Custody Transfer Flow
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-0.5">
            Follow carbon through each stage of the CarbonFlow network — click any stage to inspect transaction audit details.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-[11px] text-[var(--text-secondary)] font-mono">
          <span>MASS BALANCE YIELD:</span>
          <span className="font-bold text-[var(--ink)]">66.4% NET UTILIZED</span>
        </div>
      </div>

      {/* Process Flow: Horizontal on Desktop (lg:), Vertical on Mobile */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-3 lg:gap-2">
        {journeyStages.map((stage: JourneyStage, idx: number) => {
          const isLast = idx === journeyStages.length - 1;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Card */}
              <div
                onClick={() => selectStage(stage.id)}
                className="flex-1 p-4 rounded-[var(--radius-card)] bg-[var(--surface-muted)]/50 hover:bg-[var(--surface-muted)] border border-[var(--border-subtle)] hover:border-[var(--ink)]/30 transition-all cursor-pointer group flex flex-col justify-between space-y-3 relative select-none"
              >
                {/* Stage Step Badge & Inspect Icon */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--accent-primary)] uppercase">
                    STAGE 0{stage.order}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--ink)] flex items-center gap-0.5 transition-colors">
                    <Info className="w-3 h-3" />
                    <span>Inspect</span>
                  </span>
                </div>

                {/* Stage Title & Big Volume */}
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[var(--ink)]">
                    {stage.name}
                  </h3>
                  <div className="text-xl sm:text-2xl font-extrabold text-[var(--ink)] font-mono tracking-tight mt-0.5">
                    {stage.formattedTonnes}
                  </div>
                </div>

                {/* Supporting headline spec */}
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1 text-[11px]">
                  <div className="font-semibold text-[var(--ink)] flex items-center justify-between">
                    <span>{stage.headlineStats}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary-accessible)] leading-snug line-clamp-2">
                    {stage.tagline}
                  </p>
                </div>
              </div>

              {/* Connector between Stages */}
              {!isLast && (
                <div className="flex lg:flex-col items-center justify-center py-1 lg:py-0 px-2 lg:px-1 shrink-0 text-[var(--text-secondary)]">
                  {/* Desktop connector (horizontal with conversion pill) */}
                  <div className="hidden lg:flex flex-col items-center gap-1">
                    {stage.conversionPercent !== undefined && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xs text-[var(--ink)]">
                        {stage.conversionPercent}%
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>

                  {/* Mobile connector (vertical with conversion pill) */}
                  <div className="flex lg:hidden items-center justify-center gap-2 w-full py-1">
                    <ArrowDown className="w-4 h-4 text-[var(--text-secondary)]" />
                    {stage.conversionPercent !== undefined && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xs text-[var(--ink)]">
                        {stage.conversionPercent}% conversion
                      </span>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
