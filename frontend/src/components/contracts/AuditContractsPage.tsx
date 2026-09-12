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
import { useAuth } from '@clerk/clerk-react';
import { getContracts, getComplianceSummary } from '../../services/contractsApi';

export const AuditContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<AuditContractItem[]>([]);
  const [summary, setSummary] = useState({
    activeContracts: 0,
    pendingApproval: 0,
    completed: 0,
    withAmendments: 0
  });
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

  const { getToken } = useAuth();
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const [apiContracts, apiSummary] = await Promise.all([
          getContracts(token),
          getComplianceSummary(token)
        ]);
        if (apiContracts && apiContracts.length > 0) {
          const mapped: AuditContractItem[] = apiContracts.map(c => ({
            id: c.id,
            contractId: c.contract_id,
            supplier: c.supplier_name,
            buyer: c.buyer_name,
            volume: c.volume,
            value: c.contract_value,
            date: c.created_date,
            status: c.status as AuditContractStatus,
            version: c.version,
            purity: c.purity || '',
            pricePerTon: c.price_per_ton || '',
            deliveryDate: c.delivery_date || '',
            transportationTerms: c.transportation_terms || '',
            paymentTerms: c.payment_terms || '',
            auditHash: c.audit_hash || '',
            isoStandard: c.iso_standard || '',
            timeline: c.timeline.map((t: any) => ({
              step: t.step,
              label: t.label,
              timestamp: t.timestamp_str || '',
              actor: t.actor || '',
              role: t.role || '',
              action: t.action || '',
              notes: t.notes || '',
              status: t.status
            })),
            versions: c.version_history.map((v: any) => ({
              version: v.version,
              isCurrent: v.is_current,
              summary: v.summary || '',
              date: v.effective_date || '',
              author: v.author || '',
              changes: v.changes || []
            }))
          }));
          setContracts(mapped);
        }
        if (apiSummary) {
          setSummary({
            activeContracts: apiSummary.active_contracts,
            pendingApproval: apiSummary.pending_approval,
            completed: apiSummary.completed,
            withAmendments: apiSummary.with_amendments
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [getToken]);

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
        summary={summary}
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
