import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import type { AuditContractItem, AuditContractStatus } from '../../data/auditContractsMock';

export interface AuditContractTableProps {
  contracts: AuditContractItem[];
  selectedContractId: string | null;
  onSelectContract: (contract: AuditContractItem) => void;
}

export const AuditContractTable: React.FC<AuditContractTableProps> = ({
  contracts,
  selectedContractId,
  onSelectContract,
}) => {
  const getStatusBadge = (status: AuditContractStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Active
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending Review
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Approved
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--border-subtle)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />
            Completed
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-300">
            Draft
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 border border-zinc-200">
            Expired
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  if (contracts.length === 0) {
    return (
      <div className="w-full py-16 px-4 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] text-center space-y-2">
        <FileText className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
        <h3 className="text-sm font-semibold text-[var(--ink)]">No audit contracts found</h3>
        <p className="text-xs text-[var(--text-secondary-accessible)]">
          Try clearing your search query or switching the status filter to "All".
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-2xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--paper)] text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              <th className="py-3 px-4">Contract ID</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Buyer</th>
              <th className="py-3 px-4">CO₂ Volume</th>
              <th className="py-3 px-4">Contract Value</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4 text-right">Audit Trail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {contracts.map((contract) => {
              const isSelected = selectedContractId === contract.id;

              return (
                <tr
                  key={contract.id}
                  onClick={() => onSelectContract(contract)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-[var(--surface-muted)]/80 font-medium'
                      : 'hover:bg-[var(--surface-muted)]/40'
                  }`}
                >
                  {/* Contract ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--ink)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {contract.contractId}
                      </span>
                    </div>
                  </td>

                  {/* Supplier */}
                  <td className="py-3 px-4 font-medium text-[var(--ink)]">
                    {contract.supplier}
                  </td>

                  {/* Buyer */}
                  <td className="py-3 px-4 text-[var(--text-secondary-accessible)]">
                    {contract.buyer}
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 font-mono font-semibold text-[var(--ink)]">
                    {contract.volume}
                  </td>

                  {/* Value */}
                  <td className="py-3 px-4 font-mono font-medium text-[var(--ink)]">
                    {contract.contractValue}
                  </td>

                  {/* Created */}
                  <td className="py-3 px-4 text-[var(--text-secondary-accessible)] font-mono text-[11px]">
                    {contract.createdDate}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {getStatusBadge(contract.status)}
                  </td>

                  {/* Version */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-mono font-bold bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--border-subtle)]">
                      {contract.version}
                    </span>
                  </td>

                  {/* Inspect CTA */}
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] group-hover:text-[var(--ink)] group-hover:translate-x-0.5 transition-all">
                      <span>Audit Trail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
