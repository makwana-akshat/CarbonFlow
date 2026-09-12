import React from 'react';
import { Search, Download, ChevronDown, Calendar, Filter } from 'lucide-react';
import type { AuditContractStatus } from '../../data/auditContractsMock';

export interface AuditContractsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: AuditContractStatus | 'All';
  onStatusChange: (status: AuditContractStatus | 'All') => void;
  dateFilter: string;
  onDateFilterChange: (df: string) => void;
  onExportReport: () => void;
  totalCount: number;
}

export const AuditContractsHeader: React.FC<AuditContractsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  onExportReport,
  totalCount,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = React.useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = React.useState(false);

  const statuses: (AuditContractStatus | 'All')[] = [
    'All',
    'Active',
    'Pending Review',
    'Approved',
    'Completed',
    'Draft',
    'Expired',
    'Cancelled',
  ];

  const dateOptions = [
    { label: 'All Dates', value: 'all' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last Quarter (Q3 2026)', value: 'q3' },
    { label: 'Year to Date (2026)', value: 'ytd' },
  ];

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)] text-left">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Audit Contracts
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border border-[var(--border-subtle)]">
            {totalCount} total agreements
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-secondary-accessible)] max-w-2xl leading-relaxed">
          Review contract history, approvals, amendments, and fulfillment status across CarbonFlow transactions.
        </p>
      </div>

      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        
        {/* Search input */}
        <div className="relative w-56 sm:w-64">
          <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search contracts, buyers, IDs..."
            className="w-full pl-8 pr-3 py-1.5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs text-[var(--ink)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--ink)] transition-colors shadow-2xs"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--ink)] hover:border-[var(--border-strong)] transition-colors shadow-2xs"
            aria-expanded={isStatusDropdownOpen}
          >
            <Filter className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Status: {selectedStatus}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>

          {isStatusDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsStatusDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-[var(--shadow-popover)] py-1 z-30 text-left">
                {statuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onStatusChange(st);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center justify-between ${
                      selectedStatus === st
                        ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold'
                        : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--ink)]'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--ink)] hover:border-[var(--border-strong)] transition-colors shadow-2xs"
            aria-expanded={isDateDropdownOpen}
          >
            <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>
              {dateOptions.find((d) => d.value === dateFilter)?.label || 'All Dates'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>

          {isDateDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDateDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-[var(--shadow-popover)] py-1 z-30 text-left">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onDateFilterChange(opt.value);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center justify-between ${
                      dateFilter === opt.value
                        ? 'bg-[var(--surface-muted)] text-[var(--ink)] font-semibold'
                        : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)]/60 hover:text-[var(--ink)]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {dateFilter === opt.value && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Export Audit Report Button */}
        <button
          type="button"
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-card)] bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--accent-primary)] transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Report</span>
        </button>

      </div>
    </header>
  );
};
