import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, type Column } from '../ui/DataDisplay';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Feedback';
import { PillTabNav, type PillTab } from '../ui/Navigation';
import { Modal, Dropdown, type DropdownItem } from '../ui/Overlays';
import { MoreVertical, Plus, Factory, Truck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '@clerk/clerk-react';
import { getMyListings, createListing, updateListing } from '../../services/marketplaceApi';
import { useNavigate } from 'react-router-dom';

export type SupplyStatus = 'all' | 'active' | 'paused' | 'draft' | 'sold_out';

export interface SupplierListingItem {
  id: string;
  facilityName: string;
  sourceType: string;
  co2Grade: string;
  purity: number;
  volumeTpa: number;
  pricePerTon: number;
  transportMode: string;
  location: string;
  status: 'active' | 'cancelled' | 'draft' | 'fulfilled' | string;
  buyerRequestsCount: number;
  postedDate: string;
}

export const MySupplyView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SupplierListingItem | null>(null);

  const { showToast } = useAppStore();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Debounce search query to avoid aggressive API requests
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // TanStack Query for server state
  const { data: serverData, isLoading } = useQuery({
    queryKey: ['my-supply-listings', statusFilter, debouncedSearch],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) return { items: [], counts: {} };
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (debouncedSearch) params.append('search', debouncedSearch);

        const res = await getMyListings(token, params);
        
        // Map API response to UI model
        const items = (res.items || []).map((item: any) => ({
          id: item.id,
          facilityName: item.facility_name || 'Registered Supply Plant',
          sourceType: item.source_type || 'Industrial Carbon Capture',
          co2Grade: item.co2_grade || 'Standard Purity',
          purity: item.purity_percentage || 98.5,
          volumeTpa: item.volume_tpa || 5000,
          pricePerTon: item.price_per_ton || 4500,
          transportMode: Array.isArray(item.transport_modes) ? item.transport_modes[0] : 'Pipeline-ready',
          location: item.location || 'Gujarat Industrial Cluster',
          status: item.status || 'active',
          buyerRequestsCount: 0, // Demand requirements are not currently mapped back to listings directly
          postedDate: new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          notes: item.notes || '',
        }));
        
        return { items, counts: res.counts || {} };
      } catch (e) {
        console.error("Failed to fetch listings:", e);
        // Error state, return empty to trigger the EmptyState and not old mock data
        return { items: [], counts: {} };
      }
    },
  });

  const listings: SupplierListingItem[] = serverData?.items || [];
  const counts = serverData?.counts || { all: 0, active: 0, paused: 0, draft: 0, sold_out: 0 };

  // Status counts for PillTabNav natively bound to DB aggregate counts
  const statusTabs: PillTab[] = useMemo(() => {
    return [
      { id: 'all', label: `All (${counts.all || 0})` },
      { id: 'active', label: `Active (${counts.active || 0})` },
      { id: 'cancelled', label: `Paused (${counts.cancelled || 0})` },
      { id: 'draft', label: `Draft (${counts.draft || 0})` },
      { id: 'fulfilled', label: `Sold Out (${counts.fulfilled || 0})` },
    ];
  }, [counts]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const token = await getToken();
      return updateListing(token, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-supply-listings'] });
    },
    onError: (error) => {
      showToast('Failed to update listing.');
      console.error(error);
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = await getToken();
      return createListing(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-supply-listings'] });
      setIsNewModalOpen(false);
      showToast(`New listing successfully published.`);
      // Reset Form
      setFormFacility('');
      setFormVolume('10000');
      setFormPrice('5200');
    },
    onError: (error) => {
      showToast('Failed to create listing.');
      console.error(error);
    }
  });

  // Actions handler
  const handleAction = (actionId: string, listing: SupplierListingItem) => {
    if (actionId === 'pause') {
      updateMutation.mutate({ id: listing.id, data: { status: 'cancelled' } });
      showToast(`Pausing listing "${listing.facilityName}"...`);
    } else if (actionId === 'publish') {
      updateMutation.mutate({ id: listing.id, data: { status: 'active' } });
      showToast(`Publishing listing "${listing.facilityName}"...`);
    } else if (actionId === 'close') {
      updateMutation.mutate({ id: listing.id, data: { status: 'fulfilled' } });
      showToast(`Marking "${listing.facilityName}" as sold out...`);
    } else if (actionId === 'edit') {
      setSelectedListing(listing);
    }
  };

  // Form State for + New Listing
  const [formFacility, setFormFacility] = useState('');
  const [formSource, setFormSource] = useState('Direct Air Capture (DAC)');
  const [formPurity, setFormPurity] = useState('99.5');
  const [formVolume, setFormVolume] = useState('10000');
  const [formPrice, setFormPrice] = useState('5200');
  const [formTransport, setFormTransport] = useState('Pipeline-ready');
  const [formLocation, setFormLocation] = useState('Dahej Corridor, Gujarat');
  const [formGrade, setFormGrade] = useState('Ultra-Pure Food/Beverage');

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFacility.trim()) {
      showToast('Facility name is required');
      return;
    }

    createMutation.mutate({
      facility_name: formFacility.trim(),
      source_type: formSource,
      co2_grade: formGrade,
      purity_percentage: parseFloat(formPurity) || 99.0,
      volume_tpa: parseInt(formVolume, 10) || 5000,
      price_per_ton: parseInt(formPrice, 10) || 4800,
      transport_modes: [formTransport],
      location: formLocation,
      status: 'active',
    });
  };

  // Table columns definition
  const columns: Column<SupplierListingItem>[] = [
    {
      key: 'listing',
      header: 'Listing',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[14px] text-[var(--ink)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer">
              {row.facilityName}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-secondary-accessible)] bg-[var(--surface-muted)] px-1.5 py-0.5 rounded" title={row.id}>
              {row.id.split('-')[0] + '-' + row.id.split('-')[1].substring(0, 4)}
            </span>
          </div>
          <div className="text-[12px] text-[var(--text-secondary-accessible)] flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-[var(--ink)]">{row.volumeTpa.toLocaleString()} t/yr</span>
            <span>•</span>
            <span>{row.purity}% purity</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
              <Truck className="w-3 h-3" />
              {row.transportMode}
            </span>
            <span>•</span>
            <span>{row.sourceType}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (row) => {
        const variants: Record<string, { variant: 'outline-success' | 'outline-warning' | 'neutral' | 'outline-danger'; label: string }> = {
          active: { variant: 'outline-success', label: 'Active' },
          cancelled: { variant: 'outline-warning', label: 'Paused' },
          draft: { variant: 'neutral', label: 'Draft' },
          fulfilled: { variant: 'neutral', label: 'Sold Out' },
          inactive: { variant: 'outline-danger', label: 'Inactive' },
        };
        const current = variants[row.status] || { variant: 'neutral', label: row.status };
        return <Badge variant={current.variant}>{current.label}</Badge>;
      },
    },
    {
      key: 'requests',
      header: 'Buyer Requests',
      width: '140px',
      render: (row) => {
        if (row.buyerRequestsCount > 0) {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/app/buyer-requests');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-pill)] text-[12px] font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors"
              title="View buyer inquiries for this supply"
            >
              <span>{row.buyerRequestsCount} inquiries</span>
              <span>→</span>
            </button>
          );
        }
        return <span className="text-[var(--text-secondary)] text-[13px] pl-2">—</span>;
      },
    },
    {
      key: 'postedDate',
      header: 'Posted Date',
      width: '130px',
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary-accessible)] font-medium">
          {row.postedDate}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      align: 'right',
      render: (row) => {
        const items: DropdownItem[] = [];
        if (row.status === 'active') {
          items.push({ id: 'pause', label: 'Pause Listing' });
          items.push({ id: 'edit', label: 'View Terms' });
          items.push({ id: 'close', label: 'Mark as Sold Out' });
        } else if (row.status === 'cancelled') {
          items.push({ id: 'publish', label: 'Publish (Resume)' });
          items.push({ id: 'edit', label: 'View Terms' });
          items.push({ id: 'close', label: 'Mark as Sold Out' });
        } else if (row.status === 'draft') {
          items.push({ id: 'publish', label: 'Publish to Market' });
          items.push({ id: 'edit', label: 'View Draft' });
        } else if (row.status === 'fulfilled') {
          items.push({ id: 'publish', label: 'Re-list Volume' });
          items.push({ id: 'edit', label: 'View Listing' });
        } else {
            items.push({ id: 'publish', label: 'Publish to Market' });
        }

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
                  aria-label="Listing actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={items}
              onSelect={(item) => handleAction(item.id, row)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold tracking-tight text-[var(--ink)]">
              My CO₂ Supply
            </h1>
            <span className="text-[11px] font-mono text-[var(--accent-primary)] font-semibold bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-[var(--radius-pill)]">
              SUPPLIER NODE
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
            Manage your registered carbon capture output streams, active offtake availability, and commercial terms.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto shadow-sm"
          disabled={createMutation.isPending}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Listing</span>
        </Button>
      </div>

      {/* 2. FILTER / SEARCH ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <PillTabNav
          compact
          tabs={statusTabs}
          activeTab={statusFilter}
          onChange={(tab) => setStatusFilter(tab)}
        />

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search listings by name, spec, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-[13px] bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-pill)] text-[var(--ink)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>
      </div>

      {/* 3. TABLE OR EMPTY STATE */}
      {isLoading ? (
        <div className="py-12 flex justify-center text-[var(--text-secondary)]">Loading your supply listings...</div>
      ) : listings.length === 0 ? (
        <EmptyState
          icon={<Factory className="w-8 h-8 text-[var(--text-secondary)] stroke-[1.5]" />}
          title={statusFilter === 'all' && !debouncedSearch ? 'No listings yet' : `No matching listings`}
          description={statusFilter === 'all' && !debouncedSearch ? "List your available CO2 and we'll surface it to matching industrial buyers." : "Try adjusting your search or status filter."}
          ctaLabel={statusFilter === 'all' && !debouncedSearch ? "+ New Listing" : undefined}
          onCtaClick={statusFilter === 'all' && !debouncedSearch ? () => setIsNewModalOpen(true) : undefined}
        />
      ) : (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-xs overflow-hidden">
          <Table
            columns={columns}
            data={listings}
            keyExtractor={(row) => row.id}
            onRowClick={(row) => setSelectedListing(row)}
          />
        </div>
      )}

      {/* 4. DETAIL MODAL */}
      <Modal
        isOpen={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
        title={selectedListing?.facilityName || 'Listing Specifications'}
        maxWidth="lg"
        footer={
          <div className="flex justify-between items-center w-full">
            <div className="text-[12px] text-[var(--text-secondary-accessible)]">
              Status:{' '}
              <strong className="capitalize text-[var(--ink)]">
                {selectedListing?.status.replace('_', ' ')}
              </strong>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedListing(null)}>
                Close
              </Button>
              {selectedListing?.buyerRequestsCount ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedListing(null);
                    navigate('/app/buyer-requests');
                  }}
                >
                  View Buyer Requests ({selectedListing.buyerRequestsCount})
                </Button>
              ) : null}
            </div>
          </div>
        }
      >
        {selectedListing && (
          <div className="space-y-4 py-2 text-[13px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[var(--surface-muted)]/50 rounded-[var(--radius-chip)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-secondary-accessible)]">Available Volume</div>
                <div className="text-[16px] font-bold text-[var(--ink)] mt-0.5">
                  {selectedListing.volumeTpa.toLocaleString()} t/yr
                </div>
              </div>
              <div className="p-3 bg-[var(--surface-muted)]/50 rounded-[var(--radius-chip)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-secondary-accessible)]">Chemical Purity</div>
                <div className="text-[16px] font-bold text-[var(--ink)] mt-0.5">
                  {selectedListing.purity}%
                </div>
              </div>
              <div className="p-3 bg-[var(--surface-muted)]/50 rounded-[var(--radius-chip)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-secondary-accessible)]">Offtake Price</div>
                <div className="text-[16px] font-bold text-[var(--accent-primary)] mt-0.5">
                  ₹{selectedListing.pricePerTon.toLocaleString()}/t
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-[var(--border-subtle)] pt-3">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60">
                <span className="text-[var(--text-secondary-accessible)]">Source Technology</span>
                <span className="font-medium text-[var(--ink)]">{selectedListing.sourceType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60">
                <span className="text-[var(--text-secondary-accessible)]">Target Application Grade</span>
                <span className="font-medium text-[var(--ink)]">{selectedListing.co2Grade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60">
                <span className="text-[var(--text-secondary-accessible)]">Transport Mode</span>
                <span className="font-medium text-[var(--ink)]">{selectedListing.transportMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60">
                <span className="text-[var(--text-secondary-accessible)]">Terminal Location</span>
                <span className="font-medium text-[var(--ink)]">{selectedListing.location}</span>
              </div>
              {selectedListing.notes && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary-accessible)] uppercase tracking-wider">
                    Operational Telemetry Notes
                  </span>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1 bg-[var(--surface-muted)]/30 p-2.5 rounded-[var(--radius-chip)] border border-[var(--border-subtle)]">
                    {selectedListing.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 5. NEW LISTING MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Register New CO₂ Supply Stream"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateListing} className="space-y-4 py-1 text-[13px]">
          <div>
            <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
              Capture Facility / Node Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., AeroCapture Surat DAC Array #5"
              value={formFacility}
              onChange={(e) => setFormFacility(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Capture Technology Source
              </label>
              <select
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Direct Air Capture (DAC)">Direct Air Capture (DAC)</option>
                <option value="Biogenic Fermentation">Biogenic Fermentation</option>
                <option value="Post-Combustion Chemical Absorption">Post-Combustion Chemical Absorption</option>
                <option value="Chlor-Alkali Byproduct">Chlor-Alkali Byproduct</option>
                <option value="Ethanol Stripping">Ethanol Stripping</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Chemical Grade
              </label>
              <select
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Ultra-Pure Food/Beverage">Ultra-Pure Food/Beverage (99.8%+)</option>
                <option value="Electronic/Battery Precursor Grade">Electronic/Battery Precursor Grade</option>
                <option value="Chemical Grade Raw Feedstock">Chemical Grade Raw Feedstock</option>
                <option value="Industrial Sequester-Grade">Industrial Sequester-Grade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Volume Available (t/yr)
              </label>
              <input
                type="number"
                required
                value={formVolume}
                onChange={(e) => setFormVolume(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Purity (% CO₂)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formPurity}
                onChange={(e) => setFormPurity(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Price (₹ / ton)
              </label>
              <input
                type="number"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Transport Mode Ready
              </label>
              <select
                value={formTransport}
                onChange={(e) => setFormTransport(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Pipeline-ready">Pipeline-ready</option>
                <option value="Cryogenic Truck">Cryogenic Truck</option>
                <option value="ISO Rail Tanker">ISO Rail Tanker</option>
                <option value="Marine Barge">Marine Barge</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--ink)] mb-1">
                Hub / Dispatch Location
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-chip)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
