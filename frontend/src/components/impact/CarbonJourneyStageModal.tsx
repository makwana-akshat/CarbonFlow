import React, { useEffect } from 'react';
import { useCarbonImpact } from '../../context/CarbonImpactContext';
import { X, ShieldCheck, Activity, Route, CheckCircle2, Clock, Factory } from 'lucide-react';

export const CarbonJourneyStageModal: React.FC = () => {
  const { activeStageDetail, selectStage } = useCarbonImpact();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectStage(null);
      }
    };
    if (activeStageDetail) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStageDetail, selectStage]);

  if (!activeStageDetail) return null;

  const { details } = activeStageDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-start justify-between gap-3 bg-[var(--surface-muted)]/40">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              STAGE AUDIT DEEP-DIVE · 0{activeStageDetail.order}
            </span>
            <h3 id="stage-modal-title" className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
              CO₂ {activeStageDetail.name} Stage
            </h3>
          </div>
          <button
            type="button"
            onClick={() => selectStage(null)}
            className="p-1.5 rounded-[var(--radius-pill)] hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Main Stage Volume Banner */}
          <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-muted)]/70 border border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[var(--text-secondary-accessible)] uppercase tracking-wider">
                Total Physical Throughput
              </span>
              <div className="text-3xl font-extrabold text-[var(--ink)] font-mono mt-0.5">
                {activeStageDetail.formattedTonnes}
              </div>
            </div>
            {activeStageDetail.conversionPercent !== undefined && (
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-secondary-accessible)] block">
                  CONVERSION YIELD
                </span>
                <span className="text-xl font-bold text-[var(--status-online)] font-mono">
                  {activeStageDetail.conversionPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] text-[var(--text-secondary-accessible)] leading-relaxed">
            {details.description}
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary-accessible)] font-medium">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Transactions</span>
              </div>
              <div className="text-lg font-bold text-[var(--ink)] font-mono">
                {details.activeTransactions}
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary-accessible)] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Average Assayed Purity</span>
              </div>
              <div className="text-lg font-bold text-[var(--ink)] font-mono">
                {details.avgPurity}
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary-accessible)] font-medium">
                <Route className="w-3.5 h-3.5 text-[#34C77B]" />
                <span>Average Haul Distance</span>
              </div>
              <div className="text-lg font-bold text-[var(--ink)] font-mono">
                {details.avgDistanceKm > 0 ? `${details.avgDistanceKm} km` : 'Local Node'}
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary-accessible)] font-medium">
                <Factory className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Participating Facilities</span>
              </div>
              <div className="text-lg font-bold text-[var(--ink)] font-mono">
                {details.activeFacilities}
              </div>
            </div>
          </div>

          {/* Transaction Execution Status Ratio */}
          <div className="p-3.5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-muted)]/40 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-online)]" />
                Completed: {details.completed}
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-secondary-accessible)]">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Pending Verification: {details.pending}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
              <div
                className="h-full bg-[var(--status-online)] rounded-full transition-all"
                style={{
                  width: `${(details.completed / (details.completed + details.pending)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Custody Compliance Tag */}
          <div className="p-3 rounded-[var(--radius-card)] bg-[var(--surface-muted)]/20 border border-[var(--border-subtle)] flex items-start gap-2.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[var(--ink)] block">Custody & Clearing Standard:</span>
              <span className="text-[var(--text-secondary-accessible)] font-mono text-[10px]">
                {details.custodyCompliance}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-muted)]/30 flex justify-end">
          <button
            type="button"
            onClick={() => selectStage(null)}
            className="px-4 py-2 rounded-[var(--radius-card)] bg-[var(--ink)] text-white text-[12px] font-semibold hover:bg-[var(--accent-primary)] transition-colors"
          >
            Close Audit Spec
          </button>
        </div>
      </div>
    </div>
  );
};
