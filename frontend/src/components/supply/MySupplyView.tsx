import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, type Column } from '../ui/DataDisplay';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Feedback';
import { PillTabNav, type PillTab } from '../ui/Navigation';
import { Modal, Dropdown, type DropdownItem } from '../ui/Overlays';
import { MoreVertical, Plus, Factory, Truck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '@clerk/clerk-react';
import { getListings } from '../../services/marketplaceApi';
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
  status: 'active' | 'paused' | 'draft' | 'sold_out';
  buyerRequestsCount: number;
  postedDate: string;
  notes?: string;
}

// Resilient supplier listings mock data
const INITIAL_SUPPLIER_LISTINGS: SupplierListingItem[] = [
  {
    id: 'SL-101',
    facilityName: 'AeroCapture DAC Unit IV',
    sourceType: 'Direct Air Capture (DAC)',
    co2Grade: 'Ultra-Pure Food/Beverage',
    purity: 99.8,
    volumeTpa: 12500,
    pricePerTon: 5800,
    transportMode: 'Pipeline-ready',
    location: 'Dahej Industrial Zone, Gujarat',
    status: 'active',
    buyerRequestsCount: 4,
    postedDate: 'Aug 18, 2026',
    notes: 'Continuous metered DAC output feed linked to regional trunk 04.',
  },
  {
    id: 'SL-102',
    facilityName: 'AeroCapture Biogenic Hub 2',
    sourceType: 'Biogenic Fermentation',
    co2Grade: 'Chemical Grade Raw Feedstock',
    purity: 98.7,
    volumeTpa: 8400,
    pricePerTon: 4600,
    transportMode: 'Cryogenic Truck',
    location: 'Bharuch Agro Cluster, Gujarat',
    status: 'active',
    buyerRequestsCount: 2,
    postedDate: 'Aug 24, 2026',
    notes: 'High flow rate biogenic stream certified under IS-17482.',
  },
  {
    id: 'SL-103',
    facilityName: 'Surat Flue Scrubbing Facility #1',
    sourceType: 'Post-Combustion Chemical Absorption',
    co2Grade: 'Industrial Sequester-Grade',
    purity: 96.2,
    volumeTpa: 22000,
    pricePerTon: 3900,
    transportMode: 'ISO Rail Tanker',
    location: 'Hazira Industrial Corridor, Surat',
    status: 'paused',
    buyerRequestsCount: 0,
    postedDate: 'Jul 11, 2026',
    notes: 'Scheduled scrubber maintenance until October 1.',
  },
  {
    id: 'SL-104',
    facilityName: 'Mundra Air Stripping Prototype Array',
    sourceType: 'Direct Air Capture (DAC)',
    co2Grade: 'Electronic/Battery Precursor Grade',
    purity: 99.95,
    volumeTpa: 3500,
    pricePerTon: 7200,
    transportMode: 'Cryogenic Truck',
    location: 'Mundra Port Logistics SEZ, Kutch',
    status: 'draft',
    buyerRequestsCount: 0,
    postedDate: 'Sep 02, 2026',
    notes: 'Awaiting final Third-Party ISO-14064 metrology validation.',
  },
  {
    id: 'SL-105',
    facilityName: 'Vapi Chemical Off-Gas Recovery Phase 1',
    sourceType: 'Chlor-Alkali Byproduct',
    co2Grade: 'Polymer Synthesis Grade',
    purity: 99.4,
    volumeTpa: 6000,
    pricePerTon: 5100,
    transportMode: 'Pipeline-ready',
    location: 'Vapi GIDC Industrial Area',
    status: 'sold_out',
    buyerRequestsCount: 7,
    postedDate: 'Jun 15, 2026',
    notes: 'Fully contracted to Tata Steel Cleantech under Annual Offtake Contract #CF-001.',
  },
];

