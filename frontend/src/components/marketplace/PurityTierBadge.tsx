import React from 'react';
import { Badge } from '../ui/Badge';
import { Sparkles, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PurityTierBadgeProps {
  purity: number; // e.g. 98.7
  showUpgradeNote?: boolean;
}

export interface PurityAnalysis {
  tierName: 'Liquefaction-ready' | 'Pipeline-ready' | 'EOR-ready' | 'Needs upgrade';
  variant: 'outline-success' | 'outline-warning' | 'neutral';
  nextTier?: 'Liquefaction' | 'Pipeline' | 'EOR';
  upgradeCost?: number; // ₹/t
}

export function analyzePurityTier(purity: number): PurityAnalysis {
  if (purity >= 99.0) {
    return {
      tierName: 'Liquefaction-ready',
      variant: 'outline-success',
    };
  } else if (purity >= 97.0) {
    // 97% to 98.9% meets pipeline standard
    const gap = 99.0 - purity;
    const estimatedCost = Math.round(gap * 1400); // e.g. 0.3% gap -> +₹420/t
    return {
      tierName: 'Pipeline-ready',
      variant: 'outline-success',
      nextTier: 'Liquefaction',
      upgradeCost: estimatedCost,
    };
  } else if (purity >= 96.0) {
    // 96% to 96.9% meets EOR standard
    const gap = 97.0 - purity;
    const estimatedCost = Math.round(gap * 1100 + 400);
    return {
      tierName: 'EOR-ready',
      variant: 'neutral',
      nextTier: 'Pipeline',
      upgradeCost: estimatedCost,
    };
  } else {
    const gap = 96.0 - purity;
    const estimatedCost = Math.round(gap * 1200 + 600);
    return {
      tierName: 'Needs upgrade',
      variant: 'outline-warning',
      nextTier: 'EOR',
      upgradeCost: estimatedCost,
    };
  }
}

export const PurityTierBadge: React.FC<PurityTierBadgeProps> = ({
  purity,
  showUpgradeNote = true,
}) => {
  const analysis = analyzePurityTier(purity);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Tier Badge */}
      {analysis.tierName === 'Liquefaction-ready' ? (
        <Badge variant="outline-success" icon={<Sparkles className="w-3 h-3 text-[var(--status-success)]" />}>
          Liquefaction-ready
        </Badge>
      ) : analysis.tierName === 'Pipeline-ready' ? (
        <Badge variant="outline-success" icon={<CheckCircle2 className="w-3 h-3 text-[var(--status-success)]" />}>
          Pipeline-ready
        </Badge>
      ) : analysis.tierName === 'EOR-ready' ? (
        <Badge variant="neutral" icon={<CheckCircle2 className="w-3 h-3 text-[var(--text-secondary)]" />}>
          EOR-ready
        </Badge>
      ) : (
        <Badge variant="outline-warning" icon={<AlertTriangle className="w-3 h-3 text-[var(--status-warning)]" />}>
          Needs upgrade
        </Badge>
      )}

      {/* Platform Core Differentiator: Gap and Upgrade Cost Note */}
      {showUpgradeNote && analysis.nextTier && analysis.upgradeCost && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-pill)] bg-[#F5A623]/15 text-[var(--text-primary)] border border-[#F5A623]/40 text-[11px] font-semibold"
          title={`Polishing & purification cost to achieve ${analysis.nextTier} grade specification`}
        >
          <ArrowUpRight className="w-3 h-3 text-[var(--status-warning)] stroke-[2.5]" />
          <span>+₹{analysis.upgradeCost}/t to reach {analysis.nextTier}</span>
        </span>
      )}
    </div>
  );
};
