import React from 'react';
import { Info } from 'lucide-react';

export const MethodologyFooter: React.FC = () => {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5 text-[12px] text-[var(--text-secondary-accessible)] space-y-2">
      <div className="flex items-center gap-2 text-[var(--ink)] font-semibold text-[13px]">
        <Info className="w-4 h-4 text-[var(--text-secondary)]" />
        <h4>Impact Methodology & Reporting Transparency</h4>
      </div>
      <p className="leading-relaxed">
        CarbonFlow impact metrics represent CO₂ volumes recorded across capture metering, marketplace order-book matching,
        intermodal transportation, and productive utilization workflows.
      </p>
      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
        <strong>Demo Notice:</strong> Values displayed across this platform are illustrative and derive from simulated and metered clearing transactions.
        They do not constitute independently audited carbon offsets or regulatory emissions credits unless accompanied by third-party MRV (Monitoring, Reporting, and Verification) certifications from accredited verifiers.
      </p>
    </div>
  );
};