export const MySupplyView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SupplierListingItem | null>(null);
  const [localListings, setLocalListings] = useState<SupplierListingItem[]>(INITIAL_SUPPLIER_LISTINGS);

  const { showToast } = useAppStore();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // TanStack Query for server state
  const { data: serverListings, isLoading: _isLoading } = useQuery({
    queryKey: ['my-supply-listings'],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) return INITIAL_SUPPLIER_LISTINGS;
        const res = await getListings(token);
        if (res && Array.isArray(res) && res.length > 0) {
          return res.map((item: any) => ({
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
            buyerRequestsCount: 0,
            postedDate: new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            notes: item.notes || '',
          }));
        }
        return INITIAL_SUPPLIER_LISTINGS;
      } catch {
        return INITIAL_SUPPLIER_LISTINGS;
      }
    },
    initialData: INITIAL_SUPPLIER_LISTINGS,
  });

  // Active listings list merging server query and local creations
  const listings = useMemo(() => {
    return localListings.length > 0 ? localListings : serverListings;
  }, [localListings, serverListings]);

  // Status counts for PillTabNav
  const statusTabs: PillTab[] = useMemo(() => {
    const counts = {
      all: listings.length,
      active: listings.filter((l) => l.status === 'active').length,
      paused: listings.filter((l) => l.status === 'paused').length,
      draft: listings.filter((l) => l.status === 'draft').length,
      sold_out: listings.filter((l) => l.status === 'sold_out').length,
    };

    return [
      { id: 'all', label: `All (${counts.all})` },
      { id: 'active', label: `Active (${counts.active})` },
      { id: 'paused', label: `Paused (${counts.paused})` },
      { id: 'draft', label: `Draft (${counts.draft})` },
      { id: 'sold_out', label: `Sold Out (${counts.sold_out})` },
    ];
  }, [listings]);

  // Filtered dataset
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.facilityName.toLowerCase().includes(q) ||
          item.sourceType.toLowerCase().includes(q) ||
          item.co2Grade.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [listings, statusFilter, searchQuery]);

  // Actions handler
  const handleAction = (actionId: string, listing: SupplierListingItem) => {
    if (actionId === 'pause') {
      setLocalListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, status: 'paused' } : l))
      );
      showToast(`Listing "${listing.facilityName}" has been paused.`);
    } else if (actionId === 'publish') {
      setLocalListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, status: 'active' } : l))
      );
      showToast(`Listing "${listing.facilityName}" is now active on the Marketplace.`);
    } else if (actionId === 'close') {
      setLocalListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, status: 'sold_out' } : l))
      );
      showToast(`Listing "${listing.facilityName}" marked as sold out.`);
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

    const newListing: SupplierListingItem = {
      id: `SL-${Math.floor(100 + Math.random() * 900)}`,
      facilityName: formFacility.trim(),
      sourceType: formSource,
      co2Grade: formGrade,
      purity: parseFloat(formPurity) || 99.0,
      volumeTpa: parseInt(formVolume, 10) || 5000,
      pricePerTon: parseInt(formPrice, 10) || 4800,
      transportMode: formTransport,
      location: formLocation,
      status: 'active',
      buyerRequestsCount: 0,
      postedDate: 'Today',
      notes: 'Freshly registered output stream.',
    };

    setLocalListings([newListing, ...listings]);
    setIsNewModalOpen(false);
    showToast(`New listing "${newListing.facilityName}" successfully published.`);

    // Reset Form
    setFormFacility('');
    setFormVolume('10000');
    setFormPrice('5200');
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
            <span className="font-mono text-[10px] text-[var(--text-secondary-accessible)] bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">
              {row.id}
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
          paused: { variant: 'outline-warning', label: 'Paused' },
          draft: { variant: 'neutral', label: 'Draft' },
          sold_out: { variant: 'neutral', label: 'Sold Out' },
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
          items.push({ id: 'edit', label: 'Edit Terms' });
          items.push({ id: 'close', label: 'Mark as Sold Out' });
        } else if (row.status === 'paused') {
          items.push({ id: 'publish', label: 'Publish (Resume)' });
          items.push({ id: 'edit', label: 'Edit Terms' });
          items.push({ id: 'close', label: 'Mark as Sold Out' });
        } else if (row.status === 'draft') {
          items.push({ id: 'publish', label: 'Publish to Market' });
          items.push({ id: 'edit', label: 'Edit Draft' });
        } else if (row.status === 'sold_out') {
          items.push({ id: 'publish', label: 'Re-list Volume' });
          items.push({ id: 'edit', label: 'Edit Listing' });
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
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={<Factory className="w-8 h-8 text-[var(--text-secondary)] stroke-[1.5]" />}
          title={statusFilter === 'all' ? 'No listings yet' : `No ${statusFilter} listings`}
          description="List your available CO2 and we'll surface it to matching industrial buyers."
          ctaLabel="+ New Listing"
          onCtaClick={() => setIsNewModalOpen(true)}
        />
      ) : (
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] shadow-xs overflow-hidden">
          <Table
            columns={columns}
            data={filteredListings}
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
            <Button type="submit" variant="primary" size="md">
              Publish Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
