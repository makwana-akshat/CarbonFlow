import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import type { AiInsight } from '../../types/dashboard';

interface AiInsightCardProps {
  insight: AiInsight;
  onApplyInsight?: () => void;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({
  insight,
  onApplyInsight
}) => {
  return (
    <section aria-label="Operational AI Insight">
      <div className="relative rounded-[var(--radius-card)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] border-l-4 border-l-[var(--accent-primary)] p-5 sm:p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-sm">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="type-label text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                  CarbonFlow Intelligence
                </span>
                <span className="text-[var(--border-subtle)]">•</span>
                <span className="text-[12px] font-medium text-[var(--text-secondary-accessible)]">
                  {insight.headline}
                </span>
              </div>
              
              {/* One-sentence insight text */}
              <p className="text-[15px] font-medium text-[var(--text-primary)] leading-relaxed">
                {insight.insight}
              </p>
            </div>
          </div>

          {/* Action pill buttons: secondary and default pill-dark */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center pl-11 md:pl-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert(`Reviewing accounting details...`)}
            >
              {insight.secondaryCta}
            </Button>

            <Button
              variant="pill-dark"
              size="sm"
              withArrow
              onClick={() => {
                if (onApplyInsight) onApplyInsight();
                alert(`Applying AI Optimization: ${insight.primaryCta}`);
              }}
            >
              {insight.primaryCta}
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
};
