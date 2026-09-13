import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  ArrowRight,
  Layers,
  History
} from 'lucide-react';
import type { AuditContractItem } from './types';
import { ContractAuditTimeline } from './ContractAuditTimeline';
import { ContractVersionHistory } from './ContractVersionHistory';

export interface ContractDetailDrawerProps {
  contract: AuditContractItem | null;
  isOpen: boolean;
  onClose: () => void;
  onExportAuditReceipt: (contractId: string) => void;
}

export const ContractDetailDrawer: React.FC<ContractDetailDrawerProps> = ({
  contract,
  isOpen,
  onClose,
  onExportAuditReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'versions'>('timeline');
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen || !contract) return null;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(contract.auditHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-left" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[var(--surface-card)] border-l border-[var(--border-subtle)] shadow-[var(--shadow-popover)] flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--paper)]">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-[var(--ink)]">
                {contract.contractId}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--border-subtle)]">
                {contract.version}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                {contract.status}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
              aria-label="Close contract detail panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Parties Banner */}
            <div className="p-4 rounded-[var(--radius-card)] bg-[var(--paper)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Contractual Clearing Counterparties
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <span className="text-[11px] text-[var(--text-secondary)] block">Supplier</span>
                  <span className="font-bold text-[var(--ink)] truncate block">{contract.supplier}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                <div className="min-w-0 text-right">
                  <span className="text-[11px] text-[var(--text-secondary)] block">Buyer</span>
                  <span className="font-bold text-[var(--ink)] truncate block">{contract.buyer}</span>
                </div>
              </div>
            </div>

            {/* Contract Terms Matrix */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Commercial &amp; Technical Specifications
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Committed Volume</span>
                  <span className="font-mono font-bold text-[var(--ink)] text-sm">{contract.volume}</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Contract Value</span>
                  <span className="font-mono font-bold text-[var(--ink)] text-sm">{contract.contractValue}</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Target Purity</span>
                  <span className="font-mono font-semibold text-[var(--ink)]">{contract.purity}</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Rate per Tonne</span>
                  <span className="font-mono font-semibold text-[var(--ink)]">{contract.pricePerTon}</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5 col-span-2">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Delivery Timeline</span>
                  <span className="font-medium text-[var(--ink)]">{contract.deliveryDate}</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5 col-span-2">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Transportation Terms</span>
                  <span className="font-medium text-[var(--ink)]">{contract.transportationTerms}</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-muted)]/40 border border-[var(--border-subtle)] space-y-0.5 col-span-2">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Payment Structure</span>
                  <span className="font-medium text-[var(--ink)]">{contract.paymentTerms}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof Hash */}
            <div className="p-3 bg-[var(--paper)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[var(--ink)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--status-success)]" />
                  <span>Cryptographic Audit Proof</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-[10px] text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] flex items-center gap-1"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-[10px] text-[var(--text-secondary)] break-all bg-[var(--surface-card)] p-2 rounded border border-[var(--border-subtle)]">
                {contract.auditHash}
              </div>
              <div className="text-[10px] text-[var(--text-secondary-accessible)]">
                Standard: <span className="font-medium text-[var(--ink)]">{contract.isoStandard}</span>
              </div>
            </div>

            {/* Tabs for Timeline vs Version History */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1 border-b border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-2 px-3 text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 -mb-px ${
                    activeTab === 'timeline'
                      ? 'border-[var(--accent-primary)] text-[var(--ink)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--ink)]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Audit Timeline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('versions')}
                  className={`pb-2 px-3 text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 -mb-px ${
                    activeTab === 'versions'
                      ? 'border-[var(--accent-primary)] text-[var(--ink)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Version History ({contract.versionHistory.length})</span>
                </button>
              </div>

              {activeTab === 'timeline' ? (
                <ContractAuditTimeline timeline={contract.timeline} />
              ) : (
                <ContractVersionHistory history={contract.versionHistory} />
              )}
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--paper)]">
            <button
              type="button"
              onClick={() => onExportAuditReceipt(contract.contractId)}
              className="w-full py-2 px-4 rounded-[var(--radius-md)] bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ISO 27913 Compliance Certificate</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
