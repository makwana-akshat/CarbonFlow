import React, { useState, useMemo } from 'react';
import { AuditContractsHeader } from './AuditContractsHeader';
import { ComplianceSummaryBar } from './ComplianceSummaryBar';
import { AuditContractTable } from './AuditContractTable';
import { ContractDetailDrawer } from './ContractDetailDrawer';
import { 
  AUDIT_CONTRACTS_DATA, 
  COMPLIANCE_SUMMARY, 
  type AuditContractItem, 
  type AuditContractStatus 
} from '../../data/auditContractsMock';
import { Toast } from '../ui/Feedback';

export const AuditContractsPage: React.FC = () => {
  const [contracts] = useState<AuditContractItem[]>(AUDIT_CONTRACTS_DATA);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<AuditContractStatus | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<AuditContractItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((cnt) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          cnt.contractId.toLowerCase().includes(q) ||
          cnt.supplier.toLowerCase().includes(q) ||
          cnt.buyer.toLowerCase().includes(q) ||
          cnt.version.toLowerCase().includes(q) ||
          cnt.status.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status filter
      if (selectedStatus !== 'All') {
        if (cnt.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [contracts, searchQuery, selectedStatus]);

  const handleSelectContract = (contract: AuditContractItem) => {
    setSelectedContract(contract);
    setIsDrawerOpen(true);
  };

  const handleExportReport = () => {
    showToast(`Generating certified ISO 27913 audit report package (${filteredContracts.length} agreements)...`);
    setTimeout(() => {
      showToast(`Export complete: CarbonFlow_Audit_Report_${new Date().toISOString().slice(0, 10)}.pdf generated.`);
    }, 1200);
  };

  const handleExportAuditReceipt = (contractId: string) => {
    showToast(`Minted cryptographically sealed audit certificate for agreement ${contractId}.`);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 pb-16 animate-fade-in text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-2">
          <Toast variant="success" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

      {/* 1. Header with search, status dropdown, date filter, export */}
      <AuditContractsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onExportReport={handleExportReport}
        totalCount={contracts.length}
      />

      {/* 2. Compliance Summary Bar (Quiet metrics) */}
      <ComplianceSummaryBar
        summary={COMPLIANCE_SUMMARY}
        onFilterActive={() => setSelectedStatus('Active')}
        onFilterPending={() => setSelectedStatus('Pending Review')}
      />

      {/* 3. Main Contract Table */}
      <AuditContractTable
        contracts={filteredContracts}
        selectedContractId={selectedContract?.id || null}
        onSelectContract={handleSelectContract}
      />

      {/* 4. Contract Detail Drawer */}
      <ContractDetailDrawer
        contract={selectedContract}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onExportAuditReceipt={handleExportAuditReceipt}
      />
    </div>
  );
};
